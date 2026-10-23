// Shared guard: same-origin check + simple per-IP rate limit (best effort on serverless).
const buckets=new Map();
exports.guard=(req,res,{key,max,win})=>{
  const o=req.headers.origin;
  if(o){try{if(new URL(o).host!==req.headers.host){res.status(403).json({error:'cross-origin requests are blocked'});return false}}catch(e){res.status(400).json({error:'bad origin'});return false}}
  const ip=String(req.headers['x-forwarded-for']||(req.socket&&req.socket.remoteAddress)||'?').split(',')[0].trim();
  const k=key+':'+ip,now=Date.now();let b=buckets.get(k);
  if(!b||now>b.t){b={n:0,t:now+win};buckets.set(k,b)}
  if(++b.n>max){res.setHeader('Retry-After',Math.ceil((b.t-now)/1000));res.status(429).json({error:'slow down a little (rate limit)'});return false}
  if(buckets.size>5000)for(const[kk,v]of buckets)if(now>v.t)buckets.delete(kk);
  return true;
};
