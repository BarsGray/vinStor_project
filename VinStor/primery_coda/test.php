<?php 
  add_action('init', 'register_cars_post_type_and_taxonomies');
  function register_cars_post_type_and_taxonomies() {
      // 1. Тип записей: Автомобили
      register_post_type('car', [
          'labels'       => [
              'name'          => 'Автомобили',
              'singular_name' => 'Автомобиль',
              'add_new'       => 'Добавить авто',
              'add_new_item'  => 'Добавить новый автомобиль',
          ],
          'public'       => true,
          'has_archive'  => true,
          'menu_icon'    => 'dashicons-car',
          'supports'     => ['title', 'editor', 'thumbnail'],
          'rewrite'      => ['slug' => 'cars'],
      ]);

      // 2. Иерархическая таксономия: Марка (родитель) -> Модель (дочерний)
      register_taxonomy('car_brand', ['car'], [
          'labels'            => [
              'name'          => 'Марки и модели',
              'singular_name' => 'Марка / Модель',
              'parent_item'   => 'Марка (родитель)',
          ],
          'hierarchical'      => true, // Включает вложенность (Марка -> Модель)
          'show_admin_column' => true,
          'rewrite'           => ['slug' => 'brand'],
      ]);

      // 3. Таксономия: Тип двигателя
      register_taxonomy('car_engine', ['car'], [
          'labels'            => [
              'name'          => 'Двигатель',
              'singular_name' => 'Тип двигателя',
          ],
          'hierarchical'      => true, // Удобно выбирать галочками в админке
          'show_admin_column' => true,
          'rewrite'           => ['slug' => 'engine'],
      ]);
  }


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Получаем только родительские термины (Марки), у которых parent = 0
$brands = get_terms([
    'taxonomy'   => 'car_brand',
    'parent'     => 0,
    'hide_empty' => false, // поставьте true, чтобы скрыть марки без машин
]);

// Получаем типы двигателей
$engines = get_terms([
    'taxonomy'   => 'car_engine',
    'hide_empty' => false,
]);
?>

<div class="filter_on_main">
  <div class="container">
    <div class="filter_on_main_inner">

      <!-- 1. МАРКА -->
      <div class="custom_dropdown" data-filter="brand">
        <label class="multi_select_box">
          <input class="multi_select" type="text" readonly placeholder="Марка">
        </label>
        <div class="dropdown_list">
          <?php foreach ($brands as $brand): ?>
            <label class="dropdown_item">
              <input type="checkbox" value="<?= esc_attr($brand->slug); ?>" data-id="<?= esc_attr($brand->term_id); ?>">
              <span><?= esc_html($brand->name); ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- 2. МОДЕЛЬ (подгружается при выборе марки) -->
      <div class="custom_dropdown is-disabled" data-filter="model">
        <label class="multi_select_box">
          <input class="multi_select" type="text" readonly placeholder="Сначала выберите марку">
        </label>
        <div class="dropdown_list" id="models_dropdown_list">
          <!-- Сюда JS подставит модели выбранных марок -->
        </div>
      </div>

      <!-- 3. ДВИГАТЕЛЬ -->
      <div class="custom_dropdown" data-filter="engine">
        <label class="multi_select_box">
          <input class="multi_select" type="text" readonly placeholder="Двигатель">
        </label>
        <div class="dropdown_list">
          <?php foreach ($engines as $engine): ?>
            <label class="dropdown_item">
              <input type="checkbox" value="<?= esc_attr($engine->slug); ?>">
              <span><?= esc_html($engine->name); ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <button class="select_button" type="button" id="show_cars_btn">
        Показать авто
        <span class="select_button_icon"></span>
      </button>

    </div>
  </div>
</div>

<?php
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
add_action('wp_ajax_get_car_models', 'ajax_get_car_models');
add_action('wp_ajax_nopriv_get_car_models', 'ajax_get_car_models');

