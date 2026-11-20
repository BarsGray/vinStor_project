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