const MAX_ROUNDS = 8;

const regionTemplates = [
  {
    name: "Дагестан",
    bonus: "Сильный культурный потенциал: культурные мероприятия дают +3 к культуре.",
    stats: { stability: 68, culture: 76, activity: 64, tourism: 58, integration: 54, economy: 55 },
    resources: 5,
    bonusType: "culture"
  },
  {
    name: "Чеченская Республика",
    bonus: "Быстрое восстановление: действия против кризисов дают +3 к стабильности.",
    stats: { stability: 70, culture: 67, activity: 62, tourism: 54, integration: 52, economy: 58 },
    resources: 5,
    bonusType: "stability"
  },
  {
    name: "Ингушетия",
    bonus: "Общественная поддержка: инициативы дают +3 к активности.",
    stats: { stability: 64, culture: 63, activity: 70, tourism: 50, integration: 56, economy: 50 },
    resources: 5,
    bonusType: "activity"
  },
  {
    name: "Северная Осетия — Алания",
    bonus: "Командная работа: межрегиональные проекты дают +3 к интеграции.",
    stats: { stability: 66, culture: 70, activity: 63, tourism: 57, integration: 62, economy: 54 },
    resources: 5,
    bonusType: "integration"
  },
  {
    name: "Кабардино-Балкария",
    bonus: "Туристическая привлекательность: развитие туризма даёт +3 к туризму.",
    stats: { stability: 67, culture: 69, activity: 60, tourism: 68, integration: 55, economy: 56 },
    resources: 5,
    bonusType: "tourism"
  },
  {
    name: "Карачаево-Черкесия",
    bonus: "Горные маршруты: подготовка Кубка дополнительно даёт +2 к готовности.",
    stats: { stability: 65, culture: 66, activity: 61, tourism: 65, integration: 53, economy: 55 },
    resources: 5,
    bonusType: "cup"
  },
  {
    name: "Ставропольский край",
    bonus: "Экономическая база: каждый раунд получает +1 дополнительный ресурс.",
    stats: { stability: 72, culture: 61, activity: 60, tourism: 60, integration: 58, economy: 72 },
    resources: 6,
    bonusType: "economy"
  }
];

const events = [
  {
    title: "Рост интереса к региональному фестивалю",
    type: "положительное событие",
    text: "В регионе вырос интерес к культурной программе. Можно усилить эффект мероприятием.",
    impact: { culture: 3, activity: 2 }
  },
  {
    title: "Предложение о межрегиональном проекте",
    type: "нейтральное событие",
    text: "Соседний регион предлагает совместный проект. Он требует ресурсов, но повышает интеграцию.",
    impact: { integration: 2 }
  },
  {
    title: "Снижение интереса молодёжи",
    type: "кризис",
    text: "Молодёжь меньше участвует в мероприятиях. Нужно восстановить общественную активность.",
    impact: { activity: -6, stability: -2 },
    crisis: true
  },
  {
    title: "Организационные трудности",
    type: "кризис",
    text: "Подготовка событий замедлилась. Требуются ресурсы и кооперация.",
    impact: { economy: -4, stability: -3 },
    crisis: true
  },
  {
    title: "Приток туристов",
    type: "положительное событие",
    text: "Регион стал заметнее для туристов. Можно вложиться в развитие маршрутов.",
    impact: { tourism: 4, economy: 2 }
  },
  {
    title: "Культурный обмен между регионами",
    type: "положительное событие",
    text: "Появилась возможность укрепить взаимодействие субъектов округа.",
    impact: { integration: 4, culture: 2 }
  },
  {
    title: "Социальное напряжение",
    type: "кризис",
    text: "Общественная стабильность снизилась. Требуются меры поддержки.",
    impact: { stability: -7, activity: -2 },
    crisis: true
  }
];

