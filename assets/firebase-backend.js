(() => {
  const config = window.APP_CONFIG;
  let modules;
  const clients = new Map();
  const writes = new Map();

  function configured(){
    return Boolean(config?.firebase?.apiKey && config.firebase.projectId && config.adminUid);
  }
  async function client(kind){
    if(!configured()) throw new Error("Konfigurasi Firebase belum lengkap.");
    if(!clients.has(kind)){
      const promise = (async () => {
        modules ||= Promise.all([
          import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
          import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
        ]).catch(error => { modules = null; throw error; });
        const [appSdk, authSdk, dbSdk] = await modules;
        const name = "polapikir-" + kind;
        const app = appSdk.getApps().find(item => item.name === name) || appSdk.initializeApp(config.firebase, name);
        const auth = authSdk.getAuth(app);
        await authSdk.setPersistence(auth, kind === "admin" ? authSdk.browserSessionPersistence : authSdk.browserLocalPersistence);
        await auth.authStateReady();
        return {auth, authSdk, dbSdk, db:dbSdk.getFirestore(app)};
      })().catch(error => { clients.delete(kind); throw error; });
      clients.set(kind, promise);
    }
    return clients.get(kind);
  }
  function isAdmin(user){ return user?.uid === config.adminUid; }
  async function login(password){
    const c = await client("admin");
    const result = await c.authSdk.signInWithEmailAndPassword(c.auth, config.adminLoginEmail, password);
    if(!isAdmin(result.user)){
      await c.authSdk.signOut(c.auth);
      throw Object.assign(new Error("Akun ini tidak memiliki akses admin."), {code:"auth/unauthorized-admin"});
    }
  }
  async function restore(){
    const c = await client("admin");
    return isAdmin(c.auth.currentUser);
  }
  async function logout(){ const c = await client("admin"); await c.authSdk.signOut(c.auth); }

  function deadline(promise){
    let timer;
    return Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Pengiriman belum dikonfirmasi server. Coba kirim ulang saat koneksi tersedia.")), 15000);
    })]).finally(() => clearTimeout(timer));
  }
  async function save(payload){
    const id = payload.client_submission_id;
    if(!writes.has(id)){
      const work = (async () => {
        const c = await client("participants");
        if(!c.auth.currentUser) await c.authSdk.signInAnonymously(c.auth);
        const data = {
          owner_uid:c.auth.currentUser.uid, instrument_version:payload.instrument_version,
          participant_type:payload.participant_type, participant_name:payload.participant_name,
          school_raw:payload.school_raw, grade:payload.grade, phase:payload.phase,
          answers:payload.answers.map(answer => answer.answerIndex)
        };
        const ref = c.dbSdk.doc(c.db, "submissions", id);
        try{
          await c.dbSdk.setDoc(ref, {...data, created_at:c.dbSdk.serverTimestamp()});
        }catch(error){
          // A retry may follow a successful write whose acknowledgement was lost.
          if(error.code !== "permission-denied" && error.code !== "already-exists") throw error;
          const existing = await c.dbSdk.getDocFromServer(ref);
          if(!existing.exists() || Object.keys(data).some(key => JSON.stringify(existing.data()[key]) !== JSON.stringify(data[key]))) throw error;
        }
      })().finally(() => writes.delete(id));
      writes.set(id, work);
    }
    return deadline(writes.get(id));
  }
  async function subscribe(next, error){
    const c = await client("admin");
    if(!isAdmin(c.auth.currentUser)) throw Object.assign(new Error("Silakan masuk kembali."), {code:"auth/unauthorized-admin"});
    const q = c.dbSdk.query(c.dbSdk.collection(c.db, "submissions"), c.dbSdk.orderBy("created_at", "desc"));
    return c.dbSdk.onSnapshot(q, {includeMetadataChanges:true}, snapshot => {
      if(snapshot.metadata.fromCache) return;
      try{ next(snapshot.docs.map(doc => window.PolaPikirSubmission.fromDocument(doc.id, doc.data()))); }
      catch(problem){ error(problem); }
    }, error);
  }
  window.PolaPikirBackend = {configured, login, restore, logout, save, subscribe};
})();
