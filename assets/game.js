'use strict';

const MAX_TURNS = 18;
const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
const $ = (id) => document.getElementById(id);

const roles = [
  { id:'culture', icon:'🎭', name:'Координатор культуры', desc:'Культурные карточки дают больше культуры и подготовки Кубка.', bonus:'Культура +4, подготовка +3' },
  { id:'crisis', icon:'🛡️', name:'Антикризисный менеджер', desc:'Решения кризисов дешевле и эффективнее.', bonus:'Решения кризисов +5 стабильности' },
  { id:'tourism', icon:'🧭', name:'Куратор туризма', desc:'Туристические проекты сильнее развивают экономику.', bonus:'Туризм и экономика +4' },
  { id:'cup', icon:'🏆', name:'Организатор Кубка', desc:'Быстрее готовит главное событие игры.', bonus:'Подготовка Кубка +6 от событий' }
];

const baseRegions = [
  { id:'dagestan', emoji:'⛰️', name:'Республика Дагестан', feature:'Многонациональность, ремёсла, горные территории', stability:62, culture:78, activity:58, tourism:69, economy:62 },
  { id:'ingushetia', emoji:'🛡️', name:'Республика Ингушетия', feature:'Башенная культура, компактность региона, общественные связи', stability:66, culture:64, activity:74, tourism:78, economy:67 },
  { id:'kbr', emoji:'🏔️', name:'Кабардино-Балкарская Республика', feature:'Эльбрус, горный туризм, традиции коневодства', stability:66, culture:67, activity:59, tourism:90, economy:67 },
  { id:'kchr', emoji:'🌲', name:'Карачаево-Черкесская Республика', feature:'Природный туризм, этнокультурное разнообразие', stability:61, culture:62, activity:54, tourism:84, economy:63 },
  { id:'ossetia', emoji:'🐎', name:'Северная Осетия — Алания', feature:'Конные традиции, история, культурная идентичность', stability:65, culture:70, activity:62, tourism:72, economy:66 },
  { id:'chechnya', emoji:'🕌', name:'Чеченская Республика', feature:'Современная городская среда, спортивная инфраструктура', stability:68, culture:65, activity:64, tourism:71, economy:70 },
  { id:'stavropol', emoji:'🌾', name:'Ставропольский край', feature:'Аграрный потенциал, курортные зоны, логистический центр', stability:63, culture:57, activity:42, tourism:78, economy:84 }
];

const cards = [
  { type:'Культура', name:'Фестиваль народной культуры', desc:'Регион проводит фестиваль традиций и ремёсел.', cost:{budget:8, volunteers:4}, eff:{culture:14, activity:8, stability:4}, global:{integration:5, cup:9} },
  { type:'Культура', name:'Дни национальной кухни', desc:'Мероприятие повышает интерес жителей и туристов.', cost:{budget:7, cultural:3}, eff:{culture:10, tourism:8, economy:4}, global:{integration:4, cup:7} },
  { type:'Молодёжь', name:'Форум молодёжи СКФО', desc:'Молодёжные команды запускают совместные инициативы.', cost:{budget:10, volunteers:6}, eff:{activity:16, culture:5, stability:5}, global:{integration:8, cup:8} },
  { type:'Туризм', name:'Туристический маршрут', desc:'Регион включается в общий маршрут Кавказа.', cost:{budget:12, trust:3}, eff:{tourism:16, economy:10}, global:{integration:6, cup:7} },
  { type:'Экономика', name:'Ярмарка региональных брендов', desc:'Локальные производители получают поддержку.', cost:{budget:9, cultural:4}, eff:{economy:15, culture:6, activity:5}, global:{integration:3, cup:5} },
  { type:'Стабильность', name:'Программа общественного диалога', desc:'Снижает напряжение и укрепляет доверие.', cost:{budget:7, trust:4}, eff:{stability:18, activity:5}, global:{integration:4, cup:4} },
  { type:'Кубок', name:'Тренировки к Кубку', desc:'Регион готовит команду по хоббихорсингу.', cost:{budget:6, volunteers:5}, eff:{activity:10, tourism:5}, global:{cup:17, integration:3} },
  { type:'Кубок', name:'Показательные заезды', desc:'Публичное событие повышает вовлечённость жителей.', cost:{budget:8, volunteers:6}, eff:{activity:12, culture:7, tourism:6}, global:{cup:14, integration:5} },
  { type:'Интеграция', name:'Обмен волонтёрскими командами', desc:'Соседние регионы помогают организовать события.', cost:{volunteers:8, trust:3}, eff:{activity:9, stability:7}, global:{integration:10, cup:5} },
  { type:'Интеграция', name:'Общий медиапроект', desc:'Истории регионов объединяются в единую кампанию.', cost:{budget:8, cultural:5}, eff:{culture:9, tourism:6}, global:{integration:11, cup:6} }
];

