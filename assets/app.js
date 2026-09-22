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

const studentBanks = {
  A: [
    "Kalau saya belum bisa mengerjakan sesuatu, saya mau mencoba lagi.",
    "Kalau jawaban saya salah, saya mau belajar supaya bisa.",
    "Saya senang mencoba hal baru di sekolah.",
    "Kalau tugas terasa sulit, saya tetap mau berusaha.",
    "Saya mau bertanya kepada guru saat belum mengerti.",
    "Kalau teman lebih dulu bisa, saya tetap mau belajar.",
    "Saya senang saat tahu cara baru untuk mengerjakan sesuatu.",
    "Saya percaya latihan bisa membuat saya lebih bisa.",
    "Kalau saya gagal, saya mau mencoba lagi dengan cara lain.",
    "Saya mau mendengarkan saran guru agar belajar lebih baik."
  ],
  B: [
    "Saat pelajaran terasa sulit, saya tetap mencoba sampai lebih mengerti.",
    "Kesalahan membantu saya mengetahui apa yang perlu saya pelajari lagi.",
    "Kalau teman lebih pintar dalam suatu pelajaran, saya bisa belajar darinya.",
    "Saya percaya latihan yang teratur dapat meningkatkan kemampuan saya.",
    "Saya mau mencoba cara baru ketika cara pertama belum berhasil.",
    "Saya tidak malu bertanya ketika ada bagian pelajaran yang belum saya pahami.",
    "Nilai yang kurang baik membuat saya ingin memperbaiki cara belajar.",
    "Masukan dari guru membantu saya menjadi lebih baik.",
    "Saya merasa kemampuan saya bisa bertambah jika saya terus berusaha.",
    "Saya tetap mau belajar walaupun hasil pertama belum sesuai harapan.",
    "Saya senang menyelesaikan tugas yang menantang.",
    "Saya bisa belajar dari kesalahan yang saya buat."
  ],
  C: [
    "Saya percaya kemampuan saya dapat meningkat jika saya terus berlatih.",
    "Ketika mendapat nilai kurang baik, saya mencari bagian yang belum saya pahami.",
    "Masukan dari guru membantu saya memperbaiki cara belajar.",
    "Saya tetap berusaha ketika tugas membutuhkan waktu yang lama.",
    "Saya melihat kesalahan sebagai bagian dari proses belajar.",
    "Saya mau mencoba strategi belajar lain jika cara pertama kurang berhasil.",
    "Keberhasilan teman dapat menjadi contoh bagi saya untuk belajar lebih baik.",
    "Saya percaya kemampuan bukan sesuatu yang selalu tetap.",
    "Saya berani mencoba tugas yang menantang walaupun ada kemungkinan salah.",
    "Saya bisa menjadi lebih baik dalam pelajaran yang sekarang terasa sulit.",
    "Saya mencoba memahami penyebab kegagalan sebelum mencoba lagi.",
    "Saya menghargai saran yang membantu saya berkembang."
  ]
};

const teacherAnswers = ["Sangat Setuju","Setuju","Tidak Setuju","Sangat Tidak Setuju"];
const studentAnswers = ["Ya","Kadang-kadang","Tidak"];
const studentScores = [2,1,0];

const teacherCategories = [
  {min:0,max:20,label:"Pola Pikir Tetap (Fixed Mindset)",explanation:"Anda cenderung memandang kemampuan sebagai sesuatu yang relatif tetap. Hasil ini dapat digunakan sebagai bahan refleksi untuk melihat respons terhadap tantangan, usaha, dan kegagalan."},
  {min:21,max:33,label:"Pola Pikir Tetap Bertumbuh (Fixed-Growth Mindset)",explanation:"Terlihat campuran antara keyakinan yang tetap dan keyakinan bahwa kemampuan dapat berkembang melalui pengalaman, latihan, serta usaha."},
  {min:34,max:44,label:"Pola Pikir Bertumbuh Tetap (Growth-Fixed Mindset)",explanation:"Anda lebih banyak menunjukkan keyakinan bahwa kemampuan dapat berkembang, meskipun pada beberapa situasi masih terdapat kecenderungan yang lebih tetap."},
  {min:45,max:60,label:"Pola Pikir Bertumbuh (Growth Mindset)",explanation:"Anda cenderung melihat kemampuan sebagai sesuatu yang dapat dikembangkan melalui latihan, strategi, umpan balik, dan ketekunan."}
];

