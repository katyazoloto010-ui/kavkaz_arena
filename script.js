const MAX_ROUNDS = 8;
const CUP_MIN_READY = 100;
const CUP_GOOD_READY = 100;
const SHARED_RESOURCE_LIMIT = 12;

const regionTemplates = [
  {
    name: "Дагестан",
    bonus: "Сильный культурный потенциал: культурные мероприятия дают +3 к культуре.",
    stats: { stability: 68, culture: 76, activity: 64, tourism: 58, integration: 54, economy: 55 },
    resources: 6,
    resourceFocus: "Культура",
    bonusType: "culture"
  },
  {
    name: "Чеченская Республика",
    bonus: "Быстрое восстановление: действия против кризисов дают +3 к стабильности.",
    stats: { stability: 70, culture: 67, activity: 62, tourism: 54, integration: 52, economy: 58 },
    resources: 4,
    resourceFocus: "Стабильность",
    bonusType: "stability"
  },
  {
    name: "Ингушетия",
    bonus: "Общественная поддержка: инициативы дают +3 к активности.",
    stats: { stability: 64, culture: 63, activity: 70, tourism: 50, integration: 56, economy: 50 },
    resources: 5,
    resourceFocus: "Общественная поддержка",
    bonusType: "activity"
  },
  {
    name: "Северная Осетия — Алания",
    bonus: "Командная работа: межрегиональные проекты дают +3 к интеграции.",
    stats: { stability: 66, culture: 70, activity: 63, tourism: 57, integration: 62, economy: 54 },
    resources: 4,
    resourceFocus: "Интеграция",
    bonusType: "integration"
  },
  {
    name: "Кабардино-Балкария",
    bonus: "Туристическая привлекательность: развитие туризма даёт +3 к туризму.",
    stats: { stability: 67, culture: 69, activity: 60, tourism: 68, integration: 55, economy: 56 },
    resources: 6,
    resourceFocus: "Туризм",
    bonusType: "tourism"
  },
  {
    name: "Карачаево-Черкесия",
    bonus: "Горные маршруты: подготовка Кубка дополнительно даёт +2 к готовности.",
    stats: { stability: 65, culture: 66, activity: 61, tourism: 65, integration: 53, economy: 55 },
    resources: 5,
    resourceFocus: "Подготовка событий",
    bonusType: "cup"
  },
  {
    name: "Ставропольский край",
    bonus: "Экономическая база: каждый раунд получает +1 дополнительный ресурс.",
    stats: { stability: 72, culture: 61, activity: 60, tourism: 60, integration: 58, economy: 72 },
    resources: 7,
    resourceFocus: "Экономика",
    bonusType: "economy"
  }
];

const events = [
  {
    title: "Рост интереса к региональному фестивалю",
    type: "положительное событие",
    text: "В регионе вырос интерес к культурной программе. Культура растёт, но организация требует расходов.",
    impact: { culture: 3, activity: 2, economy: -1 }
  },
  {
    title: "Предложение о межрегиональном проекте",
    type: "нейтральное событие",
    text: "Соседний регион предлагает совместный проект. Интеграция растёт, но региону нужны организационные ресурсы.",
    impact: { integration: 2, economy: -1 }
  },
  {
    title: "Снижение интереса молодёжи",
    type: "кризис",
    text: "Молодёжь меньше участвует в мероприятиях. Нужно восстановить общественную активность.",
    impact: { activity: -10, stability: -6, integration: -3 },
    crisis: true
  },
  {
    title: "Организационные трудности",
    type: "кризис",
    text: "Подготовка событий замедлилась. Требуются ресурсы и кооперация.",
    impact: { economy: -8, stability: -7, activity: -3 },
    crisis: true
  },
  {
    title: "Приток туристов",
    type: "положительное событие",
    text: "Регион стал заметнее для туристов. Туризм и экономика растут, но повышается нагрузка на стабильность.",
    impact: { tourism: 4, economy: 2, stability: -1 }
  },
  {
    title: "Культурный обмен между регионами",
    type: "положительное событие",
    text: "Появилась возможность укрепить взаимодействие субъектов округа, но требуется часть ресурсов.",
    impact: { integration: 4, culture: 2, economy: -1 }
  },
  {
    title: "Социальное напряжение",
    type: "кризис",
    text: "Общественная стабильность снизилась. Требуются меры поддержки.",
    impact: { stability: -12, activity: -5, integration: -3 },
    crisis: true
  },
  {
    title: "Перегрузка организаторов",
    type: "кризис",
    text: "Слишком много мероприятий подряд снижает активность и стабильность.",
    impact: { activity: -9, stability: -8, culture: -3 },
    crisis: true
  },
  {
    title: "Экономический рывок",
    type: "нейтральное событие",
    text: "Экономика растёт, но культурные инициативы получают меньше внимания.",
    impact: { economy: 5, culture: -2, integration: -1 }
  }
];

