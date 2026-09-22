const state = {
  role:null,
  name:"",
  schoolRaw:"",
  schoolNormalized:"",
  grade:null,
  phase:null,
  questions:[],
  answers:[],
  mobileIndex:0,
  clientSubmissionId:null,
  lastPayload:null,
  lastResult:null,
  reportCreatedAt:null
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function prefersReducedMotion(){
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function smoothBehavior(){
  return prefersReducedMotion() ? "auto" : "smooth";
}

function showView(id){
  clearTimeout(state.advanceTimer);
  const target = $(id);
  if(!target) return;

  const current = $(".view.active");
  if(current === target){
    window.scrollTo({top:0,behavior:smoothBehavior()});
    return;
  }

  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active","view-entering");
  });

  target.classList.add("active");
  const step = id.replace("#", "").replace("View", "");
  let reached = false;
  document.querySelectorAll("[data-step]").forEach(item => {
    const currentStep = item.dataset.step === step;
    item.classList.toggle("completed", !reached && !currentStep);
    item.removeAttribute("aria-current");
    if(currentStep){ item.setAttribute("aria-current", "step"); reached = true; }
  });
  const heading = target.querySelector("h1");
  if(heading){ heading.tabIndex = -1; heading.focus({preventScroll:true}); }
  window.scrollTo({top:0,behavior:"auto"});

  if(!prefersReducedMotion()){
    requestAnimationFrame(() => {
      target.classList.add("view-entering");
      window.setTimeout(() => target.classList.remove("view-entering"),220);
    });
  }
}

function normalizePersonName(value){
  return value.normalize("NFKC").trim().replace(/\s+/g," ").toUpperCase();
}

function normalizeSchool(value){
  let school = value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
  school = school.replace(/[._,/\\-]+/g," ");
  school = school.replace(/\bMADRASAH\s+IBTIDAIYAH\b/g,"MI");
  school = school.replace(/\bRAUDHATUL\s+ATHFAL\b/g,"RA");
  school = school.replace(/^M\s+I\b/,"MI").replace(/^R\s+A\b/,"RA");
  school = school.replace(/\s+/g," ").trim();
  school = school.replace(/^(RA|MI)\s+AL\s+/,"$1 AL");
  return school;
}

function getPhase(grade){
  if(grade <= 2) return "A";
  if(grade <= 4) return "B";
  return "C";
}

function makeId(){
  if(window.crypto?.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
    const random = Math.random() * 16 | 0;
    const value = char === "x" ? random : (random & 3 | 8);
    return value.toString(16);
  });
}

function configured(){
  return Boolean(APP_CONFIG.supabaseUrl && APP_CONFIG.supabaseAnonKey);
}

function toast(message){
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => element.classList.remove("show"), 2600);
}

function resolveRole(){
  const declared = document.body?.dataset?.initialRole;
  if(declared === "teacher" || declared === "student") return declared;

  const path = (location.pathname || "").toLowerCase();
  if(path.endsWith("/guru.html") || path.endsWith("guru.html")) return "teacher";
  if(path.endsWith("/murid.html") || path.endsWith("murid.html")) return "student";
  return state.role;
}

function setupRole(role){
  if(role !== "teacher" && role !== "student"){
    toast("Jenis peserta tidak dikenali. Silakan kembali ke halaman utama.");
    return;
  }

  state.role = role;

  const student = role === "student";
  $("#identityTitle").textContent = student ? "Mari berkenalan." : "Mulai dengan identitas Anda.";
  $("#identityEyebrow").textContent = student ? "Asesmen murid MI" : "Asesmen guru MI";
  $("#nameLabel").textContent = student ? "Nama Murid" : "Nama Guru";
  $("#gradeField").hidden = !student;
  $("#gradeSelect").required = student;

  showView("#identityView");
}

document.querySelectorAll("[data-role]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    setupRole(button.dataset.role);
  });
});

$("#identityBack").addEventListener("click", event => {
  if(document.body.dataset.initialRole){
    return;
  }
  event.preventDefault();
  showView("#homeView");
});
$("#assessmentBack").addEventListener("click", () => showView("#identityView"));
$("#restartBtn").addEventListener("click", () => location.reload());

const initialRole = resolveRole();
if(initialRole === "teacher" || initialRole === "student"){
  setupRole(initialRole);
}

