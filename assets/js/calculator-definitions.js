window.CalculatorDefinitions = {
  plaster: {
    eyebrow: '',
    title: 'Розрахунок штукатурних матеріалів',
    description: 'Оцінює кількість штукатурної суміші та ґрунтовки для вирівнювання стін.',
    fields: [
      { name: 'area', label: 'Площа стін, м²', type: 'number', value: 35, min: 0, step: 0.1 },
      { name: 'thickness', label: 'Середня товщина шару, мм', type: 'number', value: 10, min: 1, step: 1 },
      { name: 'bagWeight', label: 'Вага мішка, кг', type: 'number', value: 25, min: 1, step: 1 },
      { name: 'primerConsumption', label: 'Витрата ґрунтовки на 1 м², л', type: 'number', value: 0.12, min: 0, step: 0.01 },
      { name: 'reserve', label: 'Запас матеріалу, %', type: 'number', value: 10, min: 0, step: 1 },
      {
        name: 'consumption',
        label: 'Тип штукатурки',
        type: 'select',
        value: 9.5,
        hint: 'При товщині шару 10 мм',
        options: [
          { label: 'Гіпсова штукатурка - 9.5 кг/м²', value: 9.5 },
          { label: 'Цементна штукатурка - 17 кг/м²', value: 17 }
        ]
      }
    ],
    calculate(values) {
      const reserve = 1 + values.reserve / 100;
      const plasterKg = values.area * (values.thickness / 10) * values.consumption * reserve;
      const bags = Math.ceil(plasterKg / values.bagWeight);
      const primerL = values.area * values.primerConsumption * reserve;

      return [
        { label: 'Штукатурна суміш', value: plasterKg.toFixed(1), unit: 'кг' },
        { label: 'Кількість мішків', value: bags, unit: 'шт' },
        { label: 'Ґрунтовка', value: primerL.toFixed(1), unit: 'л' }
      ];
    }
  },
  concrete: {
    eyebrow: '',
    title: 'Розрахунок бетонних матеріалів',
    description: '',
    fields: [
      {
        name: 'mode',
        label: 'Тип розрахунку',
        type: 'segmented',
        value: 'components',
        options: [
          { label: 'Бетон по компонентах', value: 'components' },
          { label: 'Готова стяжка в мішках', value: 'baggedScreed' },
          { label: 'Суха стяжка', value: 'dryScreed' }
        ]
      },
      { name: 'length', label: 'Довжина, м', type: 'number', value: 4, min: 0, step: 0.1 },
      { name: 'width', label: 'Ширина, м', type: 'number', value: 3, min: 0, step: 0.1 },
      { name: 'height', label: 'Товщина / висота, м', type: 'number', value: 0.05, min: 0, step: 0.01 },
      { name: 'cementPerM3', label: 'Цемент на 1 м³, кг', type: 'number', value: 300, min: 0, step: 1, visibleWhen: { mode: 'components' } },
      { name: 'sandPerM3', label: 'Пісок на 1 м³, кг', type: 'number', value: 650, min: 0, step: 1, visibleWhen: { mode: 'components' } },
      { name: 'gravelPerM3', label: 'Щебінь на 1 м³, кг', type: 'number', value: 1200, min: 0, step: 1, visibleWhen: { mode: 'components' } },
      { name: 'waterPerM3', label: 'Вода на 1 м³, л', type: 'number', value: 180, min: 0, step: 1, visibleWhen: { mode: 'components' } },
      { name: 'bagConsumption', label: 'Витрата готової стяжки на 1 м² при 10 мм, кг', type: 'number', value: 18, min: 0, step: 0.1, visibleWhen: { mode: 'baggedScreed' } },
      { name: 'bagWeight', label: 'Вага мішка готової суміші, кг', type: 'number', value: 25, min: 1, step: 1, visibleWhen: { mode: 'baggedScreed' } },
      { name: 'dryFillConsumption', label: 'Суха засипка на 1 м² при 10 мм, л', type: 'number', value: 10, min: 0, step: 0.1, visibleWhen: { mode: 'dryScreed' } },
      { name: 'boardArea', label: 'Площа одного листа сухої стяжки, м²', type: 'number', value: 0.72, min: 0.1, step: 0.01, visibleWhen: { mode: 'dryScreed' } },
      { name: 'reserve', label: 'Запас, %', type: 'number', value: 7, min: 0, step: 1 }
    ],
    calculate(values) {
      const volume = values.length * values.width * values.height * (1 + values.reserve / 100);
      const area = values.length * values.width;

      if (values.mode === 'baggedScreed') {
        const thicknessMm = values.height * 1000;
        const mixKg = area * (thicknessMm / 10) * values.bagConsumption * (1 + values.reserve / 100);

        return [
          { label: 'Площа стяжки', value: area.toFixed(1), unit: 'м²' },
          { label: 'Готова суміш', value: mixKg.toFixed(0), unit: 'кг' },
          { label: 'Кількість мішків', value: Math.ceil(mixKg / values.bagWeight), unit: 'шт' }
        ];
      }

      if (values.mode === 'dryScreed') {
        const thicknessMm = values.height * 1000;
        const dryFillL = area * (thicknessMm / 10) * values.dryFillConsumption * (1 + values.reserve / 100);
        const boards = Math.ceil((area * (1 + values.reserve / 100)) / values.boardArea);

        return [
          { label: 'Площа сухої стяжки', value: area.toFixed(1), unit: 'м²' },
          { label: 'Суха засипка', value: dryFillL.toFixed(0), unit: 'л' },
          { label: 'Листи / плити', value: boards, unit: 'шт' }
        ];
      }

      return [
        { label: 'Обсяг бетону', value: volume.toFixed(2), unit: 'м³' },
        { label: 'Цемент', value: (volume * values.cementPerM3).toFixed(0), unit: 'кг' },
        { label: 'Пісок', value: (volume * values.sandPerM3).toFixed(0), unit: 'кг' },
        { label: 'Щебінь', value: (volume * values.gravelPerM3).toFixed(0), unit: 'кг' },
        { label: 'Вода', value: (volume * values.waterPerM3).toFixed(0), unit: 'л' }
      ];
    }
  },
  paint: {
    eyebrow: '',
    title: 'Розрахунок малярних матеріалів',
    description: 'Рахує фарбу та ґрунтовку для стін або стелі з урахуванням шарів і запасу.',
    fields: [
      { name: 'area', label: 'Площа поверхні, м²', type: 'number', value: 40, min: 0, step: 0.1 },
      { name: 'openings', label: 'Вікна та двері, м²', type: 'number', value: 4, min: 0, step: 0.1 },
      { name: 'layers', label: 'Кількість шарів фарби', type: 'number', value: 2, min: 1, step: 1 },
      { name: 'paintConsumption', label: 'Витрата фарби на 1 м², л', type: 'number', value: 0.12, min: 0, step: 0.01 },
      { name: 'primerConsumption', label: 'Витрата ґрунтовки на 1 м², л', type: 'number', value: 0.1, min: 0, step: 0.01 },
      { name: 'reserve', label: 'Запас, %', type: 'number', value: 10, min: 0, step: 1 }
    ],
    calculate(values) {
      const netArea = Math.max(values.area - values.openings, 0);
      const reserve = 1 + values.reserve / 100;

      return [
        { label: 'Чиста площа', value: netArea.toFixed(1), unit: 'м²' },
        { label: 'Фарба', value: (netArea * values.layers * values.paintConsumption * reserve).toFixed(1), unit: 'л' },
        { label: 'Ґрунтовка', value: (netArea * values.primerConsumption * reserve).toFixed(1), unit: 'л' }
      ];
    }
  },
  electrical: {
    eyebrow: '',
    title: 'Розрахунок електричних матеріалів',
    description: 'Оцінює кабель, підрозетники та коробки для базової електрики у приміщенні.',
    fields: [
      { name: 'sockets', label: 'Кількість розеток', type: 'number', value: 12, min: 0, step: 1 },
      { name: 'switches', label: 'Кількість вимикачів', type: 'number', value: 4, min: 0, step: 1 },
      { name: 'lights', label: 'Світлові точки', type: 'number', value: 5, min: 0, step: 1 },
      { name: 'cablePerSocket', label: 'Кабель на розетку, м', type: 'number', value: 7, min: 0, step: 0.5 },
      { name: 'cablePerLight', label: 'Кабель на світлову точку, м', type: 'number', value: 6, min: 0, step: 0.5 },
      { name: 'junctionBoxes', label: 'Розподільчі коробки', type: 'number', value: 3, min: 0, step: 1 },
      { name: 'reserve', label: 'Запас кабелю, %', type: 'number', value: 15, min: 0, step: 1 }
    ],
    calculate(values) {
      const cable = ((values.sockets * values.cablePerSocket) + (values.lights * values.cablePerLight)) * (1 + values.reserve / 100);

      return [
        { label: 'Кабель орієнтовно', value: cable.toFixed(0), unit: 'м' },
        { label: 'Підрозетники', value: values.sockets + values.switches, unit: 'шт' },
        { label: 'Світлові точки', value: values.lights, unit: 'шт' },
        { label: 'Розподільчі коробки', value: values.junctionBoxes, unit: 'шт' }
      ];
    }
  },
  tile: {
    eyebrow: '',
    title: 'Розрахунок плитки',
    description: 'Рахує плитку, упаковки, клей і затирку для підлоги або стін.',
    fields: [
      { name: 'area', label: 'Площа облицювання, м²', type: 'number', value: 18, min: 0, step: 0.1 },
      { name: 'tileWidth', label: 'Ширина плитки, см', type: 'number', value: 60, min: 1, step: 1 },
      { name: 'tileHeight', label: 'Висота плитки, см', type: 'number', value: 60, min: 1, step: 1 },
      { name: 'tilesPerBox', label: 'Плиток в упаковці', type: 'number', value: 4, min: 1, step: 1 },
      { name: 'adhesiveConsumption', label: 'Витрата клею на 1 м², кг', type: 'number', value: 4, min: 0, step: 0.1 },
      { name: 'groutConsumption', label: 'Витрата затирки на 1 м², кг', type: 'number', value: 0.35, min: 0, step: 0.01 },
      { name: 'reserve', label: 'Запас на підрізку, %', type: 'number', value: 10, min: 0, step: 1 }
    ],
    calculate(values) {
      const areaWithReserve = values.area * (1 + values.reserve / 100);
      const tileArea = (values.tileWidth / 100) * (values.tileHeight / 100);
      const tiles = Math.ceil(areaWithReserve / tileArea);
      const boxes = Math.ceil(tiles / values.tilesPerBox);

      return [
        { label: 'Площа з запасом', value: areaWithReserve.toFixed(1), unit: 'м²' },
        { label: 'Плитка', value: tiles, unit: 'шт' },
        { label: 'Упаковки', value: boxes, unit: 'шт' },
        { label: 'Клей', value: (areaWithReserve * values.adhesiveConsumption).toFixed(1), unit: 'кг' },
        { label: 'Затирка', value: (areaWithReserve * values.groutConsumption).toFixed(1), unit: 'кг' }
      ];
    }
  }
};
