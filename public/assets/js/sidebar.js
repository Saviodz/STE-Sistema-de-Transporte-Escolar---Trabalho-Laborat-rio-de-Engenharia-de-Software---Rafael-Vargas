/**
 * Returns the full sidebar HTML string.
 * Call injectSidebar() on DOMContentLoaded to inject into #sidebar placeholder.
 */
function getSidebarHTML() {
  return `
  <a class="sidebar-brand" href="index.html">
    <div class="brand-icon"><i class="bi bi-bus-front-fill"></i></div>
    <div class="brand-text">
      <span class="brand-name">STE</span>
      <span class="brand-sub">TRANSPORTE ESCOLAR</span>
    </div>
  </a>
  <div class="sidebar-section">
    <ul class="sidebar-nav" style="padding:0 14px">
      <li><a href="index.html" data-page="index.html"><i class="bi bi-grid-1x2-fill nav-icon"></i>Dashboard</a></li>
    </ul>
  </div>
  <div class="sidebar-section">
    <div class="sidebar-section-label">Cadastros</div>
    <ul class="sidebar-nav">
      <li><a href="listagem-aluno.html"             data-page="listagem-aluno.html"><i class="bi bi-people-fill nav-icon"></i>Alunos</a></li>
      <li><a href="cadastro-matricula-transporte.html" data-page="cadastro-matricula-transporte.html"><i class="bi bi-card-checklist nav-icon"></i>Matrícula de Transporte</a></li>
      <li><a href="listagem-prefeitura.html"        data-page="listagem-prefeitura.html"><i class="bi bi-building-fill nav-icon"></i>Prefeituras</a></li>
      <li><a href="cadastro-estado.html"            data-page="cadastro-estado.html"><i class="bi bi-map-fill nav-icon"></i>Estados</a></li>
      <li><a href="cadastro-cidade.html"            data-page="cadastro-cidade.html"><i class="bi bi-geo-alt-fill nav-icon"></i>Cidades</a></li>
      <li><a href="cadastro-instituicao-ensino.html" data-page="cadastro-instituicao-ensino.html"><i class="bi bi-mortarboard-fill nav-icon"></i>Instituições de Ensino</a></li>
      <li><a href="cadastro-onibus.html"            data-page="cadastro-onibus.html"><i class="bi bi-bus-front nav-icon"></i>Ônibus</a></li>
      <li><a href="cadastro-motorista.html"         data-page="cadastro-motorista.html"><i class="bi bi-person-badge-fill nav-icon"></i>Motoristas</a></li>
      <li><a href="cadastro-rota.html"              data-page="cadastro-rota.html"><i class="bi bi-signpost-2-fill nav-icon"></i>Rotas</a></li>
    </ul>
  </div>
  <div class="sidebar-section">
    <div class="sidebar-section-label">Operacional</div>
    <ul class="sidebar-nav">
      <li><a href="listagem-viagens.html"   data-page="listagem-viagens.html"><i class="bi bi-calendar2-check-fill nav-icon"></i>Viagens</a></li>
      <li><a href="registro-acesso.html"    data-page="registro-acesso.html"><i class="bi bi-qr-code-scan nav-icon"></i>Registros de Acesso</a></li>
      <li><a href="registro-viagem.html"    data-page="registro-viagem.html"><i class="bi bi-calendar-plus-fill nav-icon"></i>Registrar Viagem</a></li>
    </ul>
  </div>
  <div class="sidebar-section">
    <div class="sidebar-section-label">Relatórios</div>
    <ul class="sidebar-nav">
      <li><a href="relatorio-alunos-por-rota.html" data-page="relatorio-alunos-por-rota.html"><i class="bi bi-file-earmark-person nav-icon"></i>Alunos por Rota</a></li>
      <li><a href="relatorio-acessos-por-periodo.html" data-page="relatorio-acessos-por-periodo.html"><i class="bi bi-file-earmark-bar-graph nav-icon"></i>Acessos por Período</a></li>
    </ul>
  </div>
  <div class="sidebar-footer">
    <ul class="sidebar-nav" style="padding:0">
      <li><a href="sair-sistema.html" data-page="sair-sistema.html" style="color:rgba(231,76,60,.8)"><i class="bi bi-box-arrow-left nav-icon"></i>Sair do Sistema</a></li>
    </ul>
  </div>`;
}

function injectSidebar() {
  const el = document.getElementById('sidebar');
  if (el) {
    el.innerHTML = getSidebarHTML();
    // Mark active
    const cur = location.pathname.split('/').pop() || 'index.html';
    el.querySelectorAll('a[data-page]').forEach(a => {
      if (a.dataset.page === cur) a.classList.add('active');
    });
  }
  // Mobile toggle
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (toggle && sidebar && overlay) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('visible');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    });
  }
  // Show username
  const uEl = document.getElementById('topbar-username');
  if (uEl) uEl.textContent = localStorage.getItem('ste-user') || 'Usuário';
  const av = document.getElementById('topbar-avatar-letter');
  if (av) av.textContent = (localStorage.getItem('ste-user') || 'U')[0].toUpperCase();
}

export { injectSidebar };