$("#identityForm").addEventListener("submit", event => {
  event.preventDefault();

  try{
    state.role = resolveRole();

    if(state.role !== "teacher" && state.role !== "student"){
      throw new Error("Jenis peserta belum dipilih.");
    }

    const rawName = $("#participantName").value;
    const rawSchool = $("#schoolName").value;
    const grade = Number($("#gradeSelect").value);

    const invalid = rawName.trim().length < 2 ? ["#participantName", "Nama lengkap perlu diisi, minimal 2 karakter."]
      : rawSchool.trim().length < 2 ? ["#schoolName", "Nama madrasah perlu diisi, minimal 2 karakter."]
      : state.role === "student" && (!Number.isInteger(grade) || grade < 1 || grade > 6)
        ? ["#gradeSelect", "Pilih kelas murid terlebih dahulu."] : null;
    $("#identityError").hidden = !invalid;
    $$("#identityForm [aria-invalid]").forEach(input => input.removeAttribute("aria-invalid"));
    if(invalid){
      $("#identityError").textContent = invalid[1];
      $(invalid[0]).setAttribute("aria-invalid", "true");
      $(invalid[0]).focus();
      return;
    }

    state.name = normalizePersonName(rawName);
    state.schoolRaw = rawSchool.trim();
    state.schoolNormalized = normalizeSchool(rawSchool);
    state.grade = state.role === "student" ? grade : null;
    state.phase = state.role === "student" ? getPhase(grade) : null;

    const instrument = window.PolaPikirInstruments.instrument(state.role,state.phase);

    if(!instrument || !Array.isArray(instrument.items) || instrument.items.length === 0){
      throw new Error("Instrumen asesmen tidak ditemukan.");
    }

    const sameInstrument = state.questions.length === instrument.items.length && state.instrumentKey === `${state.role}-${state.phase}`;
    state.questions = instrument.items.map(item => item.text);
    if(!sameInstrument) state.answers = Array(state.questions.length).fill(null);
    state.instrumentKey = `${state.role}-${state.phase}`;
    state.mobileIndex = 0;
    state.clientSubmissionId = makeId();
    state.lastPayload = null;
    state.lastResult = null;
    state.reportCreatedAt = null;

    renderAssessment();

    if($("#questionsContainer").children.length !== state.questions.length){
      throw new Error("Pertanyaan gagal dimuat dengan lengkap.");
    }

    showView("#assessmentView");
  }catch(error){
    console.error("Gagal memulai asesmen:",error);
    toast("Pertanyaan gagal dimuat. Muat ulang halaman lalu coba kembali.");
  }
});

function getAnswerLabels(){
  return window.PolaPikirInstruments.instrument(state.role,state.phase).answers;
}

function renderAssessment(){
  if(!Array.isArray(state.questions) || state.questions.length === 0){
    throw new Error("Tidak ada pertanyaan untuk dirender.");
  }

  const student = state.role === "student";
  document.body.classList.toggle("phase-a", student && state.phase === "A");
  $("#assessmentTitle").textContent = student ? "Bagaimana caramu belajar?" : "Kenali cara Anda belajar.";
  $("#participantBadge").textContent = student
    ? `Murid MI · Fase ${state.phase} · ${state.questions.length} pernyataan`
    : "Guru MI · 20 pernyataan";
  $("#participantDisplay").textContent = `Nama: ${state.name}`;
  $("#schoolDisplay").textContent = `Sekolah: ${state.schoolNormalized}`;

  const container = $("#questionsContainer");
  const labels = getAnswerLabels();
  const fragment = document.createDocumentFragment();
  container.innerHTML = "";

  state.questions.forEach((question,index) => {
    const card = document.createElement("article");
    card.className = "question-card" + (index === 0 ? " mobile-active" : "");
    card.dataset.index = index;

    const radioOptions = labels.map((label,answerIndex) => `
      <label>
        <input type="radio" name="q${index}" value="${answerIndex}" ${state.answers[index] === answerIndex ? "checked" : ""}>
        ${student && state.phase === "A" ? `<span class="choice-emoji" aria-hidden="true">${["🙂","🤔","🙁"][answerIndex]}</span>` : ""}
        <span>${label}</span>
      </label>
    `).join("");

    card.innerHTML = `
      <div class="question-heading"><span class="q-number" aria-hidden="true">${String(index + 1).padStart(2,"0")}</span>
      <h2 class="q-text" id="question-${index}" tabindex="-1">${question}</h2></div>
      <div role="radiogroup" aria-labelledby="question-${index}">
        <div class="answer-options ${labels.length === 3 ? "three-options" : ""}">
          ${radioOptions}
        </div>
      </div>
    `;

    fragment.appendChild(card);

    card.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener("change", () => {
        state.answers[index] = Number(input.value);
        updateProgress();
      });
    });
  });

  container.appendChild(fragment);
  updateProgress();
  setMobileQuestion(0);
}

