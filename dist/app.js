const icons = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  list: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v4H9zM9 12h6M9 16h6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  back: '<path d="m14 6-6 6 6 6"/>',
  lamp: '<path d="M9 18h6M10 21h4M8 13a6 6 0 1 1 8 0l-1 2H9z"/>',
  road: '<path d="M8 3 4 21M16 3l4 18M12 4v3M12 11v3M12 18v3"/>',
  clean: '<path d="M4 7h16M9 4h6M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  exit: '<path d="M10 4H4v16h6M9 12h12m-5-5 5 5-5 5"/>'
};
const categories = [
  { id: 'iluminacao', name: 'Iluminação', icon: 'lamp' },
  { id: 'vias', name: 'Vias públicas', icon: 'road' },
  { id: 'limpeza', name: 'Limpeza', icon: 'clean' }
];
const examples = [
  { id: 'BED-2026-0142', title: 'Poste apagado na praça', description: 'O poste próximo à entrada da praça está apagado há três noites.', address: 'Rua das Flores, 120 · Centro', category: 'iluminacao', status: 'EM_ATENDIMENTO', date: '18 nov 2026', updated: '19 nov 2026' },
  { id: 'BED-2026-0138', title: 'Calçada danificada', description: 'Um trecho da calçada está quebrado perto do ponto de ônibus.', address: 'Av. dos Ipês, 35 · Centro', category: 'vias', status: 'ABERTA', date: '17 nov 2026', updated: '17 nov 2026' },
  { id: 'BED-2026-0121', title: 'Descarte irregular', description: 'Entulho descartado ao lado da praça do bairro.', address: 'Praça do Sol · Centro', category: 'limpeza', status: 'RESOLVIDA', date: '12 nov 2026', updated: '16 nov 2026' }
];
const statuses = { ABERTA: { label: 'Aberta', style: 'open' }, EM_ATENDIMENTO: { label: 'Em atendimento', style: 'progress' }, RESOLVIDA: { label: 'Resolvida', style: 'done' } };
let requests = examples.map(item => ({ ...item }));
let selectedId = requests[0].id;
let filter = 'TODAS';
let selectedCategory = '';
let draft = { title: '', description: '', address: '', category: '' };
let toastTimer;
const app = document.getElementById('app');
const navigation = document.getElementById('navigation');
const icon = name => `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[name] || icons.info}</svg></span>`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const categoryName = id => categories.find(category => category.id === id)?.name || 'Outra categoria';
const badge = status => `<span class="badge ${statuses[status].style}">${statuses[status].label}</span>`;
const back = route => `<button class="icon-button back" data-route="${route}" aria-label="Voltar">${icon('back')}</button>`;
const requestCard = item => `<button class="request" data-request="${item.id}"><span class="request-top"><span>${item.id}</span>${badge(item.status)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.address)}</p></button>`;

function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3500);
}

function welcome() {
  return `<section class="screen welcome"><span class="brand-mark" aria-hidden="true">b.</span><h1>Seu bairro.<br>Nosso cuidado.</h1><p>Registre o que precisa de atenção e acompanhe cada passo da mudança.</p><div class="neighborhood" aria-hidden="true"><span class="sun"></span>${['one', 'two', 'three', 'four'].map(name => `<div class="building ${name}">${'<i></i>'.repeat(6)}</div>`).join('')}<div class="ground"></div></div><div class="welcome-bottom"><button class="primary light" data-route="inicio">Conhecer o aplicativo</button><small>Explore uma jornada com dados de demonstração.</small></div></section>`;
}

function home() {
  const open = requests.filter(item => item.status !== 'RESOLVIDA').length;
  const done = requests.filter(item => item.status === 'RESOLVIDA').length;
  return `<section class="screen"><header class="row"><div><p class="eyebrow">Olá, morador</p><h1>Vamos cuidar<br>do nosso bairro?</h1></div><button class="icon-button avatar" data-route="perfil" aria-label="Abrir perfil">MC</button></header><div class="hero"><h2>Uma pequena atitude.<br>Um bairro melhor.</h2><p>Viu algo que precisa de cuidado? Sua solicitação faz a diferença.</p><button class="primary light" data-new="">${icon('plus')}Nova solicitação</button></div><div class="stats"><div class="stat"><span>Em acompanhamento</span><strong>${open}</strong><span>solicitações suas</span></div><div class="stat"><span>Concluídas</span><strong>${done}</strong><span>problemas resolvidos</span></div></div><h2 class="section-heading">O que precisa de atenção?</h2><div class="category-grid">${categories.map(category => `<button class="category" data-new="${category.id}">${icon(category.icon)}${category.name}</button>`).join('')}</div><div class="row section-heading"><h2>Última atualização</h2><button class="text-button" data-route="solicitacoes">Ver todas</button></div>${requestCard(requests[0])}</section>`;
}

