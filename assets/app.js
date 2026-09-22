const APP_CONFIG = window.APP_CONFIG || {};

const teacherQuestions = [
  "Kemampuan Anda adalah sesuatu yang sangat mendasar yang tidak banyak dapat Anda ubah lagi.",
  "Tidak peduli seberapapun tingkat kemampuan Anda saat ini, Anda bisa mengubahnya walaupun sedikit.",
  "Anda akan selalu dapat mengubah kemampuan Anda",
  "Anda adalah seseorang yang unik, tidak banyak yang dapat dilakukan untuk mengubahnya.",
  "Anda akan selalu dapat mengubah diri Anda sendiri",
  "Kemampuan dalam bidang seni dan musik dapat dipelajari oleh siapapun",
  "Hanya sedikit orang yang benar-benar mahir dalam olahraga, Anda harus membawa bakat ini sejak lahir.",
  "Matematika lebih mudah dipelajari oleh pria atau seseorang yang berada dalam lingkungan yang menyukainya",
  "Makin keras Anda mengerjakan sesuatu makin mahir Anda dalam hal ini",
  "Tidak peduli tipe apapun Anda saat ini, Anda akan selalu dapat mengubahnya",
  "Mencoba sesuatu yang baru akan sangat menyulitkan Anda sehingga Anda ingin menghindarinya.",
  "Sebagian orang baik dan pintar, sebagian lagi tidak. Tidak banyak yang dapat berubah.",
  "Saya sangat menghargai kritik dan saran dari siapapun juga terkait dengan kinerja saya saat ini.",
  "Saya kurang senang bila ada kritik dan saran dari orang lain.",
  "Semua orang yang tanpa cacat-otak atau cacat-lahir memiliki kemampuan yang sama dalam belajar",
  "Anda bisa mempelajari sesuatu yang baru, tapi Anda tidak bisa mengubah kemampuan Anda",
  "Anda dapat melakukan sesuatu secara berbeda, tapi sebenarnya Anda tetap tidak dapat mengubah kemampuan Anda",
  "Semua orang pada dasarnya baik, tapi kadang-kadang membuat keputusan yang salah",
  "Alasan terpenting mengapa Anda melakukan pekerjaan Anda adalah keinginan untuk mempelajari sesuatu yang baru.",
  "Orang yang benar-benar cerdas, tidak perlu bekerja keras."
];

const teacherScoring = [
  [0,1,2,3],[3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],
  [3,2,1,0],[0,1,2,3],[0,1,2,3],[3,2,1,0],[3,2,1,0],
  [0,1,2,3],[0,1,2,3],[3,2,1,0],[0,1,2,3],[3,2,1,0],
  [0,1,2,3],[0,1,2,3],[3,2,1,0],[3,2,1,0],[0,1,2,3]
];