function ajax_get_car_models() {
    $brand_ids = isset($_POST['brand_ids']) ? array_map('intval', $_POST['brand_ids']) : [];

    if (empty($brand_ids)) {
        wp_send_json_success('');
    }

    $html = '';
    foreach ($brand_ids as $parent_id) {
        $models = get_terms([
            'taxonomy'   => 'car_brand',
            'parent'     => $parent_id,
            'hide_empty' => false,
        ]);

        foreach ($models as $model) {
            $html .= sprintf(
                '<label class="dropdown_item"><input type="checkbox" value="%s"><span>%s</span></label>',
                esc_attr($model->slug),
                esc_html($model->name)
            );
        }
    }

    wp_send_json_success($html);
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.custom_dropdown');

  // 1. Открытие и закрытие выпадающих списков
  dropdowns.forEach(dropdown => {
    const box = dropdown.querySelector('.multi_select_box');
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown.classList.contains('is-disabled')) return;
      
      dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('is-open'); });
      dropdown.classList.toggle('is-open');
    });

    // Обновление текста в инпуте при клике на чекбоксы
    dropdown.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const input = dropdown.querySelector('.multi_select');
        const checkedLabels = Array.from(dropdown.querySelectorAll('input:checked'))
                                   .map(cb => cb.nextElementSibling.textContent.trim());
        input.value = checkedLabels.join(', ');

        // Если изменили Марку — подгружаем Модели
        if (dropdown.dataset.filter === 'brand') {
          loadModels(dropdown);
        }
      }
    });
  });

  // Закрытие при клике мимо
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom_dropdown')) {
      dropdowns.forEach(d => d.classList.remove('is-open'));
    }
  });

  // 2. Функция AJAX-подгрузки моделей
  function loadModels(brandDropdown) {
    const modelDropdown = document.querySelector('[data-filter="model"]');
    const modelInput = modelDropdown.querySelector('.multi_select');
    const modelList = document.getElementById('models_dropdown_list');
    
    const brandIds = Array.from(brandDropdown.querySelectorAll('input:checked'))
                          .map(cb => cb.dataset.id);

    modelInput.value = ''; // сбрасываем выбранные модели

    if (brandIds.length === 0) {
      modelDropdown.classList.add('is-disabled');
      modelInput.placeholder = 'Сначала выберите марку';
      modelList.innerHTML = '';
      return;
    }

    const formData = new FormData();
    formData.append('action', 'get_car_models');
    brandIds.forEach(id => formData.append('brand_ids[]', id));

    fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(response => {
      if (response.success && response.data) {
        modelList.innerHTML = response.data;
        modelDropdown.classList.remove('is-disabled');
        modelInput.placeholder = 'Модель';
      } else {
        modelList.innerHTML = '';
        modelDropdown.classList.add('is-disabled');
        modelInput.placeholder = 'Нет моделей';
      }
    });
  }

  // 3. Клик по кнопке "Показать авто" -> переход в каталог /cars/
  document.getElementById('show_cars_btn').addEventListener('click', () => {
    const params = new URLSearchParams();

    dropdowns.forEach(dropdown => {
      const key = dropdown.dataset.filter;
      const values = Array.from(dropdown.querySelectorAll('input:checked')).map(cb => cb.value);
      if (values.length > 0) {
        params.append(key, values.join(','));
      }
    });

    window.location.href = '/cars/?' + params.toString();
  });
});





// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
add_action('pre_get_posts', 'filter_cars_archive_query');
function filter_cars_archive_query($query) {
    if (is_admin() || !$query->is_main_query() || !is_post_type_archive('car')) {
        return;
    }

    $tax_query = ['relation' => 'AND'];

    // Фильтруем по модели (если выбрана) ИЛИ по марке
    if (!empty($_GET['model'])) {
        $models = array_map('sanitize_title', explode(',', $_GET['model']));
        $tax_query[] = [
            'taxonomy' => 'car_brand',
            'field'    => 'slug',
            'terms'    => $models,
        ];
    } elseif (!empty($_GET['brand'])) {
        $brands = array_map('sanitize_title', explode(',', $_GET['brand']));
        $tax_query[] = [
            'taxonomy' => 'car_brand',
            'field'    => 'slug',
            'terms'    => $brands,
        ];
    }

    // Фильтруем по двигателю
    if (!empty($_GET['engine'])) {
        $engines = array_map('sanitize_title', explode(',', $_GET['engine']));
        $tax_query[] = [
            'taxonomy' => 'car_engine',
            'field'    => 'slug',
            'terms'    => $engines,
        ];
    }

    if (count($tax_query) > 1) {
        $query->set('tax_query', $tax_query);
    }
}
?>

<style>
/* Обертка для позиционирования ::before (стрелки) */
.multi_select_box {
  position: relative;
  display: block;
  cursor: pointer;
}

/* Стрелка через ::before */
.multi_select_box::before {
  content: "";
  position: absolute;
  right: 14px;
  top: 50%;
  width: 7px;
  height: 7px;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: translateY(-70%) rotate(45deg);
  transition: transform 0.2s ease;
  pointer-events: none;
}

/* Поворот стрелки вверх, когда список открыт */
.custom_dropdown.is-open .multi_select_box::before {
  transform: translateY(-30%) rotate(-135deg);
}

/* Сам инпут */
.multi_select {
  width: 100%;
  padding: 12px 36px 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #fff;
  color: #111827;
  font-size: 15px;
  cursor: pointer;            /* меняем курсор с текстового на указатель */
  user-select: none;          /* запрещаем случайное выделение текста */
  text-overflow: ellipsis;    /* если выбрано много марок, обрезаем с троеточием (...) */
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
}

.multi_select:focus {
  outline: none;
  border-color: #2563eb;
}

/* Стиль для заблокированного инпута (например, "Сначала выберите марку") */
.custom_dropdown.is-disabled .multi_select {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

</style>