const playerActions = [
  {
    key: "festival",
    title: "Провести культурное мероприятие",
    desc: "Расход: 2 ресурса. + культура и активность, но - экономика из-за затрат.",
    cost: 2,
    effect: { culture: 8, activity: 5, economy: -3 }
  },
  {
    key: "tourism",
    title: "Развить туризм",
    desc: "Расход: 2 ресурса. + туризм и экономика, но - стабильность из-за нагрузки на регион.",
    cost: 2,
    effect: { tourism: 8, economy: 4, stability: -3 }
  },
  {
    key: "initiative",
    title: "Запустить общественную инициативу",
    desc: "Расход: 2 ресурса. + стабильность и активность, но - экономика из-за социальных расходов.",
    cost: 2,
    effect: { stability: 8, activity: 4, economy: -2 }
  },
  {
    key: "support",
    title: "Помочь региону в кризисе",
    desc: "Расход: 2 ресурса. Помогает слабому региону, + интеграция, но ваш регион теряет часть ресурсов и экономики.",
    cost: 2,
    effect: { integration: 5, economy: -2 },
    support: true
  },
  {
    key: "project",
    title: "Запустить межрегиональный проект",
    desc: "Расход: 3 ресурса. + интеграция и культура, но - экономика из-за крупных затрат.",
    cost: 3,
    effect: { integration: 9, culture: 3, economy: -4 },
    shared: 1
  },
  {
    key: "cup",
    title: "Готовить Кубок Кавказа",
    desc: "Расход: 3 ресурса. + готовность Кубка, + туризм и культура, но - экономика и активность из-за нагрузки.",
    cost: 3,
    cup: 14,
    effect: { tourism: 3, culture: 3, economy: -4, activity: -2 }
  },
  {
    key: "economy",
    title: "Укрепить экономику региона",
    desc: "Расход: 1 ресурс. + экономика, но - культура и интеграция, потому что внимание уходит на хозяйственные задачи.",
    cost: 1,
    effect: { economy: 9, culture: -2, integration: -2 }
  }
];

let state = {
  selectedRegion: null,
  regions: [],
  round: 1,
  currentEvent: null,
  cupReadiness: 10,
  sharedResources: 4,
  phase: "setup",
  actedThisRound: false,
  botQueue: [],
  activeBotIndex: null,
  lastBotAction: ""
};

const el = (id) => document.getElementById(id);

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(values) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function copyRegions() {
  return regionTemplates.map((r) => ({
    ...r,
    stats: { ...r.stats },
    isPlayer: false,
    crisis: false
  }));
}

function initSetup() {
  const box = el("regionSelect");
  box.innerHTML = "";
  regionTemplates.forEach((region, index) => {
    const card = document.createElement("div");
    card.className = "region-option";
    card.innerHTML = `<b>${region.name}</b><span>${region.bonus}</span>`;
    card.addEventListener("click", () => {
      state.selectedRegion = index;
      document.querySelectorAll(".region-option").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      el("startBtn").disabled = false;
    });
    box.appendChild(card);
  });
}