function create() {
  return `<section class="screen">${back('inicio')}<p class="eyebrow">Cuidar começa por aqui</p><h1>Nova solicitação</h1><p class="subtitle">Conte o que aconteceu e onde o problema está.</p><form id="request-form"><label class="field">Categoria<select name="category" required><option value="">Selecione uma categoria</option>${categories.map(category => `<option value="${category.id}" ${draft.category === category.id ? 'selected' : ''}>${category.name}</option>`).join('')}</select></label><label class="field">Título<input name="title" maxlength="120" required placeholder="Ex.: Poste apagado na praça" value="${escapeHtml(draft.title)}"></label><label class="field">Localização<input name="address" maxlength="250" required placeholder="Rua, número e bairro" value="${escapeHtml(draft.address)}"></label><label class="field">Descrição<textarea name="description" maxlength="2000" required placeholder="Descreva o problema e uma referência do local">${escapeHtml(draft.description)}</textarea><small>Evite incluir dados pessoais na descrição.</small></label><div class="notice">Sua solicitação receberá um protocolo para acompanhamento.</div><p id="form-error" class="form-error" role="alert"></p><button type="submit" class="primary">Enviar solicitação</button></form></section>`;
}

function confirmation() {
  const item = requests.find(request => request.id === selectedId);
  if (!item) return listing();
  return `<section class="screen success"><div class="icon success-symbol">${icon('check')}</div><p class="eyebrow">Primeiro passo dado</p><h1>Solicitação registrada!</h1><p class="subtitle">Agora você pode acompanhar o andamento pelo seu protocolo.</p><div class="card"><p class="eyebrow">Seu protocolo</p><h2>${item.id}</h2><span class="detail-label">Problema registrado</span><p class="detail-value">${escapeHtml(item.title)}</p><span class="detail-label">Status</span>${badge(item.status)}</div><button class="primary" data-request="${item.id}">Acompanhar solicitação</button><button class="secondary" data-route="inicio">Voltar ao início</button><p class="subtitle" style="font-size:13px;margin-top:20px">Registro simulado para demonstração do protótipo.</p></section>`;
}

function listing() {
  const visible = requests.filter(item => filter === 'TODAS' || item.status === filter);
  return `<section class="screen"><p class="eyebrow">Cada cuidado conta</p><h1>Minhas solicitações</h1><p class="subtitle">Acompanhe o que você já registrou.</p><div class="chips" role="group" aria-label="Filtrar solicitações">${[['TODAS', 'Todas'], ['ABERTA', 'Abertas'], ['EM_ATENDIMENTO', 'Em atendimento'], ['RESOLVIDA', 'Resolvidas']].map(([value, label]) => `<button class="chip ${filter === value ? 'active' : ''}" data-filter="${value}" aria-pressed="${filter === value}">${label}</button>`).join('')}</div>${visible.length ? visible.map(requestCard).join('') : '<div class="empty">Nenhuma solicitação nesta situação.</div>'}<button class="secondary" data-new="">${icon('plus')}Registrar outro problema</button></section>`;
}