const crisisPool = [
  { name:'Падение туристического интереса', desc:'Турпоток снижается, экономика региона проседает.', damage:{tourism:-14,economy:-7,stability:-4} },
  { name:'Снижение общественной активности', desc:'Жители меньше участвуют в мероприятиях.', damage:{activity:-15,stability:-8,culture:-4} },
  { name:'Дисбаланс развития', desc:'Регион отстаёт от остальных и снижает общую интеграцию.', damage:{stability:-9,economy:-8,activity:-6} },
  { name:'Культурная усталость', desc:'События стали однотипными, интерес аудитории падает.', damage:{culture:-12,activity:-9,tourism:-5} }
];

const projects = [
  { name:'Кавказский культурный маршрут', cost:{budget:22,cultural:10}, ids:['dagestan','chechnya','ingushetia'], eff:{tourism:10,culture:8,economy:5}, global:{integration:16,cup:8} },
  { name:'Горный спортивный фестиваль', cost:{budget:24,volunteers:12}, ids:['kbr','kchr','ossetia'], eff:{tourism:12,activity:10}, global:{integration:14,cup:14} },
  { name:'Форум регионов СКФО', cost:{budget:30,trust:10,volunteers:8}, ids:['all'], eff:{activity:8,stability:6,culture:5}, global:{integration:22,cup:10} }
];

let state;

function freshState(){
  return {
    started:false, role:null, turn:1, maxTurns:MAX_TURNS, selectedRegionId:null,
    integration:59, cup:27, cupDone:false, gameOver:false,
    resources:{ budget:56, volunteers:37, trust:56, cultural:39 },
    regions:baseRegions.map(r=>({...r, stage:'Рост', crisis:null, wasCrisis:false})),
    hand:[], handPlayed:false, logs:['Кампания началась. Выберите роль и развивайте регионы округа.'],
    councilCooldown:0, projectUsed:[]
  };
}

function save(){ localStorage.setItem('hh_kavkaz_final_save', JSON.stringify(state)); }
function load(){
  try { return JSON.parse(localStorage.getItem('hh_kavkaz_final_save')); } catch(e){ return null; }
}
function archiveResult(result){
  const key='hh_kavkaz_results';
  const list=JSON.parse(localStorage.getItem(key)||'[]');
  list.unshift({...result, date:new Date().toLocaleString('ru-RU')});
  localStorage.setItem(key, JSON.stringify(list.slice(0,12)));
}

function start(roleId){
  state=freshState(); state.started=true; state.role=roles.find(r=>r.id===roleId);
  $('startPanel').hidden=true; $('gameLayout').hidden=false;
  log(`Выбрана роль: ${state.role.name}.`);
  render(); save();
}