function startGame() {
  state.regions = copyRegions();
  state.regions[state.selectedRegion].isPlayer = true;
  state.round = 1;
  state.cupReadiness = 10;
  state.sharedResources = 4;
  state.actedThisRound = false;
  state.phase = "player";
  el("setupScreen").classList.add("hidden");
  el("gameScreen").classList.remove("hidden");
  addLog("Игра началась. Вы управляете регионом: " + getPlayerRegion().name + ".");
  startPlayerTurn();
  renderAll();
}

function getPlayerRegion() {
  return state.regions[state.selectedRegion];
}

function randomEvent() {
  return events[Math.floor(Math.random() * events.length)];
}

function calculateIncome(region) {
  let income = 1 + Math.floor(region.stats.economy / 45);

  if (region.stats.tourism >= 65) income += 1;
  if (region.stats.activity >= 65) income += 1;
  if (region.stats.stability < 45) income -= 1;
  if (region.crisis) income -= 1;

  if (region.bonusType === "economy") income += 2;
  if (region.bonusType === "tourism" && region.stats.tourism >= 60) income += 1;
  if (region.bonusType === "culture" && region.stats.culture >= 70) income += 1;

  return Math.max(1, income);
}

function startPlayerTurn() {
  state.phase = "player";
  state.actedThisRound = false;
  const player = getPlayerRegion();
  let income = calculateIncome(player);
  player.resources += income;

  state.currentEvent = randomEvent();
  applyImpact(player, state.currentEvent.impact);
  if (state.currentEvent.crisis) player.crisis = true;

  addLog(`<strong>Раунд ${state.round}.</strong> ${player.name} получает ${income} ресурсов. Событие: «${state.currentEvent.title}».`);
  renderAll();
}

function applyImpact(region, impact) {
  Object.entries(impact || {}).forEach(([key, value]) => {
    region.stats[key] = clamp(region.stats[key] + value);
  });
}

function describeEffect(effect) {
  const names = {
    stability: "стабильность",
    culture: "культура",
    activity: "активность",
    tourism: "туризм",
    integration: "интеграция",
    economy: "экономика"
  };

  return Object.entries(effect || {})
    .map(([key, value]) => `${value > 0 ? "+" : ""}${value} ${names[key] || key}`)
    .join(", ");
}

function applyGlobalIntegration(value) {
  state.regions.forEach(region => {
    region.stats.integration = clamp(region.stats.integration + value);
  });
}

function applyGlobalImpact(impact) {
  state.regions.forEach(region => {
    applyImpact(region, impact);
  });
}

function unresolvedCrisisRegions() {
  return state.regions.filter(region => region.crisis || region.stats.stability < 40);
}

function takeAction(action) {
  const player = getPlayerRegion();
  if (state.phase !== "player" || state.actedThisRound) return;

  if (player.resources < action.cost) {
    addLog(`Недостаточно ресурсов для действия «${action.title}».`);
    return;
  }

  player.resources -= action.cost;
  let effect = { ...(action.effect || {}) };

  if (player.bonusType === "culture" && action.key === "festival") effect.culture += 3;
  if (player.bonusType === "tourism" && action.key === "tourism") effect.tourism += 3;
  if (player.bonusType === "activity" && action.key === "initiative") effect.activity += 3;
  if (player.bonusType === "stability" && action.key === "initiative") effect.stability += 3;
  if (player.bonusType === "integration" && action.key === "project") effect.integration += 3;

  applyImpact(player, effect);

  if (action.support) {
    const weakest = [...state.regions].sort((a, b) => a.stats.stability - b.stats.stability)[0];
    weakest.stats.stability = clamp(weakest.stats.stability + 10);
    weakest.stats.activity = clamp(weakest.stats.activity + 5);
    weakest.crisis = false;
    applyGlobalIntegration(2);
    addLog(`${player.name} помогает региону ${weakest.name}. Последствия для вашего региона: ${describeEffect(effect)}. Кризис ослаблен, интеграция округа выросла.`);
  } else if (action.key === "project") {
    applyGlobalIntegration(3);
    state.sharedResources = Math.min(SHARED_RESOURCE_LIMIT, state.sharedResources + (action.shared || 0));
    addLog(`${player.name} запускает межрегиональный проект. Последствия: ${describeEffect(effect)}. Округ получает общий ресурс и рост интеграции.`);
  } else if (action.key === "cup") {
    let cupGain = action.cup;
    if (player.bonusType === "cup") cupGain += 2;
    state.cupReadiness = clamp(state.cupReadiness + cupGain);
    addLog(`${player.name} вкладывается в подготовку Кубка. Готовность Кубка +${cupGain}. Последствия: ${describeEffect(effect)}.`);
  } else {
    if (action.key === "initiative") player.crisis = false;
    addLog(`${player.name} выполняет действие: «${action.title}». Последствия: ${describeEffect(effect)}.`);
  }

  if (player.crisis && action.key !== "initiative" && action.key !== "support") {
    player.stats.stability = clamp(player.stats.stability - 4);
    player.stats.activity = clamp(player.stats.activity - 3);
    addLog(`Кризис в регионе ${player.name} не решён во время хода. Дополнительные последствия: -4 стабильность, -3 активность.`);
  }

  state.actedThisRound = true;
  state.phase = "bots";
  renderAll();

  setTimeout(botTurns, 700);
}

