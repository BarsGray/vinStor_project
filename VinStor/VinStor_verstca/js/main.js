// ===================================== filter =====================================
  const filetrOnMain = document.querySelector('.filetr_on_main');
  const multiSelectList = document.querySelectorAll('.multi_select_input');

  document.querySelectorAll('.multi_select_elem').forEach(selectElem => {

    selectElem.addEventListener('click', (e) => {
      if (e.target.closest('.multi_select_input') && !e.target.closest('.active')) {
        closeMultiSelectList();
        e.target.classList.toggle('active');
      } else if(e.target.closest('.multi_select_input') && !e.target.closest('.multi_select_list_wrap')) {
        closeMultiSelectList();
      }
    });

  });
  
  // filetrOnMain.addEventListener('click', (e) => {
  //   if (e.target.closest('.multi_select_input') && !e.target.closest('.active')) {
  //     closeMultiSelectList();
  //     e.target.classList.toggle('active');
  //   } else if(e.target.closest('.multi_select_input') && !e.target.closest('.multi_select_list_wrap')) {
  //     closeMultiSelectList();
  //   }
  // });

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