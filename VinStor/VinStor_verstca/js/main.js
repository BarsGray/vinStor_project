// ===================================== filter =====================================
  const multiSelectList = document.querySelectorAll('.multi_select_input');

  document.querySelectorAll('.multi_select_elem').forEach(selectElem => {

    let selected = [];
    
    selectElem.addEventListener('click', (e) => {
      const input = e.target.closest('.multi_select_input');

      if (input) {
        const isActive = input.classList.contains('active');
        closeMultiSelectList();
        e.target.classList.toggle('active', !isActive);
        return;
      }

      const option = e.target.closest('.multi_select_option');

      if (option) {
        e.target.classList.toggle('active');
        
        const value = option.dataset.value;
        const inputNow = e.target.closest('.multi_select_elem').querySelector('input[type="hidden"]');
        
        if (option.classList.contains('active'))
          if (!selected.includes(value)) selected.push(value);
        else
          selected = selected.filter(i => i !== value);

        console.log(selected);
        inputNow.value = selected.join(',');
      }
    });

  });
  

  document.addEventListener('click', (e) => {if (!e.target.closest('.multi_select_elem')) closeMultiSelectList();});
  
  function closeMultiSelectList() {
    multiSelectList.forEach((e) => {e.classList.remove('active');});
  }
// ===================================== Swiper =====================================
  const bunner_slider = new Swiper('.bunner_slider', {
    loop:true,
    slidesPerView: 1,
    pagination: {
      el: ".bunner_pagination",
      clickable: true,
    },
    // autoplay: {
    //   delay: 3000, // Интервал 3 секунды
    //   // disableOnInteraction: false, // Не останавливать после взаимодействия
    //   // pauseOnMouseEnter: true // Пауза при наведении
    // },
  });