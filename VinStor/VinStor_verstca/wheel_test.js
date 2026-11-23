document.querySelectorAll('.wheel').forEach(wheel => {

  const wheelList  = wheel.querySelector('.wheel-list');
  const wheelItem  = wheel.querySelector('.wheel-item');
  const wheelInput = wheel.querySelector('input[type="text"]');


  const heightItem = wheelItem.scrollHeight;
  const height     = wheelList.scrollHeight;

  let position      = heightItem * 2;
  let isDragging    = false;
  let startY        = 0;
  let startPosition = 0;

  let lastY         = 0;
  let lastTime      = 0;
  let velocity      = 0;
  let lastFrameTime = 0;
  let animationId   = null;

  let selectedIndex = 0;

  function render() {
    if ((heightItem * 2) <= position) position = heightItem * 2;
    else if ((height - heightItem * 3) * -1 >= position) position = (height - heightItem * 3) * -1;

    wheelList.style.transform = `translateY(${position}px)`;

    selectedIndex = Math.round((heightItem * 2 - position) / heightItem);
    
    inputSet()
  }
  
  wheel.addEventListener('pointerdown', (e) => {    
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (isDragging) return;

    isDragging    = true;
    startY        = e.clientY;
    startPosition = position;

    lastY    = e.clientY;
    lastTime = performance.now();
    velocity = 0;

    wheelList.style.transition = 'unset';
    // Закрепляем указатель за колесом
    wheel.setPointerCapture(e.pointerId);
  });

  wheel.addEventListener('pointermove', (e) => {
    if (!isDragging) return
    
    const distance = e.clientY - startY;
    position = startPosition + distance;

    const now       = performance.now();
    const deltaY    = e.clientY - lastY;
    const deltaTime = now - lastTime;

    if (deltaTime > 0) velocity = deltaY / deltaTime;

    lastY    = e.clientY;
    lastTime = now;

    render();
  });

  function inertia(time) {
    const deltaTime = time - lastFrameTime;
    lastFrameTime = time;

    position = position + velocity * deltaTime;
    velocity = velocity * Math.pow(0.95, deltaTime / 16);

    render();

    if ((heightItem * 2) <= position) velocity = 0;
    else if ((height - heightItem * 3) * -1 >= position) velocity = 0;

    if (Math.abs(velocity) > 0.02) {
      animationId = requestAnimationFrame(inertia);
    } else {
      animationId = null;
      stopAtNearest();
    }
  }

  function stopAtNearest() {
    position = heightItem * 2 - selectedIndex * heightItem;
    wheelList.style.transition = 'transform .3s ease-out';
    render();
  }

  // Завершение перетаскивания
  function stopDragging() {
    if (!isDragging) return;
    isDragging = false;

    lastFrameTime = performance.now();
    animationId   = requestAnimationFrame(inertia);
  }

  wheel.addEventListener('pointerup', stopDragging);
  wheel.addEventListener('pointercancel', stopDragging);

  function inputSet() {
    console.log(wheelList.children[selectedIndex].textContent);
    wheelInput.value = wheelList.children[selectedIndex].textContent;
  }

  render();
});