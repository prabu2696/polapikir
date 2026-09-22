const CFG = window.APP_CONFIG || {};
const $ = selector => document.querySelector(selector);

let sessionToken = null;
let rows = [];

function adminToast(message){
  const element = $("#adminToast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(window.__adminToastTimer);
  window.__adminToastTimer = setTimeout(() => element.classList.remove("show"),2600);
}

function adminReducedMotion(){
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function switchAdmin(id){
  const target = $(id);
  if(!target) return;

  document.querySelectorAll(".admin-view").forEach(view => {
    view.classList.remove("active","admin-entering");
  });

  target.classList.add("active");
  const heading = target.querySelector("h1");
  if(heading){ heading.tabIndex = -1; heading.focus({preventScroll:true}); }
  window.scrollTo({top:0,behavior:"auto"});

  if(!adminReducedMotion()){
    requestAnimationFrame(() => {
      target.classList.add("admin-entering");
      window.setTimeout(() => target.classList.remove("admin-entering"),220);
    });
  }
}

function baseUrl(){
  return (CFG.supabaseUrl || "").replace(/\/$/,"");
}

function configured(){
  return Boolean(
    CFG.supabaseUrl &&
    CFG.supabaseAnonKey &&
    CFG.adminUsername &&
    CFG.adminLoginEmail
  );
}

async function api(path,options={}){
  const headers = {
    apikey:CFG.supabaseAnonKey,
    "Content-Type":"application/json",
    ...(options.headers || {})
  };

  headers.Authorization = "Bearer " + (sessionToken || CFG.supabaseAnonKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),12000);

  try{
    const response = await fetch(baseUrl() + path,{
      ...options,
      headers,
      signal:options.signal || controller.signal
    });

    if(!response.ok){
      let body = "";
      try{ body = await response.text(); }catch{}
      const error = new Error(body || "Request gagal.");
      error.status = response.status;
      throw error;
    }

    if(response.status === 204) return null;
    return response.json();
  }finally{
    clearTimeout(timer);
  }
}

async function restoreSession(){
  const saved = sessionStorage.getItem("pp_admin_session");
  if(!saved) return false;

  try{
    const session = JSON.parse(saved);

    if(
      !session.access_token ||
      !session.expires_at ||
      Date.now() / 1000 >= session.expires_at
    ){
      sessionStorage.removeItem("pp_admin_session");
      return false;
    }

    sessionToken = session.access_token;
    return true;
  }catch{
    sessionStorage.removeItem("pp_admin_session");
    return false;
  }
}

const passwordInput = $("#adminPassword");
const passwordToggle = $("#togglePassword");

passwordToggle.addEventListener("click",() => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  passwordToggle.classList.toggle("showing",!showing);
  passwordToggle.setAttribute("aria-pressed",String(!showing));
  passwordToggle.setAttribute(
    "aria-label",
    showing ? "Tampilkan password" : "Sembunyikan password"
  );
  passwordInput.focus({preventScroll:true});
});

$("#loginForm").addEventListener("submit",async event => {
  event.preventDefault();
  $("#loginError").hidden = true;

  if(!configured()){
    adminToast("Konfigurasi Supabase belum lengkap.");
    return;
  }

  const username = $("#adminUsername").value.trim().toLowerCase();

  if(username !== String(CFG.adminUsername).toLowerCase()){
    $("#loginError").hidden = false;
    $("#loginError").textContent = "Username atau password tidak valid.";
    return;
  }

  const button = $("#loginBtn");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.textContent = "Memeriksa…";

  try{
    const data = await api("/auth/v1/token?grant_type=password",{
      method:"POST",
      body:JSON.stringify({
        email:CFG.adminLoginEmail,
        password:passwordInput.value
      })
    });

    sessionToken = data.access_token;

    const expiresAt = Math.floor(Date.now() / 1000) + (data.expires_in || 3600);

    sessionStorage.setItem("pp_admin_session",JSON.stringify({
      access_token:sessionToken,
      expires_at:expiresAt
    }));

    passwordInput.value = "";
    passwordInput.type = "password";
    passwordToggle.classList.remove("showing");
    passwordToggle.setAttribute("aria-pressed","false");
    passwordToggle.setAttribute("aria-label","Tampilkan password");

    await openDashboard();
  }catch(error){
    console.error(error);
    $("#loginError").hidden = false;
    $("#loginError").textContent = error.status === 400 || error.status === 401
      ? "Username atau password tidak valid. Periksa kembali lalu coba lagi."
      : "Belum dapat terhubung. Periksa koneksi lalu coba lagi.";
  }finally{
    button.disabled = false;
    button.innerHTML = originalText;
  }
});

$("#logoutBtn").addEventListener("click",async () => {
  try{
    if(sessionToken) await api("/auth/v1/logout",{method:"POST"});
  }catch{}

  sessionToken = null;
  rows = [];
  sessionStorage.removeItem("pp_admin_session");
  $("#logoutBtn").hidden = true;
  switchAdmin("#loginView");
});

