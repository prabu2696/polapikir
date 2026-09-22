const CFG=window.APP_CONFIG||{};
const $=s=>document.querySelector(s);
let sessionToken=null,rows=[];

function adminToast(msg){const e=$("#adminToast");e.textContent=msg;e.classList.add("show");clearTimeout(window.__at);window.__at=setTimeout(()=>e.classList.remove("show"),2200)}
function switchAdmin(id){document.querySelectorAll(".admin-view").forEach(v=>v.classList.remove("active"));$(id).classList.add("active")}
function baseUrl(){return (CFG.supabaseUrl||"").replace(/\/$/,"")}
function configured(){return !!(CFG.supabaseUrl&&CFG.supabaseAnonKey)}

async function api(path,opts={}){
  const headers={apikey:CFG.supabaseAnonKey,"Content-Type":"application/json",...(opts.headers||{})};
  headers.Authorization="Bearer "+(sessionToken||CFG.supabaseAnonKey);
  const res=await fetch(baseUrl()+path,{...opts,headers});
  if(!res.ok){let body="";try{body=await res.text()}catch{};throw new Error(body||"Request gagal")}
  if(res.status===204)return null;
  return res.json();
}

async function restoreSession(){
  const saved=localStorage.getItem("pp_admin_session");
  if(!saved)return false;
  try{
    const s=JSON.parse(saved);
    if(!s.access_token||!s.expires_at||Date.now()/1000>=s.expires_at)return false;
    sessionToken=s.access_token;return true;
  }catch{return false}
}

$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  if(!configured()){adminToast("Backend belum dikonfigurasi.");return}
  const btn=$("#loginBtn");btn.disabled=true;btn.textContent="Memeriksa...";
  try{
    const data=await api("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email:$("#adminEmail").value.trim(),password:$("#adminPassword").value})});
    sessionToken=data.access_token;
    const expires_at=Math.floor(Date.now()/1000)+(data.expires_in||3600);
    localStorage.setItem("pp_admin_session",JSON.stringify({access_token:sessionToken,expires_at}));
    await openDashboard();
  }catch{adminToast("Email atau password tidak valid.");}
  finally{btn.disabled=false;btn.textContent="Masuk ke Dashboard"}
});
$("#logoutBtn").addEventListener("click",()=>{sessionToken=null;localStorage.removeItem("pp_admin_session");$("#logoutBtn").hidden=true;switchAdmin("#loginView")});
$("#refreshBtn").addEventListener("click",loadRows);
$("#searchInput").addEventListener("input",render);
$("#typeFilter").addEventListener("change",render);
$("#phaseFilter").addEventListener("change",render);
$("#closeDetail").addEventListener("click",()=>$("#detailDialog").close());

async function openDashboard(){
  switchAdmin("#dashboardView");$("#logoutBtn").hidden=false;await loadRows();
}
async function loadRows(){
  try{
    rows=await api("/rest/v1/submissions?select=*&order=created_at.desc");
    render();
  }catch(err){adminToast("Gagal memuat data admin.");}
}
function render(){
  const q=$("#searchInput").value.trim().toUpperCase(),type=$("#typeFilter").value,phase=$("#phaseFilter").value;
  const filtered=rows.filter(r=>(!type||r.participant_type===type)&&(!phase||r.phase===phase)&&(!q||(r.participant_name||"").includes(q)||(r.school_normalized||"").includes(q)));
  $("#statTotal").textContent=rows.length;
  $("#statTeachers").textContent=rows.filter(r=>r.participant_type==="teacher").length;
  $("#statStudents").textContent=rows.filter(r=>r.participant_type==="student").length;
  $("#statSchools").textContent=new Set(rows.map(r=>r.school_normalized).filter(Boolean)).size;
  const groups={}; filtered.forEach(r=>(groups[r.school_normalized||"TANPA SEKOLAH"]??=[]).push(r));
  const wrap=$("#schoolGroups");wrap.innerHTML="";
  Object.entries(groups).sort(([a],[b])=>a.localeCompare(b)).forEach(([school,items])=>{
    const card=document.createElement("section");card.className="school-card";
    const trs=items.map(r=>`<tr>
      <td><strong>${escapeHtml(r.participant_name||"-")}</strong></td>
      <td><span class="badge ${r.participant_type==="student"?"student":""}">${r.participant_type==="student"?"Murid MI":"Guru MI"}</span></td>
      <td>${r.phase?"Fase "+r.phase:"-"}</td>
      <td>${r.score??"-"} / ${r.max_score??"-"}</td>
      <td>${escapeHtml(r.category||"-")}</td>
      <td>${new Date(r.created_at).toLocaleString("id-ID")}</td>
      <td><button class="detail-btn" data-id="${r.id}">Detail</button></td>
    </tr>`).join("");
    card.innerHTML=`<div class="school-head"><h2>${escapeHtml(school)}</h2><span>${items.length} data</span></div>
    <table class="data-table"><thead><tr><th>Nama</th><th>Peserta</th><th>Fase</th><th>Skor</th><th>Kategori</th><th>Waktu</th><th></th></tr></thead><tbody>${trs}</tbody></table>`;
    wrap.appendChild(card);
  });
  wrap.querySelectorAll(".detail-btn").forEach(b=>b.addEventListener("click",()=>openDetail(b.dataset.id)));
  $("#emptyState").hidden=filtered.length>0;
}
function openDetail(id){
  const r=rows.find(x=>String(x.id)===String(id));if(!r)return;
  const answers=Array.isArray(r.answers)?r.answers:[];
  $("#detailContent").innerHTML=`<span class="eyebrow">DETAIL HASIL</span><h2>${escapeHtml(r.participant_name||"-")}</h2>
  <div class="detail-summary">
    <div><span>Sekolah</span><strong>${escapeHtml(r.school_normalized||"-")}</strong></div>
    <div><span>Peserta</span><strong>${r.participant_type==="student"?"Murid MI":"Guru MI"}</strong></div>
    <div><span>Skor</span><strong>${r.score??"-"} / ${r.max_score??"-"}</strong></div>
    <div><span>Fase / Kelas</span><strong>${r.phase?("Fase "+r.phase+" / Kelas "+r.grade):"-"}</strong></div>
    <div><span>Kategori</span><strong>${escapeHtml(r.category||"-")}</strong></div>
    <div><span>Waktu</span><strong>${new Date(r.created_at).toLocaleString("id-ID")}</strong></div>
  </div>
  <div class="answer-list">${answers.map(a=>`<div class="answer-item"><small>Pertanyaan ${a.number}</small><p>${escapeHtml(a.question||"")}</p><strong>Jawaban: ${escapeHtml(a.answerLabel||"-")}</strong></div>`).join("")}</div>`;
  $("#detailDialog").showModal();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

(async()=>{
  if(!configured()){
    $("#adminConfigWarning").hidden=false;
    $("#adminConfigWarning").textContent="Backend Supabase belum dikonfigurasi. Login admin belum aktif.";
    return;
  }
  if(await restoreSession())await openDashboard();
})();
