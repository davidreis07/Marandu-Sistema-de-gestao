const stages = [
  { id:"ideacao", number:1, name:"Ideação", icon:"IDE", color:"#c8141d", criteria:["Identificação e validação de um problema","Mapeamento de stakeholders e persona","Análise preliminar de mercado e concorrência","Proposta de valor clara"] },
  { id:"validacao", number:2, name:"Validação", icon:"VAL", color:"#ff5a12", criteria:["Desenvolvimento de um MVP","Testes iniciais com early adopters","Feedback aplicado e iterações","Modelo de negócio validado","Canal de aquisição testado"] },
  { id:"operacao", number:3, name:"Operação Inicial", icon:"OPS", color:"#f6a400", criteria:["Primeiros clientes pagantes ou 50 usuários ativos","Funil de vendas definido","Modelo financeiro inicial","Equipe com papéis definidos"] },
  { id:"tracao", number:4, name:"Tração", icon:"TRC", color:"#f7c800", criteria:["Crescimento consistente","KPIs estruturados","Processos automatizados","Empresa formalizada","Material de captação preparado"] },
  { id:"aceleracao", number:5, name:"Aceleração", icon:"ACC", color:"#062645", criteria:["Receita recorrente validada","Expansão para novos mercados","Parcerias estratégicas","Governança e compliance","Acesso a capital externo"] }
];

const startup = {
  name:"Amazônia BioSensores",
  program:"Programa Marandu 2026",
  consultant:"Camila Rocha",
  status:"Em evolução",
  trl:"TRL 5",
  journeyStage:"Validação",
  updated:"04/08/2026",
  meetings:12,
  documents:28,
  lastNote:"Priorizar evidências de validação comercial e documentação do funil de vendas."
};

const state = { openStage:"validacao", selected:null, justCompleted:null, completedStage:null, events:[
  { icon:"R", title:"Reunião realizada", date:"04/08/2026", owner:"Camila Rocha" },
  { icon:"E", title:"Nova evidência enviada", date:"01/08/2026", owner:"Startup" },
  { icon:"C", title:"Critério concluído", date:"29/07/2026", owner:"Consultor" },
  { icon:"T", title:"TRL atualizado", date:"22/07/2026", owner:"Coordenação" },
  { icon:"O", title:"Observação registrada", date:"18/07/2026", owner:"Mentoria" }
] };

stages.forEach((stage, stageIndex) => {
  stage.criteria = stage.criteria.map((name, index) => ({
    id:`${stage.id}-${index}`,
    name,
    evidences: Math.max(0, stageIndex - 1 + (index % 2)),
    done: stageIndex < 2 || (stageIndex === 2 && index < 2),
    updated: `0${Math.min(9,index + 1)}/08/2026`
  }));
});

