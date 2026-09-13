/* Luxury invitation interactions */
const $ = (s) => document.querySelector(s);
const enter = $('#enter'), welcome = $('#welcome'), experience = $('#experience'), audio = $('#audio'), sound = $('#sound');
const introVideo=$('#introVideo');
const introVideoSource=$('#introVideoSource');
const heroVideo=$('#heroVideo');

function playHero(reset=false){
  if(!heroVideo) return;
  heroVideo.playbackRate=1;
  if(reset) heroVideo.currentTime=0;
  if(!document.hidden) heroVideo.play().catch(()=>heroVideo.classList.add('has-error'));
}

if(heroVideo){
  heroVideo.addEventListener('canplay',()=>heroVideo.classList.add('is-ready'),{once:true});
  heroVideo.addEventListener('error',()=>heroVideo.classList.add('has-error'),{once:true});
}

function showEntryButton(videoMissing=false){
  if(!welcome || welcome.classList.contains('intro-ready')) return;
  if(videoMissing) welcome.classList.add('video-missing');
  welcome.classList.add('intro-ready');
}

if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  showEntryButton();
}else if(introVideo){
  introVideo.addEventListener('ended',()=>showEntryButton(),{once:true});
  introVideo.addEventListener('error',()=>showEntryButton(true),{once:true});
  introVideoSource?.addEventListener('error',()=>showEntryButton(true),{once:true});
  introVideo.play().catch(()=>showEntryButton(true));
  setTimeout(()=>{if(introVideo.error || introVideo.networkState===HTMLMediaElement.NETWORK_NO_SOURCE) showEntryButton(true)},500);
}else{
  showEntryButton(true);
}

function revealExperience(){
  if(!welcome.classList.contains('intro-ready') || welcome.classList.contains('carousel-active')) return;
  welcome.classList.add('carousel-active');
  experience.setAttribute('aria-hidden','false');
  const finishOpening=()=>{document.body.classList.remove('welcome-active');welcome.remove()};
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(heroVideo&&!reducedMotion){
    playHero(true);
  }
  if(reducedMotion){
    welcome.animate([{opacity:1},{opacity:0}],{duration:220,fill:'forwards'});
    setTimeout(finishOpening,230);
  }else if(window.gsap){
    const carousel=gsap.timeline();
    carousel.to('.welcome-card',{opacity:0,y:-20,scale:.96,duration:.45,ease:'power2.in'})
      .to('.panel-one',{opacity:1,x:'0%',duration:.48,ease:'power4.out'},.12)
      .to('.panel-one',{x:'105%',scale:1.02,duration:.55,ease:'power3.inOut'},.62)
      .to('.panel-two',{opacity:1,x:'0%',duration:.52,ease:'power4.out'},.58)
      .to('.panel-two',{x:'-105%',scale:1.02,duration:.55,ease:'power3.inOut'},1.12)
      .to('.panel-three',{opacity:1,y:'0%',duration:.56,ease:'power4.out'},1.08)
      .to('.carousel-flash',{opacity:1,duration:.15,ease:'power1.in'},1.58)
      .to('.carousel-flash',{opacity:0,duration:.42,ease:'power2.out'},1.73)
      .to(welcome,{opacity:0,duration:.42,delay:.05,onComplete:finishOpening},1.7);
    gsap.from('.hero-content > *',{opacity:0,y:18,stagger:.1,duration:.8,delay:1.95,ease:'power3.out'});
  }else{
    welcome.style.opacity='0';
    setTimeout(finishOpening,700);
  }
  audio.play().then(()=>setSound(true)).catch(()=>setSound(false));
}
enter.addEventListener('click', revealExperience);
function setSound(isPlaying){sound.querySelector('i').className=isPlaying?'fa-solid fa-pause':'fa-solid fa-play';sound.setAttribute('aria-label',isPlaying?'Pausar música':'Reproducir música')}
sound.addEventListener('click',()=>{ if(audio.paused) audio.play().then(()=>setSound(true)).catch(()=>alert('Añade tu archivo de música en assets/music para activar el reproductor.')); else {audio.pause();setSound(false)} });
document.addEventListener('visibilitychange',()=>{
  if(!heroVideo||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(document.hidden){
    heroVideo.pause();
  }else if(!document.body.classList.contains('welcome-active')){
    playHero();
  }
});

const menuToggle=$('#menuToggle'), quickMenu=$('#quickMenu');
menuToggle.addEventListener('click',()=>{const open=quickMenu.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',open);menuToggle.querySelector('i').className=open?'fa-solid fa-xmark':'fa-solid fa-bars'});
quickMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{quickMenu.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.querySelector('i').className='fa-solid fa-bars'}));

const eventDate = new Date('2026-10-10T21:00:00-05:00');
function tick(){const d=Math.max(0,eventDate-new Date());const values=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];['days','hours','minutes','seconds'].forEach((id,i)=>{const el=$('#'+id),v=String(values[i]).padStart(2,'0');if(el.textContent!==v){el.textContent=v;el.animate([{transform:'translateY(-5px)',opacity:.45},{transform:'translateY(0)',opacity:1}],{duration:270})}})}tick();setInterval(tick,1000);

function typeStory(){const el=$('#typewriter'), text=el.dataset.text;if(el.dataset.done)return;el.dataset.done='1';let i=0;const timer=setInterval(()=>{el.textContent+=text[i++]||'';if(i>=text.length)clearInterval(timer)},22)}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');if(entry.target.classList.contains('story'))typeStory();observer.unobserve(entry.target)}}),{threshold:.2});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
if(window.gsap && window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);document.querySelectorAll('.reveal').forEach(el=>gsap.fromTo(el,{opacity:0,y:28,scale:.985},{opacity:1,y:0,scale:1,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'}}));if(!heroVideo)gsap.to('.hero-image',{y:'12%',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}})}

const lightbox=$('#lightbox');document.querySelectorAll('.photo').forEach(p=>p.addEventListener('click',()=>{lightbox.querySelector('img').src=p.dataset.full;lightbox.showModal()}));lightbox.querySelector('button').onclick=()=>lightbox.close();lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});$('#morePhotos').onclick=()=>document.querySelector('.photo').click();

const mirrorSlides=[...document.querySelectorAll('.mirror-slide')],mirrorDots=[...document.querySelectorAll('.mirror-dots i')];let mirrorIndex=0;
function showMirrorSlide(next){mirrorSlides.forEach((slide,index)=>{const active=index===next;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));mirrorDots[index]?.classList.toggle('is-active',active)});mirrorIndex=next}
if(mirrorSlides.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>showMirrorSlide((mirrorIndex+1)%mirrorSlides.length),6500);

const canvas=$('#sparkles'),ctx=canvas.getContext('2d');let points=[];function resize(){canvas.width=innerWidth;canvas.height=innerHeight;points=Array.from({length:innerWidth<600?28:48},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.25,v:Math.random()*.22+.05,a:Math.random()*.55+.15}))}function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);points.forEach(p=>{p.y-=p.v;if(p.y<-5){p.y=canvas.height+5;p.x=Math.random()*canvas.width}ctx.beginPath();ctx.fillStyle=`rgba(219,166,82,${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(draw)}resize();draw();addEventListener('resize',resize);