function log(text){ state.logs.unshift(`Ход ${state.turn}: ${text}`); state.logs=state.logs.slice(0,40); }
function selectedRegion(){ return state.regions.find(r=>r.id===state.selectedRegionId); }
function avgRegion(r){ return Math.round((r.stability+r.culture+r.activity+r.tourism+r.economy)/5); }
function regionStatus(r){ if(r.stability<35 || avgRegion(r)<42 || r.crisis) return 'crisis'; if(r.stability<55 || avgRegion(r)<58) return 'tension'; return 'stable'; }
function updateStages(){
  state.regions.forEach(r=>{
    const avg=avgRegion(r);
    if(r.crisis || r.stability<35 || avg<42) r.stage='Спад';
    else if(r.wasCrisis && avg>=55) r.stage='Возрождение';
    else if(avg>=76 && r.stability>=65) r.stage='Расцвет';
    else if(avg<60 || r.stability<55) r.stage='Напряжение';
    else r.stage='Рост';
  });
}
function applyRegionEff(r, eff){ Object.keys(eff||{}).forEach(k=>{ r[k]=clamp(r[k]+eff[k]); }); }
function applyGlobal(g){
  state.integration=clamp(state.integration+(g.integration||0));
  state.cup=clamp(state.cup+(g.cup||0));
}
function canPay(cost){ return Object.keys(cost||{}).every(k => state.resources[k] >= cost[k]); }
function pay(cost){ Object.keys(cost||{}).forEach(k => state.resources[k] -= cost[k]); }
function costText(cost){
  const names={budget:'бюджет',volunteers:'волонтёры',trust:'доверие',cultural:'культ. потенциал'};
  return Object.keys(cost||{}).map(k=>`${names[k]} −${cost[k]}`).join(', ') || 'без затрат';
}
function effectText(eff,g){
  const names={stability:'стабильность',culture:'культура',activity:'активность',tourism:'туризм',economy:'экономика',integration:'интеграция',cup:'Кубок'};
  return [...Object.keys(eff||{}).map(k=>`${names[k]} ${eff[k]>0?'+':''}${eff[k]}`), ...Object.keys(g||{}).map(k=>`${names[k]} ${g[k]>0?'+':''}${g[k]}`)];
}
function roleBonus(card, eff, global){
  const e={...eff}, g={...global};
  if(!state.role) return {eff:e, global:g};
  if(state.role.id==='culture' && card.type==='Культура'){ e.culture=(e.culture||0)+4; g.cup=(g.cup||0)+3; }
  if(state.role.id==='tourism' && card.type==='Туризм'){ e.tourism=(e.tourism||0)+4; e.economy=(e.economy||0)+4; }
  if(state.role.id==='cup' && card.type==='Кубок'){ g.cup=(g.cup||0)+6; }
  return {eff:e, global:g};
}

function drawCards(){
  if(state.gameOver) return;
  if(!state.selectedRegionId){ toast('Сначала выберите регион на карте.'); return; }
  if(state.hand.length && !state.handPlayed){ toast('Сначала сыграйте одну из текущих карточек.'); return; }
  const shuffled=[...cards].sort(()=>Math.random()-.5);
  state.hand=shuffled.slice(0,3);
  state.handPlayed=false;
  $('nextStep').textContent='Выберите одну карточку. После применения карточки рука очистится, а игра перейдёт к следующему ходу.';
  render();
}

function playCard(i){
  const card=state.hand[i], r=selectedRegion();
  if(!card || !r || state.handPlayed) return;
  if(!canPay(card.cost)){ toast('Не хватает ресурсов для этой карточки.'); return; }
  pay(card.cost);
  const b=roleBonus(card, card.eff, card.global);
  applyRegionEff(r,b.eff); applyGlobal(b.global);
  r.wasCrisis = r.wasCrisis || !!r.crisis;
  log(`${r.name}: сыграна карточка «${card.name}».`);
  state.hand=[]; state.handPlayed=true;
  flashRegion(r.id);
  endTurn();
}

function endTurn(){
  updateStages();
  passiveEffects();
  if(checkFinish()) { render(); save(); return; }
  state.turn += 1;
  state.hand=[]; state.handPlayed=false;
  if(state.councilCooldown>0) state.councilCooldown--;
  maybeNewCrisis();
  updateStages();
  render(); save();
}

function passiveEffects(){
  // unresolved crises hurt the district each turn
  const crisisCount=state.regions.filter(r=>r.crisis).length;
  if(crisisCount){ state.integration=clamp(state.integration - crisisCount*3); log(`Нерешённые кризисы снизили интеграцию округа на ${crisisCount*3}.`); }
  const avgs=state.regions.map(avgRegion); const diff=Math.max(...avgs)-Math.min(...avgs);
  if(diff>34){ state.integration=clamp(state.integration-5); log('Дисбаланс между регионами снизил интеграцию округа на 5.'); }
  // small resource income
  state.resources.budget=Math.min(100,state.resources.budget+8);
  state.resources.volunteers=Math.min(100,state.resources.volunteers+4);
  state.resources.trust=Math.min(100,state.resources.trust+3);
  state.resources.cultural=Math.min(100,state.resources.cultural+4);
}

