(function(){
  const C = {
    green:[23,107,54],
    greenDark:[13,85,40],
    greenSoft:[234,244,237],
    gold:[198,154,21],
    goldSoft:[255,246,217],
    text:[24,27,24],
    muted:[108,116,108],
    line:[224,228,222],
    soft:[248,249,246],
    white:[255,255,255]
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

  const explanations = {
    "Pola Pikir Tetap (Fixed Mindset)":"Peserta cenderung memandang kemampuan sebagai sesuatu yang relatif tetap. Hasil ini dapat digunakan sebagai bahan refleksi terhadap respons pada tantangan, usaha, dan kegagalan.",
    "Pola Pikir Tetap Bertumbuh (Fixed-Growth Mindset)":"Terlihat campuran antara keyakinan yang tetap dan keyakinan bahwa kemampuan dapat berkembang melalui pengalaman, latihan, serta usaha.",
    "Pola Pikir Bertumbuh Tetap (Growth-Fixed Mindset)":"Peserta lebih banyak menunjukkan keyakinan bahwa kemampuan dapat berkembang, meskipun pada beberapa situasi masih terdapat kecenderungan yang lebih tetap.",
    "Pola Pikir Bertumbuh (Growth Mindset)":"Peserta cenderung melihat kemampuan sebagai sesuatu yang dapat dikembangkan melalui latihan, strategi, umpan balik, dan ketekunan.",
    "Perlu Dukungan untuk Bertumbuh":"Murid masih memerlukan dukungan yang konsisten untuk melihat tantangan, kesalahan, latihan, dan masukan sebagai bagian dari proses belajar.",
    "Pola Pikir Bertumbuh Mulai Berkembang":"Murid sudah menunjukkan beberapa kebiasaan belajar yang mendukung pertumbuhan dan masih dapat diperkuat melalui latihan, strategi, serta umpan balik.",
    "Pola Pikir Bertumbuh Berkembang Baik":"Murid cukup konsisten menunjukkan kemauan mencoba, belajar dari kesalahan, menerima masukan, dan memperbaiki strategi belajar.",
    "Pola Pikir Bertumbuh Berkembang Sangat Baik":"Murid sangat konsisten menunjukkan ketekunan, keterbukaan terhadap masukan, keberanian menghadapi tantangan, dan keyakinan bahwa kemampuan dapat berkembang."
  };

  function safe(value,fallback="-"){
    return value === null || value === undefined || value === "" ? fallback : String(value);
  }

  function itemScore(type,phase,index,answerIndex){
    const selected = Number(answerIndex);
    if(!Number.isInteger(selected)) return "-";
    const matrix = type === "teacher" ? teacherScoring : studentScoring[phase];
    return matrix?.[index]?.[selected] ?? "-";
  }

  function formatDate(value){
    const date = value ? new Date(value) : new Date();
    if(Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("id-ID",{
      day:"2-digit",
      month:"long",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    });
  }

  function normalize(data){
    const participantType = data.participantType || data.participant_type;
    const phase = data.phase || null;
    const grade = data.grade || null;
    const answers = Array.isArray(data.answers) ? data.answers : [];

    return {
      participantType,
      participantName:safe(data.participantName || data.participant_name),
      school:safe(data.school || data.school_normalized || data.school_raw),
      phase,
      grade,
      answers,
      score:Number(data.score ?? 0),
      rawScore:data.rawScore ?? data.raw_score ?? null,
      rawMaxScore:data.rawMaxScore ?? data.raw_max_score ?? null,
      category:safe(data.category),
      explanation:data.explanation || explanations[data.category] || "Hasil ini merupakan bahan refleksi pendidikan berdasarkan jawaban peserta.",
      createdAt:data.createdAt || data.created_at || new Date().toISOString()
    };
  }

  function participantLabel(data){
    if(data.participantType === "teacher") return "Guru MI";
    return data.phase ? "Murid MI • Fase " + data.phase : "Murid MI";
  }

  function filename(data){
    const clean = safe(data.participantName,"PESERTA")
      .replace(/[^A-Za-z0-9]+/g,"_")
      .replace(/^_+|_+$/g,"");

    return "Laporan_Profil_Pola_Pikir_" + clean + ".pdf";
  }

  const JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  const AUTOTABLE_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js";
  let pdfLoader = null;

  function assertLibrary(){
    if(!window.jspdf?.jsPDF) throw new Error("Pustaka PDF belum termuat.");
    const test = new window.jspdf.jsPDF();
    if(typeof test.autoTable !== "function") throw new Error("Pustaka tabel PDF belum termuat.");
  }

  function loadScript(src){
    return new Promise((resolve,reject) => {
      const existing = document.querySelector(`script[data-pdf-src="${src}"]`);
      if(existing){
        if(existing.dataset.loaded === "true") return resolve();
        existing.addEventListener("load",resolve,{once:true});
        existing.addEventListener("error",() => reject(new Error("Gagal memuat pustaka PDF.")),{once:true});
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.pdfSrc = src;
      script.addEventListener("load",() => {
        script.dataset.loaded = "true";
        resolve();
      },{once:true});
      script.addEventListener("error",() => reject(new Error("Gagal memuat pustaka PDF.")),{once:true});
      document.head.appendChild(script);
    });
  }

  async function ensurePdfLibraries(){
    try{
      assertLibrary();
      return;
    }catch{}

    if(!pdfLoader){
      pdfLoader = (async () => {
        await loadScript(JSPDF_URL);
        await loadScript(AUTOTABLE_URL);
        assertLibrary();
      })().catch(error => {
        pdfLoader = null;
        throw error;
      });
    }

    return pdfLoader;
  }

  function buildDoc(input){
    assertLibrary();

    const data = normalize(input);
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});

    const pageWidth = 210;
    const left = 16;
    const right = 16;
    const contentWidth = pageWidth - left - right;

    doc.setProperties({
      title:"Laporan Profil Pola Pikir - " + data.participantName,
      subject:"Hasil Asesmen Profil Pola Pikir MI",
      author:"Prabu26.dev",
      creator:"Profil Pola Pikir MI"
    });

    doc.setFillColor(...C.white);
    doc.rect(0,0,pageWidth,297,"F");

    doc.setFillColor(...C.green);
    doc.roundedRect(left,14,12,12,3,3,"F");

    doc.setTextColor(...C.white);
    doc.setFont("helvetica","bold");
    doc.setFontSize(7.5);
    doc.text("PP",left + 6,21.7,{align:"center"});

    doc.setTextColor(...C.text);
    doc.setFont("helvetica","bold");
    doc.setFontSize(14);
    doc.text("Profil Pola Pikir MI",left + 17,19);

    doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text("Laporan Hasil Asesmen",left + 17,24);

    doc.setFillColor(...C.goldSoft);
    doc.roundedRect(pageWidth - right - 32,14,32,12,3,3,"F");
    doc.setTextColor(116,88,0);
    doc.setFont("helvetica","bold");
    doc.setFontSize(7.5);
    doc.text("NILAI 0–100",pageWidth - right - 16,21.2,{align:"center"});

    doc.setDrawColor(...C.line);
    doc.line(left,33,pageWidth-right,33);

    let y = 43;

    doc.setFont("helvetica","bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...C.text);
    doc.text("Identitas Peserta",left,y);

    y += 6;

    const meta = [
      ["Nama",data.participantName],
      ["Sekolah / Madrasah",data.school],
      ["Jenis Peserta",participantLabel(data)],
      ["Kelas / Fase",data.participantType === "student" ? "Kelas " + data.grade + " / Fase " + data.phase : "-"],
      ["Tanggal Pengisian",formatDate(data.createdAt)]
    ];

    meta.forEach(([label,value],index) => {
      const rowY = y + index * 6.6;
      doc.setFont("helvetica","bold");
      doc.setFontSize(7.2);
      doc.setTextColor(...C.muted);
      doc.text(label,left,rowY);

      doc.setFont("helvetica","normal");
      doc.setTextColor(...C.text);
      doc.text(safe(value),55,rowY);
    });

    y += meta.length * 6.6 + 6;

    doc.setFillColor(...C.soft);
    doc.setDrawColor(...C.line);
    doc.roundedRect(left,y,contentWidth,32,4,4,"FD");

    doc.setFont("helvetica","bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...C.muted);
    doc.text("NILAI AKHIR",left + 7,y + 8);

    doc.setFontSize(25);
    doc.setTextColor(...C.green);
    doc.text(String(Math.round(data.score)),left + 7,y + 23);

    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text("/ 100",left + 27,y + 23);

    doc.setFont("helvetica","bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...C.text);

    const categoryLines = doc.splitTextToSize(data.category,118);
    doc.text(categoryLines,left + 51,y + 9);

    const categoryBottom = y + 9 + (categoryLines.length - 1) * 4.3;

    doc.setFont("helvetica","normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...C.muted);

    const explanationLines = doc.splitTextToSize(data.explanation,121);
    doc.text(explanationLines,left + 51,categoryBottom + 5.5);

    y += 40;

    doc.setFont("helvetica","bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...C.text);
    doc.text("Rangkuman Jawaban",left,y);

    y += 4;

    const body = data.answers.map((answer,index) => [
      String(answer.number ?? index + 1),
      safe(answer.question),
      safe(answer.answerLabel),
      String(itemScore(data.participantType,data.phase,index,answer.answerIndex))
    ]);

    doc.autoTable({
      startY:y,
      head:[["No.","Pernyataan","Jawaban","Skor Item"]],
      body,
      margin:{left,right,top:18,bottom:18},
      theme:"grid",
      styles:{
        font:"helvetica",
        fontSize:7.2,
        textColor:C.text,
        lineColor:C.line,
        lineWidth:.18,
        cellPadding:2.25,
        valign:"middle",
        overflow:"linebreak"
      },
      headStyles:{
        fillColor:C.green,
        textColor:C.white,
        fontStyle:"bold",
        fontSize:7.2
      },
      alternateRowStyles:{fillColor:C.soft},
      columnStyles:{
        0:{cellWidth:10,halign:"center"},
        1:{cellWidth:101},
        2:{cellWidth:45},
        3:{cellWidth:22,halign:"center"}
      }
    });

    y = doc.lastAutoTable.finalY + 8;

    if(y > 245){
      doc.addPage();
      y = 25;
    }

    doc.setFillColor(...C.greenSoft);
    doc.setDrawColor(215,229,218);
    doc.roundedRect(left,y,contentWidth,31,4,4,"FD");

    doc.setFont("helvetica","bold");
    doc.setFontSize(8.3);
    doc.setTextColor(...C.greenDark);
    doc.text("Ringkasan Penilaian",left + 5,y + 7);

    doc.setFont("helvetica","normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...C.text);

    const raw = data.rawScore !== null && data.rawMaxScore !== null
      ? "Skor mentah: " + data.rawScore + " / " + data.rawMaxScore + "  •  "
      : "";

    doc.text(raw + "Nilai akhir: " + Math.round(data.score) + " / 100",left + 5,y + 14);

    const note = data.participantType === "student"
      ? "Catatan: instrumen murid merupakan asesmen reflektif pendidikan yang disesuaikan dengan fase belajar."
      : "Catatan: hasil digunakan sebagai bahan refleksi pendidikan dan pengembangan praktik belajar.";

    doc.setTextColor(...C.muted);
    doc.text(doc.splitTextToSize(note,contentWidth - 10),left + 5,y + 21);

    y += 40;

    doc.setFont("helvetica","bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.text);
    doc.text("Pengawas Bina",left,y);

    doc.setFont("helvetica","normal");
    doc.text("Zainal Arifin, S.Ag., M.M",left,y + 5);
    doc.setTextColor(...C.muted);
    doc.setFontSize(6.8);
    doc.text("RA dan MI",left,y + 10);

    doc.text("Laporan dibuat: " + formatDate(new Date()),pageWidth - right,y + 5,{align:"right"});

    const pages = doc.internal.getNumberOfPages();

    for(let page = 1; page <= pages; page++){
      doc.setPage(page);

      if(page > 1){
        doc.setFont("helvetica","bold");
        doc.setFontSize(6.8);
        doc.setTextColor(...C.green);
        doc.text("PROFIL POLA PIKIR MI",left,9);

        doc.setDrawColor(...C.line);
        doc.line(left,12,pageWidth-right,12);
      }

      doc.setDrawColor(...C.line);
      doc.line(left,286,pageWidth-right,286);

      doc.setFont("helvetica","normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...C.muted);
      doc.text("Develoved by: Prabu26.dev",left,291);
      doc.text("Halaman " + page + " / " + pages,pageWidth-right,291,{align:"right"});
    }

    return {doc,data};
  }

  async function download(data){
    await ensurePdfLibraries();
    const built = buildDoc(data);
    built.doc.save(filename(built.data));
  }

  async function print(data){
    await ensurePdfLibraries();
    const built = buildDoc(data);

    if(typeof built.doc.autoPrint === "function"){
      built.doc.autoPrint({variant:"non-conform"});
    }

    const url = built.doc.output("bloburl");
    window.open(url,"_blank","noopener,noreferrer");
  }

  function fromSubmission(row){
    return normalize(row);
  }

  window.PolaPikirReport = {
    buildDoc,
    download,
    print,
    fromSubmission,
    itemScore,
    normalize
  };
})();