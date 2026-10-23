// Music lookup for Arzy: iTunes (cover + 30s preview), optional YouTube / Spotify search for FULL songs, and link metadata.
const env=process.env;
const to=ms=>{const c=new AbortController();setTimeout(()=>c.abort(),ms);return c.signal};
let tok=null,tokExp=0;
async function spToken(){
  if(tok&&Date.now()<tokExp)return tok;
  const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',signal:to(8000),headers:{'content-type':'application/x-www-form-urlencoded',Authorization:'Basic '+Buffer.from(env.SPOTIFY_CLIENT_ID+':'+env.SPOTIFY_CLIENT_SECRET).toString('base64')},body:'grant_type=client_credentials'});
  const j=await r.json();tok=j.access_token;tokExp=Date.now()+((j.expires_in||3600)-60)*1000;return tok;
}
async function spSearch(q){
  const r=await fetch('https://api.spotify.com/v1/search?type=track&limit=1&q='+encodeURIComponent(q),{signal:to(8000),headers:{Authorization:'Bearer '+await spToken()}});
  const t=(((await r.json()).tracks||{}).items||[])[0];
  return t?{id:t.id,title:t.name,artist:t.artists.map(a=>a.name).join(', '),cover:(t.album.images[0]||{}).url}:null;
}
async function ytSearch(q){
  const r=await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&videoSyndicated=true&videoCategoryId=10&maxResults=1&q=${encodeURIComponent(q)}&key=${env.YOUTUBE_API_KEY}`,{signal:to(8000)});
  const v=(((await r.json()).items)||[])[0];
  return v?{id:v.id.videoId,title:v.snippet.title,channel:v.snippet.channelTitle,thumb:(v.snippet.thumbnails.high||v.snippet.thumbnails.default||{}).url}:null;
}
const {guard}=require('./_lib');
module.exports=async(req,res)=>{
  if(!guard(req,res,{key:'music',max:30,win:60000}))return;
  const Q=req.query||{};
  if(Q.meta){
    let h='';try{h=new URL(String(Q.meta).slice(0,300)).hostname.replace(/^www\.|^m\./,'')}catch(e){return res.status(400).json({error:'bad url'})}
    const ep=/(^|\.)youtube\.com$|^youtu\.be$/.test(h)?'https://www.youtube.com/oembed?format=json&url=':h==='open.spotify.com'?'https://open.spotify.com/oembed?url=':null;
    if(!ep)return res.status(400).json({error:'unsupported link'});
    try{const j=await (await fetch(ep+encodeURIComponent(String(Q.meta).slice(0,300)),{signal:to(6000)})).json();return res.status(200).json({title:j.title||'',thumb:j.thumbnail_url||''})}catch(e){return res.status(200).json({title:''})}
  }
  const q=String(Q.q||'').trim().slice(0,100);
  if(!q)return res.status(400).json({error:'no query'});
  try{
    let m=null;
    try{
      const r=await fetch(`https://itunes.apple.com/search?media=music&entity=song&limit=5&country=${env.ITUNES_COUNTRY||'US'}&term=${encodeURIComponent(q)}`,{signal:to(8000)});
      const t=((await r.json()).results||[]).find(x=>x.previewUrl);
      if(t)m={title:t.trackName,artist:t.artistName,cover:(t.artworkUrl100||'').replace('100x100','600x600'),preview:t.previewUrl,link:t.trackViewUrl};
    }catch(e){}
    const sq=m?m.artist+' '+m.title:q;let yt=null,sp=null;
    const tryYT=async()=>{if(env.YOUTUBE_API_KEY&&!yt)try{yt=await ytSearch(sq+' audio')}catch(e){}};
    const trySP=async()=>{if(env.SPOTIFY_CLIENT_ID&&env.SPOTIFY_CLIENT_SECRET&&!sp)try{sp=await spSearch(sq)}catch(e){}};
    if(env.MUSIC_SOURCE==='spotify'){await trySP();if(!sp)await tryYT()}else{await tryYT();if(!yt)await trySP()}
    if(!m&&!yt&&!sp)return res.status(404).json({error:'song not found'});
    res.setHeader('Cache-Control','s-maxage=3600');
    res.status(200).json({title:sp?sp.title:m?m.title:yt.title,artist:sp?sp.artist:m?m.artist:yt.channel,cover:(sp&&sp.cover)||(m&&m.cover)||(yt&&yt.thumb)||'',preview:m&&m.preview,link:m&&m.link,yt:yt&&!sp?yt:null,sp});
  }catch(e){res.status(502).json({error:String(e.message||e)})}
};