function botTurns() {
  state.botQueue = state.regions
    .map((region, index) => index)
    .filter(index => index !== state.selectedRegion);

  state.activeBotIndex = null;
  state.lastBotAction = "Боты начинают ходить по очереди.";
  addLog("Боты начинают выполнять ходы по очереди.");
  renderAll();
  setTimeout(processNextBotTurn, 650);
}

function processNextBotTurn() {
  if (state.botQueue.length === 0) {
    state.activeBotIndex = null;
    state.lastBotAction = "Все боты завершили ходы.";
    renderAll();
    setTimeout(districtPhase, 650);
    return;
  }

  const index = state.botQueue.shift();
  const region = state.regions[index];
  state.activeBotIndex = index;

  let income = calculateIncome(region);
  region.resources += income;

  const event = randomEvent();
  applyImpact(region, event.impact);
  if (event.crisis) region.crisis = true;

  const action = chooseBotAction(region);
  let actionText = "";

  if (region.resources >= action.cost) {
    region.resources -= action.cost;
    applyImpact(region, action.effect || {});

    if (action.key === "initiative") region.crisis = false;

    if (action.key === "project") {
      applyGlobalIntegration(1);
      state.sharedResources = Math.min(SHARED_RESOURCE_LIMIT, state.sharedResources + 1);
    }

    if (action.key === "cup") {
      let gain = action.cup;
      if (region.bonusType === "cup") gain += 2;
      state.cupReadiness = clamp(state.cupReadiness + gain);
    }

    actionText = `Бот региона ${region.name}: получил ${income} ресурсов, событие «${event.title}», выбрал действие «${action.title}» (${describeEffect(action.effect || {})}).`;
  } else {
    actionText = `Бот региона ${region.name}: получил ${income} ресурсов, событие «${event.title}», но не смог выполнить «${action.title}» из-за нехватки ресурсов.`;
  }

  state.lastBotAction = actionText;
  addLog(actionText);
  renderAll();

  setTimeout(processNextBotTurn, 900);
}

function chooseBotAction(region) {
  if (region.crisis || region.stats.stability < 45 || region.stats.activity < 45) return playerActions.find(a => a.key === "initiative");
  if (region.stats.economy < 42) return playerActions.find(a => a.key === "economy");
  if (state.cupReadiness < 70 && state.round >= 4) return playerActions.find(a => a.key === "cup");
  if (averageIntegration() < 62) return playerActions.find(a => a.key === "project");
  if (region.stats.tourism < 60) return playerActions.find(a => a.key === "tourism");
  return playerActions.find(a => a.key === "festival");
}

