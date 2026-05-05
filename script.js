/* ═══════════════════════════════
   SOUNDSTAGE — script.js
   By Khemra
═══════════════════════════════ */

/* ═══ ENTER PLATFORM ═══ */
function enterPlatform(){
  var splash = document.getElementById('splash');
  var app = document.getElementById('app');
  if(splash){
    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.8s ease';
    setTimeout(function(){ splash.style.display = 'none'; }, 800);
  }
  if(app){
    app.style.opacity = '1';
    app.style.pointerEvents = 'all';
  }
  showPage('login');
}
window.enterPlatform = enterPlatform;

/* ═══ SPLASH ═══ */
document.addEventListener('DOMContentLoaded', function(){

var loadMsgs = ['Initializing SoundStage','Loading your channels','Syncing Amp wallet','Connecting the culture','Stage is ready'];
var msgIdx = 0;
var loadInterval = setInterval(function(){
  msgIdx++;
  if(msgIdx < loadMsgs.length){
    var el = document.getElementById('loadTxt');
    if(el) el.textContent = loadMsgs[msgIdx];
  } else { clearInterval(loadInterval); }
}, 1000);

/* Particles */
var cols = ['#F5A623','#00E5FF','#C07800','#FFD080','#ffffff'];
var ptc = document.getElementById('particles');
if(ptc){
  for(var i = 0; i < 24; i++){
    var pt = document.createElement('div');
    pt.className = 'pt';
    var sz = Math.random() * 2.5 + 0.8;
    pt.style.cssText = [
      'width:'+sz+'px','height:'+sz+'px',
      'background:'+cols[Math.floor(Math.random()*cols.length)],
      'opacity:'+(Math.random()*0.35+0.08),
      'left:'+(Math.random()*100)+'%',
      'animation-duration:'+(Math.random()*9+7)+'s',
      'animation-delay:-'+(Math.random()*8)+'s'
    ].join(';');
    ptc.appendChild(pt);
  }
}

/* ═══ STATE ═══ */
var amps = 18;
var overlayOn = false;
var spotSecs = 161;
var scanCount = 0;
var labelTimeout = null;
var spVotes = {fire:62, love:28, amp:10};
var curChannel = 'hiphop';
var curIdx = 0;
var currentUser = null;
var auraAdds = 0;
var moyoItems = [];

var auras = [
  {id:1,name:'Midnight Waves',emoji:'🌙',tracks:12,votes:87,shares:23,published:true,cover:'#1a0a2e'},
  {id:2,name:'Street Gospel',emoji:'🔥',tracks:8,votes:142,shares:41,published:true,cover:'#2e0a0a'},
  {id:3,name:'Chrome Dreams',emoji:'⚡',tracks:15,votes:111,shares:19,published:true,cover:'#0a1a2e'},
  {id:4,name:'Late Night Frequency',emoji:'📻',tracks:6,votes:0,shares:0,published:false,cover:'#0a2e1a'}
];

/* ═══ CHANNELS ═══ */
var channels = {
  hiphop:{
    color:'#F5A623',
    drop:'<strong>NIKE DROP:</strong> Air Max feat. in this video — PRO members 20% off',
    queue:[
      {e:'🎵',t:'Sundress',a:'ASAP Rocky',v:1240,vid:'c6C2T87JQKQ',active:true},
      {e:'🔥',t:'Mask Off',a:'Future',v:987,vid:'QGaezHPsEeE',active:false},
      {e:'⚡',t:'God Did',a:'DJ Khaled ft Jay-Z',v:834,vid:'reygR-YQQPU',active:false},
      {e:'💜',t:'Rich Flex',a:'Drake & 21 Savage',v:721,vid:'mhkgJrPZQQE',active:false},
      {e:'🎤',t:'All The Stars',a:'Kendrick Lamar',v:654,vid:'JQbjS0p6RTs',active:false}
    ]
  },
  rock:{
    color:'#FF3B3B',
    drop:'<strong>GIBSON DROP:</strong> Custom Les Paul collab — exclusive SoundStage members',
    queue:[
      {e:'🤘',t:'Chop Suey!',a:'System of a Down',v:892,vid:'CSvFpBOe8eY',active:true},
      {e:'🎸',t:'Numb',a:'Linkin Park',v:743,vid:'kXYiU_JCYtU',active:false},
      {e:'🔥',t:'In the End',a:'Linkin Park',v:612,vid:'eVTXPUF4Oz4',active:false},
      {e:'⚡',t:'Enter Sandman',a:'Metallica',v:589,vid:'CD-E-LDc384',active:false},
      {e:'💀',t:'B.Y.O.B.',a:'System of a Down',v:401,vid:'MsUBiH5bRSo',active:false}
    ]
  },
  latin:{
    color:'#00E5FF',
    drop:'<strong>ADIDAS DROP:</strong> Bad Bunny collab shoe — dropping live on SoundStage',
    queue:[
      {e:'🌴',t:'Tití Me Preguntó',a:'Bad Bunny',v:1580,vid:'Gx_Y4ME4jW8',active:true},
      {e:'🔥',t:'Hawái',a:'Maluma',v:1102,vid:'r64j8G1E7PY',active:false},
      {e:'💃',t:'Ojitos Lindos',a:'Bad Bunny',v:934,vid:'tUDMGTAkBLM',active:false},
      {e:'⚡',t:'La Canción',a:'J Balvin & Bad Bunny',v:812,vid:'cHKNBHEOqzU',active:false},
      {e:'🎵',t:'Problemática',a:'Rauw Alejandro',v:704,vid:'OPiC-oZcT2M',active:false}
    ]
  },
  rnb:{
    color:'#CC44FF',
    drop:'<strong>FENTY DROP:</strong> New collection featured in this video — shop now',
    queue:[
      {e:'💜',t:'Essence',a:'Wizkid ft Tems',v:1100,vid:'_nSmkyDQJ2E',active:true},
      {e:'🌙',t:'Leave The Door Open',a:'Bruno Mars & Anderson Paak',v:934,vid:'adLGHcg_dB8',active:false},
      {e:'🔥',t:'Pick Up Your Feelings',a:'Jazmine Sullivan',v:788,vid:'kGMbPGZTaHc',active:false},
      {e:'⚡',t:'Good Days',a:'SZA',v:654,vid:'rBKadCZIkk8',active:false},
      {e:'🎤',t:'Peaches',a:'Justin Bieber',v:543,vid:'pKRmACcC1sc',active:false}
    ]
  },
  metal:{
    color:'#FF6B00',
    drop:'<strong>ESP GUITARS DROP:</strong> Limited edition collab — SoundStage exclusive',
    queue:[
      {e:'🔥',t:'Master of Puppets',a:'Metallica',v:1020,vid:'xopiah6YHEY',active:true},
      {e:'💀',t:'Raining Blood',a:'Slayer',v:876,vid:'L8YQEFwkN_A',active:false},
      {e:'⚡',t:'Holy Wars',a:'Megadeth',v:754,vid:'HBScCHKoRRU',active:false},
      {e:'🤘',t:'Walk',a:'Pantera',v:632,vid:'PoZTERz4kGo',active:false},
      {e:'🎸',t:'Painkiller',a:'Judas Priest',v:521,vid:'0JEQDvTBHQs',active:false}
    ]
  },
  emo:{
    color:'#00FF88',
    drop:'<strong>HOT TOPIC DROP:</strong> Exclusive merch collab — limited run',
    queue:[
      {e:'🖤',t:'Welcome to the Black Parade',a:'My Chemical Romance',v:1340,vid:'RRKJiM9Njwk',active:true},
      {e:'💚',t:"Sugar We're Goin Down",a:'Fall Out Boy',v:987,vid:'h3l6bwCRMOA',active:false},
      {e:'🎵',t:'Helena',a:'My Chemical Romance',v:823,vid:'UCCyoaB_8ks',active:false},
      {e:'⚡',t:'I Write Sins',a:'Panic! At The Disco',v:711,vid:'Pim6KqEMaKg',active:false},
      {e:'🔥',t:'Misery Business',a:'Paramore',v:634,vid:'aCyGvGEtOwc',active:false}
    ]
  },
  spotlight:{
    color:'#F5A623',
    drop:'<strong>INDIE SPOTLIGHT:</strong> Submit your 3-min slot — $49 artists / $79 designers',
    queue:[
      {e:'🦋',t:'Satori Blu — LIVE NOW',a:'Indie R&B / Soul',v:847,vid:'JmKz4LwfhkI',active:true},
      {e:'👗',t:'NXUS Studio Drop',a:'Fashion Showcase',v:198,vid:'JmKz4LwfhkI',active:false}
    ]
  }
};

/* ═══ FASHION ITEMS ═══ */
var fashionItems = {
  jacket:{name:'Vintage Coach Jacket',tag:'Outerwear — Spotted on ASAP Rocky',prices:[{s:'SSENSE',p:'$340',best:false},{s:'Grailed',p:'$280',best:false},{s:'StockX',p:'$260',best:true}],bp:'$260',bs:'StockX'},
  shoes:{name:'Nike Air Force 1 Lo',tag:'Footwear — Spotted in video',prices:[{s:'Nike.com',p:'$110',best:false},{s:'GOAT',p:'$95',best:false},{s:'StockX',p:'$88',best:true}],bp:'$88',bs:'StockX'},
  pants:{name:"Levi's 501 Baggy Denim",tag:'Bottoms — Spotted in video',prices:[{s:"Levi's",p:'$128',best:false},{s:'Nordstrom',p:'$110',best:false},{s:'Depop',p:'$65',best:true}],bp:'$65',bs:'Depop'},
  chain:{name:'Cuban Link Chain Gold',tag:'Accessories — Spotted on ASAP Rocky',prices:[{s:'Farfetch',p:'$480',best:false},{s:'Grailed',p:'$320',best:false},{s:'eBay',p:'$195',best:true}],bp:'$195',bs:'eBay'}
};

/* ═══ PAGE NAVIGATION ═══ */
window.showPage = function(pageId){
  var pages = ['login','stage','aura','artist','profile'];
  pages.forEach(function(p){
    var el = document.getElementById('page-'+p);
    if(el) el.style.display = p === pageId ? 'flex' : 'none';
  });
  var navPages = ['stage','aura','artist'];
  navPages.forEach(function(p){
    var btn = document.getElementById('nav-'+p);
    if(btn) btn.classList.toggle('active', p === pageId);
  });
  if(pageId === 'stage') renderQueue();
  if(pageId === 'aura') renderAuras();
  if(pageId === 'profile') renderProfile();
};

/* ═══ AUTH ═══ */
window.switchLoginTab = function(tab){
  document.getElementById('login-in').style.display = tab==='in'?'block':'none';
  document.getElementById('login-up').style.display = tab==='up'?'block':'none';
  document.getElementById('ltab-in').classList.toggle('active', tab==='in');
  document.getElementById('ltab-up').classList.toggle('active', tab==='up');
};

window.handleLogin = function(){
  var email = document.getElementById('loginEmail').value;
  var pass = document.getElementById('loginPass').value;
  if(!email||!pass){ showToast('Please enter email and password'); return; }
  currentUser = {name:email.split('@')[0], email:email, role:'fan'};
  updateUserUI();
  showPage('stage');
  showToast('Welcome back to SoundStage!');
};

window.handleSignup = function(){
  var name = document.getElementById('signupName').value;
  var email = document.getElementById('signupEmail').value;
  var pass = document.getElementById('signupPass').value;
  var role = document.getElementById('signupRole').value;
  if(!name||!email||!pass){ showToast('Please fill in all fields'); return; }
  currentUser = {name:name, email:email, role:role};
  updateUserUI();
  showPage('stage');
  showToast('Welcome to SoundStage '+name+'!');
};

window.handleGoogleAuth = function(){
  currentUser = {name:'Khemra', email:'khemra@soundstage.tech', role:'fan'};
  updateUserUI();
  showPage('stage');
  showToast('Welcome to SoundStage!');
};

window.handleLogout = function(){
  currentUser = null;
  var ua=document.getElementById('userAv');
  var un=document.getElementById('userName');
  if(ua) ua.textContent='?';
  if(un) un.textContent='Sign In';
  showPage('login');
  showToast('Signed out — see you soon!');
};

function updateUserUI(){
  if(!currentUser) return;
  var av=document.getElementById('userAv');
  var nm=document.getElementById('userName');
  if(av) av.textContent=currentUser.name.charAt(0).toUpperCase();
  if(nm) nm.textContent=currentUser.name;
}

/* ═══ QUEUE ═══ */
function getQueue(){ return channels[curChannel].queue; }

function renderQueue(){
  var q = getQueue();
  var html = '';
  q.forEach(function(s,i){
    html += '<div class="q-item'+(s.active?' active':'')+'" onclick="jumpTo('+i+')">'
      +'<div class="q-rank">'+(i+1)+'</div>'
      +'<div class="q-emoji">'+s.e+'</div>'
      +'<div class="q-info"><div class="q-title">'+s.t+'</div><div class="q-artist">'+s.a+'</div></div>'
      +'<div style="display:flex;gap:3px;flex-shrink:0;">'
      +'<button class="amp-btn" onclick="event.stopPropagation();ampVote('+i+',this)">⚡ '+s.v+'</button>'
      +'<button class="aura-add" id="aura-'+i+'" onclick="event.stopPropagation();addToAura('+i+',this)">+ Aura</button>'
      +'</div></div>';
  });
  var ql = document.getElementById('queueList');
  if(ql) ql.innerHTML = html;
}

window.jumpTo = function(idx){
  var q = getQueue();
  q.forEach(function(s){ s.active=false; });
  q[idx].active = true;
  curIdx = idx;
  var s = q[idx];
  var nt=document.getElementById('nowTitle');
  var nth=document.getElementById('nowThumb');
  if(nt) nt.textContent=s.t+' — '+s.a;
  if(nth) nth.textContent=s.e;
  loadVideo(s.vid);
  renderQueue();
};

window.ampVote = function(idx,btn){
  if(amps<=0){ showToast('NO AMPS LEFT — RECHARGES TOMORROW'); return; }
  amps--;
  getQueue()[idx].v++;
  updateAmps();
  renderQueue();
  showToast('⚡ "'+getQueue()[idx].t+'" PUSHED UP!');
};

window.addToAura = function(idx,btn){
  btn.classList.add('added');
  btn.textContent='✓ Added';
  auraAdds++;
  var as=document.getElementById('auraStat');
  if(as) as.textContent=auraAdds;
  var q=getQueue();
  if(moyoItems.length<3){
    moyoItems.push({name:q[idx].t,emoji:q[idx].e,price:'—'});
    renderMiniMoyo();
  }
  showToast('✨ '+getQueue()[idx].t+' added to your Aura!');
};

window.nextVid = function(){
  var q=getQueue();
  jumpTo((curIdx+1)%q.length);
};

window.prevVid = function(){
  var q=getQueue();
  jumpTo((curIdx-1+q.length)%q.length);
};

/* ═══ VIDEO ═══ */
window.loadVideo = function(vid){
  var frame=document.getElementById('ytFrame');
  var bg=document.getElementById('playerBg');
  if(!vid){ vid=getQueue()[curIdx].vid; }
  if(frame){
    frame.src='https://www.youtube.com/embed/'+vid+'?autoplay=1&modestbranding=1&rel=0&color=white';
    frame.style.display='block';
  }
  if(bg) bg.style.display='none';
};

/* ═══ CHANNEL ═══ */
window.switchCh = function(ch,btn){
  curChannel=ch; curIdx=0;
  document.querySelectorAll('.ch-btn,.spot-btn').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  var chData=channels[ch];
  var cb=document.getElementById('chBar');
  var dt=document.getElementById('dropTxt');
  if(cb) cb.style.background=chData.color;
  if(dt) dt.innerHTML=chData.drop;
  var q=chData.queue;
  q.forEach(function(s){ s.active=false; });
  q[0].active=true;
  var nt=document.getElementById('nowTitle');
  var nth=document.getElementById('nowThumb');
  var ns=document.getElementById('nowSub');
  if(nt) nt.textContent=q[0].t+' — '+q[0].a;
  if(nth) nth.textContent=q[0].e;
  if(ns) ns.textContent=ch.charAt(0).toUpperCase()+ch.slice(1)+' Channel';
  var frame=document.getElementById('ytFrame');
  var bg=document.getElementById('playerBg');
  if(frame){ frame.src=''; frame.style.display='none'; }
  if(bg){
    bg.style.display='flex';
    var npt=document.getElementById('npTitle');
    var npa=document.getElementById('npArtist');
    if(npt) npt.textContent=q[0].t;
    if(npa) npa.textContent=q[0].a;
  }
  overlayOn=false;
  var svo=document.getElementById('svgOv');
  var ovb=document.getElementById('ovBtn');
  var sh=document.getElementById('scanHint');
  if(svo) svo.classList.remove('on');
  if(ovb){ ovb.classList.remove('on'); ovb.textContent='✦ Fashion Scan'; }
  if(sh) sh.classList.remove('show');
  closeCard();
  renderQueue();
  showToast('SWITCHED TO '+ch.toUpperCase()+' CHANNEL');
};

/* ═══ FASHION OVERLAY ═══ */
window.toggleOverlay = function(){
  overlayOn=!overlayOn;
  var svo=document.getElementById('svgOv');
  var ovb=document.getElementById('ovBtn');
  var sh=document.getElementById('scanHint');
  if(svo) svo.classList.toggle('on',overlayOn);
  if(ovb){ ovb.classList.toggle('on',overlayOn); ovb.textContent=overlayOn?'✦ Scan ON':'✦ Fashion Scan'; }
  if(sh) sh.classList.toggle('show',overlayOn);
  if(!overlayOn){ closeCard(); var rl=document.getElementById('regionLabel'); if(rl) rl.classList.remove('show'); }
  showToast(overlayOn?'FASHION SCAN ON — HOVER OVER CLOTHING':'FASHION SCAN OFF');
};

window.hoverR = function(el,item){
  if(!overlayOn) return;
  var d=fashionItems[item]; if(!d) return;
  var label=document.getElementById('regionLabel');
  var wrap=document.getElementById('playerWrap');
  if(!label||!wrap) return;
  var r=el.getBoundingClientRect();
  var wr=wrap.getBoundingClientRect();
  label.textContent=d.name;
  label.style.left=Math.min(r.left-wr.left,wr.width-190)+'px';
  label.style.top=Math.max(r.top-wr.top-26,4)+'px';
  label.classList.add('show');
  scanCount++;
  var sc=document.getElementById('scanStat');
  if(sc) sc.textContent=scanCount;
};

window.leaveR = function(){
  clearTimeout(labelTimeout);
  labelTimeout=setTimeout(function(){
    var rl=document.getElementById('regionLabel');
    if(rl) rl.classList.remove('show');
  },300);
};

window.selectR = function(item){
  if(!overlayOn) return;
  var d=fashionItems[item]; if(!d) return;
  document.querySelectorAll('.region').forEach(function(r){ r.classList.remove('sel'); });
  var el=document.getElementById('r-'+item);
  if(el) el.classList.add('sel');
  var fcn=document.getElementById('fcName');
  var fct=document.getElementById('fcTag');
  var fcp=document.getElementById('fcPrices');
  var fcb=document.getElementById('fcBuy');
  var fcs=document.getElementById('fcSave');
  var fc=document.getElementById('fashionCard');
  if(fcn) fcn.textContent=d.name;
  if(fct) fct.textContent=d.tag;
  if(fcp){
    var html='';
    d.prices.forEach(function(p){
      html+='<div class="fc-row'+(p.best?' best':'')+'">'
        +'<span class="fc-store">'+p.s+(p.best?' <span class="fc-btag">BEST</span>':'')+'</span>'
        +'<span class="fc-price">'+p.p+'</span></div>';
    });
    fcp.innerHTML=html;
  }
  if(fcb){ fcb.textContent='Buy — '+d.bp+' on '+d.bs; fcb.onclick=function(){ showToast('OPENING CHECKOUT: '+d.name+' — '+d.bp); }; }
  if(fcs){ fcs.onclick=function(){
    moyoItems.push({name:d.name,emoji:'👕',price:d.bp});
    if(moyoItems.length>3) moyoItems=moyoItems.slice(-3);
    renderMiniMoyo();
    showToast(d.name+' SAVED TO MOYO!');
    closeCard();
  }; }
  if(fc) fc.classList.add('show');
};

window.closeCard = function(){
  var fc=document.getElementById('fashionCard');
  if(fc) fc.classList.remove('show');
  document.querySelectorAll('.region').forEach(function(r){ r.classList.remove('sel'); });
};

/* ═══ MINI MOYO ═══ */
function renderMiniMoyo(){
  var mt=document.getElementById('mmTitle');
  var mi=document.getElementById('mmItems');
  if(moyoItems.length===0){
    if(mt) mt.textContent='Nothing saved yet';
    if(mi) mi.innerHTML='<div class="mm-empty">Turn on Fashion Scan · hover clothing · save pieces</div>';
    return;
  }
  if(mt) mt.textContent=moyoItems.length+' piece'+(moyoItems.length>1?'s':'')+' saved';
  var h='';
  moyoItems.forEach(function(item){
    h+='<div class="mm-item">'
      +'<div class="mm-emoji">'+item.emoji+'</div>'
      +'<div class="mm-name">'+item.name+'</div>'
      +'<div class="mm-price">'+item.price+'</div>'
      +'<button class="mm-buy" onclick="showToast(\'Opening checkout!\')">$</button>'
      +'</div>';
  });
  if(mi) mi.innerHTML=h;
}

/* ═══ AMPS ═══ */
function updateAmps(){
  var av=document.getElementById('ampVal');
  var wc=document.getElementById('wCnt');
  if(av) av.textContent=amps;
  if(wc) wc.textContent=amps;
  var html='';
  for(var i=0;i<20;i++) html+='<div class="pip" style="background:'+(i<amps?'#F5A623':'#1c1c1c')+'"></div>';
  var pips=document.getElementById('ampPips');
  if(pips) pips.innerHTML=html;
}

/* ═══ SPOTLIGHT ═══ */
window.spotVote = function(type){
  if(amps<=0){ showToast('NO AMPS LEFT!'); return; }
  amps--; spVotes[type]++;
  var total=spVotes.fire+spVotes.love+spVotes.amp;
  [['fire','fb1','fp1'],['love','fb2','fp2'],['amp','fb3','fp3']].forEach(function(x){
    var pct=Math.round(spVotes[x[0]]/total*100);
    var f=document.getElementById(x[1]);
    var l=document.getElementById(x[2]);
    if(f) f.style.width=pct+'%';
    if(l) l.textContent=pct+'%';
  });
  updateAmps();
  showToast('⚡ YOU VOTED FOR SATORI BLU!');
};

setInterval(function(){
  if(spotSecs>0) spotSecs--;
  var m=Math.floor(spotSecs/60),s=spotSecs%60;
  var el=document.getElementById('spotTime');
  if(el) el.textContent=m+':'+(s<10?'0':'')+s;
},1000);

/* ═══ VIEWER COUNT PULSE ═══ */
setInterval(function(){
  var vc=document.getElementById('viewerCount');
  var vs=document.getElementById('viewStat');
  var count=1100+Math.floor(Math.random()*80);
  if(vc) vc.textContent=count.toLocaleString()+' watching';
  if(vs) vs.textContent=(count/1000).toFixed(1)+'K';
},3500);

/* ═══ AURA ═══ */
function renderAuras(){
  var html='';
  auras.forEach(function(a){
    html+='<div class="aura-card">'
      +'<div class="aura-cover" style="background:'+a.cover+';">'+a.emoji
      +(a.published?'<div class="aura-pub">Published</div>':'')
      +'</div>'
      +'<div class="aura-info">'
      +'<div class="aura-name">'+a.name+'</div>'
      +'<div class="aura-tracks">'+a.tracks+' tracks</div>'
      +'<div class="aura-stats">'
      +'<div class="aura-stat">⚡ <span>'+a.votes+'</span></div>'
      +'<div class="aura-stat">↗ <span>'+a.shares+'</span></div>'
      +'<button class="aura-vote" onclick="voteAura('+a.id+')">Amp it</button>'
      +'</div></div></div>';
  });
  var ag=document.getElementById('auraGrid');
  if(ag) ag.innerHTML=html;
}

window.voteAura = function(id){
  var a=auras.find(function(x){ return x.id===id; });
  if(!a){ return; }
  if(!a.published){ showToast('Publish your Aura first!'); return; }
  a.votes++;
  renderAuras();
  showToast('⚡ Aura "'+a.name+'" Amped!');
};

window.createAura = function(){
  var names=['Neon Frequencies','Soul Archive','Bass Theory','Concrete Poetry','Golden Era'];
  var emojis=['🎵','🌊','💜','🎤','✨'];
  var covers=['#1a2e0a','#2e1a0a','#0a0a2e','#2e0a1a','#1a1a0a'];
  var idx=auras.length%5;
  auras.push({id:auras.length+1,name:names[idx],emoji:emojis[idx],tracks:0,votes:0,shares:0,published:false,cover:covers[idx]});
  renderAuras();
  showToast('New Aura created! Add tracks and publish it.');
};

/* ═══ ARTIST PORTAL ═══ */
window.applyForSlot = function(type){
  var af=document.getElementById('applyForm');
  var at=document.getElementById('afTitle');
  if(at) at.textContent=type==='artist'?'Apply for Artist Spotlight Slot':'Apply for Designer Spotlight Slot';
  if(af){ af.style.display='block'; af.scrollIntoView({behavior:'smooth'}); }
};

window.submitApplication = function(){
  var af=document.getElementById('applyForm');
  if(af) af.style.display='none';
  showToast('Application submitted! We will contact you within 48 hours.');
};

/* ═══ PROFILE ═══ */
function renderProfile(){
  if(!currentUser) return;
  var pa=document.getElementById('profileAv');
  var pn=document.getElementById('profileName');
  if(pa) pa.textContent=currentUser.name.charAt(0).toUpperCase();
  if(pn) pn.textContent=currentUser.name;
}

/* ═══ TOAST ═══ */
function showToast(msg){
  var t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); },2400);
}
window.showToast = showToast;

/* ═══ INIT ═══ */
updateAmps();
renderQueue();
renderMiniMoyo();

}); /* END DOMContentLoaded */
