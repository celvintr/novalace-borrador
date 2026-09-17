/* NOVALACE — Frontend (borrador) */
(function(){
  "use strict";
  const I18N = window.NOVALACE_I18N;
  const PRODUCTS = window.NOVALACE_PRODUCTS;
  const MARQUEE = window.NOVALACE_MARQUEE;
  const LS_KEY = "novalace_lang";
  let lang = localStorage.getItem(LS_KEY) || "es";

  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));
  const t = (k)=> (I18N[lang] && I18N[lang][k]) || (I18N.es[k]) || k;

  /* ---------------- i18n ---------------- */
  function applyI18n(){
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el=>{ el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach(el=>{ el.setAttribute("placeholder", t(el.dataset.i18nPh)); });
    $$(".lang button").forEach(b=> b.classList.toggle("active", b.dataset.lang===lang));
  }
  function setLang(l){ lang=l; localStorage.setItem(LS_KEY,l); applyI18n(); buildMarquee(); renderProducts(); refreshChatSuggestions(); }

  /* ---------------- Marquee ---------------- */
  function buildMarquee(){
    const track = $("#marquee-track"); if(!track) return;
    const items = MARQUEE[lang]||MARQUEE.es;
    const html = items.map(x=>`<span>${x}</span>`).join("");
    track.innerHTML = html+html; // duplicate for seamless loop
  }

  /* ---------------- Product visuals (SVG) ---------------- */
  function cordSVG(colors, shape){
    // diagonal braided cords echoing the logo
    const rx = shape==="flat" ? 7 : (shape==="oval"? 13 : 16);
    const th = shape==="flat" ? 26 : (shape==="oval"? 30 : 24);
    let bands="";
    const n = Math.min(colors.length,4);
    for(let i=0;i<n;i++){
      const off = -30 + i*(150/n);
      const c = colors[i];
      bands += `<g transform="translate(${off},0)">
        <rect x="-40" y="-10" width="120" height="${th}" rx="${rx}" fill="${c}" transform="rotate(32 20 90)" />
        <rect x="-40" y="-10" width="120" height="${th}" rx="${rx}" fill="url(#gloss)" transform="rotate(32 20 90)" opacity=".35"/>
      </g>`;
    }
    return `<svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">
      <defs>
        <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <pattern id="braid" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <path d="M0 6 Q3 0 6 6 T12 6" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
        </pattern>
      </defs>
      <g transform="translate(90,-30) scale(1.15)">${bands}
        <rect x="-140" y="-40" width="360" height="90" fill="url(#braid)" transform="rotate(32 20 90)" opacity=".5"/>
      </g>
    </svg>`;
  }
  function tapeSVG(colors){
    const n=Math.min(colors.length,4);
    let stripes="";
    const h=44, gap=14, startY=(180-(n*h+(n-1)*gap))/2;
    for(let i=0;i<n;i++){
      const y=startY+i*(h+gap);
      stripes+=`<rect x="20" y="${y}" width="280" height="${h}" rx="7" fill="${colors[i]}"/>
        <rect x="20" y="${y}" width="280" height="${h/2}" rx="7" fill="url(#tg)" opacity=".3"/>
        <rect x="20" y="${y}" width="280" height="${h}" fill="url(#weftp)" opacity=".4"/>`;
    }
    return `<svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <pattern id="weftp" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="8" fill="rgba(0,0,0,.10)"/></pattern>
      </defs>${stripes}
    </svg>`;
  }
  function weaveSVG(colors){
    const c1=colors[0]||"#111a3d", c2=colors[1]||"#5c6472", c3=colors[2]||"#dc121d";
    return `<svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">
      <defs>
        <pattern id="wv" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="${c1}"/>
          <rect x="0" y="0" width="12" height="12" fill="${c2}"/>
          <rect x="12" y="12" width="12" height="12" fill="${c2}"/>
          <rect x="4" y="0" width="4" height="24" fill="${c3}" opacity=".6"/>
          <rect x="0" y="4" width="24" height="4" fill="#fff" opacity=".12"/>
        </pattern>
      </defs>
      <rect width="320" height="180" fill="url(#wv)"/>
      <rect width="320" height="180" fill="url(#gloss2)"/>
      <linearGradient id="gloss2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
    </svg>`;
  }
  function productVisual(p){
    if(p.style==="tape") return tapeSVG(p.colors);
    if(p.style==="weave") return weaveSVG(p.colors);
    return cordSVG(p.colors, p.style);
  }

  /* ---------------- Products render + filters ---------------- */
  let fType="all", fMat="all", fSearch="";
  function renderProducts(){
    const grid=$("#product-grid"); if(!grid) return;
    const catLabel={cordones:t("ft_cordones"),cintas:t("ft_cintas"),tejidos:t("ft_tejidos")};
    const list=PRODUCTS.filter(p=>{
      if(fType!=="all"&&p.cat!==fType) return false;
      if(fMat!=="all"&&p.material!==fMat) return false;
      if(fSearch){
        const hay=(p.name[lang]+" "+p.desc[lang]+" "+(p.apps[lang]||[]).join(" ")).toLowerCase();
        if(!hay.includes(fSearch.toLowerCase())) return false;
      }
      return true;
    });
    if(!list.length){ grid.innerHTML=`<div class="empty">${t("prod_empty")}</div>`; return; }
    grid.innerHTML=list.map(p=>`
      <article class="pcard reveal">
        <div class="pcard-visual">
          <span class="pcard-tag">${catLabel[p.cat]}</span>
          ${productVisual(p)}
        </div>
        <div class="pcard-body">
          <h3>${p.name[lang]}</h3>
          <p>${p.desc[lang]}</p>
          <div class="pcard-meta">
            <span class="pmeta">${t("fm_"+p.material)}</span>
            ${(p.apps[lang]||[]).map(a=>`<span class="pmeta">${a}</span>`).join("")}
          </div>
          <div class="pcard-foot">
            <div class="swatches">${p.colors.slice(0,5).map(c=>`<span class="swatch" style="background:${c}"></span>`).join("")}</div>
            <a href="#contacto" data-quote="${p.name[lang]}">${t("prod_detail")}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
      </article>`).join("");
    checkReveal();
    // prefill contact interest when clicking detail
    $$("[data-quote]",grid).forEach(a=>a.addEventListener("click",()=>{
      const sel=$("#f_interest"); if(sel){ const v=a.dataset.quote;
        if(![...sel.options].some(o=>o.value===v)){ const o=document.createElement("option"); o.value=v;o.textContent=v; sel.appendChild(o);} sel.value=v; }
    }));
  }
  function initFilters(){
    $$("[data-ftype]").forEach(b=>b.addEventListener("click",()=>{
      fType=b.dataset.ftype; $$("[data-ftype]").forEach(x=>x.classList.toggle("active",x===b)); renderProducts();
    }));
    $$("[data-fmat]").forEach(b=>b.addEventListener("click",()=>{
      fMat=b.dataset.fmat; $$("[data-fmat]").forEach(x=>x.classList.toggle("active",x===b)); renderProducts();
    }));
    const s=$("#product-search"); if(s) s.addEventListener("input",e=>{fSearch=e.target.value.trim(); renderProducts();});
  }

  /* ---------------- Header + mobile menu ---------------- */
  function initHeader(){
    const header=$(".site-header");
    const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>10);
    onScroll(); window.addEventListener("scroll",onScroll,{passive:true});
    const toggle=$(".menu-toggle"), links=$(".nav-links");
    if(toggle){ toggle.addEventListener("click",()=>links.classList.toggle("open")); }
    $$(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
  }

  /* ---------------- Reveal + counters (scroll-based, robusto) ---------------- */
  function runCounter(el){
    if(el.dataset.done) return; el.dataset.done="1";
    const target=parseFloat(el.dataset.count), suf=el.dataset.suf||"", dur=1400, t0=performance.now();
    const loc=lang==="es"?"es-HN":"en-US";
    const step=(now)=>{ const p=Math.min((now-t0)/dur,1); const val=Math.floor(target*(1-Math.pow(1-p,3)));
      el.textContent=val.toLocaleString(loc); if(p<1) requestAnimationFrame(step);
      else el.innerHTML=target.toLocaleString(loc)+`<span class="suf">${suf}</span>`; };
    requestAnimationFrame(step);
  }
  function checkReveal(){
    const vh=window.innerHeight||document.documentElement.clientHeight;
    $$(".reveal:not(.in)").forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.top < vh*0.92 && r.bottom > -40) el.classList.add("in");
    });
    $$("[data-count]").forEach(el=>{
      if(el.dataset.done) return;
      const r=el.getBoundingClientRect();
      if(r.top < vh*0.9 && r.bottom > 0) runCounter(el);
    });
  }
  function initReveal(){
    checkReveal();
    window.addEventListener("scroll",checkReveal,{passive:true});
    window.addEventListener("resize",checkReveal);
    window.addEventListener("load",()=>setTimeout(checkReveal,60));
  }

  /* ---------------- NOVABOT chat ---------------- */
  function botReply(msg){
    const m=msg.toLowerCase();
    const has=(...ws)=>ws.some(w=>m.includes(w));
    if(has("product","fabric","fabrican","hacen","cordon","cordón","cinta","tejido","tape","catálogo","catalogo")) return t("bot_products");
    if(has("envi","envío","ship","export","internacion","deliver")) return t("bot_shipping");
    if(has("mínimo","minimo","minimum","moq","pedido")) return t("bot_moq");
    if(has("cotiz","precio","price","quote","cost","presupuesto")) return t("bot_quote");
    return t("bot_default");
  }
  function addBubble(text,who){
    const body=$("#cp-body"); if(!body) return;
    const b=document.createElement("div"); b.className="bubble "+who; b.textContent=text; body.appendChild(b);
    body.scrollTop=body.scrollHeight;
  }
  function botTyping(cb){
    const body=$("#cp-body");
    const b=document.createElement("div"); b.className="bubble bot"; b.textContent="…"; body.appendChild(b); body.scrollTop=body.scrollHeight;
    setTimeout(()=>{ b.remove(); cb(); },650);
  }
  function sendUser(msg){
    if(!msg) return; addBubble(msg,"user");
    const sug=$("#cp-sugg"); if(sug) sug.style.display="none";
    botTyping(()=>addBubble(botReply(msg),"bot"));
  }
  function refreshChatSuggestions(){
    const sug=$("#cp-sugg"); if(!sug) return;
    sug.innerHTML=["cp_sugg1","cp_sugg2","cp_sugg3","cp_sugg4"].map(k=>`<button data-k="${k}">${t(k)}</button>`).join("");
    $$("button",sug).forEach(b=>b.addEventListener("click",()=>sendUser(b.textContent)));
    // el saludo sigue el idioma actual hasta que el usuario empiece a chatear
    const body=$("#cp-body");
    if(body && !body.querySelector(".bubble.user")){ body.innerHTML=""; addBubble(t("cp_greeting"),"bot"); }
  }
  function initChat(){
    const panel=$("#chat-panel"), openBtn=$("#fab-bot"), closeBtn=$("#cp-close");
    const open=()=>{ panel.classList.add("open"); refreshChatSuggestions(); const sug=$("#cp-sugg"); if(sug&&!$("#cp-body").querySelector(".bubble.user")) sug.style.display="flex"; };
    if(openBtn) openBtn.addEventListener("click",()=>panel.classList.contains("open")?panel.classList.remove("open"):open());
    if(closeBtn) closeBtn.addEventListener("click",()=>panel.classList.remove("open"));
    $$("[data-open-bot]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();open();}));
    const input=$("#cp-input"), send=$("#cp-send");
    const doSend=()=>{ const v=input.value.trim(); if(!v) return; input.value=""; sendUser(v); };
    if(send) send.addEventListener("click",doSend);
    if(input) input.addEventListener("keydown",e=>{ if(e.key==="Enter") doSend(); });
  }

  /* ---------------- Contact form ---------------- */
  function initForm(){
    const form=$("#contact-form"); if(!form) return;
    form.addEventListener("submit",e=>{ e.preventDefault(); showToast(t("toast_sent")); form.reset(); });
  }
  let toastTimer;
  function showToast(msg){
    let el=$("#toast"); if(!el){ el=document.createElement("div"); el.id="toast"; el.className="toast";
      el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
      document.body.appendChild(el); }
    el.querySelector("span").textContent=msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),3200);
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded",()=>{
    $("#year") && ($("#year").textContent=new Date().getFullYear());
    $$(".lang button").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
    applyI18n(); buildMarquee(); initFilters(); renderProducts();
    initHeader(); initChat(); initForm(); initReveal();
  });
})();
