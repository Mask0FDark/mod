export function installProfiles(app, {db, auth, express, emitToUser}) {
  app.patch("/api/me/profile", auth, async (req,res,next) => {
    const name=String(req.body?.displayName||"").trim().replace(/\s+/g," ");
    const username=String(req.body?.username||"").trim().replace(/^@/,"").toLowerCase();
    if (!name || name.length>40 || (username && !/^[a-z][a-z0-9_]{3,31}$/.test(username))) return res.status(400).json({error:"invalid_profile"});
    try {
      const r=await db.query("UPDATE users SET display_name=$2,username=$3 WHERE id=$1 RETURNING id,display_name,username,avatar_version",[req.user.id,name,username||null]);
      await changed(req.user.id);
      res.json({user:r.rows[0]});
    } catch(e) { if(e.code==="23505") return res.status(409).json({error:"username_taken"}); next(e); }
  });
  app.put("/api/me/avatar", auth, express.raw({type:"image/png",limit:"2mb"}), async(req,res,next)=>{
    try {
      if(!Buffer.isBuffer(req.body)||req.body.length<24||!req.body.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||req.body.readUInt32BE(16)>1024||req.body.readUInt32BE(20)>1024) return res.status(400).json({error:"invalid_avatar"});
      const r=await db.query("UPDATE users SET avatar_data=$2,avatar_version=gen_random_uuid() WHERE id=$1 RETURNING avatar_version",[req.user.id,req.body]);
      await changed(req.user.id); res.json(r.rows[0]);
    } catch(e){next(e);}
  });
  app.delete("/api/me/avatar",auth,async(req,res,next)=>{
    try {await db.query("UPDATE users SET avatar_data=NULL,avatar_version=NULL WHERE id=$1",[req.user.id]);await changed(req.user.id);res.json({ok:true});}catch(e){next(e);}
  });
  app.get("/api/users/:id/avatar",auth,async(req,res,next)=>{
    try {
      const r=await db.query("SELECT avatar_data FROM users WHERE id=$1",[req.params.id]);
      if(!r.rows[0]?.avatar_data) return res.sendStatus(404);
      res.set("Cache-Control","private, max-age=3600").type("png").send(r.rows[0].avatar_data);
    }catch(e){next(e);}
  });
  app.get("/api/users/by-username/:username",auth,async(req,res,next)=>{
    try {
      const username=String(req.params.username).replace(/^@/,"").toLowerCase();
      if(!/^[a-z][a-z0-9_]{3,31}$/.test(username)) return res.status(400).json({error:"invalid_profile"});
      const r=await db.query("SELECT id,display_name,username,avatar_version,public_key_jwk FROM users WHERE username=$1",[username]);
      if(!r.rowCount)return res.status(404).json({error:"not_found"});
      res.json({user:r.rows[0]});
    }catch(e){next(e);}
  });
  async function changed(userId){
    const r=await db.query("SELECT DISTINCT b.user_id FROM conversation_members a JOIN conversation_members b ON a.conversation_id=b.conversation_id WHERE a.user_id=$1",[userId]);
    for(const id of new Set([userId,...r.rows.map(x=>x.user_id)]))emitToUser(id,{type:"profile-updated",userId});
  }
}

