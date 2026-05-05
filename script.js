/* ═══════════════════════════════
   SOUNDSTAGE — script.js
   By Khemra
═══════════════════════════════ */

/* ═══ SPLASH SCREEN ═══ */
var loadMsgs = [
  'Initializing SoundStage',
  'Loading your channels',
  'Syncing Amp wallet',
  'Connecting the culture',
  'Stage is ready'
];
var msgIdx = 0;
var loadInterval = setInterval(function(){
  msgIdx++;
  if(msgIdx < loadMsgs.length){
    var el = document.getElementById('loadTxt');
    if(el) el.textContent = loadMsgs[msgIdx];
  } else {
    clearInterval(loadInterval);
  }
}, 1000);

/* Hide loader, show enter button after loading */
setTimeout(function(){
  var la = document.getElementById('loadArea');
  var ew = document.getElementById('enterWrap');
  if(la) la.style.display = 'none';
  if(ew){
    ew.style.transition = 'opacity 0.7s ease';
    ew.style.opacity = '1';
  }
}, 5800);

/* Floating particles */
var cols = ['#F5A623','#00E5FF','#C07800','#FFD080','#ffffff'];
var ptContainer = document.getElementById('particles');
if(ptContainer){
  for(var i = 0; i < 24; i++){
    var pt = document.createElement('div');
    pt.className = 'pt';
    var sz = Math.random() * 2.5 + 0.8;
    pt.style.cssText = [
      'width:' + sz + 'px',
      'height:' + sz + 'px',
      'background:' + cols[Math.floor(Math.random() * cols.length)],
      'opacity:' + (Math.random() * 0.35 + 0.08),
      'left:' + (Math.random() * 100) + '%',
      'animation-duration:' + (Math.random() * 9 + 7) + 's',
      'animation-delay:-' + (Math.random() * 8) + 's'
    ].join(';');
    ptContainer.appendChild(pt);
  }
}

/* Enter platform */
function enterPlatform(){
  var splash = document.getElementById('splash');
  var platform = document.getElementById('platform');
  if(splash) splash.classList.add('hidden');
  if(platform) platform.classList.add('visible');
  setTimeout(function(){
    if(splash) splash.style.display = 'none';
  }, 900);
}

/* ═══ PLATFORM DATA ═══ */
var amps = 18;
var overlayOn = false;
var spotSecs = 161;
var scanCount = 0;
var labelTimeout = null;
var spVotes = { fire:62, love:28, amp:10 };