function districtPhase() {
  state.phase = "district";

  const unresolved = unresolvedCrisisRegions();
  const crises = unresolved.length;

  if (crises > 0) {
    const damage = {
      stability: -4 * crises,
      activity: -3 * crises,
      integration: -2 * crises,
      economy: -1 * crises
    };

    applyGlobalImpact(damage);
    state.sharedResources = Math.max(0, state.sharedResources - crises);

    addLog(`<strong>Цепная реакция кризиса:</strong> ${crises} нерешённ. кризис(а) ударили по всему округу. Последствия для всех регионов: ${describeEffect(damage)}.`);

    unresolved.forEach(region => {
      region.crisisTurns = (region.crisisTurns || 0) + 1;
      if (region.crisisTurns >= 2) {
        region.stats.stability = clamp(region.stats.stability - 6);
        region.stats.activity = clamp(region.stats.activity - 4);
        addLog(`Затяжной кризис в регионе ${region.name}: дополнительное снижение стабильности и активности.`);
      }
    });
  } else {
    addLog("Общий этап округа: нерешённых кризисов нет, округ сохраняет баланс.");
  }

  const stability = averageStability();
  const integration = averageIntegration();

  if (crises === 0 && stability > 70 && integration > 65) {
    state.sharedResources = Math.min(SHARED_RESOURCE_LIMIT, state.sharedResources + 1);
    addLog("За устойчивое развитие округ получил +1 общий ресурс.");
  }

  if (state.sharedResources >= 4 && crises > 0) {
    const weakest = unresolvedCrisisRegions().sort((a, b) => a.stats.stability - b.stats.stability)[0];

    if (weakest) {
      state.sharedResources -= 4;
      weakest.stats.stability = clamp(weakest.stats.stability + 10);
      weakest.stats.activity = clamp(weakest.stats.activity + 6);
      weakest.stats.integration = clamp(weakest.stats.integration + 3);
      weakest.crisis = false;
      weakest.crisisTurns = 0;
      addLog(`Коллективное решение: общий ресурс направлен на спасение региона ${weakest.name}. Расход: 4 общего ресурса.`);
    }
  } else if (crises > 0) {
    addLog("Коллективная помощь не сработала: общего ресурса не хватило для спасения кризисного региона.");
  }

  if (state.sharedResources >= 5 && state.cupReadiness < 100 && crises === 0) {
    state.sharedResources -= 5;
    state.cupReadiness = clamp(state.cupReadiness + 8);
    addLog("Коллективное решение: часть общего ресурса вложена в подготовку Кубка. Расход: 5 общего ресурса.");
  }

  renderAll();
  checkEndOrNext();
}

function checkEndOrNext() {
  const stability = averageStability();
  const crises = crisisCount();

  if (stability <= 45 || crises >= 3) {
    showEnd("Общий проигрыш", "Округ столкнулся с сильным кризисом. Несколько нерешённых проблем ударили по всем регионам, и команда не успела восстановить баланс.");
    return;
  }

  if (state.round >= MAX_ROUNDS) {
    startCupFinal();
    return;
  }

  el("nextRoundBtn").classList.remove("hidden");
}

function startCupFinal() {
  state.phase = "cup";
  renderHeader();
  addLog("<strong>Финальный этап:</strong> проверка готовности Кубка Кавказа по хоббихорсингу.");

  if (state.cupReadiness < 100) {
    addLog(`Кубок не проведён: готовность составляет ${state.cupReadiness}%, а для проведения нужно 100%.`);
    showEnd("Общий проигрыш", `Кубок Кавказа не удалось провести: готовность составляет ${state.cupReadiness}%, а нужно 100%. Команда не выполнила ключевую игровую цель.`);
    return;
  }

  addLog("Готовность Кубка достигла 100%. Начинается проведение финальных этапов.");

  const stability = averageStability();
  const integration = averageIntegration();
  const culture = avg(state.regions.map(r => r.stats.culture));
  const activity = avg(state.regions.map(r => r.stats.activity));
  const tourism = avg(state.regions.map(r => r.stats.tourism));

  const stages = [
    { name: "Гонки на скорость", base: tourism, need: 58 },
    { name: "Прыжки через препятствия", base: activity, need: 58 },
    { name: "Соревнование на стиль", base: culture, need: 60 },
    { name: "Командные заезды", base: integration, need: 62 }
  ];

  let successStages = 0;

  stages.forEach(stage => {
    const score = stage.base + 10 + randomInt(-8, 8);
    if (score >= stage.need) {
      successStages++;
      addLog(`Этап Кубка «${stage.name}» пройден успешно. Итоговый балл: ${score}.`);
    } else {
      addLog(`Этап Кубка «${stage.name}» прошёл с трудностями. Итоговый балл: ${score}.`);
    }
  });

  if (successStages >= 3 && stability >= 55 && integration >= 55) {
    showEnd("Основная победа", "Кубок Кавказа по хоббихорсингу успешно проведён: готовность достигла 100%, большинство этапов прошло хорошо, регионы сохранили стабильность и усилили межрегиональную интеграцию.");
  } else {
    showEnd("Общий проигрыш", "Кубок был подготовлен на 100%, но этапы прошли недостаточно успешно или показатели округа оказались слишком низкими.");
  }
}

