(function(){
  const BRAND = {
    navy:[7,17,31],
    teal:[13,148,136],
    blue:[37,99,235],
    ink:[30,41,59],
    muted:[100,116,139],
    line:[226,232,240],
    soft:[241,245,249]
  };

  const teacherScoring = [
    [0,1,2,3],[3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],
    [3,2,1,0],[0,1,2,3],[0,1,2,3],[3,2,1,0],[3,2,1,0],
    [0,1,2,3],[0,1,2,3],[3,2,1,0],[0,1,2,3],[3,2,1,0],
    [0,1,2,3],[0,1,2,3],[3,2,1,0],[3,2,1,0],[0,1,2,3]
  ];
  const studentScoring = {
    A:[
      [2,1,0],[2,1,0],[2,1,0],[0,1,2],[2,1,0],
      [2,1,0],[0,1,2],[2,1,0],[2,1,0],[2,1,0]
    ],
    B:[
      [3,2,1,0],[3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],
      [3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],[3,2,1,0],
      [3,2,1,0],[0,1,2,3],[3,2,1,0],[3,2,1,0],[3,2,1,0]
    ],
    C:[
      [3,2,1,0],[3,2,1,0],[3,2,1,0],[3,2,1,0],[3,2,1,0],
      [0,1,2,3],[3,2,1,0],[3,2,1,0],[3,2,1,0],[3,2,1,0],
      [0,1,2,3],[3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],
      [3,2,1,0],[3,2,1,0],[0,1,2,3],[3,2,1,0],[3,2,1,0]
    ]
  };

  const explanations={
    "Pola Pikir Tetap (Fixed Mindset)":"Peserta cenderung memandang kemampuan sebagai sesuatu yang relatif tetap. Hasil ini dapat digunakan sebagai bahan refleksi terhadap respons pada tantangan, usaha, dan kegagalan.",
    "Pola Pikir Tetap Bertumbuh (Fixed-Growth Mindset)":"Terlihat campuran antara keyakinan yang tetap dan keyakinan bahwa kemampuan dapat berkembang melalui pengalaman, latihan, serta usaha.",
    "Pola Pikir Bertumbuh Tetap (Growth-Fixed Mindset)":"Peserta lebih banyak menunjukkan keyakinan bahwa kemampuan dapat berkembang, meskipun pada beberapa situasi masih terdapat kecenderungan yang lebih tetap.",
    "Pola Pikir Bertumbuh (Growth Mindset)":"Peserta cenderung melihat kemampuan sebagai sesuatu yang dapat dikembangkan melalui latihan, strategi, umpan balik, dan ketekunan.",
    "Perlu Dukungan untuk Bertumbuh":"Murid masih memerlukan dukungan yang konsisten untuk melihat tantangan, kesalahan, latihan, dan masukan sebagai bagian dari proses belajar.",
    "Pola Pikir Bertumbuh Mulai Berkembang":"Murid sudah menunjukkan beberapa kebiasaan belajar yang mendukung pertumbuhan dan masih dapat diperkuat melalui latihan, strategi, serta umpan balik.",
    "Pola Pikir Bertumbuh Berkembang Baik":"Murid cukup konsisten menunjukkan kemauan mencoba, belajar dari kesalahan, menerima masukan, dan memperbaiki strategi belajar.",
    "Pola Pikir Bertumbuh Berkembang Sangat Baik":"Murid sangat konsisten menunjukkan ketekunan, keterbukaan terhadap masukan, keberanian menghadapi tantangan, dan keyakinan bahwa kemampuan dapat berkembang."
  };

  function itemScore(type,phase,index,answerIndex){
    const n=Number(answerIndex);
    if(!Number.isInteger(n)) return "-";
    const matrix=type==="teacher"?teacherScoring:studentScoring[phase];
    return matrix?.[index]?.[n] ?? "-";
  }
  function fmtDate(value){
    const d=value?new Date(value):new Date();
    if(Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});
  }
  function safe(v,fallback="-"){ return v===null||v===undefined||v===""?fallback:String(v); }
  function normalize(data){
    const type=data.participantType||data.participant_type;
    const phase=data.phase||null;
    const grade=data.grade||null;
    const answers=Array.isArray(data.answers)?data.answers:[];
    return {
      participantType:type,
      participantName:safe(data.participantName||data.participant_name),
      school:safe(data.school||data.school_normalized||data.school_raw),
      phase,
      grade,
      answers,
      score:Number(data.score ?? 0),
      rawScore:data.rawScore ?? data.raw_score ?? null,
      rawMaxScore:data.rawMaxScore ?? data.raw_max_score ?? null,
      category:safe(data.category),
      explanation:data.explanation||explanations[data.category]||"Hasil ini merupakan bahan refleksi pendidikan berdasarkan jawaban peserta.",
      createdAt:data.createdAt||data.created_at||new Date().toISOString()
    };
  }
  function participantLabel(d){
    if(d.participantType==="teacher") return "Guru MI";
    return d.phase?("Murid MI - Fase "+d.phase):"Murid MI";
  }
  function filename(d){
    const clean=safe(d.participantName,"PESERTA").replace(/[^A-Za-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
    return "Laporan_Profil_Pola_Pikir_"+clean+".pdf";
  }
  function assertLib(){
    if(!window.jspdf?.jsPDF) throw new Error("Pustaka PDF belum termuat.");
    const test=new window.jspdf.jsPDF();
    if(typeof test.autoTable!=="function") throw new Error("Pustaka tabel PDF belum termuat.");
  }
  function buildDoc(input){
    assertLib();
    const d=normalize(input);
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});
    const width=210, left=15, right=15, contentW=width-left-right;

    doc.setProperties({
      title:"Laporan Profil Pola Pikir - "+d.participantName,
      subject:"Hasil Asesmen Profil Pola Pikir MI",
      author:"Prabu26.dev",
      creator:"Profil Pola Pikir MI"
    });

    doc.setFillColor(...BRAND.navy);doc.rect(0,0,width,32,"F");
    doc.setFillColor(...BRAND.teal);doc.rect(0,29,width,3,"F");
    doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(16);
    doc.text("PROFIL POLA PIKIR MI",left,13);
    doc.setFont("helvetica","normal");doc.setFontSize(9);
    doc.text("Laporan Hasil Asesmen",left,20);
    doc.setFont("helvetica","bold");doc.setFontSize(9);
    doc.text("NILAI 0 - 100",width-right,13,{align:"right"});
    doc.setFont("helvetica","normal");doc.setFontSize(7.5);
    doc.text("Dokumen dibuat otomatis oleh sistem",width-right,20,{align:"right"});

    let y=42;
    doc.setTextColor(...BRAND.ink);doc.setFont("helvetica","bold");doc.setFontSize(13);
    doc.text("Identitas Peserta",left,y);
    y+=6;

    const meta=[
      ["Nama",d.participantName],
      ["Sekolah / Madrasah",d.school],
      ["Jenis Peserta",participantLabel(d)],
      ["Kelas / Fase",d.participantType==="student"?("Kelas "+d.grade+" / Fase "+d.phase):"-"],
      ["Tanggal Pengisian",fmtDate(d.createdAt)]
    ];
    meta.forEach(([label,value],i)=>{
      const yy=y+i*7;
      doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(...BRAND.muted);doc.text(label,left,yy);
      doc.setFont("helvetica","normal");doc.setTextColor(...BRAND.ink);doc.text(safe(value),55,yy);
    });
    y+=meta.length*7+5;

    doc.setFillColor(...BRAND.soft);doc.roundedRect(left,y,contentW,30,3,3,"F");
    doc.setDrawColor(...BRAND.line);doc.roundedRect(left,y,contentW,30,3,3,"S");
    doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(...BRAND.muted);doc.text("NILAI AKHIR",left+6,y+8);
    doc.setFontSize(22);doc.setTextColor(...BRAND.teal);doc.text(String(Math.round(d.score)),left+6,y+21);
    doc.setFontSize(9);doc.setTextColor(...BRAND.muted);doc.text("/ 100",left+22,y+21);

    doc.setFont("helvetica","bold");doc.setFontSize(11);doc.setTextColor(...BRAND.ink);
    const catLines=doc.splitTextToSize(d.category,118);
    doc.text(catLines,left+48,y+9);
    const catBottom=y+9+(catLines.length-1)*4.5;
    doc.setFont("helvetica","normal");doc.setFontSize(7.8);doc.setTextColor(...BRAND.muted);
    const explanation=doc.splitTextToSize(d.explanation,122);
    doc.text(explanation,left+48,catBottom+6);
    y+=37;

    doc.setFont("helvetica","bold");doc.setFontSize(12);doc.setTextColor(...BRAND.ink);
    doc.text("Rangkuman Jawaban",left,y);
    y+=4;

    const body=d.answers.map((a,i)=>[
      String(a.number ?? i+1),
      safe(a.question),
      safe(a.answerLabel),
      String(itemScore(d.participantType,d.phase,i,a.answerIndex))
    ]);

    doc.autoTable({
      startY:y,
      head:[["No.","Pernyataan","Jawaban","Skor Item"]],
      body,
      margin:{left,right,top:20,bottom:19},
      theme:"grid",
      styles:{
        font:"helvetica",fontSize:7.4,textColor:BRAND.ink,
        lineColor:BRAND.line,lineWidth:.2,cellPadding:2.3,valign:"middle",overflow:"linebreak"
      },
      headStyles:{fillColor:BRAND.navy,textColor:[255,255,255],fontStyle:"bold",fontSize:7.5},
      alternateRowStyles:{fillColor:[248,250,252]},
      columnStyles:{
        0:{cellWidth:10,halign:"center"},
        1:{cellWidth:103},
        2:{cellWidth:45},
        3:{cellWidth:22,halign:"center"}
      },
      didDrawPage:()=>{
        const page=doc.internal.getNumberOfPages();
        doc.setDrawColor(...BRAND.line);doc.line(left,286,width-right,286);
        doc.setFont("helvetica","normal");doc.setFontSize(6.8);doc.setTextColor(...BRAND.muted);
        doc.text("Develoved by: Prabu26.dev",left,291);
        doc.text("Halaman "+page,width-right,291,{align:"right"});
      }
    });

    y=doc.lastAutoTable.finalY+8;
    if(y>246){doc.addPage();y=25;}

    doc.setFillColor(248,250,252);doc.roundedRect(left,y,contentW,31,3,3,"F");
    doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(...BRAND.ink);
    doc.text("Ringkasan Penilaian",left+5,y+7);
    doc.setFont("helvetica","normal");doc.setFontSize(7.4);doc.setTextColor(...BRAND.muted);
    const raw=(d.rawScore!==null&&d.rawMaxScore!==null) ? ("Skor mentah: "+d.rawScore+" / "+d.rawMaxScore+" | ") : "";
    doc.text(raw+"Nilai akhir: "+Math.round(d.score)+" / 100",left+5,y+14);
    const note=d.participantType==="student"
      ?"Catatan: instrumen murid merupakan asesmen reflektif pendidikan yang disesuaikan dengan fase belajar."
      :"Catatan: hasil digunakan sebagai bahan refleksi pendidikan dan pengembangan praktik belajar.";
    doc.text(doc.splitTextToSize(note,contentW-10),left+5,y+21);

    y+=39;
    doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(...BRAND.ink);
    doc.text("Pengawas Bina",left,y);
    doc.setFont("helvetica","normal");doc.setFontSize(8);doc.text("Zainal Arifin, S.Ag., M.M",left,y+5);
    doc.setFontSize(7);doc.setTextColor(...BRAND.muted);doc.text("RA dan MI",left,y+10);
    doc.text("Laporan dibuat: "+fmtDate(new Date()),width-right,y+5,{align:"right"});

    return {doc,data:d};
  }
  function download(data){
    const built=buildDoc(data);
    built.doc.save(filename(built.data));
  }
  function print(data){
    const built=buildDoc(data);
    if(typeof built.doc.autoPrint==="function") built.doc.autoPrint({variant:"non-conform"});
    const url=built.doc.output("bloburl");
    window.open(url,"_blank","noopener,noreferrer");
  }
  function fromSubmission(r){
    return normalize(r);
  }

  window.PolaPikirReport={buildDoc,download,print,fromSubmission,itemScore,normalize};
})();