var channels = {
  hiphop:{
    color:'#F5A623',
    drop:'<strong>NIKE DROP:</strong> Air Max feat. in this video — PRO members 20% off',
    queue:[
      {e:'🎵', t:'Sundress', a:'ASAP Rocky', v:1240, vid:'c6C2T87JQKQ', active:true},
      {e:'🔥', t:'Mask Off', a:'Future', v:987, vid:'QGaezHPsEeE', active:false},
      {e:'⚡', t:'God Did', a:'DJ Khaled ft Jay-Z', v:834, vid:'reygR-YQQPU', active:false},
      {e:'💜', t:'Rich Flex', a:'Drake & 21 Savage', v:721, vid:'mhkgJrPZQQE', active:false},
      {e:'🎤', t:'All The Stars', a:'Kendrick Lamar', v:654, vid:'JQbjS0p6RTs', active:false}
    ]
  },
  rock:{
    color:'#FF3B3B',
    drop:'<strong>GIBSON DROP:</strong> Custom Les Paul collab — exclusive SoundStage members',
    queue:[
      {e:'🤘', t:'Chop Suey!', a:'System of a Down', v:892, vid:'CSvFpBOe8eY', active:true},
      {e:'🎸', t:'Numb', a:'Linkin Park', v:743, vid:'kXYiU_JCYtU', active:false},
      {e:'🔥', t:'In the End', a:'Linkin Park', v:612, vid:'eVTXPUF4Oz4', active:false},
      {e:'⚡', t:'Enter Sandman', a:'Metallica', v:589, vid:'CD-E-LDc384', active:false},
      {e:'💀', t:'B.Y.O.B.', a:'System of a Down', v:401, vid:'MsUBiH5bRSo', active:false}
    ]
  },
  latin:{
    color:'#00E5FF',
    drop:'<strong>ADIDAS DROP:</strong> Bad Bunny collab shoe — dropping live on SoundStage',
    queue:[
      {e:'🌴', t:'Tití Me Preguntó', a:'Bad Bunny', v:1580, vid:'Gx_Y4ME4jW8', active:true},
      {e:'🔥', t:'Hawái', a:'Maluma', v:1102, vid:'r64j8G1E7PY', active:false},
      {e:'💃', t:'Ojitos Lindos', a:'Bad Bunny', v:934, vid:'tUDMGTAkBLM', active:false},
      {e:'⚡', t:'La Canción', a:'J Balvin & Bad Bunny', v:812, vid:'cHKNBHEOqzU', active:false},
      {e:'🎵', t:'Problemática', a:'Rauw Alejandro', v:704, vid:'OPiC-oZcT2M', active:false}
    ]
  },
  rnb:{
    color:'#CC44FF',
    drop:'<strong>FENTY DROP:</strong> New collection featured in this video — shop now',
    queue:[
      {e:'💜', t:'Essence', a:'Wizkid ft Tems', v:1100, vid:'_nSmkyDQJ2E', active:true},
      {e:'🌙', t:'Leave The Door Open', a:'Bruno Mars & Anderson Paak', v:934, vid:'adLGHcg_dB8', active:false},
      {e:'🔥', t:'Pick Up Your Feelings', a:'Jazmine Sullivan', v:788, vid:'kGMbPGZTaHc', active:false},
      {e:'⚡', t:'Good Days', a:'SZA', v:654, vid:'rBKadCZIkk8', active:false},
      {e:'🎤', t:'Peaches', a:'Justin Bieber', v:543, vid:'pKRmACcC1sc', active:false}
    ]
  },
  spotlight:{
    color:'#F5A623',
    drop:'<strong>INDIE SPOTLIGHT:</strong> Submit your 3-min slot — $49 artists / $79 designers',
    queue:[
      {e:'🎤', t:'Solé Wave — NEW', a:'Indie R&B', v:312, vid:'c6C2T87JQKQ', active:true},
      {e:'👗', t:'NXUS Studio Drop', a:'Fashion Showcase', v:198, vid:'c6C2T87JQKQ', active:false}
    ]
  }
};

var curChannel = 'hiphop';
var curIdx = 0;

var fashionItems = {
  jacket:{
    name:'Vintage Coach Jacket',
    tag:'Outerwear — Spotted on ASAP Rocky',
    prices:[
      {s:'SSENSE', p:'$340', best:false},
      {s:'Grailed', p:'$280', best:false},
      {s:'StockX', p:'$260', best:true}
    ],
    bp:'$260', bs:'StockX'
  },
  shoes:{
    name:'Nike Air Force 1 Lo',
    tag:'Footwear — Spotted in video',
    prices:[
      {s:'Nike.com', p:'$110', best:false},
      {s:'GOAT', p:'$95', best:false},
      {s:'StockX', p:'$88', best:true}
    ],
    bp:'$88', bs:'StockX'
  },
  pants:{
    name:"Levi's 501 Baggy Denim",
    tag:'Bottoms — Spotted in video',
    prices:[
      {s:"Levi's", p:'$128', best:false},
      {s:'Nordstrom', p:'$110', best:false},
      {s:'Depop', p:'$65', best:true}
    ],
    bp:'$65', bs:'Depop'
  },
  chain:{
    name:'Cuban Link Chain Gold',
    tag:'Accessories — Spotted on ASAP Rocky',
    prices:[
      {s:'Farfetch', p:'$480', best:false},
      {s:'Grailed', p:'$320', best:false},
      {s:'eBay', p:'$195', best:true}
    ],
    bp:'$195', bs:'eBay'
  }
};

/* ═══ QUEUE ═══ */
function getQueue(){
  return channels[curChannel].queue;
}

function renderQueue(){
  var q = getQueue();
  var html = '';
  q.forEach(function(s, i){
    html += '<div class="q-item' + (s.active ? ' active' : '') + '" onclick="jumpTo(' + i + ')">'
      + '<div class="q-rank">' + (i+1) + '</div>'
      + '<div class="q-emoji">' + s.e + '</div>'
      + '<div class="q-info">'
      + '<div class="q-title">' + s.t + '</div>'
      + '<div class="q-artist">' + s.a + '</div>'
      + '</div>'
      + '<button class="amp-btn" onclick="event.stopPropagation();ampVote(' + i + ',this)">⚡ ' + s.v + '</button>'
      + '</div>';
  });
  document.getElementById('queueList').innerHTML = html;
}