const playerActions = [
  {
    key: "festival",
    title: "Провести культурное мероприятие",
    desc: "Расход: 2 ресурса. Повышает культуру и активность.",
    cost: 2,
    effect: { culture: 8, activity: 5 }
  },
  {
    key: "tourism",
    title: "Развить туризм",
    desc: "Расход: 2 ресурса. Повышает туристическую привлекательность и экономику.",
    cost: 2,
    effect: { tourism: 8, economy: 4 }
  },
  {
    key: "initiative",
    title: "Запустить общественную инициативу",
    desc: "Расход: 2 ресурса. Восстанавливает стабильность и активность.",
    cost: 2,
    effect: { stability: 8, activity: 4 }
  },
  {
    key: "support",
    title: "Помочь региону в кризисе",
    desc: "Расход: 2 ресурса. Поддерживает самый слабый регион и повышает интеграцию.",
    cost: 2,
    effect: { integration: 5 },
    support: true
  },
  {
    key: "project",
    title: "Запустить межрегиональный проект",
    desc: "Расход: 3 ресурса. Усиливает интеграцию и общий ресурс округа.",
    cost: 3,
    effect: { integration: 9, culture: 3 },
    shared: 2
  },
  {
    key: "cup",
    title: "Готовить Кубок Кавказа",
    desc: "Расход: 3 ресурса. Повышает готовность финального события.",
    cost: 3,
    cup: 14,
    effect: { tourism: 3, culture: 3 }
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
  actedThisRound: false
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

function startPlayerTurn() {
  state.phase = "player";
  state.actedThisRound = false;
  const player = getPlayerRegion();
  let income = 2 + Math.floor(player.stats.economy / 35) + Math.floor(player.stats.tourism / 45);
  if (player.bonusType === "economy") income += 1;
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

function applyGlobalIntegration(value) {
  state.regions.forEach(region => {
    region.stats.integration = clamp(region.stats.integration + value);
  });
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
    addLog(`${player.name} помогает региону ${weakest.name}. Кризис ослаблен, интеграция округа выросла.`);
  } else if (action.key === "project") {
    applyGlobalIntegration(3);
    state.sharedResources += action.shared || 0;
    addLog(`${player.name} запускает межрегиональный проект. Округ получает общий ресурс и рост интеграции.`);
  } else if (action.key === "cup") {
    let cupGain = action.cup;
    if (player.bonusType === "cup") cupGain += 2;
    state.cupReadiness = clamp(state.cupReadiness + cupGain);
    addLog(`${player.name} вкладывается в подготовку Кубка. Готовность Кубка +${cupGain}.`);
  } else {
    if (action.key === "initiative") player.crisis = false;
    addLog(`${player.name} выполняет действие: «${action.title}». Показатели региона обновлены.`);
  }

  state.actedThisRound = true;
  state.phase = "bots";
  renderAll();

  setTimeout(botTurns, 700);
}

function botTurns() {
  addLog("Боты выполняют свои ходы.");
  state.regions.forEach((region, index) => {
    if (index === state.selectedRegion) return;

    let income = 2 + Math.floor(region.stats.economy / 40);
    if (region.bonusType === "economy") income += 1;
    region.resources += income;

    const event = randomEvent();
    applyImpact(region, event.impact);
    if (event.crisis) region.crisis = true;

    const action = chooseBotAction(region);
    if (region.resources >= action.cost) {
      region.resources -= action.cost;
      applyImpact(region, action.effect || {});

      if (action.key === "initiative") region.crisis = false;
      if (action.key === "project") {
        applyGlobalIntegration(1);
        state.sharedResources += 1;
      }
      if (action.key === "cup") {
        let gain = action.cup;
        if (region.bonusType === "cup") gain += 2;
        state.cupReadiness = clamp(state.cupReadiness + gain);
      }
    }
  });

  districtPhase();
}

function chooseBotAction(region) {
  if (region.crisis || region.stats.stability < 45 || region.stats.activity < 45) return playerActions.find(a => a.key === "initiative");
  if (state.cupReadiness < 70 && state.round >= 4) return playerActions.find(a => a.key === "cup");
  if (averageIntegration() < 62) return playerActions.find(a => a.key === "project");
  if (region.stats.tourism < 60) return playerActions.find(a => a.key === "tourism");
  return playerActions.find(a => a.key === "festival");
}

function districtPhase() {
  state.phase = "district";

  const stability = averageStability();
  const integration = averageIntegration();
  const crises = crisisCount();

  if (crises >= 3) {
    state.sharedResources = Math.max(0, state.sharedResources - 2);
    addLog("Общий этап округа: несколько регионов в кризисе. Общий ресурс снижен.");
  } else if (stability > 65 && integration > 60) {
    state.sharedResources += 2;
    addLog("Общий этап округа: регионы сохраняют баланс. Общий ресурс увеличен.");
  } else {
    addLog("Общий этап округа: система пересчитала показатели регионов.");
  }

  if (state.sharedResources >= 3 && crises > 0) {
    const weakest = [...state.regions].filter(r => r.crisis).sort((a, b) => a.stats.stability - b.stats.stability)[0];
    if (weakest) {
      state.sharedResources -= 3;
      weakest.stats.stability = clamp(weakest.stats.stability + 8);
      weakest.stats.activity = clamp(weakest.stats.activity + 4);
      weakest.crisis = false;
      addLog(`Коллективное решение: общий ресурс направлен на поддержку региона ${weakest.name}.`);
    }
  } else if (state.sharedResources >= 4 && state.cupReadiness < 75) {
    state.sharedResources -= 4;
    state.cupReadiness = clamp(state.cupReadiness + 10);
    addLog("Коллективное решение: общий ресурс вложен в подготовку Кубка Кавказа.");
  }

  renderAll();
  checkEndOrNext();
}

function checkEndOrNext() {
  const stability = averageStability();
  const crises = crisisCount();

  if (stability <= 35 || crises >= 5) {
    showEnd("Общий проигрыш", "Округ столкнулся с сильным кризисом. Стабильность упала слишком низко, а команда не успела восстановить баланс регионов.");
    return;
  }

  if (state.round >= MAX_ROUNDS) {
    finishGame();
    return;
  }

  el("nextRoundBtn").classList.remove("hidden");
}

function finishGame() {
  const stability = averageStability();
  const integration = averageIntegration();
  const culture = avg(state.regions.map(r => r.stats.culture));
  const activity = avg(state.regions.map(r => r.stats.activity));

  if (state.cupReadiness >= 80 && stability >= 55 && integration >= 55) {
    showEnd("Основная победа", "Кубок Кавказа по хоббихорсингу успешно проведён. Регионы сохранили стабильность и усилили межрегиональную интеграцию.");
  } else if (culture >= 72 && activity >= 68) {
    showEnd("Культурная победа", "Регионы достигли высокого уровня культурного развития и общественной активности. Округ укрепил культурную самобытность.");
  } else if (integration >= 75 && stability >= 50) {
    showEnd("Интеграционная победа", "Игроки выполнили крупные межрегиональные проекты и добились устойчивого взаимодействия субъектов округа.");
  } else {
    showEnd("Общий проигрыш", "Команда не достигла условий победы. Подготовка Кубка или показатели регионов оказались недостаточными.");
  }
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
}

function renderHeader() {
  el("roundView").textContent = `${state.round} / ${MAX_ROUNDS}`;
  el("playerRegionName").textContent = getPlayerRegion()?.name || "—";
  const phases = {
    player: "Ход игрока",
    bots: "Ходы ботов",
    district: "Общий этап округа",
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
  state.regions.forEach((region) => {
    const card = document.createElement("div");
    card.className = "region-card" + (region.isPlayer ? " player" : "") + (region.crisis || region.stats.stability < 40 ? " crisis" : "");
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
      <div class="resources">Ресурсы: <b>${region.resources}</b>${region.crisis ? " · кризис" : ""}</div>
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
    actedThisRound: false
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