function maybeNewCrisis(){
  if(Math.random() < 0.48){
    const candidates=state.regions.filter(r=>!r.crisis);
    if(!candidates.length) return;
    const weakest=candidates.sort((a,b)=>avgRegion(a)-avgRegion(b))[0];
    const random=candidates[Math.floor(Math.random()*candidates.length)];
    const r=Math.random()<.58 ? weakest : random;
    const c=crisisPool[Math.floor(Math.random()*crisisPool.length)];
    r.crisis={...c}; r.wasCrisis=true; applyRegionEff(r,c.damage);
    log(`Кризис в регионе ${r.name}: «${c.name}».`);
  }
}

function solveCrisis(regionId, option){
  const r=state.regions.find(x=>x.id===regionId); if(!r || !r.crisis) return;
  const options=[
    { name:'Молодёжная мобилизация', cost:{budget:10,volunteers:8}, eff:{activity:18,stability:8}, global:{integration:4,cup:5} },
    { name:'Культурная программа', cost:{budget:12,cultural:8}, eff:{culture:18,tourism:6,stability:6}, global:{integration:5,cup:6} },
    { name:'Антикризисный штаб', cost:{budget:14,trust:8}, eff:{stability:22,economy:8}, global:{integration:6,cup:3} }
  ];
  const sol=options[option];
  if(state.role?.id==='crisis') sol.eff.stability += 5;
  if(!canPay(sol.cost)){ toast('Не хватает ресурсов для решения кризиса.'); return; }
  pay(sol.cost); applyRegionEff(r,sol.eff); applyGlobal(sol.global);
  log(`${r.name}: кризис «${r.crisis.name}» решён через «${sol.name}».`);
  r.crisis=null; r.wasCrisis=true; updateStages(); flashRegion(r.id); render(); save();
}

function openCouncil(){
  if(state.councilCooldown>0){ toast('Совет округа доступен позже.'); return; }
  openModal(`<h2>Совет округа</h2><p>Выберите курс на ближайший этап. Совет доступен раз в 3 хода.</p>
  <div class="modal-grid">
    ${[
      ['Курс на культуру','+6 культура всем регионам, +8 интеграция'],
      ['Курс на стабильность','+8 стабильность всем регионам'],
      ['Курс на подготовку Кубка','+18 подготовка Кубка, +4 интеграция'],
      ['Курс на ресурсы','+20 бюджет, +10 волонтёры, +8 доверие']
    ].map((x,i)=>`<button class="solution-btn" onclick="chooseCouncil(${i})"><strong>${x[0]}</strong><span>${x[1]}</span></button>`).join('')}
  </div>`);
}
window.chooseCouncil=function(i){
  if(i===0){ state.regions.forEach(r=>applyRegionEff(r,{culture:6})); state.integration=clamp(state.integration+8); }
  if(i===1){ state.regions.forEach(r=>applyRegionEff(r,{stability:8})); }
  if(i===2){ state.cup=clamp(state.cup+18); state.integration=clamp(state.integration+4); }
  if(i===3){ state.resources.budget=Math.min(100,state.resources.budget+20); state.resources.volunteers=Math.min(100,state.resources.volunteers+10); state.resources.trust=Math.min(100,state.resources.trust+8); }
  state.councilCooldown=3; log('Проведён Совет округа.'); closeModal(); updateStages(); render(); save();
}

