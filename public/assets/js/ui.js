// ─── STE UI Utilities ───────────────────────────────────────────────────────

/* ── Toast System ─────────────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  const titles = { success: 'Sucesso', error: 'Erro', info: 'Informação' };

  const toast = document.createElement('div');
  toast.className = `ste-toast ${type}`;
  toast.innerHTML = `
    <i class="bi ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${titles[type] || 'Aviso'}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="this.closest('.ste-toast').remove()"><i class="bi bi-x"></i></button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .25s ease forwards';
    setTimeout(() => toast.remove(), 260);
  }, 4000);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  document.body.appendChild(c);
  return c;
}

/* ── Sidebar ──────────────────────────────────────────────────────────────── */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const toggle   = document.getElementById('sidebar-toggle');

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

  // Mark active link
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#sidebar .sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop();
    if (href === currentFile) a.classList.add('active');
  });
}

/* ── Spinner ──────────────────────────────────────────────────────────────── */
function showSpinner() {
  let s = document.getElementById('ste-spinner');
  if (!s) {
    s = document.createElement('div');
    s.id = 'ste-spinner';
    s.className = 'spinner-overlay';
    s.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>';
    document.body.appendChild(s);
  }
  s.style.display = 'flex';
}
function hideSpinner() {
  const s = document.getElementById('ste-spinner');
  if (s) s.style.display = 'none';
}

/* ── Form Validation ──────────────────────────────────────────────────────── */
function setupFormValidation(formId, onValid) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      await onValid(form);
    }
    form.classList.add('was-validated');
  });
}

/* ── Select Helpers ───────────────────────────────────────────────────────── */
function populateSelect(selectId, items, valueKey, labelFn, placeholder = 'Selecione...') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = `<option value="">-- ${placeholder} --</option>`;
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item[valueKey];
    opt.textContent = labelFn(item);
    sel.appendChild(opt);
  });
}

/* ── Badge Helper ─────────────────────────────────────────────────────────── */
function badgeSituacao(situacao) {
  const map = {
    'ATIVO':       ['active',      'bi-check-circle', 'Ativo'],
    'INATIVO':     ['inactive',    'bi-x-circle',     'Inativo'],
    'MANUTENÇÃO':  ['maintenance', 'bi-tools',        'Manutenção'],
    'EMBARQUE':    ['embarque',    'bi-arrow-up-circle','Embarque'],
    'DESEMBARQUE': ['desembarque', 'bi-arrow-down-circle','Desembarque'],
  };
  const [cls, icon, label] = map[situacao?.toUpperCase()] || ['info', 'bi-circle', situacao || '—'];
  return `<span class="badge-ste ${cls}"><i class="bi ${icon}"></i>${label}</span>`;
}

/* ── Confirmation Modal ───────────────────────────────────────────────────── */
function confirmDelete(message, onConfirm) {
  let modal = document.getElementById('confirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.innerHTML = `
      <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-700 fs-6 text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Exclusão</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-2" id="confirmMsg"></div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-sm btn-danger" id="confirmOk">Excluir</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('confirmMsg').textContent = message;
  const bsModal = new bootstrap.Modal(modal.querySelector('.modal'));
  bsModal.show();
  const btn = document.getElementById('confirmOk');
  const newBtn = btn.cloneNode(true);
  btn.replaceWith(newBtn);
  newBtn.addEventListener('click', () => { bsModal.hide(); onConfirm(); });
}

/* ── Date Formatter ──────────────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export { showToast, initSidebar, showSpinner, hideSpinner, setupFormValidation, populateSelect, badgeSituacao, confirmDelete, fmtDate };