const studentInstruments = {
  A: {
    title: "Fase A",
    answers: ["Ya", "Kadang-kadang", "Tidak"],
    scoring: [
      [2,1,0],[2,1,0],[2,1,0],[0,1,2],[2,1,0],
      [2,1,0],[0,1,2],[2,1,0],[2,1,0],[2,1,0]
    ],
    questions: [
      "Kalau saya belum bisa mengerjakan sesuatu, saya mau mencoba lagi.",
      "Kalau jawaban saya salah, saya mau belajar supaya bisa.",
      "Saya berani bertanya kepada guru saat belum mengerti.",
      "Kalau tugas terasa sulit, saya langsung ingin berhenti.",
      "Saya senang mencoba cara baru saat belajar.",
      "Kalau teman lebih dulu bisa, saya tetap mau belajar.",
      "Kalau saya gagal sekali, saya merasa saya tidak akan bisa.",
      "Saya percaya latihan membuat saya semakin bisa.",
      "Saya mau mendengarkan saran guru agar belajar lebih baik.",
      "Saya bangga saat berhasil setelah mencoba beberapa kali."
    ]
  },
  B: {
    title: "Fase B",
    answers: ["Sangat Sesuai", "Sesuai", "Kurang Sesuai", "Tidak Sesuai"],
    scoring: [
      [3,2,1,0],[3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],
      [3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],[3,2,1,0],
      [3,2,1,0],[0,1,2,3],[3,2,1,0],[3,2,1,0],[3,2,1,0]
    ],
    questions: [
      "Saat pelajaran terasa sulit, saya tetap mencoba sampai lebih mengerti.",
      "Kesalahan membantu saya mengetahui bagian yang perlu saya pelajari lagi.",
      "Kalau mendapat nilai kurang baik, saya mau mempelajari kembali bagian yang belum saya pahami.",
      "Saya lebih suka menghindari pelajaran yang saya rasa tidak saya kuasai.",
      "Kalau teman lebih mahir, saya dapat belajar dari cara yang ia gunakan.",
      "Saran dari guru membantu saya memperbaiki hasil belajar.",
      "Saya mau mencoba cara lain ketika cara pertama belum berhasil.",
      "Kalau saya tidak langsung bisa, berarti saya memang tidak berbakat dalam pelajaran itu.",
      "Saya berani bertanya setelah mencoba sendiri tetapi masih belum mengerti.",
      "Saya percaya latihan yang teratur dapat meningkatkan kemampuan saya.",
      "Saya tertarik mengerjakan tugas yang sedikit lebih menantang dari biasanya.",
      "Saya malu jika harus memperbaiki pekerjaan setelah dikoreksi.",
      "Saya bisa membuat target kecil agar tugas yang sulit terasa lebih mudah dikerjakan.",
      "Setelah gagal, saya mau mencoba kembali dengan persiapan yang lebih baik.",
      "Saya menghargai kemajuan kecil yang saya capai dalam belajar."
    ]
  },
  C: {
    title: "Fase C",
    answers: ["Sangat Sesuai", "Sesuai", "Kurang Sesuai", "Tidak Sesuai"],
    scoring: [
      [3,2,1,0],[3,2,1,0],[3,2,1,0],[3,2,1,0],[3,2,1,0],
      [0,1,2,3],[3,2,1,0],[3,2,1,0],[3,2,1,0],[3,2,1,0],
      [0,1,2,3],[3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],
      [3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],[3,2,1,0]
    ],
    questions: [
      "Saya percaya kemampuan saya dapat meningkat melalui latihan dan cara belajar yang tepat.",
      "Ketika mendapat nilai kurang baik, saya mencari bagian yang belum saya pahami.",
      "Saya menggunakan masukan guru untuk memperbaiki cara belajar atau hasil pekerjaan saya.",
      "Saya tetap berusaha ketika sebuah tugas membutuhkan waktu lebih lama dari yang saya perkirakan.",
      "Saya melihat kesalahan sebagai informasi tentang apa yang perlu saya perbaiki.",
      "Jika saya kesulitan dalam suatu pelajaran, biasanya itu berarti saya memang tidak mampu.",
      "Keberhasilan teman dapat menjadi sumber ide bagi saya untuk belajar lebih efektif.",
      "Saya bersedia mencoba tugas yang menantang walaupun ada kemungkinan jawaban saya salah.",
      "Setelah gagal, saya mencoba memahami penyebabnya sebelum mencoba lagi.",
      "Saya menetapkan target belajar dan memeriksa kemajuan saya dari waktu ke waktu.",
      "Lebih baik menghindari tugas yang sulit agar saya tidak terlihat gagal.",
      "Saya lebih memperhatikan kemajuan diri saya dibanding hanya membandingkan nilai dengan orang lain.",
      "Saya mau meminta bantuan setelah terlebih dahulu berusaha mencari jalan keluarnya.",
      "Orang yang benar-benar pintar tidak perlu banyak berlatih.",
      "Saya dapat menggunakan kritik yang jelas untuk memperbaiki pekerjaan berikutnya.",
      "Satu nilai yang rendah tidak menentukan kemampuan saya untuk selamanya.",
      "Jika satu cara belajar tidak efektif, saya mencoba strategi yang berbeda.",
      "Saya mudah menyerah ketika hasil belajar tidak cepat terlihat.",
      "Saya dapat menjelaskan hal yang saya pelajari dari pengalaman menghadapi kesulitan.",
      "Saya percaya usaha, strategi, dan latihan dapat membuat kemampuan saya terus berkembang."
    ]
  }
};

const teacherAnswers = ["Sangat Setuju","Setuju","Tidak Setuju","Sangat Tidak Setuju"];

const teacherCategories = [
  {min:0,max:20,label:"Pola Pikir Tetap (Fixed Mindset)",explanation:"Anda cenderung memandang kemampuan sebagai sesuatu yang relatif tetap. Hasil ini dapat digunakan sebagai bahan refleksi terhadap respons pada tantangan, usaha, dan kegagalan."},
  {min:21,max:33,label:"Pola Pikir Tetap Bertumbuh (Fixed-Growth Mindset)",explanation:"Terlihat campuran antara keyakinan yang tetap dan keyakinan bahwa kemampuan dapat berkembang melalui pengalaman, latihan, serta usaha."},
  {min:34,max:44,label:"Pola Pikir Bertumbuh Tetap (Growth-Fixed Mindset)",explanation:"Anda lebih banyak menunjukkan keyakinan bahwa kemampuan dapat berkembang, meskipun pada beberapa situasi masih terdapat kecenderungan yang lebih tetap."},
  {min:45,max:60,label:"Pola Pikir Bertumbuh (Growth Mindset)",explanation:"Anda cenderung melihat kemampuan sebagai sesuatu yang dapat dikembangkan melalui latihan, strategi, umpan balik, dan ketekunan."}
];