function finishGame(cupResult) {
  const stability = averageStability();
  const integration = averageIntegration();
  const culture = avg(state.regions.map(r => r.stats.culture));
  const activity = avg(state.regions.map(r => r.stats.activity));

  if (cupResult === "strong_cup" && stability >= 55 && integration >= 55) {
    showEnd("Основная победа", "Кубок Кавказа по хоббихорсингу успешно проведён: готовность достигла 100%, большинство этапов прошло хорошо, регионы сохранили стабильность и усилили межрегиональную интеграцию.");
  } else if (culture >= 72 && activity >= 68) {
    showEnd("Культурная победа", "Даже без идеального Кубка регионы достигли высокого уровня культурного развития и общественной активности. Округ укрепил культурную самобытность.");
  } else if (integration >= 75 && stability >= 50) {
    showEnd("Интеграционная победа", "Игроки выполнили крупные межрегиональные проекты и добились устойчивого взаимодействия субъектов округа.");
  } else if (cupResult === "failed_cup") {
    showEnd("Общий проигрыш", "Кубок не удалось провести: шкала готовности не достигла 100%. Команда не выполнила ключевую игровую цель.");
  } else {
    showEnd("Общий проигрыш", "Кубок прошёл недостаточно успешно, а показатели регионов не позволили получить культурную или интеграционную победу.");
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextRound() {
  state.round += 1;
  el("nextRoundBtn").classList.add("hidden");
  startPlayerTurn();
}

function averageStability() {
  return avg(state.regions.map(r => r.stats.stability));
}

function averageIntegration() {
  return avg(state.regions.map(r => r.stats.integration));
}

function crisisCount() {
  return state.regions.filter(r => r.crisis || r.stats.stability < 40).length;
}

function renderAll() {
  renderHeader();
  renderDistrict();
  renderEvent();
  renderRegions();
  renderActions();
  renderBotStatus();
}

function renderHeader() {
  el("roundView").textContent = `${state.round} / ${MAX_ROUNDS}`;
  el("playerRegionName").textContent = getPlayerRegion()?.name || "—";
  const phases = {
    player: "Ход игрока",
    bots: "Ходы ботов",
    district: "Общий этап округа",
    cup: "Финал Кубка",
    setup: "Настройка"
  };
  el("phaseBadge").textContent = phases[state.phase] || "Игра";
}

function renderDistrict() {
  const stability = averageStability();
  const integration = averageIntegration();

  el("districtStabilityText").textContent = stability;
  el("districtIntegrationText").textContent = integration;
  el("cupReadinessText").textContent = state.cupReadiness;
  el("districtStabilityBar").style.width = stability + "%";
  el("districtIntegrationBar").style.width = integration + "%";
  el("cupReadinessBar").style.width = state.cupReadiness + "%";
  el("sharedResources").textContent = state.sharedResources;
  el("crisisCount").textContent = crisisCount();
}

function renderEvent() {
  if (!state.currentEvent) return;
  el("eventCard").innerHTML = `
    <span class="event-tag">${state.currentEvent.type}</span>
    <h3>${state.currentEvent.title}</h3>
    <p>${state.currentEvent.text}</p>
  `;
}

function renderRegions() {
  const board = el("regionsBoard");
  board.innerHTML = "";
  state.regions.forEach((region, index) => {
    const card = document.createElement("div");
    card.className = "region-card" 
      + (region.isPlayer ? " player" : "") 
      + (index === state.activeBotIndex ? " active-bot" : "")
      + (region.crisis || region.stats.stability < 40 ? " crisis" : "");
    card.innerHTML = `
      <div class="region-head">
        <b>${region.name}</b>
        <span class="${region.isPlayer ? "player-label" : "bot-label"}">${region.isPlayer ? "Игрок" : "Бот"}</span>
      </div>
      <div class="mini-metrics">
        ${miniMetric("Стаб.", region.stats.stability)}
        ${miniMetric("Культура", region.stats.culture)}
        ${miniMetric("Актив.", region.stats.activity)}
        ${miniMetric("Туризм", region.stats.tourism)}
        ${miniMetric("Интегр.", region.stats.integration)}
        ${miniMetric("Эконом.", region.stats.economy)}
      </div>
      <div class="resources">
        Ресурсы: <b>${region.resources}</b>${region.crisis ? " · кризис" : ""}<br>
        <span>Профиль ресурсов: ${region.resourceFocus || "общий"}</span>
      </div>
    `;
    board.appendChild(card);
  });
}

function miniMetric(label, value) {
  return `
    <div class="mini">
      <span>${label}</span>
      <div class="mini-line"><i style="width:${clamp(value)}%"></i></div>
      <b>${clamp(value)}</b>
    </div>
  `;
}

function renderBotStatus() {
  const existing = document.getElementById("botStatus");
  if (!existing) return;

  if (state.phase !== "bots") {
    existing.innerHTML = "<b>Ход ботов:</b><span>Боты ожидают своей очереди.</span>";
    return;
  }

  const active = state.activeBotIndex !== null ? state.regions[state.activeBotIndex] : null;
  existing.innerHTML = `
    <b>Ход ботов:</b>
    <span>${active ? "Сейчас ходит: " + active.name : "Подготовка очереди ботов..."}</span>
    <small>${state.lastBotAction || ""}</small>
  `;
}

function renderActions() {
  const actionsBox = el("actions");
  actionsBox.innerHTML = "";

  const disabled = state.phase !== "player" || state.actedThisRound;

  playerActions.forEach((action) => {
    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.disabled = disabled;
    btn.innerHTML = `${action.title}<small>${action.desc}</small>`;
    btn.addEventListener("click", () => takeAction(action));
    actionsBox.appendChild(btn);
  });

  el("turnHint").textContent = disabled
    ? "Дождитесь завершения хода ботов и общего этапа округа."
    : "Выберите действие для своего региона. После этого боты сделают свои ходы автоматически.";
}

function addLog(message) {
  const log = el("log");
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = message;
  log.prepend(entry);
}

function showEnd(title, text) {
  el("modalTitle").textContent = title;
  el("modalText").textContent = text;
  el("modal").classList.remove("hidden");
}

function restart() {
  state = {
    selectedRegion: null,
    regions: [],
    round: 1,
    currentEvent: null,
    cupReadiness: 10,
    sharedResources: 4,
    phase: "setup",
    actedThisRound: false,
    botQueue: [],
    activeBotIndex: null,
    lastBotAction: ""
  };
  el("modal").classList.add("hidden");
  el("gameScreen").classList.add("hidden");
  el("setupScreen").classList.remove("hidden");
  el("startBtn").disabled = true;
  el("log").innerHTML = "";
  initSetup();
}

el("startBtn").addEventListener("click", startGame);
el("nextRoundBtn").addEventListener("click", nextRound);
el("restartBtn").addEventListener("click", restart);
el("modalRestartBtn").addEventListener("click", restart);
el("clearLogBtn").addEventListener("click", () => el("log").innerHTML = "");

initSetup();
