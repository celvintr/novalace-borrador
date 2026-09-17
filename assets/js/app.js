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
  function setLang(l){ lang=l; localStorage.setItem(LS_KEY,l); applyI18n(); buildMarquee(); renderCatalog(); refreshChatSuggestions(); }

  /* ---------------- Marquee ---------------- */
  function buildMarquee(){
    const track = $("#marquee-track"); if(!track) return;
    const items = MARQUEE[lang]||MARQUEE.es;
    const html = items.map(x=>`<span>${x}</span>`).join("");
    track.innerHTML = html+html; // duplicate for seamless loop
  }

  /* ---------------- Product visuals (SVG) ---------------- */
  function pvDefs(uid,th){
    return `<defs>
      <radialGradient id="stg${uid}" cx="50%" cy="26%" r="95%">
        <stop offset="0" stop-color="#fbfcff"/><stop offset=".55" stop-color="#eef1f8"/><stop offset="1" stop-color="#dfe4f0"/>
      </radialGradient>
      <linearGradient id="rnd${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".64" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
      </linearGradient>
      <linearGradient id="stn${uid}" x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".46" stop-color="#fff" stop-opacity=".5"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <pattern id="brd${uid}" width="13" height="${th}" patternUnits="userSpaceOnUse">
        <path d="M0 0 L7 ${(th/2).toFixed(1)} L0 ${th}" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="1.6"/>
        <path d="M7 0 L14 ${(th/2).toFixed(1)} L7 ${th}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1.3"/>
      </pattern>
      <pattern id="wft${uid}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="3.2" height="7" fill="rgba(0,0,0,.10)"/></pattern>
      <filter id="sh${uid}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0b1330" flood-opacity=".26"/></filter>
    </defs>`;
  }
  function svgWrap(uid,inner,th){
    return `<svg viewBox="0 0 320 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">${pvDefs(uid,th)}<rect width="320" height="190" fill="url(#stg${uid})"/>${inner}</svg>`;
  }
  function cordViz(uid,colors,shape){
    const th=shape==="flat"?18:(shape==="oval"?26:30);
    const n=Math.min(colors.length,3),gap=11,total=n*th+(n-1)*gap,y0=95-total/2;
    let cords="";
    for(let i=0;i<n;i++){
      const y=y0+i*(th+gap),c=colors[i],rx=shape==="flat"?5:th/2;
      cords+=`<g>
        <rect x="-40" y="${y}" width="410" height="${th}" rx="${rx}" fill="${c}"/>
        <rect x="-40" y="${y}" width="410" height="${th}" rx="${rx}" fill="url(#brd${uid})"/>
        <rect x="-40" y="${y}" width="410" height="${th}" rx="${rx}" fill="url(#rnd${uid})"/>
        <rect x="-40" y="${(y+th*0.22).toFixed(1)}" width="410" height="2.4" rx="2" fill="#fff" opacity=".45"/>
      </g>`;
    }
    return svgWrap(uid,`<ellipse cx="160" cy="164" rx="118" ry="13" fill="#0b1330" opacity=".08"/><g filter="url(#sh${uid})" transform="rotate(-30 160 95)">${cords}</g>`,th);
  }
  function tapeViz(uid,colors){
    const n=Math.min(colors.length,3),h=32,gap=17,total=n*h+(n-1)*gap,y0=95-total/2;
    let bands="";
    for(let i=0;i<n;i++){
      const y=y0+i*(h+gap),c=colors[i];
      bands+=`<g filter="url(#sh${uid})">
        <rect x="24" y="${y}" width="272" height="${h}" rx="5" fill="${c}"/>
        <rect x="24" y="${y}" width="272" height="${h}" rx="5" fill="url(#wft${uid})"/>
        <rect x="24" y="${y}" width="272" height="${h}" rx="5" fill="url(#rnd${uid})" opacity=".7"/>
        <rect x="24" y="${y}" width="272" height="${h}" rx="5" fill="url(#stn${uid})"/>
        <path d="M24 ${y} l13 ${h/2} l-13 ${h/2} Z" fill="#000" opacity=".16"/>
      </g>`;
    }
    return svgWrap(uid,bands,h);
  }
  function weaveViz(uid,colors){
    const c1=colors[0]||"#111a3d",c2=colors[1]||"#5c6472",c3=colors[2]||"#dc121d";
    const inner=`<defs><pattern id="wv${uid}" width="26" height="26" patternUnits="userSpaceOnUse">
        <rect width="26" height="26" fill="${c1}"/>
        <rect x="0" y="0" width="13" height="13" fill="${c2}"/><rect x="13" y="13" width="13" height="13" fill="${c2}"/>
        <rect x="5" y="0" width="3" height="26" fill="${c3}" opacity=".75"/>
        <rect x="0" y="5" width="26" height="3" fill="#fff" opacity=".14"/><rect x="0" y="18" width="26" height="2" fill="#000" opacity=".14"/>
      </pattern></defs>
      <g filter="url(#sh${uid})"><rect x="28" y="30" width="264" height="130" rx="10" fill="url(#wv${uid})"/>
        <rect x="28" y="30" width="264" height="130" rx="10" fill="url(#rnd${uid})" opacity=".6"/>
        <rect x="28" y="30" width="264" height="130" rx="10" fill="url(#stn${uid})"/></g>`;
    return svgWrap(uid,inner,20);
  }
  function productVisual(p){
    if(p.img) return `<img src="${p.img}" alt="${p.name[lang]}" loading="lazy">`;
    if(p.style==="tape") return tapeViz(p.id,p.colors);
    if(p.style==="weave") return weaveViz(p.id,p.colors);
    return cordViz(p.id,p.colors,p.style);
  }

  /* ---------------- Catálogo (showcase por categoría) ---------------- */
  const CAT_ORDER=["cordones","cintas","tejidos"];
  function renderCatalog(){
    const wrap=$("#catalog"); if(!wrap) return;
    const titles={cordones:t("ft_cordones"),cintas:t("ft_cintas"),tejidos:t("ft_tejidos")};
    const descs={cordones:t("catdesc_cordones"),cintas:t("catdesc_cintas"),tejidos:t("catdesc_tejidos")};
    wrap.innerHTML=CAT_ORDER.map((cat,idx)=>{
      const items=PRODUCTS.filter(p=>p.cat===cat);
      if(!items.length) return "";
      const cls = idx===1?"cat-row alt":"cat-row";
      return `<div class="${cls} reveal">
        <div class="cat-label">
          <span class="cat-line"></span>
          <h3>${titles[cat]}</h3>
          <p>${descs[cat]}</p>
        </div>
        <div class="cat-tiles">
          ${items.map(p=>`
            <a class="tile" href="#contacto" data-quote="${p.name[lang]}" aria-label="${p.name[lang]}">
              <div class="tile-visual">${productVisual(p)}</div>
              <div class="tile-cap">
                <b>${p.name[lang]}</b>
                <span>${t("fm_"+p.material)} · ${(p.apps[lang]||[]).join(" · ")}</span>
              </div>
            </a>`).join("")}
        </div>
      </div>`;
    }).join("");
    checkReveal();
    $$("[data-quote]",wrap).forEach(a=>a.addEventListener("click",()=>{
      const sel=$("#f_interest"); if(sel){ const v=a.dataset.quote;
        if(![...sel.options].some(o=>o.value===v)){ const o=document.createElement("option"); o.value=v;o.textContent=v; sel.appendChild(o);} sel.value=v; }
    }));
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
    applyI18n(); buildMarquee(); renderCatalog();
    initHeader(); initChat(); initForm(); initReveal();
  });
})();