const state = {
  role:null,name:"",schoolRaw:"",schoolNormalized:"",grade:null,phase:null,
  questions:[],answers:[],mobileIndex:0,clientSubmissionId:null,lastPayload:null,lastResult:null,reportCreatedAt:null
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function showView(id){
  $$(".view").forEach(v=>v.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
function normalizePersonName(value){
  return value.normalize("NFKC").trim().replace(/\s+/g," ").toUpperCase();
}
function normalizeSchool(value){
  let s=value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
  s=s.replace(/[._,/\\-]+/g," ");
  s=s.replace(/\bMADRASAH IBTIDAIYAH\b/g,"MI");
  s=s.replace(/\bRAUDHATUL ATHFAL\b/g,"RA");
  s=s.replace(/\s+/g," ").trim();
  s=s.replace(/^RA\s+AL\s+/,"RA AL").replace(/^MI\s+AL\s+/,"MI AL");
  return s;
}
function getPhase(grade){ if(grade<=2)return"A"; if(grade<=4)return"B"; return"C"; }
function toast(msg){
  const el=$("#toast");el.textContent=msg;el.classList.add("show");
  clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),2600);
}
function makeId(){
  if(window.crypto?.randomUUID)return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==="x"?r:(r&3|8);return v.toString(16)});
}
function configured(){return !!(APP_CONFIG.supabaseUrl&&APP_CONFIG.supabaseAnonKey)}

function setupRole(role){
  state.role=role;
  $("#identityTitle").textContent=role==="teacher"?"Data Guru MI":"Data Murid MI";
  $("#identityEyebrow").textContent=role==="teacher"?"ASESMEN GURU MI":"ASESMEN MURID MI";
  $("#nameLabel").textContent=role==="teacher"?"Nama Guru":"Nama Murid";
  $("#gradeField").hidden=role!=="student";
  $("#gradeSelect").required=role==="student";
  showView("#identityView");
}
$$("[data-role]").forEach(btn=>btn.addEventListener("click",()=>setupRole(btn.dataset.role)));
$("#identityBack").addEventListener("click",()=>showView("#homeView"));
$("#assessmentBack").addEventListener("click",()=>showView("#identityView"));
$("#restartBtn").addEventListener("click",()=>location.reload());

$("#identityForm").addEventListener("submit",e=>{
  e.preventDefault();
  const rawName=$("#participantName").value;
  const rawSchool=$("#schoolName").value;
  const grade=Number($("#gradeSelect").value);
  if(!rawName.trim()||!rawSchool.trim()){toast("Nama dan sekolah wajib diisi.");return}
  if(state.role==="student"&&!grade){toast("Pilih kelas murid.");return}
  state.name=normalizePersonName(rawName);
  state.schoolRaw=rawSchool.trim();
  state.schoolNormalized=normalizeSchool(rawSchool);
  state.grade=state.role==="student"?grade:null;
  state.phase=state.role==="student"?getPhase(grade):null;
  state.questions=state.role==="teacher"?teacherQuestions:studentInstruments[state.phase].questions;
  state.answers=Array(state.questions.length).fill(null);
  state.mobileIndex=0;
  state.clientSubmissionId=makeId();
  state.lastPayload=null;
  state.lastResult=null;
  state.reportCreatedAt=null;
  renderAssessment();
  showView("#assessmentView");
});