function jumpTo(idx){
  var q = getQueue();
  q.forEach(function(s){ s.active = false; });
  q[idx].active = true;
  curIdx = idx;
  var s = q[idx];
  document.getElementById('nowTitle').textContent = s.t + ' — ' + s.a;
  document.getElementById('nowThumb').textContent = s.e;
  loadVideo(s.vid);
  renderQueue();
}

function ampVote(idx, btn){
  if(amps <= 0){ showToast('NO AMPS LEFT — RECHARGES TOMORROW'); return; }
  amps--;
  getQueue()[idx].v++;
  updateAmps();
  renderQueue();
  showToast('⚡ AMP SPENT — "' + getQueue()[idx].t + '" PUSHED UP!');
}

function nextVid(){
  var q = getQueue();
  var next = (curIdx + 1) % q.length;
  jumpTo(next);
}

function prevVid(){
  var q = getQueue();
  var prev = (curIdx - 1 + q.length) % q.length;
  jumpTo(prev);
}

/* ═══ VIDEO PLAYER ═══ */
function loadVideo(vid){
  var frame = document.getElementById('ytFrame');
  var bg = document.getElementById('playerBg');
  if(!vid){
    var q = getQueue();
    vid = q[curIdx].vid;
  }
  frame.src = 'https://www.youtube.com/embed/' + vid
    + '?autoplay=1&modestbranding=1&rel=0&color=white';
  frame.style.display = 'block';
  if(bg) bg.style.display = 'none';
}

function togglePlay(){
  var btn = document.getElementById('ppBtn');
  if(btn) btn.textContent = btn.textContent === '⏸' ? '▶' : '⏸';
  showToast('Use the YouTube controls to play/pause');
}

/* ═══ CHANNEL SWITCHING ═══ */
function switchCh(ch, btn){
  curChannel = ch;
  curIdx = 0;

  document.querySelectorAll('.ch-btn, .spot-btn').forEach(function(b){
    b.classList.remove('active');
  });
  btn.classList.add('active');

  var chData = channels[ch];
  document.getElementById('chBar').style.background = chData.color;
  document.getElementById('dropTxt').innerHTML = chData.drop;

  var q = chData.queue;
  q.forEach(function(s){ s.active = false; });
  q[0].active = true;

  document.getElementById('nowTitle').textContent = q[0].t + ' — ' + q[0].a;
  document.getElementById('nowThumb').textContent = q[0].e;
  document.getElementById('nowSub').textContent = ch.charAt(0).toUpperCase() + ch.slice(1) + ' Channel';

  /* Reset player */
  var frame = document.getElementById('ytFrame');
  var bg = document.getElementById('playerBg');
  frame.src = '';
  frame.style.display = 'none';
  if(bg){
    bg.style.display = 'flex';
    document.getElementById('npTitle').textContent = q[0].t;
    document.getElementById('npArtist').textContent = q[0].a;
  }

  /* Reset overlay */
  overlayOn = false;
  document.getElementById('svgOv').classList.remove('on');
  document.getElementById('ovBtn').classList.remove('on');
  document.getElementById('ovBtn').textContent = '✦ Fashion Scan';
  document.getElementById('scanHint').classList.remove('show');
  closeCard();

  renderQueue();
  showToast('SWITCHED TO ' + ch.toUpperCase() + ' CHANNEL');
}

/* ═══ FASHION OVERLAY ═══ */
function toggleOverlay(){
  overlayOn = !overlayOn;
  document.getElementById('svgOv').classList.toggle('on', overlayOn);
  document.getElementById('ovBtn').classList.toggle('on', overlayOn);
  document.getElementById('ovBtn').textContent = overlayOn ? '✦ Scan ON' : '✦ Fashion Scan';
  document.getElementById('scanHint').classList.toggle('show', overlayOn);
  if(!overlayOn){
    closeCard();
    var rl = document.getElementById('regionLabel');
    if(rl) rl.classList.remove('show');
  }
  showToast(overlayOn ? 'FASHION SCAN ON — HOVER OVER CLOTHING' : 'FASHION SCAN OFF');
}