$("#refreshBtn").addEventListener("click",async () => {
  const button = $("#refreshBtn");
  button.disabled = true;
  try{
    if(await loadRows()) adminToast("Data sudah diperbarui.");
  }finally{
    button.disabled = false;
  }
});

let renderFrame = 0;
function scheduleRender(){
  cancelAnimationFrame(renderFrame);
  renderFrame = requestAnimationFrame(render);
}

$("#searchInput").addEventListener("input",scheduleRender);
$("#typeFilter").addEventListener("change",render);
$("#phaseFilter").addEventListener("change",render);
$("#resetFilters").addEventListener("click",() => {
  $("#searchInput").value = "";
  $("#typeFilter").value = "";
  $("#phaseFilter").value = "";
  render();
  $("#searchInput").focus();
});
$("#closeDetail").addEventListener("click",() => $("#detailDialog").close());

$("#detailDialog").addEventListener("click",event => {
  const dialog = $("#detailDialog");
  const box = dialog.getBoundingClientRect();
  if(event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});

async function openDashboard(){
  switchAdmin("#dashboardView");
  $("#logoutBtn").hidden = false;
  await loadRows();
}

async function loadRows(){
  const status = $("#dataStatus");
  status.hidden = false;
  status.className = "data-status";
  status.textContent = "Memuat hasil asesmen…";
  $("#schoolGroups").setAttribute("aria-busy", "true");
  $("#emptyState").hidden = true;
  try{
    const pageSize = 500;
    const all = [];
    let offset = 0;

    while(true){
      const select = [
        "id","client_submission_id","instrument_version","participant_type",
        "participant_name","school_raw","school_normalized","grade","phase",
        "answers","raw_score","raw_max_score","score","max_score","category","created_at"
      ].join(",");

      const batch = await api(
        `/rest/v1/submissions?select=${encodeURIComponent(select)}&order=created_at.desc&limit=${pageSize}&offset=${offset}`
      );

      all.push(...batch);
      if(batch.length < pageSize) break;
      offset += pageSize;
    }

    rows = all;
    render();
    status.hidden = true;
    return true;
  }catch(error){
    console.error(error);
    if(error?.status === 401){
      sessionToken = null;
      sessionStorage.removeItem("pp_admin_session");
      $("#logoutBtn").hidden = true;
      switchAdmin("#loginView");
      adminToast("Sesi admin berakhir. Silakan masuk kembali.");
      return;
    }
    status.className = "data-status error";
    status.textContent = rows.length
      ? "Pembaruan gagal. Data sebelumnya masih tampil. Tekan Muat ulang untuk mencoba lagi."
      : "Hasil belum dapat dimuat. Periksa koneksi, lalu tekan Muat ulang.";
    return false;
  }finally{
    $("#schoolGroups").setAttribute("aria-busy", "false");
  }
}

function render(){
  const query = $("#searchInput").value.trim().toUpperCase();
  const type = $("#typeFilter").value;
  const phase = $("#phaseFilter").value;

  const filtered = rows.filter(row => {
    const matchesType = !type || row.participant_type === type;
    const matchesPhase = !phase || row.phase === phase;
    const matchesQuery = !query
      || (row.participant_name || "").toUpperCase().includes(query)
      || (row.school_normalized || "").toUpperCase().includes(query);

    return matchesType && matchesPhase && matchesQuery;
  });

  $("#statTotal").textContent = rows.length;
  $("#statTeachers").textContent = rows.filter(row => row.participant_type === "teacher").length;
  $("#statStudents").textContent = rows.filter(row => row.participant_type === "student").length;
  $("#statSchools").textContent = new Set(
    rows.map(row => row.school_normalized).filter(Boolean)
  ).size;

  const grouped = {};

  filtered.forEach(row => {
    const school = row.school_normalized || "TANPA SEKOLAH";
    if(!grouped[school]) grouped[school] = [];
    grouped[school].push(row);
  });

  const wrapper = $("#schoolGroups");
  $("#resultCount").textContent = `${filtered.length} hasil ditampilkan dari ${rows.length} hasil tersimpan`;
  wrapper.innerHTML = "";

  const fragment = document.createDocumentFragment();

  Object.entries(grouped)
    .sort(([schoolA],[schoolB]) => schoolA.localeCompare(schoolB,"id"))
    .forEach(([school,items]) => {
      const card = document.createElement("section");
      card.className = "school-card";

      const rowsHtml = items.map(row => {
        const participantLabel = row.participant_type === "student" ? "Murid MI" : "Guru MI";
        const phaseLabel = row.phase ? "Fase " + row.phase : "-";
        const score = row.score ?? "-";
        const created = formatDate(row.created_at);

        return `
          <tr>
            <td data-label="Nama"><strong>${escapeHtml(row.participant_name || "-")}</strong></td>
            <td data-label="Peserta"><span class="badge ${row.participant_type === "student" ? "student" : ""}">${participantLabel}</span></td>
            <td data-label="Fase">${phaseLabel}</td>
            <td data-label="Nilai"><strong>${score}</strong> / 100</td>
            <td data-label="Kategori">${escapeHtml(row.category || "-")}</td>
            <td data-label="Waktu">${created}</td>
            <td data-label="Aksi"><button class="detail-btn" data-id="${escapeHtml(row.id)}" type="button" aria-label="Lihat detail ${escapeHtml(row.participant_name)}">Lihat detail</button></td>
          </tr>
        `;
      }).join("");

      card.innerHTML = `
        <div class="school-head">
          <h3>${escapeHtml(school)}</h3>
          <span>${items.length} data</span>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Peserta</th>
              <th>Fase</th>
              <th>Nilai</th>
              <th>Kategori</th>
              <th>Waktu</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;

      fragment.appendChild(card);
    });

  wrapper.appendChild(fragment);

  wrapper.querySelectorAll(".detail-btn").forEach(button => {
    button.addEventListener("click",() => openDetail(button.dataset.id));
  });

  $("#emptyState").hidden = filtered.length > 0;
}

function openDetail(id){
  const row = rows.find(item => String(item.id) === String(id));
  if(!row) return;

  const reportData = window.PolaPikirReport.fromSubmission(row);
  const answers = reportData.answers;

  $("#detailContent").innerHTML = `
    <span class="eyebrow">DETAIL HASIL</span>
    <h2 id="detailTitle">${escapeHtml(row.participant_name || "-")}</h2>

    <div class="detail-summary">
      <div><span>Sekolah</span><strong>${escapeHtml(row.school_normalized || "-")}</strong></div>
      <div><span>Peserta</span><strong>${row.participant_type === "student" ? "Murid MI" : "Guru MI"}</strong></div>
      <div><span>Nilai</span><strong>${row.score ?? "-"} / 100</strong></div>
      <div><span>Fase / Kelas</span><strong>${row.phase ? "Fase " + row.phase + " / Kelas " + row.grade : "-"}</strong></div>
      <div><span>Kategori</span><strong>${escapeHtml(row.category || "-")}</strong></div>
      <div><span>Waktu</span><strong>${formatDate(row.created_at)}</strong></div>
    </div>

    ${reportData.profile ? `<section class="detail-mindsets" aria-label="Kecenderungan enam mindset"><h3>Kecenderungan mindset</h3><p>Paling menonjol: ${escapeHtml(reportData.profile.leading.length ? reportData.profile.leading.map(item => item.label).join(" · ") : "belum ada aspek yang lebih menonjol")}</p><div>${reportData.profile.tendencies.map(item => `<span><strong>${escapeHtml(item.label)}</strong><small>${item.percent}% · ${item.count} soal${item.sufficient ? "" : " · indikasi awal"}</small></span>`).join("")}</div><small>Hasil refleksi pendidikan, bukan diagnosis atau label tetap.</small></section>` : ""}

    <div class="detail-report-actions">
      <button class="primary-btn" id="downloadAdminPdf" type="button">Unduh PDF</button>
      <button class="secondary-btn" id="printAdminPdf" type="button">Cetak PDF</button>
    </div>

    <div class="answer-list">
      ${answers.map((answer,index) => `
        <article class="answer-item">
          <small>Pertanyaan ${answer.number ?? index + 1}</small>
          <p>${escapeHtml(answer.question || "")}</p>
          ${reportData.profile ? `<small>${escapeHtml(window.PolaPikirInstruments.dimensions.find(item => item.id === answer.dimension)?.label || "")}</small>` : ""}
          <strong>
            Jawaban: ${escapeHtml(answer.answerLabel || "-")}
            &nbsp; • &nbsp;
            Poin: ${window.PolaPikirReport.formatPoints(window.PolaPikirReport.itemPoints(row.participant_type,row.phase,index,answer.answerIndex,row.instrument_version))} / ${window.PolaPikirReport.formatPoints(window.PolaPikirReport.itemWeight(row.participant_type,row.phase))}
          </strong>
        </article>
      `).join("")}
    </div>
  `;

  $("#downloadAdminPdf").addEventListener("click",async () => {
    const button = $("#downloadAdminPdf");
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Menyiapkan PDF…";
    try{
      await window.PolaPikirReport.download(reportData);
    }catch(error){
      console.error(error);
      adminToast("Gagal membuat PDF laporan.");
    }finally{
      button.disabled = false;
      button.textContent = original;
    }
  });

  $("#printAdminPdf").addEventListener("click",async () => {
    const button = $("#printAdminPdf");
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Menyiapkan…";
    try{
      await window.PolaPikirReport.print(reportData);
    }catch(error){
      console.error(error);
      adminToast("Gagal membuka PDF untuk dicetak.");
    }finally{
      button.disabled = false;
      button.textContent = original;
    }
  });

  $("#detailDialog").showModal();
}

function formatDate(value){
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID",{
    day:"2-digit",
    month:"short",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit"
  });
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,character => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[character]));
}

(async () => {
  if(!configured()){
    $("#adminConfigWarning").hidden = false;
    $("#adminConfigWarning").textContent = "Konfigurasi Supabase belum lengkap.";
    return;
  }

  if(await restoreSession()){
    await openDashboard();
  }
})();


if("scrollRestoration" in history){
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow",() => {
  if(!location.hash){
    window.scrollTo({top:0,left:0,behavior:"auto"});
  }
});
