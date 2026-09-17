/* NOVALACE — Panel Administrativo (BORRADOR / MOCKUP, sin backend) */
(function(){
  "use strict";
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const PRODUCTS = window.NOVALACE_PRODUCTS || [];
  const CAT={cordones:"Cordones",cintas:"Cintas y tapes",tejidos:"Tejidos angostos"};
  const MAT={poliester:"Poliéster",algodon:"Algodón",mixto:"Mixto"};

  /* ---------- Datos de muestra ---------- */
  const MESSAGES=[
    {name:"María Fernández",company:"Calzado Delta S.A.",email:"compras@calzadodelta.com",subject:"Cotización cordones planos",prev:"Buenas tardes, necesitamos cordones planos de poliéster en color negro y blanco, aprox. 20,000 unidades…",time:"Hace 12 min",unread:true},
    {name:"Roberto Mejía",company:"Textiles del Valle",email:"rmejia@textilesvalle.hn",subject:"Tejido angosto personalizado",prev:"Quisiéramos desarrollar un tejido angosto con nuestro logo. ¿Podrían enviarnos muestras?",time:"Hace 1 h",unread:true},
    {name:"Ana Lucía Paz",company:"EmpaquePro",email:"apaz@empaquepro.com",subject:"Cinta técnica reforzada",prev:"Solicitamos precios de cinta técnica para correas de sujeción, especificación adjunta…",time:"Hace 3 h",unread:true},
    {name:"Carlos Andino",company:"Marroquinería Andino",email:"info@andino.hn",subject:"Cordón de algodón",prev:"Nos interesa el cordón de algodón trenzado para línea de bolsos. ¿Manejan color a pedido?",time:"Ayer",unread:false},
    {name:"Jennifer Cruz",company:"Uniformes HN",email:"jcruz@uniformeshn.com",subject:"Bies y ribete",prev:"Buen día, requerimos ribete flexible para acabados de confección. Volumen mensual estable…",time:"Ayer",unread:false},
    {name:"Diego Suazo",company:"Industrias del Norte",email:"dsuazo@innorte.com",subject:"Elástico tejido angosto",prev:"Cotización de elástico tejido para bandas, ancho 25mm, recuperación alta…",time:"Hace 2 días",unread:false}
  ];
  const PAGES=[
    {name:"Inicio",slug:"/",status:"Publicada",updated:"Hoy"},
    {name:"Nosotros",slug:"/nosotros",status:"Publicada",updated:"Hoy"},
    {name:"Productos",slug:"/productos",status:"Publicada",updated:"Hoy"},
    {name:"Calidad e Innovación",slug:"/calidad",status:"Publicada",updated:"Ayer"},
    {name:"Contacto",slug:"/contacto",status:"Publicada",updated:"Ayer"},
    {name:"Blog (próximamente)",slug:"/blog",status:"Borrador",updated:"—"}
  ];
  const VISITS=[42,55,48,63,72,58,80,95,88,102,120,110,134,151];

  /* ---------- Mini visual de producto ---------- */
  function thumb(p){
    const cs=p.colors.slice(0,3);
    const bands=cs.map((c,i)=>`<rect x="${-10+i*22}" y="-10" width="16" height="60" fill="${c}" transform="rotate(28 22 17)"/>`).join("");
    return `<svg viewBox="0 0 44 34" width="44" height="34" xmlns="http://www.w3.org/2000/svg"><rect width="44" height="34" fill="#eef1f7"/>${bands}</svg>`;
  }

  /* ---------- Login ---------- */
  function initLogin(){
    const form=$("#login-form");
    form.addEventListener("submit",e=>{e.preventDefault(); enterApp();});
  }
  function enterApp(){
    $("#login").style.display="none";
    $("#app").classList.add("active");
    renderAll();
  }
  function logout(){
    $("#app").classList.remove("active");
    $("#login").style.display="grid";
    window.scrollTo(0,0);
  }

  /* ---------- Navegación ---------- */
  const TITLES={
    dashboard:["Dashboard","Resumen general del sitio"],
    productos:["Productos","Gestione el catálogo de NOVALACE"],
    mensajes:["Mensajes","Solicitudes recibidas desde el sitio"],
    paginas:["Páginas","Contenido y secciones del sitio"],
    novabot:["NOVABOT","Asistente con IA para sus clientes"],
    seo:["SEO","Posicionamiento en buscadores"],
    idiomas:["Idiomas","Contenido multilenguaje (ES / EN)"],
    ajustes:["Ajustes del sitio","Identidad, contacto y redes"]
  };
  function go(view){
    $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    $$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));
    const t=TITLES[view]||["",""];
    $("#top-title").textContent=t[0]; $("#top-crumb").textContent=t[1];
    closeSidebar();
    $(".content").scrollTop=0;
  }

  /* ---------- Render dashboard ---------- */
  function renderChart(){
    const w=760,h=210,pad=24,max=Math.max(...VISITS)*1.15,n=VISITS.length;
    const bw=(w-pad*2)/n*0.55, gap=(w-pad*2)/n;
    let bars="",pts=[];
    VISITS.forEach((v,i)=>{
      const x=pad+gap*i+gap/2, bh=(v/max)*(h-pad*2), y=h-pad-bh;
      bars+=`<rect x="${x-bw/2}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="url(#barg)"/>`;
      pts.push([x,y]);
    });
    const line=pts.map((p,i)=>(i?"L":"M")+p[0]+" "+(p[1]-2)).join(" ");
    const area=line+` L ${pts[pts.length-1][0]} ${h-pad} L ${pts[0][0]} ${h-pad} Z`;
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="barg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4d99"/><stop offset="1" stop-color="#22316f"/></linearGradient>
        <linearGradient id="areag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(244,180,0,.35)"/><stop offset="1" stop-color="rgba(244,180,0,0)"/></linearGradient>
      </defs>
      <path d="${area}" fill="url(#areag)"/>
      ${bars}
      <path d="${line}" fill="none" stroke="#f4b400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]-2}" r="3.2" fill="#fff" stroke="#f4b400" stroke-width="2"/>`).join("")}
    </svg>`;
  }
  function renderDashboard(){
    $("#chart-wrap").innerHTML=renderChart();
    // recent messages
    $("#dash-messages").innerHTML=MESSAGES.slice(0,4).map(m=>`
      <div class="msg ${m.unread?'unread':''}">
        <div class="av">${initials(m.name)}</div>
        <div class="m-main">
          <div class="m-top"><b>${m.name}</b><time>${m.time}</time></div>
          <div class="m-sub">${m.subject}</div>
          <div class="m-prev">${m.prev}</div>
        </div>
        ${m.unread?'<span class="unread-dot"></span>':''}
      </div>`).join("");
    // top products
    $("#dash-top").innerHTML=PRODUCTS.slice(0,5).map((p,i)=>`
      <div class="msg">
        <div class="thumb">${thumb(p)}</div>
        <div class="m-main">
          <div class="m-top"><b>${p.name.es}</b><time>${(180-i*28)} vistas</time></div>
          <div class="m-sub">${CAT[p.cat]} · ${MAT[p.material]}</div>
        </div>
      </div>`).join("");
  }
  function initials(n){return n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();}

  /* ---------- Render productos ---------- */
  function renderProducts(){
    $("#prod-tbody").innerHTML=PRODUCTS.map(p=>`
      <tr>
        <td><div class="prod-cell"><div class="thumb">${thumb(p)}</div><div><b>${p.name.es}</b><div style="color:var(--muted);font-size:.8rem">${p.desc.es.slice(0,46)}…</div></div></div></td>
        <td><span class="badge navy">${CAT[p.cat]}</span></td>
        <td>${MAT[p.material]}</td>
        <td><div class="swatches">${p.colors.map(c=>`<i style="background:${c}"></i>`).join("")}</div></td>
        <td><span class="badge green">Publicado</span></td>
        <td><div class="row-actions">
          <button class="btn-icon" data-edit="${p.id}" title="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
          <button class="btn-icon" data-del="${p.id}" title="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg></button>
        </div></td>
      </tr>`).join("");
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>openProductModal(b.dataset.edit)));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>toast("Acción de demostración — no se elimina nada")));
    $("#prod-count").textContent=PRODUCTS.length;
  }

  /* ---------- Render mensajes ---------- */
  function renderMessages(){
    $("#msg-list").innerHTML=MESSAGES.map(m=>`
      <div class="msg ${m.unread?'unread':''}">
        <div class="av">${initials(m.name)}</div>
        <div class="m-main">
          <div class="m-top"><b>${m.name}</b><time>${m.time}</time></div>
          <div class="m-sub">${m.company} · ${m.email}</div>
          <div class="m-prev"><b style="color:var(--navy)">${m.subject}:</b> ${m.prev}</div>
        </div>
        ${m.unread?'<span class="badge red">Nuevo</span>':'<span class="badge gray">Leído</span>'}
      </div>`).join("");
    const unread=MESSAGES.filter(m=>m.unread).length;
    $$(".count-msg").forEach(e=>e.textContent=unread);
  }

  /* ---------- Render páginas ---------- */
  function renderPages(){
    $("#pages-tbody").innerHTML=PAGES.map(p=>`
      <tr>
        <td><b style="font-family:var(--font-display);color:var(--navy-ink)">${p.name}</b></td>
        <td style="color:var(--muted)">${p.slug}</td>
        <td>${p.status==="Publicada"?'<span class="badge green">Publicada</span>':'<span class="badge gold">Borrador</span>'}</td>
        <td style="color:var(--muted)">${p.updated}</td>
        <td><div class="row-actions"><button class="btn btn-outline btn-sm" onclick="return false">Editar</button></div></td>
      </tr>`).join("");
  }

  /* ---------- Modal producto ---------- */
  function openProductModal(id){
    const p=PRODUCTS.find(x=>x.id==id);
    const isNew=!p;
    $("#modal-title").textContent=isNew?"Nuevo producto":"Editar producto";
    $("#pm-name").value=isNew?"":p.name.es;
    $("#pm-name-en").value=isNew?"":p.name.en;
    $("#pm-cat").value=isNew?"cordones":p.cat;
    $("#pm-mat").value=isNew?"poliester":p.material;
    $("#pm-desc").value=isNew?"":p.desc.es;
    $("#modal-bg").classList.add("open");
  }
  function initModal(){
    $("#btn-new-product").addEventListener("click",()=>openProductModal(null));
    $("#modal-x").addEventListener("click",closeModal);
    $("#modal-cancel").addEventListener("click",closeModal);
    $("#modal-save").addEventListener("click",()=>{closeModal();toast("Guardado (demostración)");});
    $("#modal-bg").addEventListener("click",e=>{if(e.target.id==="modal-bg")closeModal();});
  }
  function closeModal(){$("#modal-bg").classList.remove("open");}

  /* ---------- Sidebar móvil ---------- */
  function toggleSidebar(){$(".sidebar").classList.toggle("open");$(".sidebar-backdrop").classList.toggle("show");}
  function closeSidebar(){$(".sidebar").classList.remove("open");$(".sidebar-backdrop").classList.remove("show");}

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg){
    let el=$("#toast"); if(!el){el=document.createElement("div");el.id="toast";el.className="toast";
      el.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>';document.body.appendChild(el);}
    $("span",el).textContent=msg; el.classList.add("show"); clearTimeout(tt); tt=setTimeout(()=>el.classList.remove("show"),2800);
  }

  function renderAll(){renderDashboard();renderProducts();renderMessages();renderPages();}

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded",()=>{
    initLogin(); initModal();
    $$(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
    $("#logout").addEventListener("click",logout);
    $("#menu-btn").addEventListener("click",toggleSidebar);
    $(".sidebar-backdrop").addEventListener("click",closeSidebar);
    // guardar en ajustes
    $$("[data-save]").forEach(b=>b.addEventListener("click",()=>toast("Cambios guardados (demostración)")));
    window.__toast=toast;
  });
})();
