(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 760;
  
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  function splitText(el){
    if(!el || el.dataset.splitDone) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if(!node.nodeValue.trim()) return;
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(part => {
        if(part.match(/\s+/)){
          frag.appendChild(document.createTextNode(part));
        }else{
          const span = document.createElement('span');
          span.className = 'w';
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.dataset.splitDone = '1';
  }
  
  document.querySelectorAll('.split').forEach(splitText);
  
  // sq-field generator
  document.querySelectorAll('.sq-field').forEach(field => {
    const count = parseInt(field.getAttribute('data-count') || '16');
    for(let i=0; i<count; i++){
      const sq = document.createElement('div');
      sq.className = 'grid-sq';
      const col = Math.floor(Math.random()*30);
      const row = Math.floor(Math.random()*6);
      sq.style.width = '46px';
      sq.style.height = '46px';
      sq.style.left = (col*48 - 10) + 'px';
      sq.style.top = (row*48 + 6) + 'px';
      field.appendChild(sq);
      if(!reduce && typeof gsap !== 'undefined'){
        gsap.set(sq, {opacity:0});
        gsap.to(sq, {opacity:1, duration:1.2, yoyo:true, repeat:-1, ease:'sine.inOut', delay:Math.random()*4, repeatDelay:Math.random()*3});
      }
    }
  });
  
  // hero glass
  const heroGlass = document.getElementById('heroGlass');
  if(heroGlass){
    const glassPositions = [
      [3,64],[3,71],[6.5,71],[10,71],[3,78],[-1,70],[45.5,76],[49,80],[49,76],[52.5,76],[86,58],[86,67],[82,76],[89.5,76],[86,84]
    ];
    glassPositions.forEach((pos, idx) => {
      const g = document.createElement('div');
      g.className = 'glass';
      const x = pos[0], y = pos[1];
      const size = (x>40 && x<60) ? 'clamp(28px,3.4vw,44px)' : 'clamp(36px,5.4vw,74px)';
      g.style.left = x + '%';
      g.style.top = y + '%';
      g.style.width = size;
      if(isMobile && idx % 2 === 1) g.style.display = 'none';
      heroGlass.appendChild(g);
      if(!reduce && typeof gsap !== 'undefined'){
        gsap.set(g, {opacity:0, scale:.6});
      }
    });
  }
  
  // petals
  const petals = document.getElementById('petals');
  if(petals && !reduce){
    for(let i=0; i<18; i++){
      const p = document.createElement('span');
      p.className = 'petal';
      p.style.left = Math.random()*100 + '%';
      p.style.setProperty('--dx', (Math.random()*160 - 80) + 'px');
      p.style.animationDuration = (9 + Math.random()*9) + 's';
      p.style.animationDelay = (-Math.random()*15) + 's';
      p.style.transform = 'scale(' + (0.6 + Math.random()*0.8) + ')';
      petals.appendChild(p);
    }
  }
  
  if(reduce){
    document.body.classList.remove('intro');
    const bd = document.querySelector('.backdrop');
    if(bd) bd.remove();
    if(typeof gsap !== 'undefined'){
      gsap.set('#app', {clearProps:'all'});
    }
    document.querySelectorAll('.w').forEach(w => {
      w.style.opacity = '1';
      w.style.transform = 'none';
      w.style.filter = 'none';
    });
    document.querySelectorAll('.nav').forEach(n => { n.style.opacity='1'; n.style.transform='translateX(-50%)'; });
    return;
  }
  
  // Lenis
  let lenis = null;
  if(typeof Lenis !== 'undefined'){
    lenis = new Lenis({duration:1.25, easing:function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel:true});
    lenis.on('scroll', function(){ if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.update(); });
    if(typeof gsap !== 'undefined'){
      gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        if(href === '#') return;
        e.preventDefault();
        lenis.scrollTo(href, {duration:1.6});
      });
    });
  }
  
  if(lenis) lenis.stop();
  
  const heroWords = document.querySelectorAll('#heroTitle .w');
  if(typeof gsap !== 'undefined'){
    gsap.set(heroWords, {opacity:0, y:24, filter:'blur(10px)'});
    gsap.set('.nav', {opacity:0, y:-16});
    gsap.set('.cloud-l', {x:-120, opacity:0});
    gsap.set('.cloud-r', {x:120, opacity:0});
    
    const introTl = gsap.timeline({delay:.25, onComplete: function(){
      document.body.classList.remove('intro');
      gsap.set('#app', {clearProps:'all'});
      var backdrop = document.querySelector('.backdrop');
      if(backdrop) backdrop.remove();
      if(lenis) lenis.start();
      setupScroll();
    }});
    introTl.to('#app', {scale:1, borderRadius:0, duration:1.4, ease:'expo.inOut'})
           .to('.nav', {opacity:1, y:0, duration:.8, ease:'power3.out'}, '-=.5')
           .to(heroWords, {opacity:1, y:0, filter:'blur(0px)', duration:1, stagger:.07, ease:'power3.out'}, '-=.7')
           .to('.cloud-l', {x:0, opacity:1, duration:1.6, ease:'power3.out'}, .4)
           .to('.cloud-r', {x:0, opacity:1, duration:1.6, ease:'power3.out'}, .4);
    introTl.to('#heroGlass .glass', {opacity:.15, duration:.6, stagger:{each:.05, from:'random'}, ease:'back.out(2)'}, '-=1');
  }
  
  function setupScroll(){
    if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.to('#heroTitle', {yPercent:-60, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});
    document.querySelectorAll('.hero [data-par]').forEach(function(el){
      var par = parseFloat(el.getAttribute('data-par') || '0');
      gsap.to(el, {y:par*2, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});
    });
    gsap.to('.hero-media', {yPercent:8, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});
    
    gsap.utils.toArray('.reveal').forEach(function(el){
      gsap.from(el, {opacity:0, y:16, duration:.8, ease:'power3.out', scrollTrigger:{trigger:el, start:'top 85%'}});
    });
    
    document.querySelectorAll('.stats .split .w, .loop .split .w, .cta .split .w').forEach(function(w, i){
      gsap.from(w, {opacity:0, y:22, filter:'blur(8px)', duration:.9, delay:(i%6)*.06, ease:'power3.out', scrollTrigger:{trigger:w.closest('.split'), start:'top 80%'}});
    });
    
    function setCounters(p){
      document.querySelectorAll('.card[data-to]').forEach(function(card){
        var to = parseFloat(card.getAttribute('data-to') || '0');
        var dec = parseInt(card.getAttribute('data-dec') || '0');
        var suf = card.getAttribute('data-suf') || '';
        var b = card.querySelector('b');
        if(!b) return;
        var val = to * p;
        b.textContent = val.toFixed(dec) + suf;
      });
    }
    setCounters(0);
    
    ScrollTrigger.matchMedia({
      "(min-width:901px)": function(){
        gsap.from('.card', {y:40, opacity:0, stagger:.08, duration:.8, ease:'power3.out', scrollTrigger:{trigger:'.cards', start:'top 70%'}});
        var st = gsap.timeline({scrollTrigger:{trigger:'#stats', start:'top top', end:'+=120%', pin:true, scrub:1}});
        var proxy = {p:0};
        st.to(proxy, {p:1, ease:'none', onUpdate:function(){ setCounters(proxy.p); }}, 0)
          .to('#tree', {yPercent:6, ease:'none'}, 0);
        gsap.set('#tree', {yPercent:75});
      },
      "(max-width:900px)": function(){
        gsap.from('.card', {y:30, opacity:0, stagger:.08, duration:.8, ease:'power3.out', scrollTrigger:{trigger:'.cards', start:'top 85%'}});
        ScrollTrigger.create({trigger:'.cards', start:'top 80%', onEnter:function(){
          gsap.to({p:0}, {p:1, duration:2, ease:'power2.out', onUpdate:function(){ setCounters(this.targets()[0].p); }});
        }, once:true});
        gsap.to('#tree', {yPercent:0, ease:'none', scrollTrigger:{trigger:'#stats', start:'top bottom', end:'bottom top', scrub:true}});
        gsap.set('#tree', {yPercent:40});
      },
      "(min-width:761px)": function(){
        var panels = document.querySelectorAll('.panel');
        panels.forEach(function(panel){
          var activate = function(){
            panels.forEach(function(p){ p.classList.remove('is-active'); });
            panel.classList.add('is-active');
          };
          panel.addEventListener('mouseenter', activate);
          panel.addEventListener('focus', activate);
          panel.addEventListener('click', activate);
        });
        gsap.from('.panel-in', {y:120, opacity:0, stagger:.12, duration:1.1, ease:'power3.out', scrollTrigger:{trigger:'#loop', start:'top 60%'}});
        gsap.to('.loop-cloud', {x:60, ease:'none', scrollTrigger:{trigger:'#loop', start:'top bottom', end:'bottom top', scrub:true}});
      },
      "(max-width:760px)": function(){
        document.querySelectorAll('.panel .num, .panel .step').forEach(function(el){
          gsap.from(el, {y:40, opacity:0, duration:.9, ease:'power3.out', scrollTrigger:{trigger:el.closest('.panel'), start:'top 85%'}});
        });
      }
    });
    
    gsap.to('#ctaImg', {yPercent:0, ease:'none', scrollTrigger:{trigger:'#cta', start:'top bottom', end:'bottom bottom', scrub:true}});
    gsap.set('#ctaImg', {yPercent:-12});
    gsap.from('#ctaCard', {y:80, scale:.94, opacity:0, filter:'blur(10px)', duration:1.2, ease:'power3.out', scrollTrigger:{trigger:'#cta', start:'top 60%'}});
    
    var footerTl = gsap.timeline({scrollTrigger:{trigger:'#footer', start:'top 92%'}});
    footerTl.to('.fdot', {y:-8, duration:.25, stagger:.08, yoyo:true, repeat:3, ease:'sine.inOut'})
            .to('.fdot', {attr:{cx:27, cy:50}, duration:.45, stagger:.05, ease:'power3.inOut'})
            .to('.fdot:nth-child(3), .fdot:nth-child(4)', {opacity:0, duration:.1})
            .to('#fMark', {strokeDashoffset:0, duration:.6, ease:'power3.out'}, '-=.05')
            .to('.fdot:nth-child(2)', {attr:{r:5.5}, duration:.3, ease:'back.out(3)'}, '<')
            .to('#fRing', {strokeDashoffset:0, duration:.9, ease:'power2.inOut'}, '-=.3');
    
    ScrollTrigger.refresh();
  }
  
  window.addEventListener('load', function(){ if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
})();

(function(){
  var els=document.querySelectorAll('.impact-card b[data-to]'); if(!els.length) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(el,v){ el.textContent=(el.getAttribute('data-pre')||'')+Math.round(v).toLocaleString('en-IN'); }
  function run(el){ var to=parseFloat(el.getAttribute('data-to'))||0; if(reduce||to===0){fmt(el,to);return;} var t0=null;
    function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/1500,1); fmt(el,to*(1-Math.pow(1-p,3))); if(p<1)requestAnimationFrame(step); } requestAnimationFrame(step); }
  if(!('IntersectionObserver' in window)){ els.forEach(run); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } }); },{threshold:.4});
  els.forEach(function(el){ io.observe(el); });
})();
