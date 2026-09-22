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

function switchAdmin(id){
  document.querySelectorAll(".admin-view").forEach(view => view.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
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

  const response = await fetch(baseUrl() + path,{
    ...options,
    headers
  });

  if(!response.ok){
    let body = "";
    try{ body = await response.text(); }catch{}
    throw new Error(body || "Request gagal.");
  }

  if(response.status === 204) return null;
  return response.json();
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

  if(!configured()){
    adminToast("Konfigurasi Supabase belum lengkap.");
    return;
  }

  const username = $("#adminUsername").value.trim().toLowerCase();

  if(username !== String(CFG.adminUsername).toLowerCase()){
    adminToast("Username atau password tidak valid.");
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
    adminToast("Username atau password tidak valid.");
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
    await loadRows();
    adminToast("Data sudah diperbarui.");
  }finally{
    button.disabled = false;
  }
});

$("#searchInput").addEventListener("input",render);
$("#typeFilter").addEventListener("change",render);
$("#phaseFilter").addEventListener("change",render);
$("#closeDetail").addEventListener("click",() => $("#detailDialog").close());

$("#detailDialog").addEventListener("click",event => {
  if(event.target === $("#detailDialog")) $("#detailDialog").close();
});

async function openDashboard(){
  switchAdmin("#dashboardView");
  $("#logoutBtn").hidden = false;
  await loadRows();
}

async function loadRows(){
  try{
    rows = await api("/rest/v1/submissions?select=*&order=created_at.desc");
    render();
  }catch(error){
    console.error(error);
    adminToast("Gagal memuat data admin.");
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
  wrapper.innerHTML = "";

  Object.entries(grouped)
    .sort(([schoolA],[schoolB]) => schoolA.localeCompare(schoolB,"id"))
    .forEach(([school,items],groupIndex) => {
      const card = document.createElement("section");
      card.className = "school-card";
      card.style.animationDelay = Math.min(groupIndex * 35,210) + "ms";

      const rowsHtml = items.map(row => {
        const participantLabel = row.participant_type === "student" ? "Murid MI" : "Guru MI";
        const phaseLabel = row.phase ? "Fase " + row.phase : "—";
        const score = row.score ?? "—";
        const created = formatDate(row.created_at);

        return `
          <tr>
            <td><strong>${escapeHtml(row.participant_name || "—")}</strong></td>
            <td><span class="badge ${row.participant_type === "student" ? "student" : ""}">${participantLabel}</span></td>
            <td>${phaseLabel}</td>
            <td><strong>${score}</strong> / 100</td>
            <td>${escapeHtml(row.category || "—")}</td>
            <td>${created}</td>
            <td><button class="detail-btn" data-id="${row.id}" type="button">Lihat Detail</button></td>
          </tr>
        `;
      }).join("");

      card.innerHTML = `
        <div class="school-head">
          <h2>${escapeHtml(school)}</h2>
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

      wrapper.appendChild(card);
    });

  wrapper.querySelectorAll(".detail-btn").forEach(button => {
    button.addEventListener("click",() => openDetail(button.dataset.id));
  });

  $("#emptyState").hidden = filtered.length > 0;
}

function openDetail(id){
  const row = rows.find(item => String(item.id) === String(id));
  if(!row) return;

  const answers = Array.isArray(row.answers) ? row.answers : [];
  const reportData = window.PolaPikirReport.fromSubmission(row);

  $("#detailContent").innerHTML = `
    <span class="eyebrow">DETAIL HASIL</span>
    <h2>${escapeHtml(row.participant_name || "—")}</h2>

    <div class="detail-summary">
      <div><span>Sekolah</span><strong>${escapeHtml(row.school_normalized || "—")}</strong></div>
      <div><span>Peserta</span><strong>${row.participant_type === "student" ? "Murid MI" : "Guru MI"}</strong></div>
      <div><span>Nilai</span><strong>${row.score ?? "—"} / 100</strong></div>
      <div><span>Fase / Kelas</span><strong>${row.phase ? "Fase " + row.phase + " / Kelas " + row.grade : "—"}</strong></div>
      <div><span>Kategori</span><strong>${escapeHtml(row.category || "—")}</strong></div>
      <div><span>Waktu</span><strong>${formatDate(row.created_at)}</strong></div>
    </div>

    <div class="detail-report-actions">
      <button class="primary-btn" id="downloadAdminPdf" type="button">Unduh PDF</button>
      <button class="secondary-btn" id="printAdminPdf" type="button">Cetak PDF</button>
    </div>

    <div class="answer-list">
      ${answers.map((answer,index) => `
        <article class="answer-item">
          <small>Pertanyaan ${answer.number ?? index + 1}</small>
          <p>${escapeHtml(answer.question || "")}</p>
          <strong>
            Jawaban: ${escapeHtml(answer.answerLabel || "—")}
            &nbsp; • &nbsp;
            Skor item: ${window.PolaPikirReport.itemScore(row.participant_type,row.phase,index,answer.answerIndex)}
          </strong>
        </article>
      `).join("")}
    </div>
  `;

  $("#downloadAdminPdf").addEventListener("click",() => {
    try{
      window.PolaPikirReport.download(reportData);
    }catch(error){
      console.error(error);
      adminToast("Gagal membuat PDF laporan.");
    }
  });

  $("#printAdminPdf").addEventListener("click",() => {
    try{
      window.PolaPikirReport.print(reportData);
    }catch(error){
      console.error(error);
      adminToast("Gagal membuka PDF untuk dicetak.");
    }
  });

  $("#detailDialog").showModal();
}

function formatDate(value){
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return "—";

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