const state = {
  role:null,name:"",schoolRaw:"",schoolNormalized:"",grade:null,phase:null,
  questions:[],answers:[],mobileIndex:0
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
  let s = value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
  s = s.replace(/[._,/\\-]+/g," ");
  s = s.replace(/\bMADRASAH IBTIDAIYAH\b/g,"MI");
  s = s.replace(/\bRAUDHATUL ATHFAL\b/g,"RA");
  s = s.replace(/\s+/g," ").trim();
  s = s.replace(/^RA\s+AL\s+/,"RA AL").replace(/^MI\s+AL\s+/,"MI AL");
  return s;
}
function getPhase(grade){
  if(grade<=2) return "A";
  if(grade<=4) return "B";
  return "C";
}
function toast(msg){
  const el=$("#toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove("show"),2400);
}

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
  state.questions=state.role==="teacher"?teacherQuestions:studentBanks[state.phase];
  state.answers=Array(state.questions.length).fill(null);
  state.mobileIndex=0;
  renderAssessment();
  showView("#assessmentView");
});

function renderAssessment(){
  $("#participantBadge").textContent=state.role==="teacher"?"GURU MI":`MURID MI • FASE ${state.phase}`;
  $("#participantDisplay").textContent=state.name;
  $("#schoolDisplay").textContent=state.schoolNormalized;
  const container=$("#questionsContainer");
  container.innerHTML="";
  const labels=state.role==="teacher"?teacherAnswers:studentAnswers;

  state.questions.forEach((q,i)=>{
    const card=document.createElement("div");
    card.className="question-card"+(i===0?" mobile-active":"");
    card.dataset.index=i;
    const options=labels.map((label,j)=>`
      <label>
        <input type="radio" name="q${i}" value="${j}" ${state.answers[i]===j?"checked":""}>
        <span>${label}</span>
      </label>`).join("");
    const selectOptions=['<option value="">Pilih jawaban</option>',...labels.map((l,j)=>`<option value="${j}">${l}</option>`)].join("");
    card.innerHTML=`
      <div class="q-number">${String(i+1).padStart(2,"0")}</div>
      <div class="q-text">${q}</div>
      <div>
        <div class="answer-options">${options}</div>
        <select class="mobile-select" aria-label="Jawaban pertanyaan ${i+1}">${selectOptions}</select>
      </div>`;
    container.appendChild(card);

    card.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener("change",()=>{
      state.answers[i]=Number(input.value);
      card.querySelector(".mobile-select").value=input.value;
      updateProgress();
    }));
    const select=card.querySelector(".mobile-select");
    select.addEventListener("change",()=>{
      state.answers[i]=select.value===""?null:Number(select.value);
      card.querySelectorAll('input[type="radio"]').forEach(r=>r.checked=Number(r.value)===state.answers[i]);
      updateProgress();
      if(select.value!=="" && i<state.questions.length-1){
        setTimeout(()=>setMobileQuestion(i+1),220);
      }
    });
  });
  updateProgress();
  setMobileQuestion(0);
}

function updateProgress(){
  const done=state.answers.filter(v=>v!==null).length;
  const total=state.questions.length;
  const pct=Math.round(done/total*100);
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
  const last=state.mobileIndex===state.questions.length-1;
  $("#nextQuestion").textContent=last?"Cek Nilai":"Selanjutnya →";
}
$("#prevQuestion").addEventListener("click",()=>setMobileQuestion(state.mobileIndex-1));
$("#nextQuestion").addEventListener("click",()=>{
  if(state.mobileIndex===state.questions.length-1){
    $("#assessmentForm").requestSubmit();
  } else setMobileQuestion(state.mobileIndex+1);
});