function stageProgress(stage){
  const done = stage.criteria.filter(item => item.done).length;
  return Math.round((done / stage.criteria.length) * 100);
}
function overallProgress(){
  const all = stages.flatMap(stage => stage.criteria);
  return Math.round((all.filter(item => item.done).length / all.length) * 100);
}
function toast(message){
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1900);
}
function renderMeta(){
  const items = [["Programa",startup.program],["Consultor",startup.consultant],["Status",startup.status],["TRL",startup.trl],["Etapa da startup",startup.journeyStage],["Jornada",`${overallProgress()}%`],["Atualização",startup.updated],["Responsável","Coordenação"]];
  document.getElementById("startupMeta").innerHTML = items.map(([label,value]) => `<div class="meta-card"><span>${label}</span><strong>${value}</strong></div>`).join("");
}
function renderJourney(){
  const nextStage = stages.find(stage => stageProgress(stage) < 100) || stages.at(-1);
  const nextCriterion = nextStage.criteria.find(item => !item.done) || nextStage.criteria.at(-1);
  document.getElementById("journeyCommand").innerHTML = `
    <div>
      <span class="eyebrow">Próximo passo sugerido</span>
      <strong>${nextCriterion.name}</strong>
      <small>${nextStage.name} · adicione evidência para avançar a jornada</small>
    </div>
    <button class="ghost-button" data-stage="${nextStage.id}" type="button">Abrir etapa recomendada</button>
  `;

  document.getElementById("stageStack").innerHTML = stages.map(stage => {
    const progress = stageProgress(stage);
    const done = stage.criteria.filter(item => item.done).length;
    const pending = stage.criteria.length - done;
    const status = progress === 100 ? "Concluída" : progress >= 55 ? "Em evolução" : "Necessita atenção";
    const statusClass = progress === 100 ? "success" : progress >= 55 ? "warning" : "alert";
    return `<article class="stage-card ${state.openStage === stage.id ? "open" : ""} ${state.completedStage === stage.id ? "celebrate" : ""}">
      <button class="stage-left" data-stage="${stage.id}" style="background:${stage.color}" type="button" aria-expanded="${state.openStage === stage.id}">
        <span class="stage-number">${stage.number}</span><div><div class="stage-icon">${stage.icon}</div><h3>${stage.name}</h3><small>${pending ? `${pending} pendente(s)` : "Etapa completa"}</small></div>
      </button>
      <div class="stage-content">
        <div class="section-heading"><div><span class="eyebrow">Etapa ${stage.number}</span><h3>${stage.name}</h3></div><span class="badge ${statusClass}">${status}</span></div>
        <div class="progress" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><i style="width:${progress}%"></i></div>
        <div class="stage-stats"><b>${progress}% concluído</b><span>${done} critérios concluídos</span><span>${pending} pendentes</span></div>
        <div class="criteria-grid">${stage.criteria.map(item => `<div class="criterion-card ${item.done ? "done" : ""} ${state.justCompleted === item.id ? "just-completed" : ""}">
          <div class="criterion-head"><b>${item.name}</b><span class="badge ${item.done ? "success" : "dark"}">${item.done ? "Concluído" : "Pendente"}</span></div>
          <div class="criterion-meta"><span>${item.evidences} evidência(s)</span><span>Atualizado em ${item.updated}</span></div>
          <div class="criterion-footer">
            <span>${item.done ? "Pronto para auditoria" : "Aguardando comprovação"}</span>
            <button class="ghost-button add-evidence" data-criterion="${item.id}" type="button">${item.done ? "Adicionar nova" : "Adicionar Evidência"}</button>
          </div>
        </div>`).join("")}</div>
      </div>
    </article>`;
  }).join("");
  const overall = overallProgress();
  document.getElementById("overallPill").textContent = `${overall}% da jornada concluída`;
  document.getElementById("overallScore").textContent = `${overall}%`;
  document.querySelector(".score-ring").style.setProperty("--score", `${overall}%`);
}
function renderInsights(){
  const nextStage = stages.find(stage => stageProgress(stage) < 100) || stages.at(-1);
  const allCriteria = stages.flatMap(stage => stage.criteria.map(item => ({...item, stage:stage.name})));
  const lastEvidence = allCriteria.filter(item => item.evidences > 0).at(-1);
  const rows = [["Percentual geral",`${overallProgress()}%`],["TRL Atual",startup.trl],["Etapa da startup",startup.journeyStage],["Próxima etapa recomendada",nextStage.name],["Última evidência",lastEvidence ? lastEvidence.name : "Sem evidências"],["Última observação",startup.lastNote],["Reuniões",startup.meetings],["Documentos",startup.documents]];
  document.getElementById("insightList").innerHTML = rows.map(([label,value]) => `<div class="insight-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
}
function renderStartupOverview(){
  const progress = overallProgress();
  const nextStage = stages.find(stage => stageProgress(stage) < 100) || stages.at(-1);
  const pendingCriteria = stages.flatMap(stage => stage.criteria.map(item => ({...item, stage:stage.name}))).filter(item => !item.done);
  const lastEvidence = stages.flatMap(stage => stage.criteria.map(item => ({...item, stage:stage.name}))).filter(item => item.evidences > 0).at(-1);
  const cerneSummary = summarizeCerne();
  const cerneLabel = cerneSummary.current.startsWith("Cerne 1 em") ? cerneSummary.current : cerneSummary.current;
  const trlScore = 56;
  const pendingScore = Math.max(35, 100 - pendingCriteria.length * 6);
  const updateScore = 84;
  const healthScore = Math.round((progress * .42) + (trlScore * .25) + (pendingScore * .2) + (updateScore * .13));
  const healthStatus = healthScore >= 76 ? "Saudável" : healthScore >= 56 ? "Atenção" : "Crítica";
  const healthTone = healthScore >= 76 ? "healthy" : healthScore >= 56 ? "attention" : "critical";

  document.getElementById("startupHealthCard").innerHTML = `
    <span class="eyebrow">Saúde da Startup</span>
    <div class="startup-health-status ${healthTone}">
      <strong>${healthScore}%</strong>
      <span>${healthStatus}</span>
    </div>
    <p>Composição visual por jornada, TRL, pendências e atualização. Próximo foco: ${nextStage.name}.</p>
    <div class="startup-health-bar ${healthTone}" role="progressbar" aria-valuenow="${healthScore}" aria-valuemin="0" aria-valuemax="100"><i style="width:${healthScore}%"></i></div>
    <div class="health-factor-grid">
      <span><b>${progress}%</b>Jornada</span>
      <span><b>${trlScore}%</b>TRL</span>
      <span><b>${pendingScore}%</b>Pendências</span>
      <span><b>${updateScore}%</b>Atualização</span>
    </div>
  `;

  document.getElementById("startupOverviewKpis").innerHTML = [
    ["Status", startup.status, "Acompanhamento ativo"],
    ["Programa", startup.program, "Ciclo de incubação"],
    ["Consultor", startup.consultant, "Responsável atual"],
    ["TRL", startup.trl, "Maturidade tecnológica"],
    ["CERNE", cerneLabel, "Status institucional da incubadora"],
    ["Jornada", `${progress}%`, `${pendingCriteria.length} pendência(s)`],
  ].map(([label,value,hint]) => `<article class="overview-kpi"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`).join("");

  document.getElementById("startupRecommendedAction").innerHTML = `
    <span class="eyebrow">Próxima ação recomendada</span>
    <h3>${pendingCriteria[0]?.name || "Revisar evidências finais"}</h3>
    <p>${pendingCriteria[0] ? `Critério pendente em ${pendingCriteria[0].stage}.` : "A jornada está próxima da conclusão simulada."}</p>
    <button class="primary-button" data-stage="${nextStage.id}" data-open-journey type="button">Abrir etapa</button>
  `;

  document.getElementById("startupLastMeeting").innerHTML = `
    <div class="panel-title"><h3>Última reunião</h3><span>04/08/2026</span></div>
    <p>Mentoria comercial realizada com ${startup.consultant} para revisar validação de mercado e próximos documentos.</p>
    <div class="control-meta"><span>Responsável</span><strong>${startup.consultant}</strong></div>
  `;

  document.getElementById("startupLastEvidence").innerHTML = `
    <div class="panel-title"><h3>Última evidência</h3><span>${lastEvidence?.updated || "Sem registro"}</span></div>
    <p>${lastEvidence?.name || "Nenhuma evidência enviada no protótipo."}</p>
    <div class="control-meta"><span>Quantidade vinculada</span><strong>${lastEvidence?.evidences || 0}</strong></div>
  `;

  document.getElementById("startupPendingList").innerHTML = `
    <div class="panel-title"><h3>Pendências</h3><span>${pendingCriteria.length} abertas</span></div>
    <div class="pending-list">
      ${pendingCriteria.slice(0, 4).map(item => `<div class="pending-row"><div><b>${item.name}</b><span>${item.stage}</span></div><strong>Ação</strong></div>`).join("")}
    </div>
  `;

  document.getElementById("startupMiniTimeline").innerHTML = state.events.slice(0, 4).map(event => `
    <div class="mini-timeline-item"><span>${event.icon}</span><div><b>${event.title}</b><small>${event.date} · ${event.owner}</small></div></div>
  `).join("");
}
function getCerneIndicators(){
  return window.NexusSeed?.indicadores || [];
}
function cerneLevelNumber(level){
  return Number(String(level || "").replace(/\D/g,"")) || 0;
}
function summarizeCerne(){
  const indicators = getCerneIndicators();
  const levels = ["Cerne 1","Cerne 2","Cerne 3","Cerne 4"].map(level => {
    const items = indicators.filter(indicator => indicator.nivelCerne === level);
    const completed = items.filter(indicator => indicator.status === "atendido").length;
    const reviewing = items.filter(indicator => indicator.status === "em análise" || indicator.status === "em anÃ¡lise").length;
    const pending = Math.max(0, items.length - completed - reviewing);
    const required = items.filter(indicator => indicator.obrigatorio);
    const requiredCompleted = required.filter(indicator => indicator.status === "atendido").length;
    const percentage = items.length ? Math.round((completed / items.length) * 100) : 0;
    const requiredPercentage = required.length ? Math.round((requiredCompleted / required.length) * 100) : 0;
    const achieved = percentage >= 80 && requiredPercentage >= 80;
    return { level, items, total:items.length, completed, reviewing, pending, required:required.length, requiredCompleted, percentage, requiredPercentage, achieved };
  });
  const achievedLevels = levels.filter(level => level.achieved);
  const current = achievedLevels.length ? achievedLevels.at(-1).level : "Cerne 1 em implantação";
  const next = levels.find(level => !level.achieved) || levels.at(-1);
  const totalCompleted = indicators.filter(indicator => indicator.status === "atendido").length;
  return { indicators, levels, current, next, totalCompleted };
}
function normalizeText(value){
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
}
function cerneStatusKind(status){
  const value = normalizeText(status);
  if(value === "atendido") return "completed";
  if(value === "pendente") return "pending";
  return "reviewing";
}
function cerneStatusTone(status){
  const kind = cerneStatusKind(status);
  return kind === "completed" ? "success" : kind === "pending" ? "alert" : "warning";
}
function hydrateCerneFilter(id, values){
  const select = document.getElementById(id);
  if(!select) return;
  const current = select.value;
  const uniqueValues = [...new Set(values.filter(Boolean))].sort((a,b) => String(a).localeCompare(String(b), "pt-BR"));
  select.innerHTML = `<option value="">Todos</option>${uniqueValues.map(value => `<option value="${value}">${value}</option>`).join("")}`;
  select.value = uniqueValues.includes(current) ? current : "";
}
function hydrateCerneFilters(indicators){
  hydrateCerneFilter("cerneLevelFilter", indicators.map(indicator => indicator.nivelCerne));
  hydrateCerneFilter("cerneStatusFilter", indicators.map(indicator => indicator.status));
  hydrateCerneFilter("cerneAudienceFilter", indicators.map(indicator => indicator.publico));
  hydrateCerneFilter("cerneProcessFilter", indicators.map(indicator => indicator.processo));
}
function getCerneFilters(){
  return {
    search: normalizeText(document.getElementById("cerneSearch")?.value),
    level: document.getElementById("cerneLevelFilter")?.value || "",
    status: document.getElementById("cerneStatusFilter")?.value || "",
    audience: document.getElementById("cerneAudienceFilter")?.value || "",
    process: document.getElementById("cerneProcessFilter")?.value || ""
  };
}
function filterCerneIndicators(indicators){
  const filters = getCerneFilters();
  return indicators.filter(indicator => {
    const searchable = normalizeText([indicator.id, indicator.nome, indicator.processo, indicator.pratica, indicator.publico, indicator.responsavel, indicator.nivelCerne, indicator.status].join(" "));
    return (!filters.search || searchable.includes(filters.search)) &&
      (!filters.level || indicator.nivelCerne === filters.level) &&
      (!filters.status || indicator.status === filters.status) &&
      (!filters.audience || indicator.publico === filters.audience) &&
      (!filters.process || indicator.processo === filters.process);
  });
}
function renderMiniBar(label, value, detail, tone = "blue"){
  return `<div class="cerne-bar-row ${tone}">
    <div><b>${label}</b><span>${detail}</span></div>
    <div class="cerne-bar-track"><i style="width:${value}%"></i></div>
    <strong>${value}%</strong>
  </div>`;
}
function renderCerneStatus(){
  const summary = summarizeCerne();
  const total = summary.indicators.length;
  hydrateCerneFilters(summary.indicators);
  const filteredIndicators = filterCerneIndicators(summary.indicators);
  const completed = summary.indicators.filter(indicator => cerneStatusKind(indicator.status) === "completed").length;
  const reviewing = summary.indicators.filter(indicator => cerneStatusKind(indicator.status) === "reviewing").length;
  const pending = summary.indicators.filter(indicator => cerneStatusKind(indicator.status) === "pending").length;
  const completion = total ? Math.round((completed / total) * 100) : 0;
  const reviewingShare = total ? Math.round((reviewing / total) * 100) : 0;
  const reviewingStop = Math.min(100, completion + reviewingShare);
  const currentText = summary.current.startsWith("Cerne 1 em") ? summary.current : `Incubadora classificada em ${summary.current}`;
  document.getElementById("incubatorCerneStatus").textContent = currentText;
  document.getElementById("incubatorCerneExplanation").textContent = `Base visual com ${total} indicadores CERNE da incubadora. O próximo foco é ${summary.next.level}: ${summary.next.completed}/${summary.next.total} indicadores atendidos.`;
  document.getElementById("cerneKpis").innerHTML = [
    ["Indicadores CERNE", total],
    ["Conformidade", `${completion}%`],
    ["Atendidos", completed],
    ["Pendentes", pending],
  ].map(([label,value]) => `<div class="meta-card"><span>${label}</span><strong>${value}</strong></div>`).join("");

  document.getElementById("cerneSignalCards").innerHTML = [
    ["green", "Concluídos", completed, "Indicadores com evidência suficiente para auditoria"],
    ["yellow", "Em andamento", reviewing, "Indicadores em validação ou revisão técnica"],
    ["red", "Pendentes", pending, "Indicadores que ainda precisam de evidência"],
  ].map(([tone,label,value,detail]) => `<article class="signal-card ${tone}">
    <span class="farol-dot"></span>
    <div><b>${label}</b><strong>${value}</strong><small>${detail}</small></div>
  </article>`).join("");

  document.getElementById("cerneStatusChart").innerHTML = `
    <div class="cerne-donut" style="background:conic-gradient(#1f9d55 0 ${completion}%, #f6a400 ${completion}% ${reviewingStop}%, #d92d20 ${reviewingStop}% 100%)">
      <span><strong>${completion}%</strong><small>atendido</small></span>
    </div>
    <div class="donut-legend">
      <span><i style="background:#1f9d55"></i>${completed} concluídos</span>
      <span><i style="background:#f6a400"></i>${reviewing} em andamento</span>
      <span><i style="background:#d92d20"></i>${pending} pendentes</span>
    </div>`;

  document.getElementById("cerneLevels").innerHTML = summary.levels.map(level => {
    const status = level.achieved ? "Nível atendido" : level.percentage >= 50 ? "Em evolução" : "Necessita evidências";
    const tone = level.achieved ? "success" : level.percentage >= 50 ? "warning" : "alert";
    return `<article class="cerne-level-card">
      <div class="section-heading"><div><span class="eyebrow">${level.level}</span><h3>${status}</h3></div><span class="badge ${tone}">${level.percentage}%</span></div>
      <div class="progress" role="progressbar" aria-valuenow="${level.percentage}" aria-valuemin="0" aria-valuemax="100"><i style="width:${level.percentage}%"></i></div>
      <div class="cerne-breakdown">
        <span>${level.completed} atendidos</span>
        <span>${level.reviewing} em análise</span>
        <span>${level.pending} pendentes</span>
        <span>${level.requiredCompleted}/${level.required} obrigatórios</span>
      </div>
    </article>`;
  }).join("");

  document.getElementById("cerneLevelChart").innerHTML = summary.levels.map(level => renderMiniBar(level.level, level.percentage, `${level.completed}/${level.total} indicadores atendidos`, "blue")).join("");
  document.getElementById("cerneRequiredChart").innerHTML = summary.levels.map(level => renderMiniBar(level.level, level.requiredPercentage, `${level.requiredCompleted}/${level.required} obrigatórios atendidos`, level.requiredPercentage >= 80 ? "green" : "orange")).join("");
  const processRows = [...new Set(summary.indicators.map(indicator => indicator.processo))].map(process => {
    const items = summary.indicators.filter(indicator => indicator.processo === process);
    const open = items.filter(indicator => cerneStatusKind(indicator.status) !== "completed").length;
    const pct = items.length ? Math.round(((items.length - open) / items.length) * 100) : 0;
    return { process, open, pct, total:items.length };
  }).sort((a,b) => b.open - a.open).slice(0, 6);
  document.getElementById("cerneProcessChart").innerHTML = processRows.map(row => `<div class="process-risk-row">
    <div><b>${row.process}</b><span>${row.open} pendente(s) ou em andamento de ${row.total}</span></div>
    <strong>${row.pct}%</strong>
  </div>`).join("");

  document.getElementById("cerneResultCount").textContent = `${filteredIndicators.length} de ${total} indicadores exibidos`;
  document.getElementById("cerneIndicatorTable").innerHTML = filteredIndicators.length ? filteredIndicators.map(indicator => {
    const tone = cerneStatusTone(indicator.status);
    const statusClass = cerneStatusKind(indicator.status);
    return `<div class="cerne-indicator-row ${statusClass}">
      <span class="farol-dot"></span>
      <div><b>${indicator.id} - ${indicator.nome}</b><span>${indicator.processo} · ${indicator.pratica}</span></div>
      <span>${indicator.nivelCerne}</span>
      <span>${indicator.publico || "Institucional"}</span>
      <span>${indicator.obrigatorio ? "Obrigatório" : "Recomendado"}</span>
      <span class="badge ${tone}">${indicator.status}</span>
    </div>`;
  }).join("") : `<div class="empty-state"><b>Nenhum indicador encontrado</b><span>Ajuste a pesquisa ou limpe os filtros para voltar à base completa dos 53 indicadores.</span></div>`;
}
function renderTimeline(){
  document.getElementById("timeline").innerHTML = state.events.map(event => `<div class="timeline-item"><div class="timeline-icon">${event.icon}</div><b>${event.title}</b><span>${event.date}</span><span>${event.owner}</span></div>`).join("");
}
function renderWorkspace(){
  const quickIndicators = [
    ["Hoje", "9", "ações prioritárias"],
    ["Atrasadas", "4", "startups em atenção"],
    ["Evidências", "21", "critérios aguardando"],
    ["Reuniões", "6", "agenda do dia"],
  ];
  const priorities = [
    ["Alta", "Validar evidência do MVP", "Amazônia BioSensores", "Hoje, 10:30"],
    ["Alta", "Revisar pendência de funil", "EcoTrace", "Hoje, 11:00"],
    ["Média", "Preparar parecer de TRL", "NorteMed", "Hoje, 14:30"],
    ["Média", "Atualizar observação da mentoria", "BioFlora", "Amanhã"],
  ];
  const calendar = [
    ["09:00", "Mentoria comercial", "EcoTrace"],
    ["10:30", "Validação de evidência", "Amazônia BioSensores"],
    ["14:30", "Reunião TRL", "NorteMed"],
    ["16:00", "Follow-up mensal", "BioFlora"],
  ];
  const activities = [
    ["done", "Documento aprovado", "Contrato piloto anexado"],
    ["active", "Parecer em elaboração", "Revisão técnica em andamento"],
    ["pending", "Checklist aguardando", "2 critérios sem evidência"],
  ];
  const notifications = [
    ["alert", "Startup atrasada", "EcoTrace tem 2 evidências vencidas"],
    ["warning", "Prazo próximo", "Parecer deve ser concluído até 17h"],
    ["success", "Evidência aprovada", "Amazônia BioSensores avançou na jornada"],
  ];
  const productivity = 72;

  document.getElementById("workspaceGrid").innerHTML = `
    <section class="workspace-intelligence">
      <div class="workspace-kpis">
        ${quickIndicators.map(([label,value,hint]) => `<article class="workspace-kpi"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`).join("")}
      </div>

      <article class="workspace-focus-card">
        <div>
          <span class="eyebrow">Foco do consultor</span>
          <h3>O que precisa ser feito hoje</h3>
          <p>Prioridades organizadas para reduzir retrabalho e deixar claro o próximo passo de acompanhamento.</p>
        </div>
        <div class="productivity-widget">
          <div class="productivity-head"><span>Produtividade do dia</span><strong>${productivity}%</strong></div>
          <div class="productivity-bar" role="progressbar" aria-valuenow="${productivity}" aria-valuemin="0" aria-valuemax="100"><i style="width:${productivity}%"></i></div>
          <small>5 de 7 ações críticas encaminhadas</small>
        </div>
      </article>

      <div class="workspace-main-grid">
        <article class="workspace-card smart-card priority-card">
          <div class="panel-title"><h3>Lista de prioridades</h3><span>Ordenada por urgência</span></div>
          <div class="priority-list">
            ${priorities.map(([level,title,startupName,time]) => `<div class="priority-item ${level === "Alta" ? "high" : "medium"}"><span>${level}</span><div><b>${title}</b><small>${startupName} · ${time}</small></div><button class="ghost-button" data-workspace-action="Abrindo prioridade: ${title}" type="button">Abrir</button></div>`).join("")}
          </div>
        </article>

        <article class="workspace-card smart-card">
          <div class="panel-title"><h3>Calendário resumido</h3><span>Hoje</span></div>
          <div class="calendar-list">
            ${calendar.map(([time,title,startupName]) => `<div class="calendar-item"><time>${time}</time><div><b>${title}</b><span>${startupName}</span></div></div>`).join("")}
          </div>
        </article>

        <article class="workspace-card smart-card">
          <div class="panel-title"><h3>Critérios aguardando evidências</h3><span>Fila de análise</span></div>
          <ul class="evidence-queue">
            <li><b>MVP validado</b><span>Amazônia BioSensores</span><strong>Hoje</strong></li>
            <li><b>Funil de vendas definido</b><span>EcoTrace</span><strong>2 dias</strong></li>
            <li><b>KPIs estruturados</b><span>NorteMed</span><strong>Semana</strong></li>
          </ul>
        </article>

        <article class="workspace-card smart-card">
          <div class="panel-title"><h3>Notificações</h3><span>Atenção necessária</span></div>
          <div class="notification-list">
            ${notifications.map(([tone,title,text]) => `<div class="notification-item ${tone}"><b>${title}</b><span>${text}</span></div>`).join("")}
          </div>
        </article>

        <article class="workspace-card smart-card activity-card">
          <div class="panel-title"><h3>Atividades recentes</h3><span>Fluxo do dia</span></div>
          <div class="activity-list">
            ${activities.map(([status,title,text]) => `<div class="activity-item ${status}"><i></i><div><b>${title}</b><span>${text}</span></div></div>`).join("")}
          </div>
        </article>

        <article class="workspace-card smart-card delayed-card">
          <div class="panel-title"><h3>Startups atrasadas</h3><span>Monitoramento</span></div>
          <div class="delayed-list">
            ${[["EcoTrace","2 evidências vencidas","Vermelho"],["NorteMed","Parecer pendente","Amarelo"],["BioFlora","Reunião sem ata","Amarelo"]].map(([name,reason,status]) => `<div class="delayed-item"><div><b>${name}</b><span>${reason}</span></div><strong>${status}</strong></div>`).join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}
function renderExecutiveDashboard(){
  const programs = [["Marandu Lab",18,14],["Marandu Growth",12,9],["Pré-incubação",9,6],["Aceleração",7,5]];
  const trl = [["TRL 1-3",14,"#f97316"],["TRL 4-6",19,"#f6b91a"],["TRL 7-9",13,"#15965f"]];
  const journey = stages.map(stage => [stage.name, stage.criteria.filter(item => item.done).length + stage.number * 3]);
  const meetings = [["Mar",18],["Abr",22],["Mai",26],["Jun",31],["Jul",28],["Ago",34]];
  const pendings = [["Alta","Evidências vencidas",12],["Média","Pareceres em aberto",9],["Baixa","Atualizações cadastrais",6]];
  const productivity = 78;
  const cerne = summarizeCerne();
  const totalStartups = programs.reduce((sum,item)=>sum + item[1],0);
  const openPendings = pendings.reduce((sum,item)=>sum + item[2],0);

  document.getElementById("biKpis").innerHTML = [
    ["Startups acompanhadas", totalStartups, "+8% vs mês anterior"],
    ["TRL médio", "5.4", "+0.6 na carteira"],
    ["CERNE institucional", cerne.current, `${cerne.totalCompleted}/${cerne.indicators.length} indicadores`],
    ["Jornada média", `${overallProgress()}%`, "Evolução simulada"],
    ["Reuniões", "34", "6 previstas hoje"],
    ["Pendências", openPendings, "12 de alta prioridade"],
    ["Produtividade", `${productivity}%`, "Consultoria mensal"],
    ["Evidências", "126", "+21 enviadas"],
  ].map(([label,value,hint]) => `<article class="bi-kpi"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`).join("");

  const maxProgram = Math.max(...programs.map(item=>item[1]));
  document.getElementById("programChart").innerHTML = programs.map(([name,total,active]) => `<div class="bi-bar-row"><div><b>${name}</b><span>${active} ativas</span></div><div class="bi-bar-track"><i style="width:${(total/maxProgram)*100}%"></i></div><strong>${total}</strong></div>`).join("");

  const trlTotal = trl.reduce((sum,item)=>sum + item[1],0);
  document.getElementById("trlDonut").innerHTML = `<div class="donut-big" style="background:conic-gradient(${trl.map(([label,value,color],idx)=>`${color} ${idx ? trl.slice(0,idx).reduce((s,i)=>s+i[1],0)/trlTotal*100 : 0}% ${(trl.slice(0,idx+1).reduce((s,i)=>s+i[1],0)/trlTotal)*100}%`).join(',')})"><strong>${trlTotal}</strong><span>startups</span></div><div class="donut-legend">${trl.map(([label,value,color])=>`<span><i style="background:${color}"></i>${label} · ${value}</span>`).join("")}</div>`;

  document.getElementById("cerneBiList").innerHTML = cerne.levels.map(level => `<div class="cerne-bi-row"><div><b>${level.level}</b><span>${level.completed}/${level.total} atendidos</span></div><strong>${level.percentage}%</strong></div>`).join("");

  const maxJourney = Math.max(...journey.map(item=>item[1]));
  document.getElementById("journeyFunnel").innerHTML = journey.map(([name,total],idx) => `<div class="funnel-row"><span>${idx+1}</span><div><b>${name}</b><i style="width:${(total/maxJourney)*100}%"></i></div><strong>${total}</strong></div>`).join("");

  const maxMeetings = Math.max(...meetings.map(item=>item[1]));
  document.getElementById("meetingChart").innerHTML = meetings.map(([month,total]) => `<div class="meeting-col"><i style="height:${Math.max(28,(total/maxMeetings)*170)}px"></i><b>${total}</b><span>${month}</span></div>`).join("");

  document.getElementById("productivityBi").innerHTML = `<div class="bi-score"><strong>${productivity}%</strong><span>execução do mês</span></div><div class="productivity-bar"><i style="width:${productivity}%"></i></div><p>Consultores concluíram 39 de 50 ações planejadas.</p>`;

  document.getElementById("pendingBiList").innerHTML = pendings.map(([level,label,total]) => `<div class="pending-bi-row ${level.toLowerCase()}"><span>${level}</span><b>${label}</b><strong>${total}</strong></div>`).join("");

  document.getElementById("comparisonList").innerHTML = [["Evidências validadas","+18%"],["Reuniões realizadas","+9%"],["Pendências críticas","-12%"],["Startups em avanço","+6%"]].map(([label,value]) => `<div class="comparison-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
}
function renderTrlExperience(){
  const trlLevels = [
    { level:1, title:"Princípios observados", group:"Pesquisa básica", description:"Fundamentos científicos iniciais identificados." },
    { level:2, title:"Conceito formulado", group:"Desenvolvimento conceitual", description:"Hipótese tecnológica e aplicação potencial descritas." },
    { level:3, title:"Prova de conceito", group:"Prova de conceito", description:"Primeiros testes demonstram viabilidade técnica." },
    { level:4, title:"Validação em laboratório", group:"Demonstração da tecnologia", description:"Componentes integrados e testados em ambiente controlado." },
    { level:5, title:"Validação em ambiente relevante", group:"Planta piloto", description:"Protótipo testado em condições próximas do uso real." },
    { level:6, title:"Protótipo demonstrado", group:"Protótipos", description:"Demonstração funcional com usuários e requisitos de operação." },
    { level:7, title:"Piloto operacional", group:"Negócio", description:"Tecnologia operando em escala piloto no ambiente real." },
    { level:8, title:"Sistema qualificado", group:"Mercado", description:"Solução final validada e pronta para operação comercial." },
    { level:9, title:"Mercado comprovado", group:"Mercado", description:"Tecnologia aplicada, vendida e comprovada em operação." }
  ];
  const current = 5;
  const target = 6;
  const history = [
    ["Jan", 2, "Conceito tecnológico documentado"],
    ["Fev", 3, "Prova de conceito com bancada inicial"],
    ["Abr", 4, "Validação em laboratório concluída"],
    ["Jun", 4, "Ajustes técnicos no protótipo"],
    ["Jul", 5, "Teste em ambiente relevante"],
    ["Ago", 5, "Evidências em revisão técnica"]
  ];
  const currentLevel = trlLevels.find(item => item.level === current);
  const nextLevel = trlLevels.find(item => item.level === target);
  const progress = Math.round((current / 9) * 100);

  document.getElementById("trlCurrentCard").innerHTML = `
    <span class="eyebrow">TRL Atual</span>
    <strong>TRL ${current}</strong>
    <p>${currentLevel.title}</p>
    <div class="trl-current-progress"><i style="width:${progress}%"></i></div>
    <small>${progress}% do caminho tecnológico até TRL 9</small>
  `;

  document.getElementById("trlKpis").innerHTML = [
    ["TRL Atual", `TRL ${current}`, currentLevel.group],
    ["Próximo nível", `TRL ${target}`, nextLevel.title],
    ["Gap tecnológico", `${target - current} nível`, "Foco em demonstração funcional"],
    ["Evidências técnicas", "14", "9 validadas e 5 em análise"],
    ["Última evolução", "Jul/2026", "Ambiente relevante validado"],
    ["Meta do ciclo", "TRL 6", "Até out/2026"]
  ].map(([label,value,hint]) => `<article class="trl-kpi"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`).join("");

  document.getElementById("trlRoadmap").innerHTML = trlLevels.map(item => {
    const stateClass = item.level < current ? "done" : item.level === current ? "active" : item.level === target ? "next" : "locked";
    return `<article class="trl-step ${stateClass}">
      <div class="trl-step-marker">${item.level}</div>
      <div>
        <span>${item.group}</span>
        <b>TRL ${item.level} · ${item.title}</b>
        <p>${item.description}</p>
      </div>
    </article>`;
  }).join("");

  document.getElementById("trlNextCard").innerHTML = `
    <div class="trl-next-badge">TRL ${target}</div>
    <h3>${nextLevel.title}</h3>
    <p>${nextLevel.description}</p>
    <div class="trl-next-checklist">
      <span>Consolidar protocolo de teste com usuários</span>
      <span>Registrar resultados técnicos do protótipo</span>
      <span>Validar requisitos mínimos de operação</span>
    </div>
  `;

  const maxTrl = 9;
  document.getElementById("trlEvolutionChart").innerHTML = `
    <div class="trl-chart-grid">
      ${history.map(([month, level, note]) => `<div class="trl-chart-col">
        <i style="height:${Math.max(28, (level / maxTrl) * 220)}px"></i>
        <b>TRL ${level}</b>
        <span>${month}</span>
        <small>${note}</small>
      </div>`).join("")}
    </div>
  `;

  document.getElementById("trlHistoryList").innerHTML = history.slice().reverse().map(([month, level, note], index) => `<div class="trl-history-item ${index === 0 ? "latest" : ""}">
    <span>TRL ${level}</span>
    <div><b>${note}</b><small>${month}/2026 · evidência técnica vinculada</small></div>
  </div>`).join("");

  document.getElementById("trlExplainGrid").innerHTML = [
    ["TRL mede tecnologia", "Mostra o quanto a solução saiu da ideia, passou por testes e se aproxima de operação real."],
    ["Evolução exige evidência", "Cada avanço precisa ser sustentado por teste, relatório, protótipo, validação ou demonstração."],
    ["Próximo passo claro", "O foco visual da tela é mostrar o que falta para a startup sair do TRL atual e alcançar o próximo nível."],
    ["Não substitui CERNE", "TRL pertence à maturidade tecnológica da empresa. CERNE continua sendo a maturidade da incubadora."]
  ].map(([title,text]) => `<article class="trl-explain-card"><b>${title}</b><p>${text}</p></article>`).join("");
}
function renderCompare(){
  const concepts = [
    { cls:"physical", title:"Versão 1", sub:"Mais próxima do painel físico", rows:["Ideação","Validação","Operação","Tração","Aceleração"] },
    { cls:"modern", title:"Versão 2", sub:"Mais moderna e interativa", rows:["Cards fluidos","Critérios inteligentes","Micro animações","Foco no consultor"] },
    { cls:"executive", title:"Versão 3", sub:"Mais executiva e gerencial", rows:["KPIs","Riscos","TRL","Evidências"] }
  ];
  document.getElementById("compareGrid").innerHTML = concepts.map((concept,idx) => `<article class="concept-card ${concept.cls}"><div><span class="eyebrow">${concept.title}</span><h3>${concept.sub}</h3></div><div class="concept-preview">${concept.rows.map((row,i) => `<div class="preview-row"><div class="preview-stage" style="background:${stages[Math.min(i,4)].color}">${i+1}</div><div class="preview-lines"><i style="width:${80 - i*8}%"></i><i style="width:${55 + i*7}%"></i></div></div>`).join("")}</div><button class="ghost-button" data-concept="${idx}" type="button">Selecionar conceito</button></article>`).join("");
}
function renderAll(){ renderMeta(); renderJourney(); renderInsights(); renderStartupOverview(); renderTimeline(); renderWorkspace(); renderExecutiveDashboard(); renderTrlExperience(); renderCompare(); renderCerneStatus(); }
function openModal(id){ document.getElementById(id).classList.add("open"); document.getElementById(id).setAttribute("aria-hidden","false"); }
function closeModal(id){ document.getElementById(id).classList.remove("open"); document.getElementById(id).setAttribute("aria-hidden","true"); }
function setView(viewId){
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === viewId));
  const navMap = {
    startupOverviewView:"startupOverviewButton",
    executiveDashboardView:"dashboardButton",
    trlView:"trlButton",
    cerneView:"cerneButton",
    workspaceView:"workspaceButton"
  };
  Object.entries(navMap).forEach(([view, button]) => {
    document.getElementById(button)?.classList.toggle("active", view === viewId);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}

document.addEventListener("click", event => {
  const stageButton = event.target.closest("[data-stage]");
  const criterionButton = event.target.closest("[data-criterion]");
  if(stageButton){ state.openStage = state.openStage === stageButton.dataset.stage ? "" : stageButton.dataset.stage; renderJourney(); }
  if(criterionButton){ state.selected = criterionButton.dataset.criterion; const criterion = stages.flatMap(s=>s.criteria).find(c=>c.id===state.selected); document.getElementById("evidenceContext").textContent = `Critério selecionado: ${criterion.name}`; document.getElementById("evidenceName").placeholder = `Ex.: Evidência de ${criterion.name}`; openModal("evidenceModal"); }
  if(event.target.closest("#compareButton")) openModal("compareModal");
  if(event.target.closest("#startupOverviewButton")){ setView("startupOverviewView"); }
  if(event.target.closest("#dashboardButton")){ setView("executiveDashboardView"); }
  if(event.target.closest("#dashboardToWorkspace")){ setView("workspaceView"); }
  if(event.target.closest("#dashboardToTrl")){ setView("trlView"); }
  if(event.target.closest("#dashboardToCerne")){ setView("cerneView"); }
  if(event.target.closest("#trlButton")){ setView("trlView"); }
  if(event.target.closest("#trlToJourney")){ setView("journeyView"); }
  if(event.target.closest("#trlToDashboard")){ setView("executiveDashboardView"); }
  if(event.target.closest("#workspaceButton")){ setView("workspaceView"); }
  if(event.target.closest("#openWorkspaceFromOverview")){ setView("workspaceView"); }
  if(event.target.closest("#openJourneyFromOverview")){ setView("journeyView"); }
  const openJourneyStage = event.target.closest("[data-open-journey]");
  if(openJourneyStage){ state.openStage = openJourneyStage.dataset.stage || state.openStage; renderJourney(); setView("journeyView"); }
  if(event.target.closest("#cerneButton")){ setView("cerneView"); }
  if(event.target.closest("#backToJourney") || event.target.closest("#backToJourneyFromCerne")){ setView("journeyView"); }
  if(event.target.closest("[data-close-modal]")) closeModal("evidenceModal");
  if(event.target.closest("[data-close-compare]")) closeModal("compareModal");
  const workspaceAction = event.target.closest("[data-workspace-action]");
  if(workspaceAction){ toast(workspaceAction.dataset.workspaceAction); }
  if(event.target.closest("[data-clear-cerne-filters]")){
    ["cerneSearch","cerneLevelFilter","cerneStatusFilter","cerneAudienceFilter","cerneProcessFilter"].forEach(id => {
      const field = document.getElementById(id);
      if(field) field.value = "";
    });
    renderCerneStatus();
    toast("Filtros CERNE limpos.");
  }
  const concept = event.target.closest("[data-concept]");
  if(concept){ closeModal("compareModal"); toast(`Conceito ${Number(concept.dataset.concept)+1} selecionado para discussão`); }
});

document.addEventListener("input", event => {
  if(event.target.closest("#cerneSearch")) renderCerneStatus();
});

document.addEventListener("change", event => {
  if(event.target.closest("[data-cerne-filter]")) renderCerneStatus();
});

document.getElementById("evidenceForm").addEventListener("submit", event => {
  event.preventDefault();
  const criterion = stages.flatMap(s=>s.criteria).find(c=>c.id===state.selected);
  if(!criterion) return;
  criterion.evidences += 1;
  criterion.done = true;
  criterion.updated = "04/08/2026";
  state.justCompleted = criterion.id;
  state.completedStage = stages.find(stage => stage.criteria.some(item => item.id === criterion.id))?.id || null;
  state.events.unshift({ icon:"E", title:"Nova evidência enviada", date:"04/08/2026", owner:startup.consultant });
  closeModal("evidenceModal");
  event.target.reset();
  renderAll();
  toast("Critério concluído. Jornada atualizada com sucesso.");
  setTimeout(() => {
    state.justCompleted = null;
    state.completedStage = null;
    renderJourney();
  }, 2200);
});

renderAll();
setView(document.querySelector(".view.active")?.id || "startupOverviewView");


