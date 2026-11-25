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





  // ===============================================================================================


const filetrOnMain = document.querySelector('.filetr_on_main');
const multiSelectList = document.querySelectorAll('.multi_select_input');

document.querySelectorAll('.multi_select_elem').forEach(selectElem => {
  let selected = [];

  selectElem.addEventListener('click', (e) => {

    // Открытие / закрытие списка
    const input = e.target.closest('.multi_select_input');

    if (input) {
      const isActive = input.classList.contains('active');

      closeMultiSelectList();

      input.classList.toggle('active', !isActive);
      return;
    }

    // Выбор опции
    const option = e.target.closest('.multi_select_option');

    if (option) {
      option.classList.toggle('active');

      const value = option.dataset.value;
      const inputNow = selectElem.querySelector('input[type="hidden"]');

      if (option.classList.contains('active')) {
        if (!selected.includes(value)) {
          selected.push(value);
        }
      } else {
        selected = selected.filter(i => i !== value);
      }

      inputNow.value = selected.join(',');
    }
  });
});

// Закрытие при клике вне мультиселекта
document.addEventListener('click', (e) => {
  if (!e.target.closest('.multi_select_elem')) {
    closeMultiSelectList();
  }
});

function closeMultiSelectList() {
  multiSelectList.forEach(e => {
    e.classList.remove('active');
  });
}
