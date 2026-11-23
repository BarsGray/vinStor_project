document.querySelectorAll('.wheel').forEach(wheel => {

  const wheelList = wheel.querySelector('.wheel-list');
  const wheelItem = wheel.querySelector('.wheel-item');

  const heightItem = wheelItem.scrollHeight;
  const height     = wheelList.scrollHeight;

  let position      = heightItem * 2;
  let isDragging    = false;
  let startY        = 0;
  let startPosition = 0;

  let selectedIndex = 0;

  function render() {
    if ((heightItem * 2) <= position) position = heightItem * 2;
    else if ((height - heightItem * 3) * -1 >= position) position = (height - heightItem * 3) * -1;

    wheelList.style.transform = `translateY(${position}px)`;

    selectedIndex = Math.round((heightItem * 2 - position) / heightItem);
  }
  
  wheel.addEventListener('pointerdown', (e) => {
    isDragging    = true;
    startY        = e.clientY;
    startPosition = position;

    wheelList.style.transition = 'unset';
    // Закрепляем указатель за колесом
    wheel.setPointerCapture(e.pointerId);
  });

  wheel.addEventListener('pointermove', (e) => {
    if (!isDragging) return
    
    const distance = e.clientY - startY;
    position = startPosition + distance

    render();
  });


  // Завершение перетаскивания
  function stopDragging() {
    if (!isDragging) return;
    isDragging = false;

    position = heightItem * 2 - selectedIndex * heightItem;
    wheelList.style.transition = 'transform .3s ease-out';

    render();
  }

  wheel.addEventListener('pointerup', stopDragging);
  wheel.addEventListener('pointercancel', stopDragging);

  render();
});