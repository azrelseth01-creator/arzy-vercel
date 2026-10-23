// Cloud sync for Arzy (memory, outfit, room, stats) using Upstash Redis REST (no npm packages).
const crypto=require('crypto');
const URL_=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
const TOK=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
const redis=async cmd=>{const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOK},body:JSON.stringify(cmd)});const j=await r.json();if(!r.ok||j.error)throw new Error(j.error||'redis error');return j.result};
const {guard}=require('./_lib');
module.exports=async(req,res)=>{
  if(!guard(req,res,{key:'mem',max:40,win:60000}))return;
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  if(!URL_||!TOK)return res.status(501).json({error:'cloud storage is not set up on this site yet'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
    const code=String(b.code||'');
    if(code.length<8)return res.status(400).json({error:'sync phrase must be at least 8 characters'});
    const key='arzy:'+crypto.createHash('sha256').update((process.env.ARZY_SALT||'')+code).digest('hex');
    if(b.op==='save'){const s=JSON.stringify(b.data||{});if(s.length>30000)return res.status(413).json({error:'data too large'});await redis(['SET',key,s]);return res.status(200).json({ok:true})}
    const v=await redis(['GET',key]);
    return res.status(200).json({data:v?JSON.parse(v):null});
  }catch(e){res.status(500).json({error:String(e.message||e)})}
};
