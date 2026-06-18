import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const ToastContext = createContext(null);
const ConfirmContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div id="toast-container">
        {toasts.map((toast) => (
          <div className={`ste-toast ${toast.type}`} key={toast.id}>
            <i className={`bi ${toast.type === 'error' ? 'bi-x-circle-fill' : toast.type === 'info' ? 'bi-info-circle-fill' : 'bi-check-circle-fill'} toast-icon`} />
            <div className="toast-body">
              <div className="toast-title">{toast.type === 'error' ? 'Erro' : toast.type === 'info' ? 'Informacao' : 'Sucesso'}</div>
              <div className="toast-msg">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}>
              <i className="bi bi-x" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = (message) => new Promise((resolve) => {
    setState({ message, resolve });
  });

  const answer = (value) => {
    state?.resolve(value);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="react-modal-backdrop">
          <div className="react-confirm">
            <div className="d-flex align-items-center gap-2 text-danger fw-bold mb-2">
              <i className="bi bi-exclamation-triangle-fill" />
              Confirmar exclusao
            </div>
            <p className="mb-4">{state.message}</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn-ste-secondary" onClick={() => answer(false)}>Cancelar</button>
              <button className="btn-ste-primary danger" onClick={() => answer(true)}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

const navSections = [
  {
    title: null,
    links: [
      { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill' }
    ]
  },
  {
    title: 'Cadastros',
    links: [
      { to: '/alunos', label: 'Alunos', icon: 'bi-people-fill' },
      { to: '/matriculas-transporte', label: 'Matricula de Transporte', icon: 'bi-card-checklist' },
      { to: '/prefeituras', label: 'Prefeituras', icon: 'bi-building-fill' },
      { to: '/estados', label: 'Estados', icon: 'bi-map-fill' },
      { to: '/cidades', label: 'Cidades', icon: 'bi-geo-alt-fill' },
      { to: '/instituicoes-ensino', label: 'Instituicoes de Ensino', icon: 'bi-mortarboard-fill' },
      { to: '/onibus', label: 'Onibus', icon: 'bi-bus-front' },
      { to: '/motoristas', label: 'Motoristas', icon: 'bi-person-badge-fill' },
      { to: '/rotas', label: 'Rotas', icon: 'bi-signpost-2-fill' }
    ]
  },
  {
    title: 'Operacional',
    links: [
      { to: '/viagens', label: 'Viagens', icon: 'bi-calendar2-check-fill' },
      { to: '/registros-acesso', label: 'Registros de Acesso', icon: 'bi-qr-code-scan' },
      { to: '/viagens/nova', label: 'Registrar Viagem', icon: 'bi-calendar-plus-fill' }
    ]
  },
  {
    title: 'Relatorios',
    links: [
      { to: '/relatorios/alunos-por-rota', label: 'Alunos por Rota', icon: 'bi-file-earmark-person' },
      { to: '/relatorios/acessos-por-aluno', label: 'Acessos por Aluno', icon: 'bi-file-earmark-spreadsheet' },
      { to: '/relatorios/alunos-por-instituicao-situacao', label: 'Alunos por Instituicao', icon: 'bi-file-earmark-medical' },
      { to: '/relatorios/acessos-por-periodo', label: 'Acessos por Periodo', icon: 'bi-file-earmark-bar-graph' },
      { to: '/relatorios/viagens-por-motorista', label: 'Viagens por Motorista', icon: 'bi-person-video' },
      { to: '/relatorios/utilizacao-frota', label: 'Utilizacao de Frota', icon: 'bi-truck' }
    ]
  }
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem('ste-user') || 'Usuario';

  const title = useMemo(() => {
    const flat = navSections.flatMap((section) => section.links);
    return flat.find((link) => location.pathname === link.to || location.pathname.startsWith(`${link.to}/`))?.label || 'STE';
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('ste-user');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <aside id="sidebar" className={open ? 'open' : ''}>
        <Link className="sidebar-brand" to="/">
          <div className="brand-icon"><i className="bi bi-bus-front-fill" /></div>
          <div className="brand-text">
            <span className="brand-name">STE</span>
            <span className="brand-sub">TRANSPORTE ESCOLAR</span>
          </div>
        </Link>
        {navSections.map((section, index) => (
          <div className="sidebar-section" key={index}>
            {section.title && <div className="sidebar-section-label">{section.title}</div>}
            <ul className="sidebar-nav">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} onClick={() => setOpen(false)} end={link.to === '/'}>
                    <i className={`bi ${link.icon} nav-icon`} />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="sidebar-footer">
          <ul className="sidebar-nav" style={{ padding: 0 }}>
            <li>
              <button className="sidebar-logout" onClick={logout}>
                <i className="bi bi-box-arrow-left nav-icon" />
                Sair do Sistema
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <button className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={() => setOpen(false)} aria-label="Fechar menu" />
      <div id="main-content">
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button id="sidebar-toggle" className="btn-icon" onClick={() => setOpen(true)} type="button">
              <i className="bi bi-list" />
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="topbar-avatar">{user[0]?.toUpperCase() || 'U'}</div>
              <span>{user}</span>
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ icon, title, children, className = '' }) {
  return (
    <div className={`ste-card ${className}`}>
      {(title || icon) && (
        <div className="ste-card-header">
          {icon && <div className="card-icon"><i className={`bi ${icon}`} /></div>}
          {title && <h2>{title}</h2>}
        </div>
      )}
      {children}
    </div>
  );
}

export function LoadingRow({ colSpan = 6 }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-4 text-muted">
        <span className="spinner-border spinner-border-sm me-2" />
        Carregando...
      </td>
    </tr>
  );
}

export function EmptyRow({ colSpan = 6, message = 'Nenhum registro encontrado.' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-4 text-muted">{message}</td>
    </tr>
  );
}

export function Badge({ value }) {
  const normalized = String(value || '').toUpperCase();
  const map = {
    ATIVO: ['active', 'bi-check-circle', 'Ativo'],
    INATIVO: ['inactive', 'bi-x-circle', 'Inativo'],
    BLOQUEADO: ['inactive', 'bi-lock-fill', 'Bloqueado'],
    SUSPENSO: ['maintenance', 'bi-pause-circle', 'Suspenso'],
    MANUTENCAO: ['maintenance', 'bi-tools', 'Manutencao'],
    EMBARQUE: ['embarque', 'bi-arrow-up-circle', 'Embarque'],
    DESEMBARQUE: ['desembarque', 'bi-arrow-down-circle', 'Desembarque']
  };
  const [cls, icon, label] = map[normalized] || ['info', 'bi-circle', value || '-'];
  return <span className={`badge-ste ${cls}`}><i className={`bi ${icon}`} />{label}</span>;
}

export function fmtDate(value) {
  if (!value) return '-';
  const [date] = String(value).split('T');
  const parts = date.split('-');
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