function hoverR(el, item){
  if(!overlayOn) return;
  var d = fashionItems[item];
  if(!d) return;
  var label = document.getElementById('regionLabel');
  var wrap = document.getElementById('playerWrap');
  var r = el.getBoundingClientRect();
  var wr = wrap.getBoundingClientRect();
  label.textContent = d.name;
  label.style.left = Math.min(r.left - wr.left, wr.width - 190) + 'px';
  label.style.top = Math.max(r.top - wr.top - 26, 4) + 'px';
  label.classList.add('show');
  scanCount++;
  var sc = document.getElementById('scanStat');
  if(sc) sc.textContent = scanCount;
}

function leaveR(){
  clearTimeout(labelTimeout);
  labelTimeout = setTimeout(function(){
    var rl = document.getElementById('regionLabel');
    if(rl) rl.classList.remove('show');
  }, 300);
}

function selectR(item){
  if(!overlayOn) return;
  var d = fashionItems[item];
  if(!d) return;
  document.querySelectorAll('.region').forEach(function(r){ r.classList.remove('sel'); });
  var el = document.getElementById('r-' + item);
  if(el) el.classList.add('sel');
  document.getElementById('fcName').textContent = d.name;
  document.getElementById('fcTag').textContent = d.tag;
  var html = '';
  d.prices.forEach(function(p){
    html += '<div class="fc-row' + (p.best ? ' best' : '') + '">'
      + '<span class="fc-store">' + p.s
      + (p.best ? ' <span class="fc-btag">BEST</span>' : '')
      + '</span>'
      + '<span class="fc-price">' + p.p + '</span>'
      + '</div>';
  });
  document.getElementById('fcPrices').innerHTML = html;
  document.getElementById('fcBuy').textContent = 'Buy — ' + d.bp + ' on ' + d.bs;
  document.getElementById('fcBuy').onclick = function(){
    showToast('OPENING CHECKOUT: ' + d.name + ' — ' + d.bp);
  };
  document.getElementById('fcSave').onclick = function(){
    showToast(d.name.toUpperCase() + ' SAVED TO MOYO!');
    closeCard();
  };
  document.getElementById('fashionCard').classList.add('show');
}

function closeCard(){
  var fc = document.getElementById('fashionCard');
  if(fc) fc.classList.remove('show');
  document.querySelectorAll('.region').forEach(function(r){ r.classList.remove('sel'); });
}

/* ═══ AMP WALLET ═══ */
function updateAmps(){
  var av = document.getElementById('ampVal');
  var wc = document.getElementById('wCnt');
  if(av) av.textContent = amps;
  if(wc) wc.textContent = amps;
  var html = '';
  for(var i = 0; i < 20; i++){
    html += '<div class="pip" style="background:' + (i < amps ? '#F5A623' : '#1c1c1c') + '"></div>';
  }
  var pips = document.getElementById('ampPips');
  if(pips) pips.innerHTML = html;
}

/* ═══ SPOTLIGHT VOTING ═══ */
function spotVote(type){
  if(amps <= 0){ showToast('NO AMPS LEFT!'); return; }
  amps--;
  spVotes[type]++;
  var total = spVotes.fire + spVotes.love + spVotes.amp;
  var map = [['fire','fb1','fp1'],['love','fb2','fp2'],['amp','fb3','fp3']];
  map.forEach(function(x){
    var pct = Math.round(spVotes[x[0]] / total * 100);
    var fill = document.getElementById(x[1]);
    var label = document.getElementById(x[2]);
    if(fill) fill.style.width = pct + '%';
    if(label) label.textContent = pct + '%';
  });
  updateAmps();
  showToast('⚡ YOU AMPED THE SPOTLIGHT!');
}

/* ═══ SPOTLIGHT COUNTDOWN ═══ */
setInterval(function(){
  if(spotSecs > 0) spotSecs--;
  var m = Math.floor(spotSecs / 60);
  var s = spotSecs % 60;
  var el = document.getElementById('spotTime');
  if(el) el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
}, 1000);

/* ═══ TOAST ═══ */
function showToast(msg){
  var t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

/* ═══ INIT ═══ */
updateAmps();
renderQueue();