function getAnswerLabels(){
  return state.role==="teacher"?teacherAnswers:studentInstruments[state.phase].answers;
}
function renderAssessment(){
  $("#participantBadge").textContent=state.role==="teacher"?"GURU MI":`MURID MI • FASE ${state.phase} • ${state.questions.length} SOAL`;
  $("#participantDisplay").textContent=state.name;
  $("#schoolDisplay").textContent=state.schoolNormalized;
  const container=$("#questionsContainer");container.innerHTML="";
  const labels=getAnswerLabels();

  state.questions.forEach((q,i)=>{
    const card=document.createElement("div");
    card.className="question-card"+(i===0?" mobile-active":"");
    card.dataset.index=i;
    const options=labels.map((label,j)=>`<label><input type="radio" name="q${i}" value="${j}"><span>${label}</span></label>`).join("");
    const selectOptions=['<option value="">Pilih jawaban</option>',...labels.map((l,j)=>`<option value="${j}">${l}</option>`)].join("");
    card.innerHTML=`
      <div class="q-number">${String(i+1).padStart(2,"0")}</div>
      <div class="q-text">${q}</div>
      <div><div class="answer-options ${labels.length===3?"three-options":""}">${options}</div>
      <select class="mobile-select" aria-label="Jawaban pertanyaan ${i+1}">${selectOptions}</select></div>`;
    container.appendChild(card);
    card.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener("change",()=>{
      state.answers[i]=Number(input.value);card.querySelector(".mobile-select").value=input.value;updateProgress();
    }));
    const select=card.querySelector(".mobile-select");
    select.addEventListener("change",()=>{
      state.answers[i]=select.value===""?null:Number(select.value);
      card.querySelectorAll('input[type="radio"]').forEach(r=>r.checked=Number(r.value)===state.answers[i]);
      updateProgress();
      if(select.value!==""&&i<state.questions.length-1)setTimeout(()=>setMobileQuestion(i+1),180);
    });
  });
  updateProgress();setMobileQuestion(0);
}

function updateProgress(){
  const done=state.answers.filter(v=>v!==null).length,total=state.questions.length,pct=Math.round(done/total*100);
  $("#progressText").textContent=`${done} dari ${total} terjawab`;
  $("#progressPercent").textContent=`${pct}%`;
  $("#progressBar").style.width=`${pct}%`;
  $("#submitHint").textContent=done===total?"Semua jawaban sudah lengkap.":"Hasil akan dihitung setelah seluruh pertanyaan dijawab.";
}
function setMobileQuestion(index){
  state.mobileIndex=Math.max(0,Math.min(index,state.questions.length-1));
  $$(".question-card").forEach((c,i)=>c.classList.toggle("mobile-active",i===state.mobileIndex));
  $("#mobileCounter").textContent=`${state.mobileIndex+1} / ${state.questions.length}`;
  $("#prevQuestion").disabled=state.mobileIndex===0;
  $("#nextQuestion").textContent=state.mobileIndex===state.questions.length-1?"Cek Nilai":"Selanjutnya →";
}
$("#prevQuestion").addEventListener("click",()=>setMobileQuestion(state.mobileIndex-1));
$("#nextQuestion").addEventListener("click",()=>state.mobileIndex===state.questions.length-1?$("#assessmentForm").requestSubmit():setMobileQuestion(state.mobileIndex+1));

function studentCategory(score){
  if(score<40)return {label:"Perlu Dukungan untuk Bertumbuh",explanation:"Murid masih memerlukan dukungan yang konsisten untuk melihat tantangan, kesalahan, latihan, dan masukan sebagai bagian dari proses belajar."};
  if(score<70)return {label:"Pola Pikir Bertumbuh Mulai Berkembang",explanation:"Murid sudah menunjukkan beberapa kebiasaan belajar yang mendukung pertumbuhan dan masih dapat diperkuat melalui latihan, strategi, serta umpan balik."};
  if(score<85)return {label:"Pola Pikir Bertumbuh Berkembang Baik",explanation:"Murid cukup konsisten menunjukkan kemauan mencoba, belajar dari kesalahan, menerima masukan, dan memperbaiki strategi belajar."};
  return {label:"Pola Pikir Bertumbuh Berkembang Sangat Baik",explanation:"Murid sangat konsisten menunjukkan ketekunan, keterbukaan terhadap masukan, keberanian menghadapi tantangan, dan keyakinan bahwa kemampuan dapat berkembang."};
}
function calculateResult(){
  let raw=0,rawMax=0,category;
  if(state.role==="teacher"){
    state.answers.forEach((a,i)=>raw+=teacherScoring[i][a]);rawMax=60;
    category=teacherCategories.find(c=>raw>=c.min&&raw<=c.max);
  }else{
    const inst=studentInstruments[state.phase];
    state.answers.forEach((a,i)=>raw+=inst.scoring[i][a]);
    rawMax=inst.scoring.length*(state.phase==="A"?2:3);
  }
  const score=Math.round(raw*100/rawMax);
  if(state.role==="student")category=studentCategory(score);
  return {score,maxScore:100,rawScore:raw,rawMaxScore:rawMax,category:category.label,explanation:category.explanation};
}

