const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
    return;
  }

  callback();
};

ready(() => {
  document.documentElement.classList.add('is-ready');

  const dropdowns = [...document.querySelectorAll('[data-dropdown]')];
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const calculatorModal = document.querySelector('[data-calculator-modal]');
  const calculatorContent = window.CalculatorDefinitions || {};

  const closeDropdowns = () => {
    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector('[data-dropdown-toggle]');

      dropdown.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  };

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('[data-dropdown-toggle]');

    const showPageBlur = () => {
      if (!mobileQuery.matches) {
        document.body.classList.add('has-nav-dropdown');
      }
    };

    const hidePageBlur = () => {
      document.body.classList.remove('has-nav-dropdown');
    };

    toggle?.addEventListener('click', (event) => {
      if (!mobileQuery.matches) {
        return;
      }

      const isOpen = dropdown.classList.contains('is-open');

      event.preventDefault();
      closeDropdowns();

      if (!isOpen) {
        dropdown.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    dropdown.addEventListener('mouseenter', showPageBlur);
    dropdown.addEventListener('mouseleave', hidePageBlur);
    dropdown.addEventListener('focusin', showPageBlur);
    dropdown.addEventListener('focusout', hidePageBlur);
  });

  document.addEventListener('click', (event) => {
    if (!mobileQuery.matches || event.target.closest('[data-dropdown]')) {
      return;
    }

    closeDropdowns();
  });

  const closeCalculatorModal = () => {
    calculatorModal?.classList.remove('is-open');
    calculatorModal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-modal-open');
  };

  const getFormValues = (form) => {
    const formData = new FormData(form);

    return Object.fromEntries(
      [...formData.entries()].map(([name, value]) => {
        const numericValue = Number(value);

        return [name, Number.isNaN(numericValue) ? value : numericValue];
      })
    );
  };

  const renderCalculatorResults = (container, results) => {
    container.innerHTML = results.map((result) => `
      <div class="calculator-result">
        <span class="calculator-result__label">${result.label}</span>
        <strong class="calculator-result__value">${result.value} ${result.unit}</strong>
      </div>
    `).join('');
  };

  const renderCalculatorField = (field) => {
    const visibilityAttributes = field.visibleWhen
      ? ` data-visible-when='${JSON.stringify(field.visibleWhen)}' hidden`
      : '';

    if (field.type === 'segmented') {
      return `
        <fieldset class="calculator-field calculator-field--full"${visibilityAttributes}>
          <legend class="calculator-field__label">${field.label}</legend>
          <div class="calculator-segmented">
            ${field.options.map((option) => `
              <label class="calculator-segmented__option">
                <input
                  class="calculator-segmented__input"
                  type="radio"
                  name="${field.name}"
                  value="${option.value}"
                  ${option.value === field.value ? 'checked' : ''}
                >
                <span class="calculator-segmented__label">${option.label}</span>
              </label>
            `).join('')}
          </div>
          ${field.hint ? `<span class="calculator-field__hint">${field.hint}</span>` : ''}
        </fieldset>
      `;
    }

    if (field.type === 'select') {
      return `
        <label class="calculator-field"${visibilityAttributes}>
          <span class="calculator-field__label">${field.label}</span>
          <select class="calculator-field__input" name="${field.name}">
            ${field.options.map((option) => `
              <option value="${option.value}" ${Number(option.value) === Number(field.value) ? 'selected' : ''}>
                ${option.label}
              </option>
            `).join('')}
          </select>
          ${field.hint ? `<span class="calculator-field__hint">${field.hint}</span>` : ''}
        </label>
      `;
    }

    return `
      <label class="calculator-field"${visibilityAttributes}>
        <span class="calculator-field__label">${field.label}</span>
        <input
          class="calculator-field__input"
          name="${field.name}"
          type="${field.type}"
          value="${field.value}"
          min="${field.min}"
          step="${field.step}"
          inputmode="decimal"
        >
        ${field.hint ? `<span class="calculator-field__hint">${field.hint}</span>` : ''}
      </label>
    `;
  };

  const renderCalculatorForm = (calculator) => `
    <form class="calculator-form" data-calculator-form>
      <div class="calculator-form__fields">
        ${calculator.fields.map(renderCalculatorField).join('')}
      </div>
      <button class="button calculator-form__button" type="submit">Розрахувати</button>
      <div class="calculator-results" data-calculator-results></div>
    </form>
  `;

  const syncVisibleFields = (form) => {
    const values = getFormValues(form);

    form.querySelectorAll('[data-visible-when]').forEach((field) => {
      const conditions = JSON.parse(field.dataset.visibleWhen);
      const isVisible = Object.entries(conditions).every(([name, value]) => values[name] === value);

      field.hidden = !isVisible;
      field.querySelectorAll('input, select').forEach((input) => {
        input.disabled = !isVisible;
      });
    });
  };

  document.querySelectorAll('[data-calculator-popup]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const calculator = calculatorContent[trigger.dataset.calculatorPopup];

      if (!calculator || !calculatorModal) {
        return;
      }

      event.preventDefault();
      const eyebrow = calculatorModal.querySelector('[data-calculator-eyebrow]');
      eyebrow.textContent = calculator.eyebrow || '';
      eyebrow.hidden = !calculator.eyebrow;
      const description = calculatorModal.querySelector('[data-calculator-description]');
      calculatorModal.querySelector('[data-calculator-title]').textContent = calculator.title;
      description.textContent = calculator.description || '';
      description.hidden = !calculator.description;
      calculatorModal.querySelector('[data-calculator-content]').innerHTML = renderCalculatorForm(calculator);

      const form = calculatorModal.querySelector('[data-calculator-form]');
      const resultsContainer = calculatorModal.querySelector('[data-calculator-results]');
      const calculate = () => {
        syncVisibleFields(form);
        renderCalculatorResults(resultsContainer, calculator.calculate(getFormValues(form)));
      };

      form.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        calculate();
      });

      form.addEventListener('change', calculate);

      calculate();

      closeDropdowns();
      document.body.classList.remove('has-nav-dropdown');
      calculatorModal.classList.add('is-open');
      calculatorModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('has-modal-open');
    });
  });

  document.querySelectorAll('[data-calculator-close]').forEach((trigger) => {
    trigger.addEventListener('click', closeCalculatorModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCalculatorModal();
    }
  });
});