function updateProgress(){
  const answered = state.answers.filter(answer => answer !== null).length;
  const total = state.questions.length;
  const percent = Math.round((answered / total) * 100);

  $("#progressText").textContent = `${answered} dari ${total} terjawab`;
  $("#progressPercent").textContent = `${percent}%`;
  $("#progressBar").style.width = `${percent}%`;
  $(".progress-track").setAttribute("aria-valuenow", String(percent));
  $("#submitHint").textContent = answered === total
    ? "Semua jawaban sudah lengkap. Anda dapat melihat hasil."
    : "Hasil akan dihitung setelah seluruh pertanyaan dijawab.";
}

function setMobileQuestion(index, focus=false){
  clearTimeout(state.advanceTimer);
  state.mobileIndex = Math.max(0,Math.min(index,state.questions.length - 1));

  $$(".question-card").forEach((card,cardIndex) => {
    card.classList.toggle("mobile-active",cardIndex === state.mobileIndex);
  });

  $("#mobileCounter").textContent = `${state.mobileIndex + 1} / ${state.questions.length}`;
  $("#prevQuestion").disabled = state.mobileIndex === 0;
  $("#nextQuestion").textContent = state.mobileIndex === state.questions.length - 1
    ? "Cek nilai"
    : "Berikutnya";

  const active = document.querySelector(`.question-card[data-index="${state.mobileIndex}"]`);
  if(active && window.innerWidth <= 700 && $("#assessmentView").classList.contains("active")){
    if(focus) active.querySelector("h2").focus({preventScroll:true});
    const top = active.getBoundingClientRect().top + window.scrollY - 65;
    window.scrollTo({top:Math.max(0,top),behavior:smoothBehavior()});
  }
}

$("#prevQuestion").addEventListener("click", () => setMobileQuestion(state.mobileIndex - 1,true));
$("#nextQuestion").addEventListener("click", () => {
  if(state.mobileIndex === state.questions.length - 1){
    $("#assessmentForm").requestSubmit();
  }else{
    setMobileQuestion(state.mobileIndex + 1,true);
  }
});

function calculateResult(){
  const profile = window.PolaPikirInstruments.evaluate(state.role,state.phase,state.answers);
  return {
    ...profile,
    maxScore:100,
    category:"Profil enam mindset",
    explanation:"Hasil menunjukkan kecenderungan jawaban pada enam cara berpikir dalam belajar dan mengajar. Gunakan bersama pengamatan dan percakapan, bukan sebagai label tetap."
  };
}

function makePayload(){
  const labels = getAnswerLabels();

  return {
    client_submission_id:state.clientSubmissionId,
    instrument_version:window.PolaPikirInstruments.version,
    participant_type:state.role,
    participant_name:state.name,
    school_raw:state.schoolRaw,
    school_normalized:state.schoolNormalized,
    grade:state.grade,
    phase:state.phase,
    answers:state.questions.map((question,index) => ({
      number:index + 1,
      question,
      dimension:window.PolaPikirInstruments.instrument(state.role,state.phase).items[index].dimension,
      answerIndex:state.answers[index],
      answerLabel:labels[state.answers[index]]
    }))
  };
}

async function saveSubmission(payload,attempt=0){
  if(!configured()) throw new Error("Backend belum dikonfigurasi.");

  const endpoint = APP_CONFIG.supabaseUrl.replace(/\/$/,"")
    + "/rest/v1/submissions?on_conflict=client_submission_id";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),10000);

  try{
    const response = await fetch(endpoint,{
      method:"POST",
      signal:controller.signal,
      headers:{
        apikey:APP_CONFIG.supabaseAnonKey,
        Authorization:"Bearer " + APP_CONFIG.supabaseAnonKey,
        "Content-Type":"application/json",
        Prefer:"resolution=ignore-duplicates,return=minimal"
      },
      body:JSON.stringify(payload)
    });

    if(!response.ok){
      const detail = await response.text().catch(() => "");
      if(response.status >= 500 && attempt < 1){
        await new Promise(resolve => setTimeout(resolve,450));
        return saveSubmission(payload,attempt + 1);
      }
      throw new Error(detail || "Gagal menyimpan data.");
    }
  }catch(error){
    if(attempt < 1 && error?.name !== "AbortError"){
      await new Promise(resolve => setTimeout(resolve,450));
      return saveSubmission(payload,attempt + 1);
    }
    throw error;
  }finally{
    clearTimeout(timer);
  }
}

function setSaveState(type,message,retry=false){
  const element = $("#saveStatus");
  element.className = "save-status " + type;
  element.innerHTML = retry
    ? `${message} <button type="button" id="retrySaveBtn" class="inline-retry">Kirim ulang</button>`
    : message;

  if(retry){
    $("#retrySaveBtn").addEventListener("click",retryLastSave);
  }
}

async function sendToAdmin(payload){
  setSaveState("pending","Mengirim hasil ke dashboard admin…");

  try{
    await saveSubmission(payload);
    setSaveState("ok","Hasil tersimpan dan dapat dilihat oleh pengawas.");
  }catch(error){
    console.error(error);
    setSaveState(
      "warn",
      "Hasil sudah dihitung, tetapi belum berhasil dikirim ke admin.",
      true
    );
  }
}