function detail() {
  const item = requests.find(request => request.id === selectedId);
  if (!item) return listing();
  return `<section class="screen">${back('solicitacoes')}<div class="row"><p class="eyebrow">${item.id}</p>${badge(item.status)}</div><h1>${escapeHtml(item.title)}</h1><p class="subtitle">${categoryName(item.category)} · ${item.date}</p><div class="card"><h2>Sobre a solicitação</h2><span class="detail-label">Localização</span><p class="detail-value">${escapeHtml(item.address)}</p><span class="detail-label">Descrição</span><p class="detail-value">${escapeHtml(item.description)}</p></div><h2>Andamento</h2><ol class="timeline"><li><strong>Solicitação recebida</strong><small>${item.date} · Protocolo gerado para acompanhamento.</small></li>${item.status !== 'ABERTA' ? `<li><strong>Equipe em atendimento</strong><small>${item.updated} · Solicitação encaminhada para a equipe responsável.</small></li>` : '<li><strong>Aguardando atendimento</strong><small>O próximo passo será exibido aqui.</small></li>'}${item.status === 'RESOLVIDA' ? `<li><strong>Problema resolvido</strong><small>${item.updated} · Atendimento concluído.</small></li>` : ''}</ol><button class="secondary" data-route="solicitacoes">Ver minhas solicitações</button></section>`;
}

function profile() {
  return `<section class="screen"><h1>Meu perfil</h1><div class="profile-heading"><div class="icon-button avatar profile-avatar">MC</div><h2>Morador do Centro</h2><p class="subtitle">Perfil de demonstração</p></div><div class="card"><div class="profile-option"><span>Bairro</span><strong>Centro</strong></div><div class="profile-option"><span>Solicitações registradas</span><strong>${requests.length}</strong></div><div class="profile-option"><span>Participação</span><strong>Cidadão</strong></div></div><h2>Sobre o Bairro em Dia</h2><p class="subtitle">Um canal simples para registrar problemas de zeladoria urbana e acompanhar o cuidado com os espaços públicos.</p><div class="notice">Conectado ao ODS 11 — Cidades e comunidades sustentáveis.</div><button class="secondary" data-route="boas-vindas">${icon('exit')}Sair da demonstração</button></section>`;
}

const screens = { 'boas-vindas': welcome, inicio: home, nova: create, confirmacao: confirmation, solicitacoes: listing, detalhes: detail, perfil: profile };
function render() {
  const route = location.hash.slice(1) || 'boas-vindas';
  const screen = screens[route] || welcome;
  app.innerHTML = screen();
  navigation.hidden = screen === welcome;
  navigation.innerHTML = [['inicio', 'home', 'Início'], ['solicitacoes', 'list', 'Solicitações'], ['perfil', 'user', 'Perfil']].map(([path, symbol, label]) => `<button data-route="${path}" class="${route === path ? 'active' : ''}" ${route === path ? 'aria-current="page"' : ''}>${icon(symbol)}${label}</button>`).join('');
  app.scrollTop = 0;
  document.title = `${app.querySelector('h1')?.textContent.replace(/\s+/g, ' ') || 'Bairro em Dia'} · Bairro em Dia`;
  if (document.activeElement !== document.body) app.focus({ preventScroll: true });
}
function navigate(route) {
  if (location.hash === `#${route}`) render();
  else location.hash = route;
}

document.addEventListener('click', event => {
  const route = event.target.closest('[data-route]');
  if (route) navigate(route.dataset.route);
  const request = event.target.closest('[data-request]');
  if (request) { selectedId = request.dataset.request; navigate('detalhes'); }
  const newRequest = event.target.closest('[data-new]');
  if (newRequest) { draft.category = newRequest.dataset.new; navigate('nova'); }
  const chip = event.target.closest('[data-filter]');
  if (chip) { filter = chip.dataset.filter; render(); }
});
document.addEventListener('input', event => {
  if (event.target.form?.id !== 'request-form') return;
  draft[event.target.name] = event.target.value;
});
document.addEventListener('change', event => {
  if (event.target.form?.id === 'request-form') draft[event.target.name] = event.target.value;
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'request-form') return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target));
  const error = document.getElementById('form-error');
  if (!values.title.trim() || !values.address.trim() || !values.description.trim() || !categories.some(category => category.id === values.category)) {
    error.textContent = 'Preencha os campos para registrar a solicitação.';
    return;
  }
  const date = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  const id = `BED-${new Date().getFullYear()}-${String(requests.length + 143).padStart(4, '0')}`;
  const item = { id, title: values.title.trim(), address: values.address.trim(), description: values.description.trim(), category: values.category, status: 'ABERTA', date, updated: date };
  requests.unshift(item);
  selectedId = id;
  draft = { title: '', description: '', address: '', category: '' };
  navigate('confirmacao');
});
window.addEventListener('hashchange', render);
render();
