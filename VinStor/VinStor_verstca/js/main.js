// ===================================== filter =====================================
  const filetrOnMain = document.querySelector('.filetr_on_main');
  const multiSelectList = document.querySelectorAll('.multi_select_input');

  document.querySelectorAll('.multi_select_elem').forEach(selectElem => {

    let selected = [];
    
    selectElem.addEventListener('click', (e) => {
      
      if (e.target.closest('.multi_select_input') && !e.target.closest('.active')) {
        closeMultiSelectList();
        e.target.classList.toggle('active');
      } else if (e.target.closest('.multi_select_input') && !e.target.closest('.multi_select_list_wrap')) {
        closeMultiSelectList();
      }

      if (e.target.closest('.multi_select_option')) {
        e.target.classList.toggle('active');
        
        const inputNow = e.target.closest('.multi_select_elem').querySelector('input[type="hidden"]');
        if (e.target.closest('.active')) {
          if (!selected.includes(e.target.getAttribute('data-value'))) selected.push(e.target.getAttribute('data-value'));
        } else {
          selected = selected.filter(i => i !== e.target.dataset.value);
        }
        console.log(selected);
        inputNow.setAttribute('value', selected.join(','));
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