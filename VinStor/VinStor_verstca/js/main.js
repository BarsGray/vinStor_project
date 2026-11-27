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
// ===================================== filter =====================================
const filetrOnMain = document.querySelector('.filetr_on_main');
const multiSelectList = document.querySelectorAll('.multi_select_input');

document.querySelectorAll('.multi_select_elem').forEach(selectElem => {
  let selected = [];

  selectElem.addEventListener('click', (e) => {

    const input = e.target.closest('.multi_select_input');
    if (input) {
      const isActive = input.classList.contains('active');
      closeMultiSelectList();
      input.classList.toggle('active', !isActive);
      return;
    }

    const option = e.target.closest('.multi_select_option');
    if (option) {
      option.classList.toggle('active');
      
      const inputNow = option.closest('.multi_select_elem').querySelector('input[type="hidden"]');
      if (option.classList.contains('active')) {
        if (!selected.includes(option.dataset.value)) selected.push(option.dataset.value);
      } else {
        selected = selected.filter(i => i !== option.dataset.value);
      }
      inputNow.value = selected.join(',');
    }
  });
});

document.addEventListener('click', (e) => {if (!e.target.closest('.multi_select_elem')) closeMultiSelectList();});

function closeMultiSelectList() {
  multiSelectList.forEach((e) => {e.classList.remove('active');});
}
// ===================================== carusel_avto =====================================
// const mediaQuery = window.matchMedia('(min-width: 768px)');
// let swiper;
// function handleBreakpoint(e) {
//   if (e.matches) {
//     // Desktop — создаём Swiper
//     if (!swiper) {
//       swiper = new Swiper('.swiper', {
//         slidesPerView: 3,
//         spaceBetween: 20,
//       });
//     }
//   } else {
//     // Mobile — уничтожаем Swiper
//     if (swiper) {
//       swiper.destroy(true, true);
//       swiper = null;
//     }
//   }
// }
// mediaQuery.addEventListener('change', handleBreakpoint);
// // Проверяем при первой загрузке
// handleBreakpoint(mediaQuery);
const autopark_swiper = new Swiper('.carusel', {
  slidesPerView: 3,
  spaceBetween: 12,
  normalizeSlideIndex: false,
  navigation: {nextEl: ".carusel_btn_right",prevEl: ".carusel_btn_left"},
  scrollbar: {el: ".carusel .swiper-scrollbar"},
  breakpoints: {
    1100: {slidesPerView: 4,spaceBetween: 12,scrollbar: {enabled: false}},
    740: {scrollbar: {enabled: false}}
  },
});
// ======================= footer_menu ==========================
const footerMenuLinkList = document.querySelectorAll('.footer_mid nav>ul>li.menu-item-has-children a');

function resetSubMenu() {
  footerMenuLinkList.forEach((link) => {
    if (!link.nextElementSibling) return;
    link.classList.remove('active');
    link.nextElementSibling.classList.remove('active');
    link.nextElementSibling.removeAttribute('style');
  });
}

footerMenuLinkList.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.innerWidth > 1000) return;
    
    const subMenu = e.currentTarget.nextElementSibling;
    if (!subMenu) return;
    const isOpen = subMenu.classList.contains('active');
    
    resetSubMenu();
    
    if(!isOpen) {
      subMenu.classList.add('active');
      e.currentTarget.classList.add('active');
      subMenu.setAttribute('style', 'max-height:' + subMenu.scrollHeight + 'px;');
    }
  });
});