function openProjects(){
  openModal(`<h2>Межрегиональные проекты</h2><p>Проекты развивают сразу несколько регионов и повышают интеграцию округа.</p><div class="modal-grid">
    ${projects.map((p,i)=>`<div class="mini-card"><h4>${p.name}</h4><p><b>Стоимость:</b> ${costText(p.cost)}</p><p><b>Эффект:</b> ${effectText(p.eff,p.global).join(', ')}</p><button class="btn green block" onclick="launchProject(${i})" ${state.projectUsed.includes(p.name)?'disabled':''}>Запустить</button></div>`).join('')}
  </div>`);
}
window.launchProject=function(i){
  const p=projects[i]; if(state.projectUsed.includes(p.name)) return;
  if(!canPay(p.cost)){ toast('Не хватает ресурсов для проекта.'); return; }
  pay(p.cost);
  const targets=p.ids[0]==='all'?state.regions:state.regions.filter(r=>p.ids.includes(r.id));
  targets.forEach(r=>applyRegionEff(r,p.eff)); applyGlobal(p.global);
  state.projectUsed.push(p.name); log(`Запущен межрегиональный проект «${p.name}».`);
  closeModal(); updateStages(); render(); save();
}

function conductCup(){
  const blockers=cupBlockers();
  if(blockers.length){ toast('Кубок пока нельзя провести: ' + blockers[0]); return; }
  state.cupDone=true; state.integration=clamp(state.integration+15);
  state.regions.forEach(r=>applyRegionEff(r,{activity:10,tourism:8,culture:6,stability:4}));
  log('Кубок Кавказа успешно проведён. Регионы получили общий импульс развития.');
  checkFinish(true); render(); save();
}
function cupBlockers(){
  const blockers=[];
  if(state.cup<100) blockers.push('подготовка меньше 100');
  if(state.integration<60) blockers.push('интеграция ниже 60');
  if(state.regions.some(r=>regionStatus(r)==='crisis')) blockers.push('есть регионы в кризисе');
  return blockers;
}
function checkFinish(afterCup=false){
  if(state.gameOver) return true;
  const collapse=state.integration<=10 || state.regions.filter(r=>regionStatus(r)==='crisis').length>=4;
  if(collapse){ finish('Кризис регионального баланса', 'Несколько регионов ушли в глубокий спад, а интеграция округа разрушилась.'); return true; }
  if(afterCup){
    const avg=Math.round(state.regions.reduce((s,r)=>s+avgRegion(r),0)/state.regions.length);
    if(state.integration>=85 && avg>=72) finish('Культурное единство Кавказа', 'Кубок стал сильным объединяющим событием, а регионы сохранили высокий баланс развития.');
    else finish('Стабильное развитие округа', 'Кубок проведён успешно, но отдельные направления требуют дальнейшей поддержки.');
    return true;
  }
  if(state.turn>=state.maxTurns){
    if(state.cupDone) finish('Кампания завершена', 'Кубок состоялся, округ сохранил развитие.');
    else finish('Частичный успех', 'Округ развивался, но Кубок Кавказа не удалось подготовить вовремя.');
    return true;
  }
  return false;
}
function finish(title, text){
  state.gameOver=true;
  archiveResult({title, integration:state.integration, cup:state.cup, turn:state.turn, role:state.role?.name||'без роли'});
  openModal(`<h2>${title}</h2><p>${text}</p><div class="modal-grid"><div class="mini-card"><h4>Интеграция</h4><p>${state.integration}%</p></div><div class="mini-card"><h4>Подготовка Кубка</h4><p>${state.cup}%</p></div><div class="mini-card"><h4>Ход</h4><p>${state.turn}/${state.maxTurns}</p></div></div><button class="btn danger block" onclick="newGame()">Начать заново</button>`);
}

