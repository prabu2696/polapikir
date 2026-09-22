document.querySelector("#main").innerHTML = `
  <ol class="flow-steps" aria-label="Tahapan asesmen"><li data-step="identity" aria-current="step"><span>1</span> Identitas</li><li data-step="assessment"><span>2</span> Asesmen</li><li data-step="result"><span>3</span> Hasil</li></ol>
  <section id="identityView" class="view active" aria-labelledby="identityTitle">
    <div class="flow-shell"><a class="back-link" id="identityBack" href="./"><span aria-hidden="true">‹</span> Pilih peserta</a>
      <div class="panel form-panel"><div class="section-heading"><p class="section-kicker" id="identityEyebrow">Asesmen</p><h1 id="identityTitle">Mari berkenalan.</h1><p>Lengkapi identitas agar hasil dan laporan tercatat atas nama Anda.</p></div>
        <form id="identityForm" novalidate>
          <label class="field"><span id="nameLabel">Nama lengkap</span><input id="participantName" type="text" autocomplete="name" minlength="2" maxlength="100" placeholder="Tulis nama lengkap" required aria-describedby="nameHelp"><small id="nameHelp">Gunakan nama yang akan ditampilkan pada laporan.</small></label>
          <label class="field"><span>Nama madrasah</span><input id="schoolName" type="text" autocomplete="organization" minlength="2" maxlength="150" placeholder="Contoh: MI Al Hidayah" required></label>
          <label class="field" id="gradeField" hidden><span>Kelas</span><select id="gradeSelect"><option value="">Pilih kelas</option><option value="1">Kelas 1 · Fase A</option><option value="2">Kelas 2 · Fase A</option><option value="3">Kelas 3 · Fase B</option><option value="4">Kelas 4 · Fase B</option><option value="5">Kelas 5 · Fase C</option><option value="6">Kelas 6 · Fase C</option></select></label>
          <p id="identityError" class="form-error" role="alert" hidden></p>
          <div class="privacy-note"><strong>Tentang data Anda</strong><p>Nama, madrasah, kelas murid, jawaban, dan hasil disimpan untuk evaluasi oleh pengawas.</p></div>
          <button class="primary-btn full-btn" type="submit">Mulai asesmen</button>
        </form>
      </div><p class="form-footnote">Jawablah sesuai diri Anda. Hasil digunakan sebagai bahan refleksi pendidikan.</p>
    </div>
  </section>
  <section id="assessmentView" class="view" aria-labelledby="assessmentTitle">
    <div class="assessment-header"><button class="back-link" id="assessmentBack" type="button"><span aria-hidden="true">‹</span> Data peserta</button><div class="participant-card"><span id="participantBadge"></span><strong id="participantDisplay"></strong><small id="schoolDisplay"></small></div></div>
    <div class="assessment-intro"><h1 id="assessmentTitle">Kenali cara Anda belajar.</h1><p>Pilih jawaban yang paling sesuai. Anda boleh meninjau dan mengganti jawaban.</p></div>
    <div class="progress-card"><div class="progress-row"><span id="progressText">Belum ada jawaban</span><strong id="progressPercent">0%</strong></div><div class="progress-track" role="progressbar" aria-label="Jawaban terisi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="progressBar"></span></div></div>
    <form id="assessmentForm" novalidate><div id="questionsContainer"></div><div class="mobile-nav" id="mobileNav"><button type="button" class="secondary-btn" id="prevQuestion">Sebelumnya</button><span id="mobileCounter">1 / 20</span><button type="button" class="primary-btn" id="nextQuestion">Berikutnya</button></div><div class="submit-wrap"><div><strong>Siap melihat hasil?</strong><span id="submitHint">Lengkapi seluruh jawaban terlebih dahulu.</span></div><button class="primary-btn" id="submitAssessment" type="submit">Cek nilai</button></div></form>
  </section>
  <section id="resultView" class="view" aria-labelledby="resultCategory">
    <div class="panel result-panel"><p class="section-kicker">Hasil refleksi Anda</p><div class="score-card"><span>Nilai akhir</span><div><strong id="resultScore">0</strong><small id="resultMax">/ 100</small></div></div><h1 id="resultCategory"></h1><p id="resultExplanation"></p>
      <section class="mindset-profile" aria-labelledby="mindsetTitle"><h2 id="mindsetTitle">Kecenderungan cara berpikir</h2><p>Paling menonjol: <strong id="resultLeading"></strong></p><div id="resultTendencies" class="mindset-list"></div><small>Persentase dihitung dari jawaban pada tiap aspek; jumlah soal per aspek berbeda. Hasil ini bahan refleksi, bukan diagnosis atau penetapan karakter.</small></section>
      <dl class="result-meta"><div><dt>Nama</dt><dd id="resultName"></dd></div><div><dt>Madrasah</dt><dd id="resultSchool"></dd></div><div id="resultPhaseRow" hidden><dt>Kelas &amp; fase</dt><dd id="resultPhase"></dd></div></dl>
      <div id="saveStatus" class="save-status" role="status" aria-live="polite"></div><div class="result-actions"><button class="primary-btn" id="downloadPdfBtn" type="button">Unduh laporan PDF</button><button class="secondary-btn" id="printPdfBtn" type="button">Cetak laporan</button><button class="ghost-btn" id="restartBtn" type="button">Mulai lagi</button></div><p class="form-footnote">Simpan laporan sebagai bahan refleksi dan percakapan tentang proses belajar.</p>
    </div>
  </section>`;
