var VIKAS_PHOTO = "assets/vikas.jpg";

(function(){
  window.addEventListener('load', function(){
    document.getElementById('photos-hero-img').src = VIKAS_PHOTO;
    document.getElementById('x-avatar').style.backgroundImage = 'url('+VIKAS_PHOTO+')';
    document.getElementById('li-avatar').style.backgroundImage = 'url('+VIKAS_PHOTO+')';
    setTimeout(function(){ document.getElementById('boot').classList.add('hidden'); }, 1500);
    setTimeout(function(){ openWindow('finder'); }, 1900);
  });

  function pad(n){return n.toString().padStart(2,'0');}
  function updateClock(){
    var d=new Date();
    var h=d.getHours(), ap=h>=12?'PM':'AM', h12=h%12===0?12:h%12;
    document.getElementById('mb-clock').textContent = h12+':'+pad(d.getMinutes())+' '+ap;
  }
  updateClock(); setInterval(updateClock,1000);

  var zTop=20, wins={};
  document.querySelectorAll('.win').forEach(function(w){ wins[w.id.replace('win-','')]=w; });
  var appMap={'finder':'finder','notes':'notes','preview':'preview','chatgpt':'chatgpt','x':'x','linkedin':'linkedin','messages':'messages','photos':'photos','photobooth':'photobooth','music':'music','terminal':'terminal','settings':'settings','trash':'trash','weather':'weather'};

  function setActiveAppName(n){ document.getElementById('active-app-name').textContent=n; }
  function bringToFront(key){ var w=wins[key]; if(!w)return; zTop++; w.style.zIndex=zTop; setActiveAppName(w.dataset.app); }
  function markDockRunning(key,on){ document.querySelectorAll('.dock-item').forEach(function(d){ if(appMap[d.dataset.app]===key) d.classList.toggle('running',on); }); }
  function openWindow(key){
    var w=wins[key]; if(!w) return;
    w.classList.add('open'); w.classList.remove('minimized');
    bringToFront(key); markDockRunning(key,true);
    if(key==='finder' && !w.dataset.inited) selectFinderPane('home');
    if(key==='notes' && !w.dataset.inited) selectNote('about');
    if(key==='messages' && !w.dataset.inited) selectThread(0);
    if(key==='music' && !w.dataset.inited) selectPlaylist('bollywood');
    if(key==='settings' && !w.dataset.inited) selectSettingsPane('skills');
    if(key==='weather' && !w.dataset.inited) selectCity('delhi');
    w.dataset.inited='1';
  }
  function closeWindow(key){ var w=wins[key]; if(!w) return; w.classList.remove('open'); markDockRunning(key,false); if(key==='photobooth') stopCamera(); }
  function toggleMin(key){ var w=wins[key]; if(!w) return; if(!w.classList.contains('open')){ openWindow(key); return; } w.classList.toggle('minimized'); }

  document.querySelectorAll('.win').forEach(function(w){
    var key=w.id.replace('win-','');
    w.addEventListener('mousedown', function(){ bringToFront(key); });
    w.querySelector('[data-act="close"]').addEventListener('click', function(e){ e.stopPropagation(); closeWindow(key); });
    w.querySelector('[data-act="min"]').addEventListener('click', function(e){ e.stopPropagation(); w.classList.add('minimized'); });
    w.querySelector('[data-act="max"]').addEventListener('click', function(e){ e.stopPropagation(); w.classList.toggle('maxed'); });
  });

  document.querySelectorAll('.dock-item').forEach(function(d){
    d.addEventListener('click', function(){
      var key=appMap[d.dataset.app]||d.dataset.app;
      toggleMin(key);
      if(wins[key].classList.contains('open')) bringToFront(key);
    });
  });
  document.querySelectorAll('.dicon').forEach(function(ic){
    ic.addEventListener('click', function(){
      document.querySelectorAll('.dicon').forEach(function(o){o.classList.remove('selected');});
      ic.classList.add('selected'); openWindow(ic.dataset.open);
    });
  });

  document.querySelectorAll('.win-bar').forEach(function(bar){
    var win=bar.closest('.win'); var dragging=false, offX=0, offY=0;
    function start(x,y){ if(window.innerWidth<=760) return; dragging=true; var r=win.getBoundingClientRect(); offX=x-r.left; offY=y-r.top; bringToFront(win.id.replace('win-','')); }
    function move(x,y){ if(!dragging) return; var nx=Math.max(2,x-offX), ny=Math.max(28,y-offY); win.style.left=nx+'px'; win.style.top=ny+'px'; }
    function end(){ dragging=false; }
    bar.addEventListener('mousedown', function(e){ start(e.clientX,e.clientY); });
    document.addEventListener('mousemove', function(e){ move(e.clientX,e.clientY); });
    document.addEventListener('mouseup', end);
    bar.addEventListener('touchstart', function(e){ var t=e.touches[0]; start(t.clientX,t.clientY); }, {passive:true});
    document.addEventListener('touchmove', function(e){ var t=e.touches[0]; move(t.clientX,t.clientY); }, {passive:true});
    document.addEventListener('touchend', end);
  });

  var appList = [
    {n:'Notes',i:'📝',c:'i-notes',key:'notes'},{n:'ChatGPT',i:'✦',c:'i-chatgpt',key:'chatgpt'},
    {n:'X',i:'𝕏',c:'i-x',key:'x'},{n:'LinkedIn',i:'in',c:'i-linkedin',key:'linkedin'},
    {n:'Messages',i:'💬',c:'i-messages',key:'messages'},{n:'Photos',i:'🖼️',c:'i-photos',key:'photos'},
    {n:'Photo Booth',i:'📷',c:'i-photobooth',key:'photobooth'},{n:'Music',i:'🎵',c:'i-music',key:'music'},
    {n:'Terminal',i:'&gt;_',c:'i-terminal',key:'terminal'},{n:'Settings',i:'⚙️',c:'i-settings',key:'settings'},
    {n:'Weather',i:'☁️',c:'',key:'weather'},{n:'Preview',i:'📄',c:'',key:'preview'}
  ];
  function appGridHtml(){
    return '<h2>Applications</h2><p class="sub">// installed on this Mac</p><div class="app-grid">' +
      appList.map(function(a){ return '<div class="ag-item" data-openapp="'+a.key+'"><div class="ag-icon '+a.c+'">'+a.i+'</div><div class="ag-name">'+a.n+'</div></div>'; }).join('') + '</div>';
  }
  function docsHtml(){
    return '<h2>Documents</h2><p class="sub">// 4 items</p><div class="doc-list">'+
      '<div class="doc-row" data-openapp="preview"><div class="doc-ic pdf">PDF</div>Resume.pdf</div>'+
      '<div class="doc-row" data-note="1"><div class="doc-ic md">MD</div>notes-on-learning.md</div>'+
      '<div class="doc-row" data-note="1"><div class="doc-ic md">MD</div>why-i-build.md</div>'+
      '<div class="doc-row" data-note="1"><div class="doc-ic md">MD</div>figuring-it-out.md</div>'+
      '</div>';
  }
  var panes = {
    home: '<h2>Vikas Aggarwal</h2><p class="sub">// developer</p>'+
      '<p>Hey, I\'m <span class="accent">Vikas</span> — an Information Technology undergraduate at Maharaja Surajmal Institute of Technology, New Delhi. I like figuring out how things work and building stuff that\'s actually useful, end to end.</p>'+
      '<p>Currently picking up full-stack development — HTML, CSS, JavaScript, React, Node.js, MongoDB — and getting comfortable with tools like Docker, Kubernetes and Git along the way.</p>'+
      '<p style="color:var(--text-faint);font-size:12px;">— This whole desktop is my portfolio. Click around: Applications, Documents, Projects, Skills, Experience, Contact — it\'s all in the sidebar.</p>',
    projects: '<h2>Projects</h2><p class="sub">// 2 selected builds</p>'+
      '<div class="project-card"><h3>Netflix Clone</h3><p class="desc">A fully responsive static clone of the Netflix homepage — semantic HTML5, modern CSS3, Flexbox/Grid layouts across desktop, tablet and mobile. Hero banner, content thumbnails, nav bar, footer — all built from scratch with clean, reusable CSS.</p><div><span class="tag">HTML5</span><span class="tag">CSS3</span><span class="tag">Flexbox/Grid</span></div></div>'+
      '<div class="project-card"><h3>DB-Demo-App — Email Management</h3><p class="desc">A full-stack email management application. Responsive UI in HTML5 + vanilla JS with client-side validation, REST API built with Express.js, MongoDB + Mongoose for data persistence, deployed and managed with Kubernetes.</p><div class="project-links"><a href="https://github.com/vikasaggar7792/db-demo-app" target="_blank">Code</a></div><div><span class="tag">Express.js</span><span class="tag">MongoDB</span><span class="tag">Mongoose</span><span class="tag">Kubernetes</span></div></div>',
    skills: '<h2>Skills</h2><p class="sub">// tech stack</p>'+
      '<div class="skill-cat"><h4>Languages &amp; Web</h4><span class="tag">HTML</span><span class="tag">CSS</span><span class="tag">JavaScript</span><span class="tag">Java</span></div>'+
      '<div class="skill-cat"><h4>Frameworks</h4><span class="tag">React.js</span><span class="tag">Node.js</span></div>'+
      '<div class="skill-cat"><h4>Data &amp; DevOps</h4><span class="tag">MongoDB</span><span class="tag">Docker</span><span class="tag">Jenkins</span><span class="tag">Kubernetes</span><span class="tag">AWS</span></div>'+
      '<div class="skill-cat"><h4>Tools</h4><span class="tag">Git</span><span class="tag">GitHub</span></div>'+
      '<div class="skill-cat"><h4>Practical</h4><span class="tag">Problem Solving</span><span class="tag">Communication</span><span class="tag">Teamwork</span></div>',
    experience: '<h2>Experience</h2><p class="sub">// where I\'ve worked</p>'+
      '<div class="exp-block"><h3>Full-Stack Web Development Intern</h3><div class="exp-sub">Prodigy InfoTech — Remote · 15 Jun – 15 Jul 2025</div><p style="margin:0;font-size:13.5px;">Completed a 1-month, project-based internship building practical full-stack skills — working on real project tasks and picking up the workflow of shipping features end-to-end. Certificate of Completion issued.</p></div>'+
      '<div class="exp-block"><h3>Community &amp; Events</h3><div class="exp-sub">Volunteer · Event Coordination</div><p style="margin:0;font-size:13.5px;">Volunteered and helped run multiple college events, handling on-ground coordination and logistics. Active community member with Avensis, contributing to planning and execution of events.</p></div>'+
      '<div class="exp-block"><h3>Certifications</h3><div class="exp-sub">Workshop on Generative AI — DUCAT</div><p style="margin:0;font-size:13.5px;">Hands-on exposure to AI concepts, prompt engineering and practical implementation techniques.</p></div>',
    contact: '<h2>Let\'s talk</h2><p class="sub">// reach out</p>'+
      '<a class="contact-row" href="mailto:aggarwalvikas294@gmail.com"><span class="ic">✉</span> aggarwalvikas294@gmail.com</a>'+
      '<a class="contact-row" href="tel:+918882546726"><span class="ic">📞</span> +91 8882546726</a>'+
      '<a class="contact-row" href="https://github.com/vikasaggar7792" target="_blank"><span class="ic">🐙</span> github.com/vikasaggar7792</a>'+
      '<a class="contact-row" href="https://linkedin.com/in/vikas-aggarwal-1119282b4/" target="_blank"><span class="ic">in</span> linkedin.com/in/vikas-aggarwal</a>'+
      '<a class="contact-row" href="https://x.com/Vikasaggarw7792" target="_blank"><span class="ic">𝕏</span> @Vikasaggarw7792</a>'
  };
  panes.applications = appGridHtml();
  panes.documents = docsHtml();
  function selectFinderPane(name){
    var pane = panes[name] || panes.home;
    document.getElementById('finder-pane').innerHTML = pane;
    document.querySelectorAll('#win-finder .sb-item').forEach(function(it){ it.classList.toggle('active', it.dataset.pane===name); });
    var label = name.charAt(0).toUpperCase()+name.slice(1);
    document.getElementById('finder-title').textContent = label;
    document.getElementById('finder-tb-title').textContent = label;
    document.querySelectorAll('#finder-pane [data-openapp]').forEach(function(el){
      el.addEventListener('click', function(){
        var k = el.dataset.openapp;
        toggleMin(k); bringToFront(k);
      });
    });
    document.querySelectorAll('#finder-pane [data-note]').forEach(function(el){
      el.addEventListener('click', function(){ toggleMin('notes'); bringToFront('notes'); });
    });
  }
  document.querySelectorAll('#win-finder .sb-item').forEach(function(it){ it.addEventListener('click', function(){ selectFinderPane(it.dataset.pane); }); });

  var notesData = {
    about: {icon:'👋', title:'about me', date:'Today', photo:true, preview:"hi, i'm Vikas...",
      body:"<p>hi, i'm Vikas — 20, an Information Technology undergraduate at Maharaja Surajmal Institute of Technology, New Delhi.</p>"+
      "<p>I like figuring things out — how systems work, how to make something go from an idea to something that actually runs. Right now that means full-stack web dev: HTML/CSS/JS, React, Node, MongoDB — plus getting comfortable with Docker, Kubernetes and AWS along the way.</p>"+
      "<p>I try to learn fast and ship rather than just plan. Still early in the journey, and okay with that.</p>"+
      "<p style='color:var(--text-faint);font-size:12.5px;'>— want this section more personal? tell me your real hobbies/interests and I'll rewrite it in your own words.</p>"},
    experience: {icon:'💼', title:'experience', date:'This month', preview:'Prodigy InfoTech — the internship...',
      body:"<p><b>Full-Stack Web Development Intern</b> — Prodigy InfoTech (15 Jun – 15 Jul 2025, Remote)</p>"+
      "<p>Spent a month in a project-based internship getting hands-on with full-stack development — working through real project tasks and picking up the habit of shipping rather than just learning in theory. Came out of it with a Certificate of Completion and a clearer sense of what full-stack work actually looks like day to day.</p>"},
    community: {icon:'🤝', title:'community', date:'This month', preview:'volunteering, events, Avensis...',
      body:"<p>Been on the volunteering side of a few college events — helping with on-ground coordination, logistics, making sure things ran smoothly behind the scenes.</p>"+
      "<p>Was an active member of the <b>Avensis</b> community, pitching in on event planning and execution as part of the team.</p>"},
    hackathons: {icon:'🏆', title:'hackathons &amp; wins', date:'', preview:'coming soon...', body:"<p style='color:var(--text-faint);'>— nothing here yet. add your hackathon wins whenever you have them.</p>"}
  };
  function selectNote(key){
    var n = notesData[key];
    document.querySelectorAll('#notes-list .nl-item').forEach(function(it){ it.classList.toggle('active', it.dataset.note===key); });
    var html = '<div class="nd-date">'+(n.date||'')+'</div><h2>'+n.icon+' '+n.title+'</h2>';
    if(n.photo) html += '<img class="nd-photo" src="'+VIKAS_PHOTO+'" alt="Vikas">';
    html += n.body;
    document.getElementById('notes-detail').innerHTML = html;
  }
  function renderNotesList(){
    var order = ['about','experience','community','hackathons'];
    var html = '<div class="nl-search">🔍 Search</div><div class="nl-cat">Pinned</div>';
    order.forEach(function(k){
      var n = notesData[k];
      html += '<div class="nl-item" data-note="'+k+'"><div class="nl-title">'+n.icon+' '+n.title+'</div><div class="nl-preview">'+n.preview+'</div></div>';
    });
    document.getElementById('notes-list').innerHTML = html;
    document.querySelectorAll('#notes-list .nl-item').forEach(function(it){ it.addEventListener('click', function(){ selectNote(it.dataset.note); }); });
  }
  renderNotesList();

  var gptFaq = {
    why: "Vikas picks things up fast and actually ships — he's built full-stack projects (React/Node/MongoDB), deployed with Kubernetes, and just wrapped a full-stack internship at Prodigy InfoTech. Strong fundamentals in Java, DBMS, OS and networking too.",
    project: "Probably the DB-Demo-App — a full email management app with an Express.js REST API, MongoDB + Mongoose for storage, and Kubernetes for deployment. End-to-end, not just a frontend demo.",
    intern: "He did a 1-month Full-Stack Web Development internship at Prodigy InfoTech (Jun–Jul 2025) — project-based, hands-on, and he came out with a completion certificate.",
    skills: "HTML, CSS, JavaScript, Java, React.js, Node.js, MongoDB, Git/GitHub, Docker, Jenkins, Kubernetes, AWS — plus solid problem-solving and teamwork."
  };
  function gptAsk(question, key){
    document.getElementById('gpt-landing').style.display='none';
    var log = document.getElementById('gpt-log'); log.style.display='flex';
    var u = document.createElement('div'); u.className='gpt-bubble user'; u.textContent=question; log.appendChild(u);
    var b = document.createElement('div'); b.className='gpt-bubble bot';
    b.textContent = gptFaq[key] || "I'm just a portfolio demo, but here's what I know: Vikas is an IT undergrad who builds full-stack projects and just finished an internship at Prodigy InfoTech. Try one of the suggested questions for more!";
    log.appendChild(b); log.scrollTop = log.scrollHeight;
  }
  document.querySelectorAll('.gpt-chip').forEach(function(c){
    c.addEventListener('click', function(){ gptAsk(c.textContent, c.dataset.q); });
  });
  document.getElementById('gpt-input').addEventListener('keydown', function(e){
    if(e.key!=='Enter') return;
    var v=this.value.trim(); if(!v) return;
    var low=v.toLowerCase(); var key='';
    if(low.indexOf('hire')>-1||low.indexOf('why')>-1) key='why';
    else if(low.indexOf('project')>-1) key='project';
    else if(low.indexOf('intern')>-1) key='intern';
    else if(low.indexOf('skill')>-1) key='skills';
    gptAsk(v, key); this.value='';
  });

  var threads = [
    {name:'Elon Musk', init:'EM', msgs:[
      {them:"Vikas. I need someone who ships fast for a Mars project. You in?"},
      {me:"I have exams next week Elon"},
      {them:"Exams are a legacy system. I'm deprecating them. Starting with yours."},
      {me:"please don't email my college"},
      {them:"Too late. Also naming a rocket after your GitHub repo."}
    ]},
    {name:'MrBeast', init:'MB', msgs:[
      {them:"if your Netflix clone hits 1M views I'll fund your next project"},
      {me:"it's a static clone, it doesn't really 'get views'"},
      {them:"perfect, we'll add a button that says SUBSCRIBE FOR MORE CLONES"},
      {me:"...okay"}
    ]},
    {name:'Sundar Pichai', init:'SP', msgs:[
      {them:"we reviewed your DB-Demo-App. very clean REST structure."},
      {me:"thank you so much sir!!"},
      {them:"unfortunately we're going to need you to rebuild it in 7 different frameworks for A/B testing"},
      {me:"is this a job offer or a punishment"},
      {them:"why not both"}
    ]},
    {name:'Gordon Ramsay', init:'GR', msgs:[
      {them:"I heard you're learning Kubernetes"},
      {me:"yes chef"},
      {them:"THIS POD IS RAW. IT'S NOT EVEN DEPLOYED PROPERLY"},
      {me:"it's literally just starting up"},
      {them:"IT'S STILL RAW"}
    ]},
    {name:'Satya Nadella', init:'SN', msgs:[
      {them:"we noticed you use VS Code, GitHub, and Azure-adjacent tools"},
      {me:"is this a compliment"},
      {them:"we'd like to gently remind you that you are, in fact, already ours"},
      {me:"understood sir"}
    ]},
    {name:'Recruiter — TechCorp', init:'TC', msgs:[
      {them:"Hi Vikas, saw your DB-Demo-App on GitHub — impressive use of Kubernetes for a student project. Are you open to intern roles?"},
      {me:"Yes, definitely open! Happy to share my resume."},
      {them:"Perfect, sending over the JD now."}
    ]},
    {name:'Mom', init:'❤️', msgs:[
      {them:"beta khana khaya?"},
      {me:"haan mumma khaya"},
      {them:"resume bhej rakha hai sab jagah? interview kab hai?"},
      {me:"maa website bana raha hu abhi thoda ruk jao"}
    ]}
  ];
  function renderMsgList(){
    var html='';
    threads.forEach(function(t,i){
      var last = t.msgs[t.msgs.length-1];
      var lastText = last.them || last.me;
      html += '<div class="ml-item" data-i="'+i+'"><div class="ml-avatar">'+t.init+'</div><div class="ml-info"><div class="ml-name">'+t.name+'</div><div class="ml-preview">'+lastText+'</div></div></div>';
    });
    document.getElementById('msg-list').innerHTML = html;
    document.querySelectorAll('#msg-list .ml-item').forEach(function(it){ it.addEventListener('click', function(){ selectThread(parseInt(it.dataset.i)); }); });
  }
  function selectThread(i){
    var t = threads[i];
    document.querySelectorAll('#msg-list .ml-item').forEach(function(it){ it.classList.toggle('active', parseInt(it.dataset.i)===i); });
    document.getElementById('msg-head').textContent = 'To: '+t.name;
    var html='';
    t.msgs.forEach(function(m){
      if(m.them) html += '<div class="msg-bubble them">'+m.them+'</div>';
      else html += '<div class="msg-bubble me">'+m.me+'</div>';
    });
    document.getElementById('msg-body').innerHTML = html;
  }
  renderMsgList();

  var pbStream = null;
  function stopCamera(){ if(pbStream){ pbStream.getTracks().forEach(function(t){t.stop();}); pbStream=null; } }
  document.getElementById('pb-start').addEventListener('click', function(){
    var wrap = document.getElementById('pb-wrap');
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      document.getElementById('pb-msg').textContent = 'Camera access not supported in this browser.'; return;
    }
    navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
      pbStream = stream;
      wrap.innerHTML = '<video id="pb-video" autoplay playsinline muted></video>';
      var v = document.getElementById('pb-video'); v.srcObject = stream;
    }).catch(function(err){
      document.getElementById('pb-msg').textContent = 'Camera permission denied or unavailable.';
    });
  });
  document.getElementById('pb-shutter').addEventListener('click', function(){
    var v = document.getElementById('pb-video'); if(!v) return;
    var canvas = document.createElement('canvas'); canvas.width=v.videoWidth||480; canvas.height=v.videoHeight||360;
    var ctx = canvas.getContext('2d'); ctx.drawImage(v,0,0,canvas.width,canvas.height);
    var img = document.createElement('img'); img.src = canvas.toDataURL('image/jpeg');
    document.getElementById('pb-strip').appendChild(img);
  });

  var playlists = {
    bollywood: {name:'Bollywood Hits ❤️', songs:[
      {t:'Humsafar', a:'Akhil Sachdeva, Mansheel Gujral', d:'4:32', icon:'💕'},
      {t:'Tum Hi Ho', a:'Arijit Singh', d:'4:22', icon:'🎻'},
      {t:'Sun Raha Hai Na Tu', a:'Ankit Tiwari', d:'6:15', icon:'🎹'},
      {t:'Mere Humsafar', a:'Mithoon, Arijit Singh, Tulsi Kumar', d:'4:20', icon:'💫'},
      {t:'Dilruba', a:'Jubin Nautiyal', d:'3:48', icon:'🌙'},
      {t:'Saiyaara (Title Track)', a:'Faheem Abdullah, Arslan Nizami', d:'3:10', icon:'🎬'},
      {t:'Chahun Main Ya Naa', a:'Arijit Singh, Palak Muchhal', d:'5:03', icon:'🎧'},
      {t:'Bhula Dena', a:'Mustafa Zahid', d:'5:38', icon:'🎼'},
      {t:'Meri Aashiqui', a:'Arijit Singh', d:'5:05', icon:'💗'},
      {t:'Barfani', a:'Vishal Mishra', d:'3:52', icon:'❄️'}
    ]},
    focus: {name:'late night builds', songs:[
      {t:'cold/mess', a:'Prateek Kuhad', d:'4:41', icon:'🌙'},
      {t:'End of Beginning', a:'Djo', d:'2:39', icon:'🚀'},
      {t:'Apocalypse', a:'Cigarettes After Sex', d:'4:50', icon:'☁️'}
    ]}
  };
  function renderMusicSide(){
    var html='<div class="m-item active" data-pl="bollywood">❤️ Bollywood Hits</div><div class="m-item" data-pl="focus">🌙 late night builds</div>';
    document.getElementById('music-side').innerHTML = html;
    document.querySelectorAll('#music-side .m-item').forEach(function(it){ it.addEventListener('click', function(){ selectPlaylist(it.dataset.pl); }); });
  }
  function selectPlaylist(key){
    var pl = playlists[key];
    document.querySelectorAll('#music-side .m-item').forEach(function(it){ it.classList.toggle('active', it.dataset.pl===key); });
    var html='<h2>'+pl.name+'</h2>';
    pl.songs.forEach(function(s,i){
      html += '<div class="song-row" data-pl="'+key+'" data-i="'+i+'"><div class="sn-ic" style="background:linear-gradient(135deg,#845ec2,#d65db1);">'+s.icon+'</div><div><div class="sn-title">'+s.t+'</div><div class="sn-artist">'+s.a+'</div></div><div class="sn-dur">'+s.d+'</div></div>';
    });
    document.getElementById('music-main').innerHTML = html;
    document.querySelectorAll('.song-row').forEach(function(row){
      row.addEventListener('click', function(){ playTrack(row.dataset.pl, parseInt(row.dataset.i)); });
    });
    markPlayingRow();
  }
  renderMusicSide();

  /* ---- real-feeling play/pause/progress player (no copyrighted audio hosted) ---- */
  var player = { pl:null, i:0, elapsed:0, total:0, playing:false, timer:null };
  function parseDur(d){ var parts=d.split(':'); return parseInt(parts[0])*60+parseInt(parts[1]); }
  function formatTime(s){ s=Math.max(0,Math.round(s)); var m=Math.floor(s/60), r=s%60; return m+':'+(r<10?'0':'')+r; }
  function markPlayingRow(){
    document.querySelectorAll('.song-row').forEach(function(row){
      var isPlaying = player.pl && row.dataset.pl===player.pl && parseInt(row.dataset.i)===player.i;
      row.classList.toggle('playing', !!isPlaying);
    });
  }
  function playTrack(plKey, i){
    clearInterval(player.timer);
    var song = playlists[plKey].songs[i];
    player.pl = plKey; player.i = i; player.elapsed = 0; player.total = parseDur(song.d); player.playing = true;
    document.getElementById('now-playing-bar').style.display = 'flex';
    document.getElementById('np-ic').textContent = song.icon;
    document.getElementById('np-title').textContent = song.t;
    document.getElementById('np-artist').textContent = song.a;
    document.getElementById('np-total').textContent = song.d;
    document.getElementById('np-play').textContent = '❚❚';
    updateProgressUI();
    startTimer();
    markPlayingRow();
  }
  function startTimer(){
    clearInterval(player.timer);
    player.timer = setInterval(function(){
      if(!player.playing) return;
      player.elapsed++;
      if(player.elapsed >= player.total){ nextTrack(); return; }
      updateProgressUI();
    }, 1000);
  }
  function updateProgressUI(){
    document.getElementById('np-elapsed').textContent = formatTime(player.elapsed);
    var pct = player.total ? (player.elapsed/player.total*100) : 0;
    document.getElementById('np-fill').style.width = pct+'%';
  }
  function togglePlayPause(){
    if(player.pl===null) return;
    player.playing = !player.playing;
    document.getElementById('np-play').textContent = player.playing ? '❚❚' : '▶';
  }
  function nextTrack(){
    if(player.pl===null) return;
    var songs = playlists[player.pl].songs;
    var ni = (player.i+1) % songs.length;
    playTrack(player.pl, ni);
  }
  function prevTrack(){
    if(player.pl===null) return;
    var songs = playlists[player.pl].songs;
    var pi = (player.i-1+songs.length) % songs.length;
    playTrack(player.pl, pi);
  }
  document.getElementById('np-play').addEventListener('click', togglePlayPause);
  document.getElementById('np-next').addEventListener('click', nextTrack);
  document.getElementById('np-prev').addEventListener('click', prevTrack);
  document.getElementById('np-track').addEventListener('click', function(e){
    if(player.pl===null) return;
    var rect = this.getBoundingClientRect();
    var pct = (e.clientX-rect.left)/rect.width;
    player.elapsed = Math.round(player.total*pct);
    updateProgressUI();
  });

  var termLog = document.getElementById('term-log'); var termInput = document.getElementById('term-input');
  var termCommands = {
    help:"Available commands:\n  about, projects, skills, experience, contact, resume, whoami, open <app>, neofetch, date, clear",
    about:"Vikas Aggarwal — Information Technology undergraduate at MSIT, New Delhi.\nThis whole desktop is his portfolio.",
    projects:"1) Netflix Clone — HTML5 / CSS3 / Flexbox+Grid\n2) DB-Demo-App — Express.js / MongoDB / Kubernetes\n   github.com/vikasaggar7792/db-demo-app",
    skills:"HTML, CSS, JavaScript, Java, React.js, Node.js, MongoDB, Git, GitHub, Docker, Jenkins, Kubernetes, AWS.",
    experience:"Full-Stack Web Development Intern @ Prodigy InfoTech (Jun-Jul 2025)\nVolunteer & community member, Avensis.",
    contact:"aggarwalvikas294@gmail.com\n+91 8882546726\ngithub.com/vikasaggar7792\nlinkedin.com/in/vikas-aggarwal-1119282b4",
    resume:"Opening Resume.pdf…",
    whoami:"vikasaggarw7792",
    neofetch:"vikasaggarw7792@Vikas-MacBook-Air\n-------------------------\nOS: VikasOS (portfolio edition)\nRole: IT Undergraduate\nStack: React, Node.js, MongoDB\nUptime: still learning, always shipping",
    date:function(){ return new Date().toString(); }
  };
  function printLine(text){ var row=document.createElement('div'); row.className='term-out'; row.textContent=text; termLog.insertBefore(row, termLog.lastElementChild); termLog.scrollTop=termLog.scrollHeight; }
  function printCmd(text){ var row=document.createElement('div'); row.className='term-out'; row.innerHTML='<span class="p1">vikasaggarw7792@Vikas-MacBook-Air</span>:<span class="p2">~%</span> '+escapeHtml(text); termLog.insertBefore(row, termLog.lastElementChild); }
  function escapeHtml(s){ var d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
  function handleTermKeydown(e){
    if(e.key!=='Enter') return;
    var raw = termInput.value.trim(); if(!raw) return;
    printCmd(raw);
    var cmd = raw.toLowerCase();
    if(cmd==='clear'){
      termLog.innerHTML = '<div class="term-row"><span class="p1">vikasaggarw7792@Vikas-MacBook-Air</span><span>:</span><span class="p2">~%</span><input type="text" id="term-input" autocomplete="off" spellcheck="false"></div>';
      termInput = document.getElementById('term-input'); termInput.addEventListener('keydown', handleTermKeydown); termInput.focus(); return;
    }
    if(cmd.indexOf('open ')===0){
      var app = cmd.replace('open ','').trim();
      var validApps = ['finder','notes','chatgpt','x','linkedin','messages','photos','photobooth','music','settings','weather','preview','trash'];
      if(validApps.indexOf(app)>-1){ printLine('opening '+app+'…'); toggleMin(app); bringToFront(app); }
      else printLine('no such app: '+app);
      termInput.value=''; return;
    }
    if(cmd==='resume'){ printLine(termCommands.resume); openWindow('preview'); bringToFront('preview'); termInput.value=''; return; }
    var out = termCommands[cmd];
    if(typeof out==='function') out=out();
    if(out===undefined) out='zsh: command not found: '+raw+' (type "help")';
    printLine(out); termInput.value='';
  }
  termInput.addEventListener('keydown', handleTermKeydown);
  document.getElementById('win-terminal').addEventListener('mousedown', function(){ setTimeout(function(){ termInput.focus(); },10); });

  var settingsPanes = {
    skills: '<h2>Skills</h2>'+
      '<div class="setting-row"><span class="label">JavaScript</span><div class="bar-track"><div class="bar-fill" style="width:55%;"></div></div></div>'+
      '<div class="setting-row"><span class="label">React.js</span><div class="bar-track"><div class="bar-fill" style="width:45%;"></div></div></div>'+
      '<div class="setting-row"><span class="label">Node.js / Express</span><div class="bar-track"><div class="bar-fill" style="width:45%;"></div></div></div>'+
      '<div class="setting-row"><span class="label">MongoDB</span><div class="bar-track"><div class="bar-fill" style="width:50%;"></div></div></div>'+
      '<div class="setting-row"><span class="label">Docker / Kubernetes</span><div class="bar-track"><div class="bar-fill" style="width:40%;"></div></div></div>'+
      '<div class="setting-row"><span class="label">Git / GitHub</span><div class="bar-track"><div class="bar-fill" style="width:55%;"></div></div></div>'+
      '<p style="font-size:11.5px;color:var(--text-faint);margin-top:12px;">— early-career levels, growing fast.</p>',
    wifi: '<h2>Wi-Fi</h2><div class="setting-row"><span class="label">Wi-Fi</span><div class="toggle-pill on" id="set-wifi-toggle"><div class="dot"></div></div></div><p style="font-size:12.5px;color:var(--text-dim);margin-top:10px;">Connected to Vikas\'s Home</p>',
    bt: '<h2>Bluetooth</h2><div class="setting-row"><span class="label">Bluetooth</span><div class="toggle-pill on" id="set-bt-toggle"><div class="dot"></div></div></div>',
    sound: '<h2>Sound</h2><div class="setting-row"><span class="label">Output Volume</span><div class="bar-track"><div class="bar-fill" style="width:55%;"></div></div></div>',
    about: '<h2>About This Mac</h2>'+
      '<div class="about-row"><span>Name</span><b>Vikas Aggarwal</b></div>'+
      '<div class="about-row"><span>Model</span><b>Developer, Class of 2027</b></div>'+
      '<div class="about-row"><span>Chip</span><b>Problem-Solver X1</b></div>'+
      '<div class="about-row"><span>Memory</span><b>Unlimited Curiosity</b></div>'+
      '<div class="about-row"><span>Stack</span><b>React · Node · MongoDB</b></div>'+
      '<div class="about-row"><span>College</span><b>MSIT, New Delhi</b></div>'
  };
  function selectSettingsPane(key){
    document.getElementById('settings-pane').innerHTML = settingsPanes[key];
    document.querySelectorAll('#win-settings .ss-item').forEach(function(it){ it.classList.toggle('active', it.dataset.spane===key); });
  }
  document.querySelectorAll('#win-settings .ss-item').forEach(function(it){ it.addEventListener('click', function(){ selectSettingsPane(it.dataset.spane); }); });
  document.addEventListener('click', function(e){
    if(e.target.id==='set-wifi-toggle' || e.target.id==='set-bt-toggle') e.target.classList.toggle('on');
  });

  var cities = {
    delhi:{name:'New Delhi',temp:34,desc:'Haze',hi:38,lo:29,hourly:[34,35,35,34,33,33,32,31]},
    blr:{name:'Bengaluru',temp:24,desc:'Partly Cloudy',hi:28,lo:20,hourly:[24,24,25,25,24,23,22,21]},
    sf:{name:'San Francisco',temp:14,desc:'Clear',hi:21,lo:11,hourly:[14,15,16,17,16,15,14,13]},
    sg:{name:'Singapore',temp:28,desc:'Rain',hi:31,lo:26,hourly:[28,28,29,29,28,27,27,26]},
    ny:{name:'New York',temp:27,desc:'Sunny',hi:30,lo:22,hourly:[27,28,29,29,28,27,26,25]},
    ldn:{name:'London',temp:18,desc:'Cloudy',hi:21,lo:13,hourly:[18,18,19,19,18,17,16,15]}
  };
  function renderWeatherList(){
    var html='';
    Object.keys(cities).forEach(function(k){ var c=cities[k]; html += '<div class="wl-item" data-city="'+k+'"><div class="wl-city">'+c.name+'<span>'+c.temp+'°</span></div><div class="wl-sub">'+c.desc+' · H:'+c.hi+'° L:'+c.lo+'°</div></div>'; });
    document.getElementById('weather-list').innerHTML = html;
    document.querySelectorAll('#weather-list .wl-item').forEach(function(it){ it.addEventListener('click', function(){ selectCity(it.dataset.city); }); });
  }
  function selectCity(key){
    var c = cities[key];
    document.querySelectorAll('#weather-list .wl-item').forEach(function(it){ it.classList.toggle('active', it.dataset.city===key); });
    var hourlyHtml = c.hourly.map(function(t,i){ return '<div class="wh-item">'+(i===0?'Now':(i+12)+'PM')+'<br>☀️<br>'+t+'°</div>'; }).join('');
    document.getElementById('weather-main').innerHTML =
      '<div class="wm-city">'+c.name+'</div><div class="wm-temp">'+c.temp+'°</div><div class="wm-desc">☀️ '+c.desc+' &nbsp; H:'+c.hi+'° L:'+c.lo+'°</div>'+
      '<div class="wm-hourly">'+hourlyHtml+'</div>'+
      '<div class="wm-6day"><div class="wd-row"><span>Today</span><span>☀️</span><span>'+c.lo+'° — '+c.hi+'°</span></div><div class="wd-row"><span>Tomorrow</span><span>⛅</span><span>'+(c.lo+1)+'° — '+(c.hi+1)+'°</span></div><div class="wd-row"><span>Day after</span><span>🌤️</span><span>'+(c.lo-1)+'° — '+(c.hi-1)+'°</span></div></div>';
  }
  renderWeatherList();

  var binItems = [
    {n:'old-resume-v1.pdf', ic:'PDF'},
    {n:'overthinking.txt', ic:'TXT'},
    {n:'unfinished-side-project', ic:'DIR'}
  ];
  function renderBin(){
    var html = binItems.map(function(b){ return '<div class="bin-item"><div class="bi-ic">'+b.ic+'</div><div class="bi-name">'+b.n+'</div></div>'; }).join('');
    document.getElementById('bin-list').innerHTML = html || '<div class="bin-empty-msg">This folder is empty.</div>';
    document.getElementById('bin-footer').textContent = binItems.length+' items';
  }
  renderBin();
  document.getElementById('bin-empty-btn').addEventListener('click', function(){
    binItems = []; renderBin();
  });

  var appleBtn=document.getElementById('apple-btn'), appleDD=document.getElementById('apple-dropdown');
  var wifiBtn=document.getElementById('wifi-btn'), wifiDD=document.getElementById('wifi-dropdown');
  var ccBtn=document.getElementById('cc-btn'), ccPanel=document.getElementById('cc-panel');
  var clockEl=document.getElementById('mb-clock'), notifPanel=document.getElementById('notif-panel');
  var battBtn=document.getElementById('batt-btn'), battPanel=document.getElementById('batt-panel');
  var weatherBtn=document.getElementById('weather-btn');

  function closeAll(){ [appleDD,wifiDD,ccPanel,notifPanel,battPanel].forEach(function(p){p.classList.remove('open');}); appleBtn.classList.remove('open'); }
  function toggle(el, evt){ evt.stopPropagation(); var willOpen=!el.classList.contains('open'); closeAll(); if(willOpen) el.classList.add('open'); }

  appleBtn.addEventListener('click', function(e){ toggle(appleDD,e); appleBtn.classList.toggle('open', appleDD.classList.contains('open')); });
  wifiBtn.addEventListener('click', function(e){ toggle(wifiDD,e); });
  ccBtn.addEventListener('click', function(e){ toggle(ccPanel,e); });
  battBtn.addEventListener('click', function(e){ toggle(battPanel,e); });
  clockEl.addEventListener('click', function(e){ toggle(notifPanel,e); });
  weatherBtn.addEventListener('click', function(){ closeAll(); toggleMin('weather'); bringToFront('weather'); });
  document.addEventListener('click', closeAll);
  ccPanel.addEventListener('click', function(e){ e.stopPropagation(); });
  document.getElementById('cc-wifi').addEventListener('click', function(){ this.classList.toggle('on'); });
  document.getElementById('cc-bt').addEventListener('click', function(){ this.classList.toggle('on'); });
  document.getElementById('notif-weather').addEventListener('click', function(){ closeAll(); toggleMin('weather'); bringToFront('weather'); });
  document.getElementById('notif-messages').addEventListener('click', function(){ closeAll(); toggleMin('messages'); bringToFront('messages'); });

  (function(){
    var d=new Date(); var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('notif-date-txt').textContent = days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate();
  })();

  document.querySelectorAll('#apple-dropdown [data-sys]').forEach(function(it){
    it.addEventListener('click', function(){
      closeAll();
      var action = it.dataset.sys;
      if(action==='settingsapp' || action==='about'){ toggleMin('settings'); bringToFront('settings'); return; }
      runSystemAction(action);
    });
  });

  var overlay=document.getElementById('sys-overlay'), sysContent=document.getElementById('sys-content');
  function runSystemAction(action){
    if(action==='sleep'){
      sysContent.innerHTML='<div class="wake-text">Click anywhere to wake</div>';
      overlay.classList.add('show');
      overlay.onclick=function(){ overlay.classList.remove('show'); overlay.onclick=null; };
      return;
    }
    if(action==='shutdown'){
      sysContent.innerHTML=''; overlay.classList.add('show');
      setTimeout(function(){
        sysContent.innerHTML='<div class="wake-text">Click anywhere to turn back on</div>';
        overlay.onclick=function(){
          overlay.classList.remove('show'); overlay.onclick=null;
          document.getElementById('boot').classList.remove('hidden');
          setTimeout(function(){ document.getElementById('boot').classList.add('hidden'); },1400);
        };
      },1200);
      return;
    }
    if(action==='restart'){
      sysContent.innerHTML='<div class="spinner"></div><div class="wake-text">Restarting…</div>';
      overlay.classList.add('show');
      setTimeout(function(){
        overlay.classList.remove('show');
        document.getElementById('boot').classList.remove('hidden');
        setTimeout(function(){ document.getElementById('boot').classList.add('hidden'); },1400);
      },2200);
      return;
    }
    if(action==='lock' || action==='logout'){
      sysContent.innerHTML='<div class="login-avatar" id="login-avatar" style="background-image:url('+VIKAS_PHOTO+')"></div><div class="login-name">Vikas Aggarwal</div><div class="login-hint">Click your avatar to log back in</div>';
      overlay.classList.add('show');
      setTimeout(function(){ var av=document.getElementById('login-avatar'); if(av) av.addEventListener('click', function(){ overlay.classList.remove('show'); }); },50);
      return;
    }
  }
})();