function render(){
  updateStages();
  $('turnNow').textContent=state.turn; $('turnMax').textContent=state.maxTurns; $('rolePill').textContent=state.role?.name||'Без роли';
  $('integrationValue').textContent=state.integration+'%'; $('integrationBar').style.width=state.integration+'%';
  $('cupValue').textContent=state.cup+'%'; $('cupBar').style.width=state.cup+'%';
  $('resourceGrid').innerHTML=[['budget','Бюджет'],['volunteers','Волонтёры'],['trust','Доверие'],['cultural','Культурный потенциал']].map(([k,n])=>`<div class="resource-card"><span>${n}</span><strong>${state.resources[k]}</strong></div>`).join('');
  $('regionsGrid').innerHTML=state.regions.map(r=>regionHtml(r)).join('');
  document.querySelectorAll('.region-card').forEach(el=>el.addEventListener('click',()=>selectRegion(el.dataset.id)));
  const sr=selectedRegion();
  $('selectedRegionPill').textContent=sr?sr.name:'Регион не выбран';
  $('turnTitle').textContent=sr?`Выбран регион: ${sr.name}`:'Выберите регион';
  $('detailsBox').innerHTML=sr?detailsHtml(sr):'Выберите регион, чтобы увидеть его особенности, текущую стадию и кризисы.';
  renderHand(); renderCrisisBox(); renderGoals(); renderLog();
  $('cupBtn').disabled=state.cupDone || cupBlockers().length>0 || state.gameOver;
  $('drawBtn').disabled=state.gameOver || !state.selectedRegionId;
  $('councilBtn').disabled=state.gameOver || state.councilCooldown>0;
  $('projectsBtn').disabled=state.gameOver;
}
function regionHtml(r){
  const status=regionStatus(r);
  const stats=[['stability','Стабильность'],['culture','Культура'],['activity','Активность'],['tourism','Туризм'],['economy','Экономика']];
  return `<article class="region-card ${status} ${state.selectedRegionId===r.id?'selected':''}" data-id="${r.id}" id="region-${r.id}">
    <div class="emoji">${r.emoji}</div><h3>${r.name}</h3><div class="stage">Стадия: ${r.stage}</div>
    ${stats.map(([k,n])=>`<div class="stat"><div class="stat-head"><span>${n}</span><b>${r[k]}</b></div><div class="stat-bar"><i style="width:${r[k]}%"></i></div></div>`).join('')}
    ${r.crisis?`<span class="crisis-badge">Кризис: ${r.crisis.name}</span>`:''}
  </article>`;
}
function detailsHtml(r){
  return `<h3>${r.name}</h3><p><b>Особенность:</b> ${r.feature}</p><p><b>Стадия:</b> ${r.stage}</p><p><b>Среднее развитие:</b> ${avgRegion(r)}%</p>${r.crisis?`<p><b>Кризис:</b> ${r.crisis.name}. ${r.crisis.desc}</p>`:'<p>Кризисов нет. Регион можно развивать через карточки или проекты.</p>'}`;
}
function renderHand(){
  const grid=$('handGrid');
  if(!state.hand.length){ grid.innerHTML=''; return; }
  const r=selectedRegion();
  grid.innerHTML=state.hand.map((c,i)=>{
    const b=roleBonus(c,c.eff,c.global);
    return `<article class="play-card"><span class="type">${c.type}</span><h3>${c.name}</h3><p>${c.desc}</p><div class="cost">Стоимость: ${costText(c.cost)}</div><div class="effects">${effectText(b.eff,b.global).map(x=>`<span class="effect">${x}</span>`).join('')}</div><button class="btn primary block" onclick="playCard(${i})" ${!r?'disabled':''}>Применить к региону</button></article>`;
  }).join('');
}
function renderCrisisBox(){
  const box=$('crisisBox'); const crises=state.regions.filter(r=>r.crisis);
  if(!crises.length){ box.innerHTML=''; return; }
  box.innerHTML=`<h3>Активные кризисы</h3>${crises.map(r=>`<div class="crisis-item"><h4>${r.name}: ${r.crisis.name}</h4><p>${r.crisis.desc}</p><div class="solution-grid">
    <button class="solution-btn" onclick="solveCrisis('${r.id}',0)"><strong>Молодёжная мобилизация</strong><span>Бюджет −10, волонтёры −8. Активность и стабильность растут.</span></button>
    <button class="solution-btn" onclick="solveCrisis('${r.id}',1)"><strong>Культурная программа</strong><span>Бюджет −12, культ. потенциал −8. Культура и туризм растут.</span></button>
    <button class="solution-btn" onclick="solveCrisis('${r.id}',2)"><strong>Антикризисный штаб</strong><span>Бюджет −14, доверие −8. Стабильность и экономика растут.</span></button>
  </div></div>`).join('')}`;
}
function renderGoals(){
  const blockers=cupBlockers();
  $('goalList').innerHTML=[
    ['Подготовка Кубка 100%', state.cup>=100],
    ['Интеграция не ниже 60%', state.integration>=60],
    ['Нет регионов в кризисе', !state.regions.some(r=>regionStatus(r)==='crisis')],
    ['Кубок проведён', state.cupDone]
  ].map(([t,d])=>`<li class="${d?'done':''}">${d?'✓':'○'} ${t}</li>`).join('');
  if(!state.hand.length && !state.gameOver){
    $('nextStep').textContent = state.selectedRegionId ? 'Нажмите «Получить 3 карточки», выберите одну — она сразу применится к выбранному региону и исчезнет.' : 'Сначала выберите регион на карте.';
  }
}
function renderLog(){ $('logList').innerHTML=state.logs.map(x=>`<div class="log-item">${x}</div>`).join(''); }
function selectRegion(id){ state.selectedRegionId=id; render(); save(); }
function flashRegion(id){ setTimeout(()=>{ const el=$('region-'+id); if(el){el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),650)}},30); }

