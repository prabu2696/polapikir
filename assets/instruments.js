(function(root){
  const version = "2026.09-v4";
  const dimensions = [
    {id:"growth",label:"Growth Mindset",description:"Melihat kemampuan dapat berkembang melalui latihan, strategi, dan evaluasi."},
    {id:"challenge",label:"Challenge Mindset",description:"Mau menghadapi tugas yang menantang sebagai kesempatan belajar."},
    {id:"creator",label:"Creator Mindset",description:"Mengambil peran dan langkah nyata ketika hasil belum sesuai harapan."},
    {id:"abundance",label:"Abundance Mindset",description:"Berbagi pengetahuan dan bekerja sama tanpa menganggap kemajuan orang lain sebagai ancaman."},
    {id:"benefit",label:"Benefit Mindset",description:"Menggunakan pengetahuan untuk memberi manfaat nyata bagi sekitar."},
    {id:"outward",label:"Outward Mindset",description:"Memperhatikan kebutuhan, kendala, dan sudut pandang orang lain saat belajar bersama."}
  ];
  const item = (dimension,text,reverse=false) => ({dimension,text,reverse});
  const teacher = [
    item("growth","Ketika cara mengajar saya belum membantu murid memahami materi, saya meninjau penyebabnya dan mencoba strategi lain."),
    item("challenge","Saya bersedia mencoba pendekatan baru untuk materi yang sulit dipahami murid."),
    item("creator","Ketika hasil belajar kelas belum sesuai harapan, saya menentukan langkah perbaikan yang berada dalam kendali saya."),
    item("abundance","Saya berbagi bahan ajar yang efektif dengan rekan guru agar dapat digunakan bersama."),
    item("benefit","Saya mengajak murid menerapkan pelajaran untuk membantu orang di sekitarnya."),
    item("outward","Sebelum menilai murid yang tertinggal, saya mencari tahu kesulitan belajar yang ia hadapi."),
    item("growth","Masukan dari murid atau rekan guru saya gunakan untuk memperbaiki cara mengajar."),
    item("challenge","Saat mendapat tugas mengajar di luar kebiasaan, saya mempelajari kebutuhan tugas itu dan mulai mencobanya."),
    item("creator","Saya menunggu keadaan berubah sebelum mengubah cara mengajar yang belum berhasil.",true),
    item("abundance","Kemajuan rekan guru membuat saya ingin bertukar cara mengajar, bukan bersaing dengannya."),
    item("benefit","Saya menilai keberhasilan pembelajaran juga dari manfaatnya bagi kehidupan murid, bukan hanya nilai ujian."),
    item("outward","Saya menyesuaikan penjelasan ketika melihat murid memerlukan cara belajar yang berbeda."),
    item("growth","Saya mencatat bagian pembelajaran yang perlu diperbaiki setelah mengajar."),
    item("challenge","Saya cenderung menghindari kegiatan belajar yang hasilnya belum dapat saya pastikan.",true),
    item("creator","Saya mengajak murid merencanakan langkah berikutnya setelah mereka mendapat hasil yang kurang baik."),
    item("abundance","Saya memberi ruang bagi murid untuk saling menjelaskan materi yang sudah dipahami."),
    item("benefit","Saya membantu murid melihat bagaimana pengetahuan di kelas berguna bagi lingkungan mereka."),
    item("outward","Saya mendengarkan alasan murid sebelum menentukan bantuan belajar yang ia perlukan."),
    item("growth","Saya menganggap kemampuan mengajar dapat terus berkembang melalui latihan dan umpan balik."),
    item("challenge","Saya menyusun tahapan kecil ketika menghadapi target belajar yang tampak sulit dicapai.")
  ];
  const A = [
    item("growth","Saat belum bisa, saya mau berlatih lagi."),
    item("challenge","Saya mau mencoba tugas yang sedikit sulit."),
    item("creator","Saat jawaban saya salah, saya mau memperbaikinya."),
    item("abundance","Saya mau berbagi cara belajar dengan teman."),
    item("benefit","Saya senang memakai ilmu untuk membantu orang lain."),
    item("outward","Saya mendengarkan teman yang sedang kesulitan."),
    item("growth","Saya percaya latihan membuat saya makin bisa."),
    item("challenge","Saya mau mencoba lagi saat tugas belum selesai."),
    item("creator","Saya mencari bantuan setelah mencoba sendiri."),
    item("abundance","Saya senang belajar bersama teman yang sudah bisa.")
  ];
  const B = [
    item("growth","Ketika belum memahami pelajaran, saya mencoba cara belajar lain dan berlatih kembali."),
    item("challenge","Saya mencoba tugas yang menantang walaupun belum yakin akan langsung berhasil."),
    item("creator","Setelah mendapat nilai kurang baik, saya memeriksa jawaban dan menentukan apa yang perlu diperbaiki."),
    item("abundance","Saya mau menjelaskan pelajaran kepada teman tanpa takut mereka menjadi lebih pintar dari saya."),
    item("benefit","Saya mencari cara memakai hal yang dipelajari di sekolah untuk membantu keluarga atau teman."),
    item("outward","Saya bertanya kepada teman apa yang membuatnya kesulitan sebelum membantunya."),
    item("growth","Saran guru membantu saya memperbaiki cara belajar."),
    item("challenge","Saya lebih suka melewatkan soal sulit daripada mencoba memahami langkah pertamanya.",true),
    item("creator","Saya menyusun rencana kecil untuk menyelesaikan tugas yang tertunda."),
    item("abundance","Saya senang belajar dari cara yang digunakan teman saat ia berhasil."),
    item("benefit","Saya melihat manfaat pelajaran ketika dapat memakainya untuk menyelesaikan masalah sederhana di sekitar saya."),
    item("outward","Saat bekerja kelompok, saya mendengarkan pendapat teman yang berbeda dari pendapat saya."),
    item("growth","Saya percaya kemampuan saya dapat berkembang meskipun sekarang saya masih kesulitan."),
    item("challenge","Saya mau mencoba lagi dengan cara berbeda setelah menemui kesulitan."),
    item("creator","Saya menyalahkan keadaan tanpa memikirkan langkah yang bisa saya lakukan ketika hasil saya kurang baik.",true)
  ];
  const C = [
    item("growth","Ketika hasil belajar saya belum baik, saya memeriksa strategi yang saya gunakan lalu memperbaikinya."),
    item("challenge","Saya memilih mengerjakan tugas menantang karena dapat mempelajari hal yang belum saya kuasai."),
    item("creator","Saya membuat rencana perbaikan setelah mengetahui kesalahan dalam pekerjaan saya."),
    item("abundance","Saya berbagi cara belajar yang membantu saya kepada teman yang membutuhkannya."),
    item("benefit","Saya menghubungkan pelajaran dengan cara membantu orang atau lingkungan di sekitar saya."),
    item("outward","Saya mencoba memahami kendala teman sebelum menilai hasil kerja kelompoknya."),
    item("growth","Umpan balik guru saya gunakan untuk mengubah cara belajar, bukan sekadar memperbaiki nilai."),
    item("challenge","Saat tugas terasa rumit, saya membaginya menjadi langkah yang dapat saya kerjakan."),
    item("creator","Saya bertanggung jawab menyelesaikan bagian pekerjaan kelompok yang sudah saya sepakati."),
    item("abundance","Keberhasilan teman memberi saya kesempatan mempelajari cara baru, bukan alasan untuk merasa tersaingi."),
    item("benefit","Saya ingin hasil pekerjaan sekolah saya berguna bagi orang lain, bukan hanya selesai untuk dinilai."),
    item("outward","Saya menanyakan kebutuhan anggota kelompok agar pembagian tugas terasa adil."),
    item("growth","Saya percaya kemampuan pada pelajaran yang sulit dapat meningkat melalui latihan dan strategi yang sesuai."),
    item("challenge","Saya menghindari tugas baru karena takut terlihat belum mampu.",true),
    item("creator","Ketika cara pertama tidak berhasil, saya mencari langkah lain yang bisa saya lakukan."),
    item("abundance","Saya membantu teman memahami materi meskipun kami sedang menyiapkan tugas yang sama."),
    item("benefit","Saya mempertimbangkan manfaat dan dampak bagi orang lain ketika membuat proyek kelas."),
    item("outward","Saya mendengarkan alasan teman sebelum menanggapi pendapat yang berbeda."),
    item("growth","Saya meninjau kesalahan agar dapat belajar lebih baik pada kesempatan berikutnya."),
    item("challenge","Saya bersedia mencoba soal yang belum biasa saya kerjakan sebelum meminta jawabannya.")
  ];
  const definitions = {
    teacher:{items:teacher,answers:["Sangat Setuju","Setuju","Tidak Setuju","Sangat Tidak Setuju"]},
    A:{items:A,answers:["Ya","Kadang-kadang","Tidak"]},
    B:{items:B,answers:["Sangat Sesuai","Sesuai","Kurang Sesuai","Tidak Sesuai"]},
    C:{items:C,answers:["Sangat Sesuai","Sesuai","Kurang Sesuai","Tidak Sesuai"]}
  };
  function instrument(type,phase){return definitions[type === "teacher" ? "teacher" : phase] || null;}
  function rawPoint(entry,answerIndex,answerCount){
    if(!entry || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= answerCount) return null;
    return entry.reverse ? answerIndex : answerCount - 1 - answerIndex;
  }
  function evaluate(type,phase,answers){
    const selected = instrument(type,phase);
    if(!selected || !Array.isArray(answers) || answers.length !== selected.items.length) throw new Error("Jawaban tidak sesuai instrumen.");
    const maximum = selected.answers.length - 1;
    const summary = Object.fromEntries(dimensions.map(d => [d.id,{...d,raw:0,count:0,percent:0}]));
    let raw = 0;
    selected.items.forEach((entry,index) => {
      const point = rawPoint(entry,answers[index],selected.answers.length);
      if(point === null) throw new Error(`Jawaban ${index + 1} tidak valid.`);
      raw += point;
      summary[entry.dimension].raw += point;
      summary[entry.dimension].count++;
    });
    const tendencies = dimensions.map(d => {
      const detail = summary[d.id];
      detail.percent = Math.round(detail.raw * 100 / (detail.count * maximum));
      detail.sufficient = detail.count >= 2;
      return detail;
    });
    const top = tendencies.filter(item => item.sufficient).sort((a,b) => b.percent - a.percent || dimensions.findIndex(d=>d.id===a.id)-dimensions.findIndex(d=>d.id===b.id));
    const leading = top[0]?.percent > top[top.length-1]?.percent ? top.filter(item => item.percent === top[0].percent) : [];
    return {rawScore:raw,rawMaxScore:selected.items.length*maximum,score:Math.round(raw*100/(selected.items.length*maximum)),tendencies,leading};
  }
  root.PolaPikirInstruments = {version,dimensions,definitions,instrument,rawPoint,evaluate};
})(typeof window === "undefined" ? globalThis : window);