function makePayload(){
  const labels=getAnswerLabels();
  return {
    client_submission_id:state.clientSubmissionId,
    instrument_version:"2026.09-v3",
    participant_type:state.role,
    participant_name:state.name,
    school_raw:state.schoolRaw,
    school_normalized:state.schoolNormalized,
    grade:state.grade,
    phase:state.phase,
    answers:state.questions.map((q,i)=>({number:i+1,question:q,answerIndex:state.answers[i],answerLabel:labels[state.answers[i]]}))
  };
}
async function saveSubmission(payload){
  if(!configured())throw new Error("Backend belum dikonfigurasi.");
  const url=APP_CONFIG.supabaseUrl.replace(/\/$/,"")+"/rest/v1/submissions?on_conflict=client_submission_id";
  const res=await fetch(url,{
    method:"POST",
    headers:{
      apikey:APP_CONFIG.supabaseAnonKey,
      Authorization:"Bearer "+APP_CONFIG.supabaseAnonKey,
      "Content-Type":"application/json",
      Prefer:"resolution=ignore-duplicates,return=minimal"
    },
    body:JSON.stringify(payload)
  });
  if(!res.ok){const detail=await res.text().catch(()=>"");throw new Error(detail||"Gagal menyimpan data.")}
  return true;
}
function setSaveState(type,message,retry=false){
  const el=$("#saveStatus");el.className="save-status "+type;
  el.innerHTML=retry?`${message} <button type="button" id="retrySaveBtn" class="inline-retry">Coba kirim lagi</button>`:message;
  if(retry)$("#retrySaveBtn").addEventListener("click",retryLastSave);
}
async function sendToAdmin(payload){
  setSaveState("pending","Mengirim hasil ke dashboard admin...");
  try{await saveSubmission(payload);setSaveState("ok","✓ Hasil sudah tersimpan dan tersedia di dashboard admin.");}
  catch(err){setSaveState("warn","⚠ Hasil sudah dihitung di perangkat, tetapi belum berhasil dikirim ke admin.",true);}
}
async function retryLastSave(){if(!state.lastPayload)return;await sendToAdmin(state.lastPayload)}

$("#assessmentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const missing=state.answers.findIndex(v=>v===null);
  if(missing!==-1){
    toast(`Pertanyaan ${missing+1} belum dijawab.`);setMobileQuestion(missing);
    document.querySelector(`.question-card[data-index="${missing}"]`).scrollIntoView({behavior:"smooth",block:"center"});return;
  }
  const result=calculateResult();
  const payload=makePayload();
  state.lastPayload=payload;
  state.lastResult=result;
  state.reportCreatedAt=new Date().toISOString();
  renderResult(result);
  sendToAdmin(payload);
});

function renderResult(result){
  $("#resultCategory").textContent=result.category;
  $("#resultScore").textContent=result.score;
  $("#resultMax").textContent="/ 100";
  $("#resultExplanation").textContent=result.explanation;
  $("#resultName").textContent=state.name;
  $("#resultSchool").textContent=state.schoolNormalized;
  $("#resultPhaseRow").hidden=state.role!=="student";
  $("#resultPhase").textContent=state.role==="student"?`Fase ${state.phase} • Kelas ${state.grade} • ${state.questions.length} soal`:"";
  setSaveState("pending","Menyiapkan pengiriman hasil...");
  showView("#resultView");
}


function buildClientReportData(){
  if(!state.lastResult) return null;
  const labels=getAnswerLabels();
  return {
    participantType:state.role,
    participantName:state.name,
    school:state.schoolNormalized,
    grade:state.grade,
    phase:state.phase,
    answers:state.questions.map((question,i)=>({
      number:i+1,
      question,
      answerIndex:state.answers[i],
      answerLabel:labels[state.answers[i]]
    })),
    score:state.lastResult.score,
    rawScore:state.lastResult.rawScore,
    rawMaxScore:state.lastResult.rawMaxScore,
    category:state.lastResult.category,
    explanation:state.lastResult.explanation,
    createdAt:state.reportCreatedAt||new Date().toISOString()
  };
}
$("#downloadPdfBtn").addEventListener("click",()=>{
  const data=buildClientReportData();
  if(!data){toast("Hasil belum tersedia.");return}
  try{window.PolaPikirReport.download(data)}catch(err){toast("Gagal membuat PDF. Muat ulang halaman dan coba lagi.")}
});
$("#printPdfBtn").addEventListener("click",()=>{
  const data=buildClientReportData();
  if(!data){toast("Hasil belum tersedia.");return}
  try{window.PolaPikirReport.print(data)}catch(err){toast("Gagal membuka PDF untuk dicetak.")}
});
