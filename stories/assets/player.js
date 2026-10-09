(function(){
const $=id=>document.getElementById(id);
const ST=window.STORY, S=ST.scenes, PAUSE=800, GLOSS=ST.glossary||{};
document.title=ST.title+" · Mkweli Stories";
if(ST.bookUrl){[$("booklink"),$("morelink")].forEach(a=>{a.href=ST.bookUrl;a.target="_top";});}
const audio=$("audio"), text=$("text"), playB=$("play");
let i=0, playing=false, spans=[], timer=null, raf=null, front=$("imA"), back=$("imB");
const KB=[["1.12","0%","-3%"],["1.14","3%","2%"],["1.1","-3%","1%"],["1.13","0%","3%"]];
S.forEach(()=>$("dots").appendChild(document.createElement("i")));
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const gkey=tok=>{const k=tok.toLowerCase().replace(/[^\w'-]/g,"").replace(/'s$/,"").replace(/^-+|-+$/g,"");return GLOSS[k]?k:null;};
function render(){
  const sc=S[i];
  back.src=sc.image; back.alt="Picture for page "+sc.page; const k=KB[i%4];
  back.style.setProperty("--z",k[0]);back.style.setProperty("--px",k[1]);back.style.setProperty("--py",k[2]);
  back.classList.remove("kb"); void back.offsetWidth; back.classList.add("on","kb"); front.classList.remove("on");
  [front,back]=[back,front];
  $("bg").style.backgroundImage=`url(${sc.image})`;
  $("count").textContent=`${i+1} / ${S.length}`;
  [...$("dots").children].forEach((d,n)=>d.classList.toggle("on",n===i));
  $("back").disabled=i===0;
  text.innerHTML="";spans=[];
  if(sc.title){text.innerHTML=`<div class="title-card"><h1>${esc(ST.title)}</h1><p>Story by ${esc(ST.author)}</p></div>`;}
  else{
    if(sc.closing&&sc.label){const l=document.createElement("div");l.className="label";l.textContent=sc.label;text.appendChild(l);}
    sc.tokens.forEach(tk=>{
      const sp=document.createElement("span");sp.className="w";sp.textContent=tk.w;
      const g=gkey(tk.w); if(g){sp.classList.add("learn");sp.dataset.g=g;}
      if(tk.t!==undefined){sp.dataset.t=tk.t;sp.dataset.e=tk.e;}
      text.appendChild(sp);text.appendChild(document.createTextNode(" "));spans.push(sp);
    });
  }
  audio.src=sc.audio;
}
function mark(t){for(const sp of spans){if(sp.dataset.t===undefined)continue;
  sp.classList.toggle("now",t>=+sp.dataset.t&&t<+sp.dataset.e+0.08);sp.classList.toggle("done",t>=+sp.dataset.e+0.08);}}
function tick(){mark(audio.currentTime);
  const now=text.querySelector(".now"); if(now&&text.scrollHeight>text.clientHeight) now.scrollIntoView({block:"nearest",behavior:"smooth"});
  raf=requestAnimationFrame(tick);}
function setPlaying(p){playing=p;playB.innerHTML=p?"❚❚ Pause":"▶ Play";playB.setAttribute("aria-label",p?"Pause":"Play");
  if(p){audio.play().catch(()=>setPlaying(false));cancelAnimationFrame(raf);tick();}else{audio.pause();clearTimeout(timer);}}
function go(n,auto){clearTimeout(timer);if(n<0)return;if(n>=S.length){setPlaying(false);$("quiz").classList.add("show");return;}
  i=n;render();if(playing||auto){audio.currentTime=0;setPlaying(true);}}
audio.addEventListener("ended",()=>{spans.forEach(s=>{s.classList.remove("now");s.classList.add("done")});
  if(playing)timer=setTimeout(()=>go(i+1,true),PAUSE);});
playB.onclick=()=>setPlaying(!playing);
$("next").onclick=()=>go(i+1);$("back").onclick=()=>go(i-1);
document.addEventListener("keydown",e=>{if(e.key==="ArrowRight")go(i+1);if(e.key==="ArrowLeft")go(i-1);if(e.key===" "){e.preventDefault();setPlaying(!playing);}});
let sx=null;const stage=document.querySelector(".stage");
stage.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
stage.addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)go(i+(dx<0?1:-1));sx=null;});
function bubble(sp){document.querySelectorAll(".bubble").forEach(b=>b.remove());
  const [h,d]=GLOSS[sp.dataset.g];const b=document.createElement("div");b.className="bubble";
  b.innerHTML=`<h3>💡 ${esc(h)}</h3><div>${esc(d)}</div><button>Got it!</button>`;document.body.appendChild(b);
  const r=sp.getBoundingClientRect();const bw=Math.min(300,innerWidth-20);
  b.style.left=Math.max(10,Math.min(innerWidth-bw-10,r.left+r.width/2-bw/2))+"px";
  const top=r.top-b.offsetHeight-12;b.style.top=(top>10?top:r.bottom+12)+"px";
  b.querySelector("button").onclick=()=>b.remove();}
text.addEventListener("click",e=>{const sp=e.target.closest(".learn");if(sp)bubble(sp);});
// quiz
$("qintro").innerHTML=ST.quiz.intro; $("credit").textContent="Story by "+ST.author;
ST.quiz.choices.forEach(([ic,label,fb])=>{const b=document.createElement("button");b.textContent=ic+" "+label;b.dataset.fb=fb;$("choices").appendChild(b);});
$("choices").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  [...$("choices").children].forEach(c=>c.classList.toggle("pick",c===b));$("fb").textContent=b.dataset.fb;});
$("again").onclick=()=>{$("quiz").classList.remove("show");go(0);};
render();
// preview hooks for screenshots: #quiz, #s<N>@<seconds>, #s<N>@<seconds>!<word> (opens learn bubble)
if(location.hash==="#quiz")$("quiz").classList.add("show");
const m=location.hash.match(/#s(\d+)(?:@([\d.]+))?(?:!([\w-]+))?/);
if(m){i=+m[1];render();if(m[2])mark(+m[2]);if(m[3]){const sp=spans.find(s=>s.dataset.g===m[3]);if(sp)setTimeout(()=>bubble(sp),300);}}
})();