async function retryLastSave(){
  if(state.lastPayload) await sendToAdmin(state.lastPayload);
}

$("#assessmentForm").addEventListener("submit",event => {
  event.preventDefault();

  const missingIndex = state.answers.findIndex(answer => answer === null);

  if(missingIndex !== -1){
    toast(`Pertanyaan ${missingIndex + 1} belum dijawab.`);
    setMobileQuestion(missingIndex,true);

    const missingCard = document.querySelector(`.question-card[data-index="${missingIndex}"]`);
    if(missingCard){
      missingCard.querySelector("h2").focus({preventScroll:true});
      missingCard.scrollIntoView({behavior:smoothBehavior(),block:"center"});
    }
    return;
  }

  const result = calculateResult();
  const payload = makePayload();

  state.lastPayload = payload;
  state.lastResult = result;
  state.reportCreatedAt = new Date().toISOString();

  renderResult(result);
  sendToAdmin(payload);
});

function renderResult(result){
  $("#resultCategory").textContent = result.category;
  $("#resultScore").textContent = result.score;
  $("#resultMax").textContent = "/ 100";
  $("#resultExplanation").textContent = result.explanation;
  $("#resultName").textContent = state.name;
  $("#resultSchool").textContent = state.schoolNormalized;
  $("#resultLeading").textContent = result.leading.length ? result.leading.map(item => item.label).join(" · ") : "Belum ada aspek yang lebih menonjol";
  $("#resultTendencies").replaceChildren(...result.tendencies.map(item => {
    const row = document.createElement("div");
    row.className = "mindset-row";
    const heading = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.label;
    const value = document.createElement("span");
    value.textContent = `${item.percent}% · ${item.count} soal${item.sufficient ? "" : " · indikasi awal"}`;
    heading.append(name,value);
    const track = document.createElement("div");
    track.className = "mindset-track";
    const fill = document.createElement("span");
    fill.style.width = `${item.percent}%`;
    track.append(fill);
    row.append(heading,track);
    return row;
  }));

  const phaseRow = $("#resultPhaseRow");
  phaseRow.hidden = state.role !== "student";
  $("#resultPhase").textContent = state.role === "student"
    ? `Fase ${state.phase} • Kelas ${state.grade} • ${state.questions.length} soal`
    : "";

  setSaveState("pending","Menyiapkan pengiriman hasil…");
  showView("#resultView");
}

function buildClientReportData(){
  if(!state.lastResult) return null;

  const labels = getAnswerLabels();

  return {
    instrumentVersion:window.PolaPikirInstruments.version,
    participantType:state.role,
    participantName:state.name,
    school:state.schoolNormalized,
    grade:state.grade,
    phase:state.phase,
    answers:state.questions.map((question,index) => ({
      number:index + 1,
      question,
      dimension:window.PolaPikirInstruments.instrument(state.role,state.phase).items[index].dimension,
      answerIndex:state.answers[index],
      answerLabel:labels[state.answers[index]]
    })),
    score:state.lastResult.score,
    rawScore:state.lastResult.rawScore,
    rawMaxScore:state.lastResult.rawMaxScore,
    category:state.lastResult.category,
    explanation:state.lastResult.explanation,
    createdAt:state.reportCreatedAt || new Date().toISOString()
  };
}

$("#downloadPdfBtn").addEventListener("click", async () => {
  const data = buildClientReportData();
  if(!data){
    toast("Hasil belum tersedia.");
    return;
  }

  const button = $("#downloadPdfBtn");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Menyiapkan PDF…";

  try{
    if(!window.PolaPikirReport?.download) throw new Error("Generator PDF belum siap.");
    await window.PolaPikirReport.download(data);
  }catch(error){
    console.error(error);
    toast("Gagal membuat PDF. Periksa koneksi lalu coba lagi.");
  }finally{
    button.disabled = false;
    button.textContent = original;
  }
});

$("#printPdfBtn").addEventListener("click", async () => {
  const data = buildClientReportData();
  if(!data){
    toast("Hasil belum tersedia.");
    return;
  }

  const button = $("#printPdfBtn");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Menyiapkan…";

  try{
    await window.PolaPikirReport.print(data);
  }catch(error){
    console.error(error);
    toast("Gagal membuka PDF untuk dicetak.");
  }finally{
    button.disabled = false;
    button.textContent = original;
  }
});


if("scrollRestoration" in history){
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow",() => {
  if(!location.hash){
    window.scrollTo({top:0,left:0,behavior:"auto"});
  }
});


document.documentElement.dataset.appReady = "true";
