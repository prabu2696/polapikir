(() => {
  function normalizeSchool(value){
    return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
      .replace(/[._,/\\-]+/g, " ").replace(/\bMADRASAH\s+IBTIDAIYAH\b/g, "MI")
      .replace(/\bRAUDHATUL\s+ATHFAL\b/g, "RA").replace(/^M\s+I\b/, "MI")
      .replace(/^R\s+A\b/, "RA").replace(/\s+/g, " ").trim().replace(/^(RA|MI)\s+AL\s+/, "$1 AL");
  }
  function fromDocument(id, data){
    const registry = window.PolaPikirInstruments;
    const phase = data.participant_type === "teacher" ? null
      : data.grade <= 2 ? "A" : data.grade <= 4 ? "B" : "C";
    if(data.instrument_version !== registry.version || !["teacher", "student"].includes(data.participant_type)
      || (data.participant_type === "student" && (!Number.isInteger(data.grade) || data.grade < 1 || data.grade > 6))
      || phase !== data.phase) throw new Error("Format instrumen tersimpan tidak dikenali.");
    const instrument = registry.instrument(data.participant_type, phase);
    if(!Array.isArray(data.answers) || data.answers.length !== instrument.items.length
      || data.answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer >= instrument.answers.length)){
      throw new Error("Jawaban tersimpan tidak lengkap atau tidak valid.");
    }
    const profile = registry.evaluate(data.participant_type, phase, data.answers);
    return {
      ...data, id, client_submission_id:id,
      school_normalized:normalizeSchool(data.school_raw),
      score:profile.score, raw_score:profile.rawScore, raw_max_score:profile.rawMaxScore,
      max_score:100, category:"Profil enam mindset",
      created_at:data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
      answers:instrument.items.map((item, index) => ({
        number:index + 1, question:item.text, dimension:item.dimension,
        answerIndex:data.answers[index], answerLabel:instrument.answers[data.answers[index]]
      }))
    };
  }
  window.PolaPikirSubmission = {fromDocument};
})();
