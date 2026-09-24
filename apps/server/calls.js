export function installCallHistory({db,emitConversation}) {
  async function finish(call,status){
    const result=await db.query(`UPDATE call_history SET ended_at=now(),status=$2 WHERE id=$1 AND ended_at IS NULL RETURNING *, GREATEST(0,EXTRACT(EPOCH FROM (now()-accepted_at)))::int AS duration`,[call.id,status]);
    if(!result.rowCount)return;
    const c=result.rows[0];
    const event={type:"call",video:c.video,status:c.status,duration:c.duration||0,callerId:c.caller_id};
    await db.query("UPDATE messages SET system_event=$2 WHERE id=$1",[c.message_id,event]);
    await emitConversation(c.conversation_id,{type:"message-updated",conversationId:c.conversation_id});
  }
  async function signal(msg,userId,to,conversationId){
    if(msg.type==="call-request"){
      const client=await db.connect();
      try{
        await client.query("BEGIN");
        await client.query("SELECT id FROM conversations WHERE id=$1 FOR UPDATE",[conversationId]);
        const old=await client.query("SELECT 1 FROM call_history WHERE conversation_id=$1 AND ended_at IS NULL",[conversationId]);
        if(old.rowCount){await client.query("ROLLBACK");return;}
        const event={type:"call",video:Boolean(msg.video),status:"ringing",duration:0,callerId:userId};
        const r=await client.query("INSERT INTO messages(conversation_id,sender_id,ciphertext,iv,system_event) VALUES($1,$2,'system','system',$3) RETURNING *",[conversationId,userId,event]);
        await client.query("INSERT INTO call_history(conversation_id,caller_id,callee_id,video,message_id) VALUES($1,$2,$3,$4,$5)",[conversationId,userId,to,Boolean(msg.video),r.rows[0].id]);
        await client.query("COMMIT");
        await emitConversation(conversationId,{type:"message",message:r.rows[0]});
      }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
      return;
    }
    const r=await db.query("SELECT * FROM call_history WHERE conversation_id=$1 AND ended_at IS NULL AND ((caller_id=$2 AND callee_id=$3) OR (caller_id=$3 AND callee_id=$2))",[conversationId,userId,to]);
    const call=r.rows[0];if(!call)return;
    if(msg.type==="call-accept" && userId===call.callee_id)await db.query("UPDATE call_history SET accepted_at=COALESCE(accepted_at,now()),status='connected' WHERE id=$1 AND ended_at IS NULL",[call.id]);
    if(msg.type==="call-decline")await finish(call,"declined");
    if(msg.type==="hangup")await finish(call,call.accepted_at?"ended":"missed");
  }
  setInterval(async()=>{
    try{
      const stale=await db.query("SELECT * FROM call_history WHERE ended_at IS NULL AND ((accepted_at IS NULL AND created_at<now()-interval '60 seconds') OR created_at<now()-interval '6 hours')");
      for(const c of stale.rows)await finish(c,c.accepted_at?"ended":"missed");
    }catch(e){console.error("call_history_cleanup_failed");}
  },15000).unref();
  return {signal,async disconnected(userId){
    const r=await db.query("SELECT * FROM call_history WHERE ended_at IS NULL AND (caller_id=$1 OR callee_id=$1)",[userId]);
    for(const c of r.rows)await finish(c,c.accepted_at?"ended":"missed");
  }};
}

