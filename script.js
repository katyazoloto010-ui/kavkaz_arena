var regions = [
  {
    name: 'Республика Дагестан', emoji: '🧶',
    feature: 'Многонациональность, ремёсла и сильные культурные традиции.',
    bonus: 'Стартовый бонус: +12 культура, +8 интеграция',
    stats: { stability: 66, culture: 76, activity: 58, tourism: 55, integration: 62, economy: 54 }
  },
  {
    name: 'Республика Ингушетия', emoji: '🛡️',
    feature: 'Башенная архитектура, историческая память и локальная сплочённость.',
    bonus: 'Стартовый бонус: +12 стабильность, +8 активность',
    stats: { stability: 76, culture: 61, activity: 67, tourism: 48, integration: 54, economy: 50 }
  },
  {
    name: 'Кабардино-Балкарская Республика', emoji: '🏔️',
    feature: 'Горный туризм, Эльбрус и традиции коневодства.',
    bonus: 'Стартовый бонус: +15 туризм, +5 экономика',
    stats: { stability: 62, culture: 63, activity: 56, tourism: 78, integration: 52, economy: 58 }
  },
  {
    name: 'Карачаево-Черкесская Республика', emoji: '🐎',
    feature: 'Конные традиции, природные маршруты и этнокультурные проекты.',
    bonus: 'Стартовый бонус: +10 туризм, +10 культура',
    stats: { stability: 61, culture: 70, activity: 57, tourism: 70, integration: 51, economy: 54 }
  },
  {
    name: 'Северная Осетия — Алания', emoji: '🎭',
    feature: 'Театр, эпос, городская культура и сильные образовательные практики.',
    bonus: 'Стартовый бонус: +10 культура, +10 активность',
    stats: { stability: 64, culture: 72, activity: 68, tourism: 57, integration: 55, economy: 57 }
  },
  {
    name: 'Чеченская Республика', emoji: '🌙',
    feature: 'Восстановление, современная инфраструктура и высокий темп развития.',
    bonus: 'Стартовый бонус: +12 экономика, +8 стабильность',
    stats: { stability: 74, culture: 61, activity: 59, tourism: 54, integration: 48, economy: 72 }
  },
  {
    name: 'Ставропольский край', emoji: '🌾',
    feature: 'Аграрная база, курортные территории и связь регионов округа.',
    bonus: 'Стартовый бонус: +10 экономика, +10 интеграция',
    stats: { stability: 68, culture: 56, activity: 55, tourism: 61, integration: 68, economy: 70 }
  }
];

var cards = [
  { type: 'Культурное событие', title: 'Фестиваль традиций Кавказа', text: 'Регион проводит фестиваль, где объединяются музыка, костюмы, кухня и ремёсла.', effects: { culture: 14, integration: 9, activity: 6, economy: -4 } },
  { type: 'Культурное событие', title: 'День национальных ремёсел', text: 'Мастера проводят открытые занятия и выставки, вовлекая жителей региона.', effects: { culture: 12, activity: 8, tourism: 4 } },
  { type: 'Общественная инициатива', title: 'Молодёжный форум', text: 'Активисты предлагают новые проекты для городов и сёл.', effects: { activity: 13, integration: 5, stability: 4, economy: -3 } },
  { type: 'Общественная инициатива', title: 'Волонтёрская программа', text: 'Жители помогают организовывать события и поддерживать слабые районы.', effects: { stability: 9, activity: 10, integration: 4 } },
  { type: 'Межрегиональный проект', title: 'Туристический маршрут «Горы и традиции»', text: 'Регионы объединяют маршруты, фестивали и спортивные события.', effects: { tourism: 15, economy: 9, integration: 10, stability: -2 } },
  { type: 'Межрегиональный проект', title: 'Обмен культурными делегациями', text: 'Участники из разных субъектов округа проводят совместные мероприятия.', effects: { integration: 14, culture: 8, activity: 5 } },
  { type: 'Культурное событие', title: 'Школа хоббихорсинга', text: 'Современная молодёжная практика связывается с традициями коневодства Кавказа.', effects: { activity: 12, culture: 7, tourism: 5 } },
  { type: 'Экономическое событие', title: 'Ярмарка региональных продуктов', text: 'Местные производители получают площадку для развития и обмена.', effects: { economy: 13, tourism: 6, integration: 4 } },
  { type: 'Кризис', title: 'Снижение общественной активности', text: 'Жители меньше участвуют в событиях, культурная жизнь замедляется.', effects: { activity: -16, stability: -8, culture: -4 }, crisis: true },
  { type: 'Кризис', title: 'Межрегиональное напряжение', text: 'Согласование общих проектов становится сложнее, доверие между участниками падает.', effects: { integration: -16, stability: -8, economy: -4 }, crisis: true },
  { type: 'Кризис', title: 'Падение туристического интереса', text: 'Региону нужны новые события и маршруты, иначе поток гостей снижается.', effects: { tourism: -15, economy: -8, activity: -4 }, crisis: true },
  { type: 'Кризис', title: 'Культурная усталость', text: 'Повторяющиеся форматы мероприятий теряют интерес аудитории.', effects: { culture: -12, activity: -10, integration: -4 }, crisis: true },
  { type: 'Вызов', title: 'Нужна поддержка соседнего региона', text: 'Игроки направляют часть ресурсов на общий баланс округа.', effects: { integration: 10, stability: 4, economy: -8 } },
  { type: 'Вызов', title: 'Спор о распределении ресурсов', text: 'Решение требует компромисса: быстрый рост или долгосрочная стабильность.', effects: { economy: 8, stability: -7, integration: -4 } }
];

