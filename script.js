(function(){
  const track = document.getElementById('swipeTrack');
  const swipeArea = document.getElementById('swipeArea');
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));

  let startX = 0, deltaX = 0, dragging = false, index = 0;
  const maxIndex = 2;

  function setIndex(i, animate=true){
    index = Math.max(0, Math.min(maxIndex, i));
    if(!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 260ms cubic-bezier(.2,.9,.3,1)';
    track.style.transform = `translateX(${ -index * 100 }%)`;
    tabs.forEach(t => t.classList.remove('active'));
    tabs[index].classList.add('active');
    if(!animate) requestAnimationFrame(()=> track.style.transition = '');
  }

  function start(clientX){
    dragging = true;
    startX = clientX;
    deltaX = 0;
    track.style.transition = 'none';
  }
  function move(clientX){
    if(!dragging) return;
    deltaX = clientX - startX;
    const pct = (deltaX / swipeArea.clientWidth) * 100;
    const base = -index * 100;
    const translate = base + pct;
    track.style.transform = `translateX(${translate}%)`;
  }
  function end(){
    if(!dragging) return;
    dragging = false;
    const threshold = swipeArea.clientWidth * 0.18;
    if(deltaX < -threshold) setIndex(index + 1);
    else if(deltaX > threshold) setIndex(index - 1);
    else setIndex(index);
    deltaX = 0;
  }

  // touch events
  swipeArea.addEventListener('touchstart', e=> start(e.touches[0].clientX), {passive:true});
  swipeArea.addEventListener('touchmove', e=> move(e.touches[0].clientX), {passive:true});
  swipeArea.addEventListener('touchend', end);

  // mouse events for desktop testing
  swipeArea.addEventListener('mousedown', e=> start(e.clientX));
  window.addEventListener('mousemove', e=> move(e.clientX));
  window.addEventListener('mouseup', end);

  // tab clicks
  tabs.forEach(t => t.addEventListener('click', ()=> setIndex(Number(t.dataset.index))));

  // init
  setIndex(0, false);
})();