function calculateResult(){
  if(state.role==="teacher"){
    let score=0;
    state.answers.forEach((a,i)=>score+=teacherScoring[i][a]);
    const category=teacherCategories.find(c=>score>=c.min&&score<=c.max);
    return {score,maxScore:60,category:category.label,explanation:category.explanation};
  }
  const score=state.answers.reduce((sum,a)=>sum+studentScores[a],0);
  const maxScore=state.questions.length*2;
  const ratio=score/maxScore;
  let category,explanation;
  if(ratio<.4){
    category="Masih Perlu Dukungan untuk Bertumbuh";
    explanation="Hasil ini menunjukkan murid mungkin masih membutuhkan dukungan untuk melihat tantangan, kesalahan, dan latihan sebagai bagian dari proses belajar.";
  }else if(ratio<.7){
    category="Sedang Mengembangkan Pola Pikir Bertumbuh";
    explanation="Murid sudah menunjukkan beberapa respons yang mendukung proses bertumbuh dan masih dapat diperkuat melalui latihan, umpan balik, serta pengalaman belajar.";
  }else{
    category="Pola Pikir Bertumbuh Berkembang Baik";
    explanation="Murid banyak menunjukkan sikap mau mencoba, belajar dari kesalahan, menerima masukan, dan percaya bahwa kemampuan dapat berkembang.";
  }
  return {score,maxScore,category,explanation};
}

async function saveSubmission(payload){
  if(!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey){
    return {saved:false,reason:"Backend belum dikonfigurasi."};
  }
  const url=APP_CONFIG.supabaseUrl.replace(/\/$/,"")+"/rest/v1/submissions";
  const res=await fetch(url,{
    method:"POST",
    headers:{
      "apikey":APP_CONFIG.supabaseAnonKey,
      "Authorization":"Bearer "+APP_CONFIG.supabaseAnonKey,
      "Content-Type":"application/json",
      "Prefer":"return=minimal"
    },
    body:JSON.stringify(payload)
  });
  if(!res.ok) throw new Error("Gagal menyimpan data");
  return {saved:true};
}

$("#assessmentForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const missing=state.answers.findIndex(v=>v===null);
  if(missing!==-1){
    toast(`Pertanyaan ${missing+1} belum dijawab.`);
    setMobileQuestion(missing);
    document.querySelector(`.question-card[data-index="${missing}"]`).scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }
  const btn=$("#submitAssessment"); btn.disabled=true; btn.textContent="Menyimpan...";
  const result=calculateResult();
  const answers=state.questions.map((q,i)=>({
    number:i+1,question:q,answerIndex:state.answers[i],
    answerLabel:(state.role==="teacher"?teacherAnswers:studentAnswers)[state.answers[i]]
  }));
  const payload={
    participant_type:state.role,
    participant_name:state.name,
    school_raw:state.schoolRaw,
    school_normalized:state.schoolNormalized,
    grade:state.grade,
    phase:state.phase,
    answers,
    score:result.score,
    max_score:result.maxScore,
    category:result.category,
    created_at:new Date().toISOString()
  };
  let status;
  try{status=await saveSubmission(payload)}
  catch(err){status={saved:false,reason:"Koneksi database gagal. Hasil belum tersimpan ke admin."}}
  renderResult(result,status);
  btn.disabled=false; btn.textContent="Cek Nilai";
});

function renderResult(result,status){
  $("#resultCategory").textContent=result.category;
  $("#resultScore").textContent=result.score;
  $("#resultMax").textContent=`/ ${result.maxScore}`;
  $("#resultExplanation").textContent=result.explanation;
  $("#resultName").textContent=state.name;
  $("#resultSchool").textContent=state.schoolNormalized;
  $("#resultPhaseRow").hidden=state.role!=="student";
  $("#resultPhase").textContent=state.role==="student"?`Fase ${state.phase} • Kelas ${state.grade}`:"";
  const save=$("#saveStatus");
  if(status.saved){
    save.className="save-status ok";
    save.textContent="✓ Hasil berhasil disimpan dan tersedia untuk admin.";
  }else{
    save.className="save-status warn";
    save.textContent="⚠ "+status.reason;
  }
  showView("#resultView");
}