var statNames = {
  stability: 'Стабильность', culture: 'Культурное развитие', activity: 'Общественная активность',
  tourism: 'Туристическая привлекательность', integration: 'Межрегиональная интеграция', economy: 'Экономика'
};

var game = {
  selected: null,
  stats: {},
  turn: 1,
  maxTurns: 12,
  played: 0,
  crises: 0,
  cupDone: false,
  ended: false,
  log: []
};

function qs(id) { return document.getElementById(id); }

function showScreen(id) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
  qs(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

function renderRegions() {
  var grid = qs('regionsGrid');
  grid.innerHTML = '';
  for (var i = 0; i < regions.length; i++) {
    (function(region) {
      var div = document.createElement('div');
      div.className = 'region-option';
      div.innerHTML = '<div class="emoji">' + region.emoji + '</div>' +
        '<h3>' + region.name + '</h3>' +
        '<p>' + region.feature + '</p>' +
        '<div class="bonus-box">' + region.bonus + '</div>' +
        '<button class="primary-btn">Выбрать регион</button>';
      div.querySelector('button').onclick = function() { startGame(region); };
      grid.appendChild(div);
    })(regions[i]);
  }
}

function startGame(region) {
  game.selected = region;
  game.stats = JSON.parse(JSON.stringify(region.stats));
  game.turn = 1;
  game.played = 0;
  game.crises = 0;
  game.cupDone = false;
  game.ended = false;
  game.log = [];

  qs('regionEmoji').textContent = region.emoji;
  qs('regionName').textContent = region.name;
  qs('regionFeature').textContent = region.feature;
  qs('regionBonus').textContent = region.bonus;
  setEvent('Старт игры', 'Регион выбран', 'Первый этап начинается. Поддерживай баланс показателей, собирай преимущества и подготовь главное событие — Кубок Кавказа.', {});
  addLog('Игра началась: выбран регион <b>' + region.name + '</b>.');
  renderGame();
  showScreen('gameScreen');
}

function renderGame() {
  renderStats();
  renderDistrict();
  renderGoals();
  qs('turnCounter').textContent = 'Ход ' + game.turn + ' / ' + game.maxTurns;
  qs('playedCards').textContent = game.played;
  qs('crisisCount').textContent = game.crises;
  qs('cupStatus').textContent = game.cupDone ? 'да' : 'нет';
  qs('cupBtn').disabled = !canCup() || game.cupDone || game.ended;
  qs('nextTurnBtn').disabled = game.ended;
  qs('cultureBtn').disabled = game.ended || game.stats.economy < 8;
  qs('projectBtn').disabled = game.ended || game.stats.stability < 25 || game.stats.economy < 10;
}

function renderStats() {
  var list = qs('statsList');
  list.innerHTML = '';
  for (var key in statNames) {
    var value = clamp(game.stats[key]);
    var row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = '<div class="stat-top"><span>' + statNames[key] + '</span><span>' + value + '</span></div>' +
      '<div class="bar"><div class="bar-fill" style="width:' + value + '%"></div></div>';
    list.appendChild(row);
  }
}

function getDistrictScore() {
  var sum = 0;
  var count = 0;
  for (var k in statNames) { sum += clamp(game.stats[k]); count++; }
  return Math.round(sum / count);
}

function renderDistrict() {
  var score = getDistrictScore();
  qs('districtScore').textContent = score;
  var comment = 'Система держится, но требует внимательных решений.';
  if (score >= 80) comment = 'Округ развивается уверенно: баланс почти образцовый.';
  else if (score >= 65) comment = 'Хорошая динамика: регион усиливает общий потенциал округа.';
  else if (score < 40) comment = 'Опасная зона: кризисы могут разрушить устойчивость региона.';
  qs('districtComment').textContent = comment;

  var minKey = getWeakestStat();
  qs('hintText').textContent = 'Слабое место сейчас: ' + statNames[minKey] + '. Усиль этот показатель до следующего кризиса.';
}

function renderGoals() {
  var goals = [
    { text: 'Провести Кубок Кавказа', done: game.cupDone },
    { text: 'Достичь интеграции 75+', done: game.stats.integration >= 75 },
    { text: 'Сохранить стабильность выше 35', done: game.stats.stability > 35 },
    { text: 'Получить общий индекс округа 70+', done: getDistrictScore() >= 70 },
    { text: 'Завершить 12 ходов без провала', done: game.turn > game.maxTurns && !isLose() }
  ];
  var ul = qs('goalsList');
  ul.innerHTML = '';
  for (var i = 0; i < goals.length; i++) {
    var li = document.createElement('li');
    li.className = goals[i].done ? 'done' : '';
    li.textContent = (goals[i].done ? '✓ ' : '○ ') + goals[i].text;
    ul.appendChild(li);
  }
}

function setEvent(type, title, text, effects) {
  qs('eventType').textContent = type;
  qs('eventTitle').textContent = title;
  qs('eventText').textContent = text;
  var box = qs('eventEffects');
  box.innerHTML = '';
  for (var key in effects) {
    var val = effects[key];
    var chip = document.createElement('span');
    chip.className = 'effect ' + (val >= 0 ? 'good' : 'bad');
    chip.textContent = (val > 0 ? '+' : '') + val + ' ' + statNames[key];
    box.appendChild(chip);
  }
}

function applyEffects(effects) {
  for (var key in effects) {
    game.stats[key] = clamp((game.stats[key] || 0) + effects[key]);
  }
}

function randomCard() {
  return cards[Math.floor(Math.random() * cards.length)];
}

function nextTurn() {
  if (game.ended) return;
  var card = randomCard();
  applyEffects(card.effects);
  game.played++;
  if (card.crisis) game.crises++;
  setEvent(card.type, card.title, card.text, card.effects);
  addLog('Ход ' + game.turn + ': <b>' + card.title + '</b>.');

  if (card.crisis && game.stats.activity < 25) {
    applyEffects({ stability: -8 });
    addLog('Дополнительный эффект: низкая активность усилила кризис, стабильность снижена.');
  }

  game.turn++;
  checkEnd();
  renderGame();
}

function doCulture() {
  if (game.ended || game.stats.economy < 8) return;
  var effects = { culture: 10, activity: 8, stability: 3, economy: -8 };
  applyEffects(effects);
  setEvent('Действие игрока', 'Культурная инициатива', 'Регион организовал локальное мероприятие: выставку, праздник, мастер-класс или молодёжную встречу.', effects);
  addLog('Проведена <b>культурная инициатива</b>.');
  checkEnd();
  renderGame();
}

function doProject() {
  if (game.ended || game.stats.stability < 25 || game.stats.economy < 10) return;
  var effects = { integration: 12, tourism: 8, economy: -10, culture: 4 };
  applyEffects(effects);
  setEvent('Действие игрока', 'Межрегиональный проект', 'Регион запустил совместную программу с соседями: маршрут, фестиваль, форум или обмен ресурсами.', effects);
  addLog('Запущен <b>межрегиональный проект</b>.');
  checkEnd();
  renderGame();
}

function canCup() {
  return game.stats.culture >= 55 && game.stats.stability >= 40 && game.stats.integration >= 50 && game.stats.activity >= 45;
}

function doCup() {
  if (!canCup() || game.cupDone || game.ended) return;
  var effects = { integration: 20, activity: 15, tourism: 12, culture: 10, stability: 8, economy: 6 };
  applyEffects(effects);
  game.cupDone = true;
  setEvent('Главное событие', 'Кубок Кавказа проведён!', 'Регионы объединились в кооперативном турнире по хоббихорсингу. Событие усилило культурный престиж и общий баланс округа.', effects);
  addLog('🏆 Проведён <b>Кубок Кавказа по хоббихорсингу</b>.');
  checkEnd();
  renderGame();
}

function getWeakestStat() {
  var weakest = 'stability';
  for (var key in statNames) {
    if (game.stats[key] < game.stats[weakest]) weakest = key;
  }
  return weakest;
}

function isLose() {
  return game.stats.stability <= 0 || game.stats.activity <= 0 || game.stats.integration <= 0 || getDistrictScore() < 25;
}

function isWin() {
  return game.cupDone && game.stats.integration >= 75 && game.stats.stability > 35 && getDistrictScore() >= 70;
}

function checkEnd() {
  if (isLose()) {
    finishGame(false, 'Регион не справился с кризисами', 'Ключевые показатели упали слишком низко. Игровая система показывает, что без стабильности, активности и интеграции развитие округа становится невозможным.');
    return;
  }
  if (game.turn > game.maxTurns) {
    if (isWin()) {
      finishGame(true, 'Округ достиг устойчивого развития', 'Ты сохранила баланс региона, усилила интеграцию и провела Кубок Кавказа. Кооперативная модель сработала — цивилизация не просто выжила, а красиво вышла в финал.');
    } else {
      finishGame(false, 'Развитие оказалось неполным', 'Регион прошёл все ходы, но не выполнил все цели победы. Нужно сильнее развивать интеграцию, стабильность и главное событие игры.');
    }
  }
}

function finishGame(win, title, text) {
  game.ended = true;
  qs('resultPill').textContent = win ? 'Победа' : 'Финал';
  qs('resultTitle').textContent = title;
  qs('resultText').textContent = text;
  var resultStats = qs('resultStats');
  resultStats.innerHTML = '';
  var data = [
    ['Индекс округа', getDistrictScore()],
    ['Ходов', Math.min(game.turn - 1, game.maxTurns)],
    ['Карточек', game.played],
    ['Кризисов', game.crises],
    ['Интеграция', game.stats.integration],
    ['Кубок', game.cupDone ? 'да' : 'нет']
  ];
  for (var i = 0; i < data.length; i++) {
    var div = document.createElement('div');
    div.className = 'result-stat';
    div.innerHTML = '<b>' + data[i][1] + '</b><span>' + data[i][0] + '</span>';
    resultStats.appendChild(div);
  }
  renderGame();
  showScreen('resultScreen');
}

function addLog(text) {
  game.log.unshift(text);
  var log = qs('gameLog');
  log.innerHTML = '';
  for (var i = 0; i < Math.min(game.log.length, 16); i++) {
    var div = document.createElement('div');
    div.className = 'log-item';
    div.innerHTML = game.log[i];
    log.appendChild(div);
  }
}

function openModal(title, html) {
  qs('modalTitle').textContent = title;
  qs('modalContent').innerHTML = html;
  qs('modal').classList.add('active');
}

function closeModal() { qs('modal').classList.remove('active'); }

function showRules() {
  openModal('Правила игры',
    '<p><b>Цель:</b> за 12 ходов развить регион и провести Кубок Кавказа.</p>' +
    '<ul>' +
    '<li>Каждый ход открывает карточку: событие, кризис, инициативу или проект.</li>' +
    '<li>Показатели меняются от 0 до 100. Если стабильность, активность или интеграция падают до нуля — игра заканчивается.</li>' +
    '<li>Кубок Кавказа доступен, если культура ≥ 55, стабильность ≥ 40, интеграция ≥ 50, активность ≥ 45.</li>' +
    '<li>Для победы нужны: Кубок, интеграция 75+, стабильность выше 35 и общий индекс округа 70+.</li>' +
    '</ul>');
}

function showAbout() {
  openModal('О проекте',
    '<p>«HobbyHorse Кавказ Арена» — демонстрационный сайт с рабочей мини-игрой. Он показывает механику кооперативной стратегии: выбор региона, карточки событий, кризисы, культурные инициативы и финальное объединяющее событие.</p>' +
    '<p>Проект можно использовать как практическую часть: это не статичный макет, а интерактивный веб-прототип, который запускается прямо в браузере.</p>');
}

function restart() { showScreen('selectScreen'); renderRegions(); }
function home() { showScreen('startScreen'); }

window.onload = function() {
  renderRegions();
  qs('goSelectBtn').onclick = function() { showScreen('selectScreen'); };
  qs('aboutBtn').onclick = showAbout;
  qs('rulesBtn').onclick = showRules;
  qs('restartTopBtn').onclick = restart;
  qs('nextTurnBtn').onclick = nextTurn;
  qs('cultureBtn').onclick = doCulture;
  qs('projectBtn').onclick = doProject;
  qs('cupBtn').onclick = doCup;
  qs('clearLogBtn').onclick = function() { game.log = []; qs('gameLog').innerHTML = ''; };
  qs('playAgainBtn').onclick = restart;
  qs('backHomeBtn').onclick = home;
  qs('modalClose').onclick = closeModal;
  qs('modal').onclick = function(e) { if (e.target.id === 'modal') closeModal(); };
};