function openModal(html){ $('modalContent').innerHTML=html; $('modal').classList.add('open'); $('modal').setAttribute('aria-hidden','false'); }
function closeModal(){ $('modal').classList.remove('open'); $('modal').setAttribute('aria-hidden','true'); $('modalContent').innerHTML=''; }
function toast(text){ openModal(`<h2>Подсказка</h2><p>${text}</p>`); }
function showRules(){ openModal(`<h2>Как играть</h2><ol><li>Выберите роль.</li><li>Выберите регион на карте.</li><li>Нажмите «Получить 3 карточки» и сыграйте одну.</li><li>Карточка изменит показатели выбранного региона и исчезнет.</li><li>Решайте кризисы, иначе они снижают интеграцию округа.</li><li>Подготовьте Кубок до 100%, держите интеграцию выше 60 и проведите Кубок до 18 хода.</li></ol><p>Суть игры — не прокачать один регион до небес, а удержать баланс всего округа. Если один регион проседает, страдает общая интеграция.</p>`); }
function showDeck(){ openModal(`<h2>Колода карточек</h2><div class="modal-grid">${cards.map(c=>`<div class="mini-card"><h4>${c.name}</h4><p><b>${c.type}</b></p><p>${c.desc}</p><p>${effectText(c.eff,c.global).join(', ')}</p></div>`).join('')}</div>`); }
function showArchive(){ const list=JSON.parse(localStorage.getItem('hh_kavkaz_results')||'[]'); openModal(`<h2>Архив прохождений</h2>${list.length?`<table class="archive-table"><tr><th>Дата</th><th>Итог</th><th>Интеграция</th><th>Кубок</th></tr>${list.map(r=>`<tr><td>${r.date}</td><td>${r.title}</td><td>${r.integration}%</td><td>${r.cup}%</td></tr>`).join('')}</table>`:'<p>Пока нет завершённых кампаний.</p>'}`); }
function newGame(){ localStorage.removeItem('hh_kavkaz_final_save'); state=freshState(); closeModal(); init(true); }
window.newGame=newGame; window.playCard=playCard; window.solveCrisis=solveCrisis;

function renderRoles(){ $('roleGrid').innerHTML=roles.map(r=>`<article class="role-card" data-id="${r.id}"><div class="icon">${r.icon}</div><h3>${r.name}</h3><p>${r.desc}</p><p><b>${r.bonus}</b></p></article>`).join(''); document.querySelectorAll('.role-card').forEach(el=>el.addEventListener('click',()=>start(el.dataset.id))); }
function init(forceFresh=false){
  renderRoles();
  state = forceFresh ? freshState() : (load() || freshState());
  if(state.started){ $('startPanel').hidden=true; $('gameLayout').hidden=false; render(); } else { $('startPanel').hidden=false; $('gameLayout').hidden=true; }
  $('drawBtn').onclick=drawCards; $('councilBtn').onclick=openCouncil; $('projectsBtn').onclick=openProjects; $('cupBtn').onclick=conductCup; $('rulesBtn').onclick=showRules; $('deckBtn').onclick=showDeck; $('saveBtn').onclick=()=>{save(); toast('Кампания сохранена в браузере.');}; $('resetBtn').onclick=newGame;
  $('modalClose').onclick=closeModal; $('modal').addEventListener('click',e=>{ if(e.target.id==='modal') closeModal(); }); document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
}

init();
