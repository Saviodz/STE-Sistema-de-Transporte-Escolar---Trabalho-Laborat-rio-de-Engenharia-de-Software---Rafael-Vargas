import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { api } from './api';
import {
  AppLayout,
  Badge,
  Card,
  ConfirmProvider,
  EmptyRow,
  LoadingRow,
  PageHeader,
  ToastProvider,
  fmtDate,
  useConfirm,
  useToast
} from './ui.jsx';

const studentStatusOptions = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'BLOQUEADO', label: 'Bloqueado' },
  { value: 'SUSPENSO', label: 'Suspenso' },
  { value: 'INATIVO', label: 'Inativo' }
];
const driverStatusOptions = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'AFASTADO', label: 'Afastado' },
  { value: 'INATIVO', label: 'Inativo' }
];
const busOptions = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'MANUTENÇÃO', label: 'Em Manutenção' },
  { value: 'INATIVO', label: 'Inativo' }
];
const driverCategories = ['A', 'B', 'C', 'D', 'E'];
const turns = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];

function getUser() {
  return localStorage.getItem('ste-user');
}

function RequireAuth({ children }) {
  if (!getUser()) return <Navigate to="/login" replace />;
  return children;
}

function LoginPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [nome, setNome] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const user = nome.trim() || 'Usuário';
    localStorage.setItem('ste-user', user);
    showToast('Login realizado com sucesso.');
    navigate('/', { replace: true });
  };

  return (
    <div className="login-screen">
      <Card className="login-card" icon="bi-bus-front-fill" title="Sistema de Transporte Escolar">
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="loginNome">Usuário</label>
            <input
              id="loginNome"
              className="form-control"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Informe seu nome"
              autoFocus
            />
          </div>
          <button className="btn-ste-primary w-100 justify-content-center" type="submit">
            <i className="bi bi-box-arrow-in-right" />
            Entrar
          </button>
        </form>
      </Card>
    </div>
  );
}

function LogoutPage() {
  localStorage.removeItem('ste-user');
  return <Navigate to="/login" replace />;
}

function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const pairs = await Promise.all([
          api.get('/alunos'),
          api.get('/motoristas'),
          api.get('/onibus'),
          api.get('/rotas'),
          api.get('/viagens'),
          api.get('/registros-acesso')
        ]);
        if (!active) return;
        setStats({
          alunos: pairs[0].length,
          motoristas: pairs[1].length,
          onibus: pairs[2].length,
          rotas: pairs[3].length,
          viagens: pairs[4].length,
          registros: pairs[5].length
        });
      } catch (error) {
        showToast(`Erro ao carregar indicadores: ${error.message}`, 'error');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const cards = [
    ['alunos', 'Alunos', 'bi-people-fill', 'blue', '/alunos'],
    ['motoristas', 'Motoristas', 'bi-person-badge-fill', 'green', '/motoristas'],
    ['onibus', 'Ônibus', 'bi-bus-front', 'orange', '/onibus'],
    ['rotas', 'Rotas', 'bi-signpost-2-fill', 'blue', '/rotas'],
    ['viagens', 'Viagens', 'bi-calendar2-check-fill', 'green', '/viagens'],
    ['registros', 'Acessos', 'bi-qr-code-scan', 'red', '/registros-acesso']
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral do Sistema de Transporte Escolar" />
      <div className="row g-3 mb-4">
        {cards.map(([key, label, icon, color, link]) => (
          <div className="col-md-4" key={key}>
            <Link to={link} className="text-decoration-none">
              <div className="stat-card">
                <div className={`stat-icon ${color}`}><i className={`bi ${icon}`} /></div>
                <div className="stat-info">
                  <div className="stat-value">{loading ? '...' : stats[key] ?? 0}</div>
                  <div className="stat-label">{label}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Card icon="bi-lightning-charge-fill" title="Ações rápidas">
        <div className="quick-actions">
          <Link to="/alunos/novo" className="btn-ste-secondary justify-content-center text-decoration-none">
            <i className="bi bi-person-plus-fill" />
            Novo aluno
          </Link>
          <Link to="/viagens/nova" className="btn-ste-secondary justify-content-center text-decoration-none">
            <i className="bi bi-calendar-plus-fill" />
            Nova viagem
          </Link>
          <Link to="/registros-acesso" className="btn-ste-secondary justify-content-center text-decoration-none">
            <i className="bi bi-qr-code-scan" />
            Registrar acesso
          </Link>
          <Link to="/matriculas-transporte" className="btn-ste-secondary justify-content-center text-decoration-none">
            <i className="bi bi-card-checklist" />
            Matricular aluno
          </Link>
        </div>
      </Card>
    </>
  );
}

function FormField({ field, value, onChange, options = [] }) {
  const id = field.name;
  const span = field.span || 6;
  const isSelect = field.type === 'select';
  const common = {
    id,
    className: isSelect ? 'form-select' : 'form-control',
    value: value ?? '',
    required: field.required !== false,
    onChange: (event) => onChange(field.name, event.target.value)
  };
  if (!isSelect && field.placeholder) common.placeholder = field.placeholder;
  if (field.minLength) common.minLength = field.minLength;
  if (field.maxLength) common.maxLength = field.maxLength;

  return (
    <div className={`field-span-${span}`}>
      <label htmlFor={id} className="form-label">
        {field.label}
        {field.required !== false && <span className="text-danger"> *</span>}
      </label>
      {isSelect ? (
        <select {...common}>
          <option value="">-- {field.selectPlaceholder || field.placeholder || 'Selecione'} --</option>
          {(field.staticOptions || options).map((option) => {
            const valueKey = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return <option value={valueKey} key={valueKey}>{label}</option>;
          })}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea {...common} rows={field.rows || 3} />
      ) : (
        <input {...common} type={field.type || 'text'} min={field.min} max={field.max} />
      )}
      {field.help && <div className="form-text">{field.help}</div>}
    </div>
  );
}

function normalizePayload(fields, form) {
  const payload = {};
  fields.forEach((field) => {
    let value = form[field.name];
    if (value === '') value = field.required === false ? null : value;
    if ((field.number || field.name.endsWith('Id')) && value !== null && value !== '') {
      value = Number(value);
    }
    payload[field.name] = value;
  });
  return payload;
}

function EntityPage({ config }) {
  const [items, setItems] = useState([]);
  const [lookups, setLookups] = useState({});
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const showToast = useToast();
  const confirm = useConfirm();

  const initialForm = useMemo(() => Object.fromEntries(config.fields.map((field) => [field.name, field.defaultValue ?? ''])), [config.fields]);

  const load = async () => {
    setLoading(true);
    try {
      const [data, ...lookupData] = await Promise.all([
        api.get(`${config.endpoint}?include=true`),
        ...config.fields.filter((field) => field.lookup).map((field) => api.get(field.lookup.endpoint))
      ]);
      const lookupMap = {};
      config.fields.filter((field) => field.lookup).forEach((field, index) => {
        lookupMap[field.name] = lookupData[index].map((item) => ({
          value: item.codigo,
          label: field.lookup.label(item)
        }));
      });
      setItems(data);
      setLookups(lookupMap);
      setForm(initialForm);
    } catch (error) {
      showToast(`Erro ao carregar ${config.title.toLowerCase()}: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setEditingId(null);
  }, [config.endpoint]);

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    const haystack = JSON.stringify(item).toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const edit = (item) => {
    const next = { ...initialForm };
    config.fields.forEach((field) => {
      next[field.name] = item[field.name] ?? '';
    });
    setForm(next);
    setEditingId(item.codigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = config.preparePayload ? config.preparePayload(form) : normalizePayload(config.fields, form);
      if (editingId) {
        await api.put(`${config.endpoint}/${editingId}`, payload);
        showToast(`${config.singular} atualizado com sucesso.`);
      } else {
        await api.post(config.endpoint, payload);
        showToast(`${config.singular} cadastrado com sucesso.`);
      }
      reset();
      await load();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!(await confirm(`Excluir ${config.singular.toLowerCase()} #${item.codigo}?`))) return;
    try {
      await api.delete(`${config.endpoint}/${item.codigo}`);
      showToast(`${config.singular} excluído com sucesso.`);
      setItems((current) => current.filter((entry) => entry.codigo !== item.codigo));
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} />
      <Card icon={config.icon} title={editingId ? `Editar ${config.singular}` : `Novo ${config.singular}`}>
        <form onSubmit={submit}>
          <div className="form-grid">
            {config.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={form[field.name]}
                options={lookups[field.name]}
                onChange={updateField}
              />
            ))}
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn-ste-secondary" onClick={reset}>
              <i className="bi bi-eraser" />
              Limpar
            </button>
            <button className="btn-ste-primary" disabled={saving} type="submit">
              {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-check-lg" />}
              {editingId ? 'Salvar alterações' : 'Salvar'}
            </button>
          </div>
        </form>
      </Card>
      <Card icon="bi-table" title={`Registros de ${config.title}`}>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="search-bar">
            <input className="form-control" placeholder="Buscar..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <span className="fs-13 text-muted">{filteredItems.length} registro(s)</span>
        </div>
        <div className="table-wrapper">
          <table className="ste-table">
            <thead>
              <tr>
                <th>#</th>
                {config.columns.map((column) => <th key={column.header}>{column.header}</th>)}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingRow colSpan={config.columns.length + 2} />
              ) : filteredItems.length ? (
                filteredItems.map((item) => (
                  <tr key={item.codigo}>
                    <td className="fw-600 text-accent">{item.codigo}</td>
                    {config.columns.map((column) => <td key={column.header}>{column.render(item)}</td>)}
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon edit" title="Editar" onClick={() => edit(item)} type="button"><i className="bi bi-pencil-fill" /></button>
                        <button className="btn-icon delete" title="Excluir" onClick={() => remove(item)} type="button"><i className="bi bi-trash-fill" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={config.columns.length + 2} />
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

const cidadeLookup = {
  endpoint: '/cidades',
  label: (cidade) => `${cidade.nome} - ${cidade.estado?.siglaUF || cidade.estadoId || ''}`
};

const entityConfigs = {
  estados: {
    title: 'Estados',
    singular: 'Estado',
    subtitle: 'Gerencie estados e siglas UF',
    endpoint: '/estados',
    icon: 'bi-map-fill',
    fields: [
      { name: 'nome', label: 'Nome', span: 8, placeholder: 'Ex: Espirito Santo', minLength: 2, maxLength: 50 },
      { name: 'siglaUF', label: 'UF', span: 4, placeholder: 'Ex: ES', minLength: 2, maxLength: 2 }
    ],
    columns: [
      { header: 'Nome', render: (item) => item.nome },
      { header: 'UF', render: (item) => item.siglaUF }
    ]
  },
  cidades: {
    title: 'Cidades',
    singular: 'Cidade',
    subtitle: 'Gerencie cidades vinculadas aos estados',
    endpoint: '/cidades',
    icon: 'bi-geo-alt-fill',
    fields: [
      { name: 'nome', label: 'Nome', span: 8, placeholder: 'Ex: Cachoeiro de Itapemirim', minLength: 2, maxLength: 60 },
      { name: 'estadoId', label: 'Estado', type: 'select', span: 4, selectPlaceholder: 'Selecione o estado', lookup: { endpoint: '/estados', label: (estado) => `${estado.nome} (${estado.siglaUF})` } }
    ],
    columns: [
      { header: 'Nome', render: (item) => item.nome },
      { header: 'Estado', render: (item) => item.estado?.nome || item.estadoId }
    ]
  },
  prefeituras: {
    title: 'Prefeituras',
    singular: 'Prefeitura',
    subtitle: 'Gerencie prefeituras autorizadoras',
    endpoint: '/prefeituras',
    icon: 'bi-building-fill',
    fields: [
      { name: 'razaoSocial', label: 'Razão Social', span: 6, placeholder: 'Nome oficial da prefeitura' },
      { name: 'cnpj', label: 'CNPJ', span: 3, placeholder: '00.000.000/0000-00', maxLength: 18 },
      { name: 'email', label: 'E-mail', type: 'email', span: 3, placeholder: 'contato@prefeitura.gov.br' },
      { name: 'endereco', label: 'Endereço', span: 6, placeholder: 'Rua, numero, bairro' },
      { name: 'telefones', label: 'Telefones', span: 3, placeholder: '(28) 3322-0000' },
      { name: 'cidadeId', label: 'Cidade', type: 'select', span: 3, selectPlaceholder: 'Selecione a cidade', lookup: cidadeLookup }
    ],
    columns: [
      { header: 'Razão Social', render: (item) => item.razaoSocial },
      { header: 'CNPJ', render: (item) => item.cnpj },
      { header: 'Cidade', render: (item) => item.cidade?.nome || item.cidadeId },
      { header: 'E-mail', render: (item) => item.email }
    ]
  },
  instituicoes: {
    title: 'Instituições de Ensino',
    singular: 'Instituição',
    subtitle: 'Gerencie instituições vinculadas aos alunos',
    endpoint: '/instituicoes-ensino',
    icon: 'bi-mortarboard-fill',
    fields: [
      { name: 'nome', label: 'Nome', span: 6, placeholder: 'Ex: IFES Cachoeiro de Itapemirim' },
      { name: 'tipoInstituicao', label: 'Tipo', span: 3, placeholder: 'Publica ou Privada' },
      { name: 'cidadeId', label: 'Cidade', type: 'select', span: 3, selectPlaceholder: 'Selecione a cidade', lookup: cidadeLookup },
      { name: 'endereco', label: 'Endereço', span: 8, placeholder: 'Rua, numero, bairro' },
      { name: 'telefones', label: 'Telefones', span: 4, placeholder: '(28) 3300-0000' }
    ],
    columns: [
      { header: 'Nome', render: (item) => item.nome },
      { header: 'Tipo', render: (item) => item.tipoInstituicao },
      { header: 'Cidade', render: (item) => item.cidade?.nome || item.cidadeId }
    ]
  },
  motoristas: {
    title: 'Motoristas',
    singular: 'Motorista',
    subtitle: 'Gerencie motoristas e CNH',
    endpoint: '/motoristas',
    icon: 'bi-person-badge-fill',
    fields: [
      { name: 'nome', label: 'Nome', span: 6, placeholder: 'Nome do motorista' },
      { name: 'cpf', label: 'CPF', span: 3, placeholder: '000.000.000-00', maxLength: 14 },
      { name: 'telefones', label: 'Telefones', span: 3, placeholder: '(28) 99999-0000' },
      { name: 'cnh', label: 'CNH', span: 3, placeholder: '00000000000', maxLength: 11 },
      { name: 'validadeCNH', label: 'Validade CNH', type: 'date', span: 3 },
      { name: 'categoriaCNH', label: 'Categoria', type: 'select', span: 3, selectPlaceholder: 'Categoria', staticOptions: driverCategories },
      { name: 'situacao', label: 'Situação', type: 'select', span: 3, selectPlaceholder: 'Selecione a situacao', staticOptions: driverStatusOptions }
    ],
    columns: [
      { header: 'Nome', render: (item) => item.nome },
      { header: 'CPF', render: (item) => item.cpf },
      { header: 'CNH', render: (item) => item.cnh },
      { header: 'Situação', render: (item) => <Badge value={item.situacao} /> }
    ]
  },
  onibus: {
    title: 'Ônibus',
    singular: 'Ônibus',
    subtitle: 'Gerencie a frota escolar',
    endpoint: '/onibus',
    icon: 'bi-bus-front',
    fields: [
      { name: 'placa', label: 'Placa', span: 3, placeholder: 'AAA-0000', maxLength: 8 },
      { name: 'modelo', label: 'Modelo', span: 5, placeholder: 'Ex: Marcopolo Volare W9' },
      { name: 'capacidade', label: 'Capacidade', type: 'number', number: true, span: 2, placeholder: 'Ex: 40', min: 1, max: 100 },
      { name: 'ano', label: 'Ano', type: 'number', number: true, span: 2, placeholder: '2024', min: 1990, max: 2030 },
      { name: 'situacao', label: 'Situação', type: 'select', span: 3, selectPlaceholder: 'Selecione a situacao', staticOptions: busOptions }
    ],
    columns: [
      { header: 'Placa', render: (item) => <span className="badge bg-secondary font-monospace">{item.placa}</span> },
      { header: 'Modelo', render: (item) => item.modelo },
      { header: 'Capacidade', render: (item) => item.capacidade },
      { header: 'Situação', render: (item) => <Badge value={item.situacao} /> }
    ]
  },
  rotas: {
    title: 'Rotas',
    singular: 'Rota',
    subtitle: 'Gerencie rotas do transporte escolar',
    endpoint: '/rotas',
    icon: 'bi-signpost-2-fill',
    fields: [
      { name: 'descricao', label: 'Descrição', span: 6, placeholder: 'Descreva o percurso, pontos de parada, etc.' },
      { name: 'turno', label: 'Turno', type: 'select', span: 3, selectPlaceholder: 'Selecione o turno', staticOptions: turns },
      { name: 'origemId', label: 'Origem', type: 'select', span: 3, selectPlaceholder: 'Selecione a origem', lookup: cidadeLookup },
      { name: 'destinoId', label: 'Destino', type: 'select', span: 3, selectPlaceholder: 'Selecione o destino', lookup: cidadeLookup },
      { name: 'observacao', label: 'Observação', type: 'textarea', required: false, span: 9, placeholder: 'Opcional' }
    ],
    columns: [
      { header: 'Descrição', render: (item) => item.descricao },
      { header: 'Turno', render: (item) => item.turno },
      { header: 'Origem', render: (item) => item.origem?.nome || item.origemId },
      { header: 'Destino', render: (item) => item.destino?.nome || item.destinoId }
    ]
  },
  matriculas: {
    title: 'Matrículas de Transporte',
    singular: 'Matrícula',
    subtitle: 'Vincule alunos ativos às rotas',
    endpoint: '/matriculas-transporte',
    icon: 'bi-card-checklist',
    fields: [
      { name: 'alunoId', label: 'Aluno', type: 'select', span: 6, selectPlaceholder: 'Selecione o aluno', help: 'Apenas alunos com situacao ATIVO.', lookup: { endpoint: '/alunos', label: (aluno) => `${aluno.nome} - ${aluno.cpf}` } },
      { name: 'rotaId', label: 'Rota', type: 'select', span: 6, selectPlaceholder: 'Selecione a rota', lookup: { endpoint: '/rotas', label: (rota) => `${rota.descricao} (${rota.turno})` } }
    ],
    columns: [
      { header: 'Aluno', render: (item) => item.aluno?.nome || item.alunoId },
      { header: 'CPF', render: (item) => item.aluno?.cpf || '-' },
      { header: 'Rota', render: (item) => item.rota?.descricao || item.rotaId }
    ]
  },
  viagens: {
    title: 'Viagens',
    singular: 'Viagem',
    subtitle: 'Registre e gerencie viagens',
    endpoint: '/viagens',
    icon: 'bi-calendar2-check-fill',
    fields: [
      { name: 'data', label: 'Data', type: 'date', span: 3 },
      { name: 'horarioSaida', label: 'Horário de Saída', type: 'time', span: 3 },
      { name: 'horarioChegada', label: 'Horário de Chegada', type: 'time', span: 3 },
      { name: 'rotaId', label: 'Rota', type: 'select', span: 6, selectPlaceholder: 'Selecione a rota', lookup: { endpoint: '/rotas', label: (rota) => `${rota.descricao} (${rota.turno})` } },
      { name: 'motoristaId', label: 'Motorista', type: 'select', span: 3, selectPlaceholder: 'Selecione o motorista', lookup: { endpoint: '/motoristas', label: (motorista) => `${motorista.nome} - ${motorista.cpf}` } },
      { name: 'onibusId', label: 'Ônibus', type: 'select', span: 3, selectPlaceholder: 'Selecione o onibus', lookup: { endpoint: '/onibus', label: (onibus) => `${onibus.placa} - ${onibus.modelo}` } }
    ],
    columns: [
      { header: 'Data', render: (item) => fmtDate(item.data) },
      { header: 'Saída', render: (item) => item.horarioSaida },
      { header: 'Rota', render: (item) => item.rota?.descricao || item.rotaId },
      { header: 'Motorista', render: (item) => item.motorista?.nome || item.motoristaId },
      { header: 'Ônibus', render: (item) => item.onibus?.placa || item.onibusId }
    ]
  }
};

function todayInputValue() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function emptyTripForm() {
  return {
    data: todayInputValue(),
    horarioSaida: '',
    horarioChegada: '',
    rotaId: '',
    motoristaId: '',
    onibusId: ''
  };
}

function routeName(route) {
  return `${route?.origem?.nome || route?.origemId || '?'} -> ${route?.destino?.nome || route?.destinoId || '?'}`;
}

function routeOptionLabel(route, showCode = false) {
  const code = showCode ? `#${route.codigo} | ` : '';
  return `${code}${routeName(route)} (${route.turno || '-'})`;
}

function TripFormPage() {
  const showToast = useToast();
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(emptyTripForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [rotas, motoristas, onibus] = await Promise.all([
          api.get('/rotas?include=true'),
          api.get('/motoristas'),
          api.get('/onibus')
        ]);
        if (!active) return;
        setRoutes(rotas);
        setDrivers(motoristas);
        setBuses(onibus);
      } catch (err) {
        showToast(`Erro ao carregar dados: ${err.message}`, 'error');
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const selectedRoute = routes.find((route) => Number(route.codigo) === Number(form.rotaId));
  const activeDrivers = drivers.filter((driver) => String(driver.situacao || '').toUpperCase() === 'ATIVO');
  const activeBuses = buses.filter((bus) => String(bus.situacao || '').toUpperCase() === 'ATIVO');

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const reset = () => {
    setError('');
    setForm(emptyTripForm());
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/viagens', {
        data: form.data,
        horarioSaida: form.horarioSaida,
        horarioChegada: form.horarioChegada,
        rotaId: Number(form.rotaId),
        motoristaId: Number(form.motoristaId),
        onibusId: Number(form.onibusId)
      });
      showToast('Viagem registrada com sucesso.');
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Nova Viagem"
        subtitle="Registre a execução de uma rota de transporte escolar"
        action={<Link to="/viagens" className="btn-ste-secondary text-decoration-none"><i className="bi bi-arrow-left" /> Ver listagem</Link>}
      />
      {error && (
        <div className="alert alert-danger d-flex gap-2 align-items-center mb-3">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={submit}>
        <Card icon="bi-calendar2-check-fill" title="Dados da Viagem">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label" htmlFor="data">Data da Viagem <span className="text-danger">*</span></label>
              <input id="data" className="form-control" type="date" value={form.data} required onChange={(event) => setField('data', event.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="horarioSaida">Horário de Saída <span className="text-danger">*</span></label>
              <input id="horarioSaida" className="form-control" type="time" value={form.horarioSaida} required onChange={(event) => setField('horarioSaida', event.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="horarioChegada">Horário de Chegada</label>
              <input id="horarioChegada" className="form-control" type="time" value={form.horarioChegada} onChange={(event) => setField('horarioChegada', event.target.value)} />
            </div>
          </div>
        </Card>

        <Card icon="bi-link-45deg" title="Recursos da Viagem">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label" htmlFor="rotaId">Rota <span className="text-danger">*</span></label>
              <select id="rotaId" className="form-select" value={form.rotaId} required onChange={(event) => setField('rotaId', event.target.value)}>
                <option value="">-- Selecione a rota --</option>
                {routes.map((route) => <option value={route.codigo} key={route.codigo}>{routeOptionLabel(route, true)}</option>)}
              </select>
            </div>
            {selectedRoute && (
              <div className="col-md-7">
                <div className="trip-route-preview">
                  <div className="d-flex align-items-center gap-2 fs-13">
                    <i className="bi bi-signpost-2-fill text-accent" />
                    <span className="fw-600">{routeName(selectedRoute)}</span>
                  </div>
                  <div className="text-muted fs-13 mt-1">Turno: {selectedRoute.turno} | {selectedRoute.descricao}</div>
                </div>
              </div>
            )}
            <div className="col-md-5">
              <label className="form-label" htmlFor="motoristaId">Motorista <span className="text-danger">*</span></label>
              <select id="motoristaId" className="form-select" value={form.motoristaId} required onChange={(event) => setField('motoristaId', event.target.value)}>
                <option value="">-- Selecione o motorista --</option>
                {activeDrivers.map((driver) => <option value={driver.codigo} key={driver.codigo}>{driver.nome} - CNH {driver.cnh}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="onibusId">Ônibus <span className="text-danger">*</span></label>
              <select id="onibusId" className="form-select" value={form.onibusId} required onChange={(event) => setField('onibusId', event.target.value)}>
                <option value="">-- Selecione o ônibus --</option>
                {activeBuses.map((bus) => <option value={bus.codigo} key={bus.codigo}>{bus.placa} - {bus.modelo} ({bus.capacidade} lugares)</option>)}
              </select>
            </div>
          </div>
        </Card>

        <div className="d-flex gap-3 justify-content-end">
          <Link to="/viagens" className="btn-ste-secondary text-decoration-none"><i className="bi bi-x" /> Cancelar</Link>
          <button type="submit" className="btn-ste-primary" disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-check-lg" />}
            {saving ? 'Registrando...' : 'Registrar Viagem'}
          </button>
        </div>
      </form>
    </>
  );
}

function TripsListPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [query, setQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [viagens, rotas, motoristas, onibus] = await Promise.all([
        api.get('/viagens?include=true'),
        api.get('/rotas?include=true'),
        api.get('/motoristas'),
        api.get('/onibus')
      ]);
      setTrips(viagens);
      setRoutes(rotas);
      setDrivers(motoristas);
      setBuses(onibus);
    } catch (err) {
      showToast(`Erro ao carregar viagens: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const text = [
      trip.rota?.origem?.nome,
      trip.rota?.destino?.nome,
      trip.rota?.descricao,
      trip.motorista?.nome,
      trip.onibus?.placa
    ].join(' ').toLowerCase();
    const matchesQuery = !query || text.includes(query.toLowerCase());
    const matchesDate = !filterDate || trip.data === filterDate;
    return matchesQuery && matchesDate;
  });

  const openEdit = async (trip) => {
    try {
      const current = await api.get(`/viagens/${trip.codigo}`);
      setEditForm({
        codigo: current.codigo,
        data: current.data || '',
        horarioSaida: current.horarioSaida || '',
        horarioChegada: current.horarioChegada || '',
        rotaId: current.rotaId || '',
        motoristaId: current.motoristaId || '',
        onibusId: current.onibusId || ''
      });
    } catch (err) {
      showToast(`Erro ao abrir edição: ${err.message}`, 'error');
    }
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put(`/viagens/${editForm.codigo}`, {
        data: editForm.data,
        horarioSaida: editForm.horarioSaida,
        horarioChegada: editForm.horarioChegada,
        rotaId: Number(editForm.rotaId),
        motoristaId: Number(editForm.motoristaId),
        onibusId: Number(editForm.onibusId)
      });
      showToast('Viagem atualizada com sucesso.');
      setEditForm(null);
      await loadAll();
    } catch (err) {
      showToast(`Erro: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (trip) => {
    if (!(await confirm(`Excluir a viagem #${trip.codigo}?`))) return;
    try {
      await api.delete(`/viagens/${trip.codigo}`);
      showToast('Viagem excluída com sucesso.');
      setTrips((current) => current.filter((item) => item.codigo !== trip.codigo));
    } catch (err) {
      showToast(`Erro: ${err.message}`, 'error');
    }
  };

  const setEditField = (name, value) => setEditForm((current) => ({ ...current, [name]: value }));

  return (
    <>
      <PageHeader
        title="Viagens Registradas"
        subtitle="Histórico completo de viagens do sistema"
        action={<Link to="/viagens/nova" className="btn-ste-primary text-decoration-none"><i className="bi bi-plus-lg" /> Nova Viagem</Link>}
      />

      <Card>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex gap-2 flex-wrap">
            <div className="search-bar">
              <i className="bi bi-search search-icon" />
              <input className="form-control" placeholder="Buscar por rota, motorista..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <input className="form-control trip-date-filter" type="date" title="Filtrar por data" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} />
          </div>
          <span className="fs-13 text-muted">{loading ? 'Carregando...' : `${filteredTrips.length} registro(s)`}</span>
        </div>

        <div className="table-wrapper">
          <table className="ste-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Data</th>
                <th>Rota</th>
                <th>Motorista</th>
                <th>Ônibus</th>
                <th>Saída</th>
                <th>Chegada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingRow colSpan={8} />
              ) : filteredTrips.length ? (
                filteredTrips.map((trip) => (
                  <tr key={trip.codigo}>
                    <td className="fw-600 text-accent">{trip.codigo}</td>
                    <td className="fw-600">{fmtDate(trip.data)}</td>
                    <td>
                      <span className="fw-600">{trip.rota?.origem?.nome || '?'}</span>
                      <i className="bi bi-arrow-right mx-1 text-accent" />
                      <span className="fw-600">{trip.rota?.destino?.nome || '?'}</span>
                    </td>
                    <td>{trip.motorista?.nome || '-'}</td>
                    <td className="font-monospace">{trip.onibus?.placa || '-'}</td>
                    <td><span className="badge-ste embarque"><i className="bi bi-clock" />{trip.horarioSaida}</span></td>
                    <td><span className="badge-ste desembarque"><i className="bi bi-clock" />{trip.horarioChegada}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon edit" title="Editar" onClick={() => openEdit(trip)} type="button"><i className="bi bi-pencil-fill" /></button>
                        <button className="btn-icon delete" title="Excluir" onClick={() => remove(trip)} type="button"><i className="bi bi-trash-fill" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={8} message="Nenhuma viagem encontrada." />
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editForm && (
        <div className="react-modal-backdrop">
          <div className="react-trip-modal">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="trip-modal-title"><i className="bi bi-pencil-square me-2 text-accent" />Editar Viagem</h2>
              <button className="btn-icon" type="button" onClick={() => setEditForm(null)}><i className="bi bi-x-lg" /></button>
            </div>
            <form onSubmit={saveEdit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Data <span className="text-danger">*</span></label>
                  <input className="form-control" type="date" value={editForm.data} required onChange={(event) => setEditField('data', event.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Saída <span className="text-danger">*</span></label>
                  <input className="form-control" type="time" value={editForm.horarioSaida} required onChange={(event) => setEditField('horarioSaida', event.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Chegada <span className="text-danger">*</span></label>
                  <input className="form-control" type="time" value={editForm.horarioChegada} required onChange={(event) => setEditField('horarioChegada', event.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Rota <span className="text-danger">*</span></label>
                  <select className="form-select" value={editForm.rotaId} required onChange={(event) => setEditField('rotaId', event.target.value)}>
                    <option value="">-- Selecione --</option>
                    {routes.map((route) => <option value={route.codigo} key={route.codigo}>{routeOptionLabel(route)}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Motorista <span className="text-danger">*</span></label>
                  <select className="form-select" value={editForm.motoristaId} required onChange={(event) => setEditField('motoristaId', event.target.value)}>
                    <option value="">-- Selecione --</option>
                    {drivers.map((driver) => <option value={driver.codigo} key={driver.codigo}>{driver.nome} - {driver.cnh}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ônibus <span className="text-danger">*</span></label>
                  <select className="form-select" value={editForm.onibusId} required onChange={(event) => setEditField('onibusId', event.target.value)}>
                    <option value="">-- Selecione --</option>
                    {buses.map((bus) => <option value={bus.codigo} key={bus.codigo}>{bus.placa} - {bus.modelo}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn-ste-secondary" type="button" onClick={() => setEditForm(null)}>Cancelar</button>
                <button className="btn-ste-primary" type="submit" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-check-lg" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const confirm = useConfirm();

  const load = async () => {
    setLoading(true);
    try {
      setStudents(await api.get('/alunos?include=true'));
    } catch (error) {
      showToast(`Erro ao carregar alunos: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = students.filter((student) => {
    const text = `${student.nome || ''} ${student.cpf || ''}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const remove = async (student) => {
    if (!(await confirm(`Excluir o aluno "${student.nome}"?`))) return;
    try {
      await api.delete(`/alunos/${student.codigo}`);
      showToast('Aluno excluído com sucesso.');
      setStudents((current) => current.filter((item) => item.codigo !== student.codigo));
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Alunos Cadastrados"
        subtitle="Gerencie os alunos registrados no sistema"
        action={<Link to="/alunos/novo" className="btn-ste-primary text-decoration-none"><i className="bi bi-plus-lg" /> Novo Aluno</Link>}
      />
      <Card>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="search-bar">
            <input className="form-control" placeholder="Buscar por nome ou CPF..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <span className="fs-13 text-muted">{filtered.length} registro(s)</span>
        </div>
        <div className="table-wrapper">
          <table className="ste-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Instituição</th>
                <th>Prefeitura</th>
                <th>Rota(s)</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <LoadingRow colSpan={8} /> : filtered.length ? filtered.map((student) => (
                <tr key={student.codigo}>
                  <td className="fw-600 text-accent">{student.codigo}</td>
                  <td className="fw-600">{student.nome}</td>
                  <td className="font-monospace">{student.cpf}</td>
                  <td>{student.instituicaoEnsino?.nome || student.instituicaoEnsinoId || '-'}</td>
                  <td>{student.prefeitura?.razaoSocial || student.prefeituraId || '-'}</td>
                  <td>{student.matriculas?.length ? student.matriculas.map((matricula) => (
                    <span className="badge bg-secondary me-1 mb-1" key={matricula.codigo}>{matricula.rota?.descricao || `Rota ${matricula.rotaId}`}</span>
                  )) : <span className="text-muted small">Sem rota</span>}</td>
                  <td><Badge value={student.situacaoAcesso} /></td>
                  <td>
                    <div className="table-actions">
                      <Link className="btn-icon edit" title="Editar" to={`/alunos/${student.codigo}/editar`}><i className="bi bi-pencil-fill" /></Link>
                      <button className="btn-icon delete" title="Excluir" onClick={() => remove(student)} type="button"><i className="bi bi-trash-fill" /></button>
                    </div>
                  </td>
                </tr>
              )) : <EmptyRow colSpan={8} />}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function StudentFormPage({ legacy = false }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const id = legacy ? searchParams.get('id') : params.id;
  const editing = Boolean(id);
  const [lookups, setLookups] = useState({ prefeituras: [], instituicoes: [] });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    telefones: '',
    responsavelLegal: '',
    situacaoAcesso: 'ATIVO',
    prefeituraId: '',
    instituicaoEnsinoId: '',
    foto: ''
  });

  useEffect(() => {
    async function load() {
      try {
        const [prefeituras, instituicoes] = await Promise.all([
          api.get('/prefeituras'),
          api.get('/instituicoes-ensino')
        ]);
        setLookups({ prefeituras, instituicoes });
        if (editing) {
          const student = await api.get(`/alunos/${id}`);
          setForm({
            nome: student.nome || '',
            cpf: student.cpf || '',
            dataNascimento: student.dataNascimento || '',
            endereco: student.endereco || '',
            telefones: student.telefones || '',
            responsavelLegal: student.responsavelLegal || '',
            situacaoAcesso: student.situacaoAcesso || 'ATIVO',
            prefeituraId: student.prefeituraId || '',
            instituicaoEnsinoId: student.instituicaoEnsinoId || '',
            foto: student.foto || ''
          });
        }
      } catch (error) {
        showToast(`Erro ao carregar aluno: ${error.message}`, 'error');
      }
    }
    load();
  }, [editing, id, showToast]);

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        responsavelLegal: form.responsavelLegal || null,
        prefeituraId: Number(form.prefeituraId),
        instituicaoEnsinoId: Number(form.instituicaoEnsinoId)
      };
      if (!payload.foto) delete payload.foto;
      if (editing) {
        await api.put(`/alunos/${id}`, payload);
        showToast('Aluno atualizado com sucesso.');
      } else {
        await api.post('/alunos', payload);
        showToast('Aluno cadastrado com sucesso.');
      }
      navigate('/alunos');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      update('foto', await fileToBase64(file));
    } catch {
      showToast('Erro ao processar a foto do aluno.', 'error');
    }
  };

  return (
    <>
      <PageHeader
        title={editing ? 'Editar Aluno' : 'Novo Aluno'}
        subtitle={editing ? `Editando cadastro #${id}` : 'Preencha os dados para cadastrar um aluno'}
        action={<Link to="/alunos" className="btn-ste-secondary text-decoration-none"><i className="bi bi-arrow-left" /> Ver listagem</Link>}
      />
      <form onSubmit={submit}>
        <Card icon="bi-person-fill" title="Dados Pessoais">
          <div className="form-grid">
            <FormField field={{ name: 'nome', label: 'Nome completo', span: 6, placeholder: 'Nome do aluno' }} value={form.nome} onChange={update} />
            <FormField field={{ name: 'cpf', label: 'CPF', span: 3, placeholder: '000.000.000-00', maxLength: 14 }} value={form.cpf} onChange={update} />
            <FormField field={{ name: 'dataNascimento', label: 'Data de Nascimento', type: 'date', span: 3 }} value={form.dataNascimento} onChange={update} />
            <FormField field={{ name: 'endereco', label: 'Endereço', span: 8, placeholder: 'Rua, numero, bairro, cidade' }} value={form.endereco} onChange={update} />
            <FormField field={{ name: 'telefones', label: 'Telefones', span: 4, placeholder: '(28) 99999-0000' }} value={form.telefones} onChange={update} />
            <FormField field={{ name: 'responsavelLegal', label: 'Responsável Legal', required: false, span: 6, placeholder: 'Nome do responsavel (obrigatorio se menor de 18 anos)' }} value={form.responsavelLegal} onChange={update} />
            <FormField field={{ name: 'situacaoAcesso', label: 'Situação de Acesso', type: 'select', selectPlaceholder: 'Selecione a situacao', staticOptions: studentStatusOptions, span: 3 }} value={form.situacaoAcesso} onChange={update} />
            <div className="field-span-3">
              <label className="form-label" htmlFor="foto">Foto</label>
              <input id="foto" className="form-control" type="file" accept=".jpg,.jpeg,.png" onChange={onFile} />
              {form.foto && <img src={form.foto} className="img-thumbnail mt-2 d-block" style={{ maxHeight: 100 }} alt="Foto do aluno" />}
            </div>
          </div>
        </Card>
        <Card icon="bi-link-45deg" title="Vínculos Institucionais">
          <div className="form-grid">
            <FormField
              field={{ name: 'prefeituraId', label: 'Prefeitura Autorizadora', type: 'select', span: 6, selectPlaceholder: 'Selecione a prefeitura' }}
              value={form.prefeituraId}
              onChange={update}
              options={lookups.prefeituras.map((item) => ({ value: item.codigo, label: item.razaoSocial }))}
            />
            <FormField
              field={{ name: 'instituicaoEnsinoId', label: 'Instituição de Ensino', type: 'select', span: 6, selectPlaceholder: 'Selecione a instituicao' }}
              value={form.instituicaoEnsinoId}
              onChange={update}
              options={lookups.instituicoes.map((item) => ({ value: item.codigo, label: item.nome }))}
            />
          </div>
        </Card>
        <div className="d-flex gap-3 justify-content-end">
          <Link to="/alunos" className="btn-ste-secondary text-decoration-none"><i className="bi bi-x" /> Cancelar</Link>
          <button className="btn-ste-primary" disabled={saving} type="submit">
            {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-check-lg" />}
            Salvar Aluno
          </button>
        </div>
      </form>
    </>
  );
}

function AccessPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const [students, setStudents] = useState([]);
  const [trips, setTrips] = useState([]);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [studentFilter, setStudentFilter] = useState('');
  const [form, setForm] = useState({
    tipo: 'EMBARQUE',
    dataHora: '',
    alunoId: '',
    viagemId: ''
  });

  const load = async () => {
    try {
      const [alunos, viagens, acessos] = await Promise.all([
        api.get('/alunos'),
        api.get('/viagens?include=true'),
        api.get('/registros-acesso?include=true')
      ]);
      setStudents(alunos);
      setTrips(viagens);
      setRecords(acessos);
    } catch (error) {
      showToast(`Erro ao carregar dados: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setForm((current) => ({ ...current, dataHora: now.toISOString().slice(0, 16) }));
    load();
  }, []);

  const selectedTrip = trips.find((trip) => Number(trip.codigo) === Number(form.viagemId));
  const availableStudents = selectedTrip
    ? students.filter((student) => student.matriculas?.some((matricula) => Number(matricula.rotaId) === Number(selectedTrip.rotaId)))
    : [];
  const filteredStudents = availableStudents.filter((student) => `${student.nome} ${student.cpf}`.toLowerCase().includes(studentFilter.toLowerCase()));

  const setField = (name, value) => {
    setForm((current) => {
      const next = { ...current, [name]: value };
      const trip = name === 'viagemId' ? trips.find((item) => Number(item.codigo) === Number(value)) : selectedTrip;
      if ((name === 'viagemId' || name === 'tipo') && trip?.data) {
        const tipo = name === 'tipo' ? value : next.tipo;
        const hour = tipo === 'DESEMBARQUE' ? trip.horarioChegada : trip.horarioSaida;
        if (hour) next.dataHora = `${trip.data}T${hour.slice(0, 5)}`;
      }
      if (name === 'viagemId') next.alunoId = '';
      return next;
    });
  };

  const reset = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setEditingId(null);
    setStudentFilter('');
    setForm({ tipo: 'EMBARQUE', dataHora: now.toISOString().slice(0, 16), alunoId: '', viagemId: '' });
  };

  const submit = async (event) => {
    event.preventDefault();
    const student = students.find((item) => Number(item.codigo) === Number(form.alunoId));
    const trip = trips.find((item) => Number(item.codigo) === Number(form.viagemId));
    if (!trip || !student?.matriculas?.some((matricula) => Number(matricula.rotaId) === Number(trip.rotaId))) {
      showToast('O aluno selecionado não possui matrícula na rota desta viagem.', 'error');
      return;
    }
    const payload = {
      tipo: form.tipo,
      dataHora: new Date(form.dataHora).toISOString(),
      alunoId: Number(form.alunoId),
      viagemId: Number(form.viagemId)
    };
    try {
      if (editingId) {
        await api.put(`/registros-acesso/${editingId}`, payload);
        showToast('Registro de acesso atualizado.');
      } else {
        await api.post('/registros-acesso', payload);
        showToast('Registro de acesso criado.');
      }
      reset();
      await load();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const edit = (record) => {
    const dt = new Date(record.dataHora);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    setEditingId(record.codigo);
    setForm({
      tipo: record.tipo,
      dataHora: dt.toISOString().slice(0, 16),
      alunoId: String(record.alunoId),
      viagemId: String(record.viagemId)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (record) => {
    if (!(await confirm(`Excluir o registro de acesso #${record.codigo}?`))) return;
    try {
      await api.delete(`/registros-acesso/${record.codigo}`);
      showToast('Registro excluído.');
      setRecords((current) => current.filter((item) => item.codigo !== record.codigo));
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const recent = records.slice().sort((a, b) => (b.codigo || 0) - (a.codigo || 0)).slice(0, 20);

  return (
    <>
      <PageHeader
        title={editingId ? 'Editar Registro de Acesso' : 'Registrar Acesso'}
        subtitle={editingId ? `Editando registro #${editingId}` : 'Registre embarques e desembarques dos alunos'}
      />
      <form onSubmit={submit}>
        <Card icon="bi-qr-code-scan" title="Dados do Registro">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label" htmlFor="tipo">Tipo <span className="text-danger">*</span></label>
              <select id="tipo" className="form-select" value={form.tipo} required onChange={(event) => setField('tipo', event.target.value)}>
                <option value="">-- Selecione --</option>
                <option value="EMBARQUE">Embarque</option>
                <option value="DESEMBARQUE">Desembarque</option>
              </select>
              <div className="invalid-feedback">Selecione o tipo.</div>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="dataHora">Data e Hora <span className="text-danger">*</span></label>
              <input id="dataHora" className="form-control" type="datetime-local" value={form.dataHora} required onChange={(event) => setField('dataHora', event.target.value)} />
              <div className="invalid-feedback">Informe a data e hora.</div>
            </div>
          </div>

          <div className="row g-3 mt-0">
            <div className="col-md-5">
              <label className="form-label" htmlFor="alunoId">Aluno <span className="text-danger">*</span></label>
              <input
                className="form-control mb-2"
                placeholder="Pesquisar aluno por nome ou código..."
                value={studentFilter}
                onChange={(event) => setStudentFilter(event.target.value)}
              />
              <select id="alunoId" className="form-select" size={4} value={form.alunoId} required onChange={(event) => setField('alunoId', event.target.value)}>
                <option value="">{selectedTrip ? '-- Selecione o aluno --' : '-- Selecione a viagem --'}</option>
                {filteredStudents.map((student) => (
                  <option value={student.codigo} key={student.codigo}>{student.nome} - {student.cpf}</option>
                ))}
              </select>
              <div className="invalid-feedback">Selecione o aluno.</div>
            </div>
            <div className="col-md-5">
              <label className="form-label" htmlFor="viagemId">Viagem <span className="text-danger">*</span></label>
              <select id="viagemId" className="form-select" value={form.viagemId} required onChange={(event) => setField('viagemId', event.target.value)}>
                <option value="">-- Selecione --</option>
                {trips.map((trip) => (
                  <option value={trip.codigo} key={trip.codigo}>
                    #{trip.codigo} | {fmtDate(trip.data)} | {trip.rota?.origem?.nome || '?'} - {trip.rota?.destino?.nome || '?'} ({trip.horarioSaida})
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">Selecione a viagem.</div>
            </div>
          </div>

          {selectedTrip && (
            <div className="mt-3 p-3 rounded-3 access-preview">
              <div className="row g-2 fs-13">
                <div className="col-md-4"><span className="text-muted">Rota:</span><span className="fw-600 ms-1">{selectedTrip.rota?.origem?.nome || '?'} - {selectedTrip.rota?.destino?.nome || '?'}</span></div>
                <div className="col-md-3"><span className="text-muted">Data:</span><span className="fw-600 ms-1">{fmtDate(selectedTrip.data)}</span></div>
                <div className="col-md-2"><span className="text-muted">Saída:</span><span className="fw-600 ms-1">{selectedTrip.horarioSaida}</span></div>
                <div className="col-md-3"><span className="text-muted">Motorista:</span><span className="fw-600 ms-1">{selectedTrip.motorista?.nome || '-'}</span></div>
              </div>
            </div>
          )}
        </Card>
        <div className="d-flex gap-3 justify-content-end mt-4">
          {editingId && <button type="button" className="btn-ste-secondary" onClick={reset}><i className="bi bi-x" /> Cancelar Edição</button>}
          {!editingId && <button type="button" className="btn-ste-secondary" onClick={reset}><i className="bi bi-eraser" /> Limpar</button>}
          <button type="submit" className="btn-ste-primary"><i className="bi bi-check-lg" /> {editingId ? 'Salvar alterações' : 'Registrar Acesso'}</button>
        </div>
      </form>
      <Card icon="bi-clock-history" title="Últimos Registros" className="mt-4">
        <div className="table-wrapper">
          <table className="ste-table">
            <thead>
              <tr><th>#</th><th>Tipo</th><th>Aluno</th><th>Viagem</th><th>Data/Hora</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {recent.length ? recent.map((record) => (
                <tr key={record.codigo}>
                  <td className="fw-600 text-accent">{record.codigo}</td>
                  <td><Badge value={record.tipo} /></td>
                  <td className="fw-600">{record.aluno?.nome || record.alunoId}</td>
                  <td>#{record.viagemId}</td>
                  <td>{record.dataHora ? new Date(record.dataHora).toLocaleString('pt-BR') : '-'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon edit" onClick={() => edit(record)} type="button"><i className="bi bi-pencil-fill" /></button>
                      <button className="btn-icon delete" onClick={() => remove(record)} type="button"><i className="bi bi-trash-fill" /></button>
                    </div>
                  </td>
                </tr>
              )) : <EmptyRow colSpan={6} />}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function ReportTable({ columns, rows, empty = 'Nenhum registro encontrado.' }) {
  return (
    <div className="table-wrapper">
      <table className="ste-table">
        <thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={row.codigo || row.alunoCodigo || row.onibusId || index}>
              {columns.map((column) => <td key={column.header}>{column.render(row)}</td>)}
            </tr>
          )) : <EmptyRow colSpan={columns.length} message={empty} />}
        </tbody>
      </table>
    </div>
  );
}

function DateRangeReport({ title, subtitle, icon, endpoint, columns, transformUrl, summary }) {
  const showToast = useToast();
  const [filters, setFilters] = useState({ dataInicial: '2026-04-01', dataFinal: '2026-04-30' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (filters.dataInicial > filters.dataFinal) {
      showToast('A data inicial não pode ser posterior à data final.', 'error');
      return;
    }
    setLoading(true);
    try {
      const url = transformUrl ? transformUrl(filters) : `${endpoint}?dataInicial=${filters.dataInicial}&dataFinal=${filters.dataFinal}`;
      setRows(await api.get(url));
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Card icon="bi-calendar-range-fill" title="Período de Análise">
        <form className="row g-3 align-items-end" onSubmit={submit}>
          <div className="col-md-5">
            <label className="form-label" htmlFor={`${title}-inicio`}>Data Inicial</label>
            <input id={`${title}-inicio`} className="form-control" type="date" value={filters.dataInicial} onChange={(event) => setFilters({ ...filters, dataInicial: event.target.value })} required />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor={`${title}-final`}>Data Final</label>
            <input id={`${title}-final`} className="form-control" type="date" value={filters.dataFinal} onChange={(event) => setFilters({ ...filters, dataFinal: event.target.value })} required />
          </div>
          <div className="col-md-2">
            <button className="btn-ste-primary w-100 justify-content-center" type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-search" />}
              Buscar
            </button>
          </div>
        </form>
      </Card>
      {summary && rows.length > 0 && summary(rows)}
      <Card icon={icon} title="Resultados">
        <ReportTable columns={columns} rows={rows} empty="Selecione os filtros e clique em Buscar." />
      </Card>
    </>
  );
}

function AccessByStudentReport() {
  return (
    <DateRangeReport
      title="Acessos por Aluno"
      subtitle="Consulte a quantidade de embarques e desembarques por aluno em um período"
      icon="bi-table"
      transformUrl={({ dataInicial, dataFinal }) => `/registros-acesso/relatorios/quantidades-por-aluno/${dataInicial}/${dataFinal}`}
      columns={[
        { header: '#', render: (row) => row.alunoCodigo },
        { header: 'Aluno', render: (row) => row.aluno },
        { header: 'Total', render: (row) => row.quantidade },
        { header: 'Embarques', render: (row) => row.embarques },
        { header: 'Desembarques', render: (row) => row.desembarques }
      ]}
    />
  );
}

function AccessByPeriodReport() {
  const showToast = useToast();
  const [tipo, setTipo] = useState('Todos');
  const [filters, setFilters] = useState({ dataInicial: '2026-04-01', dataFinal: '2026-04-30' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (filters.dataInicial > filters.dataFinal) {
      showToast('A data inicial não pode ser posterior à data final.', 'error');
      return;
    }
    setLoading(true);
    try {
      const url = `/registros-acesso/relatorios/por-periodo?dataInicial=${filters.dataInicial}&dataFinal=${filters.dataFinal}${tipo !== 'Todos' ? `&tipo=${tipo}` : ''}`;
      setRows(await api.get(url));
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Acessos por Período" subtitle="Consulte o histórico de acessos num intervalo de datas" />
      <Card icon="bi-calendar-range-fill" title="Filtros">
        <form className="row g-3 align-items-end" onSubmit={submit}>
          <div className="col-md-3">
            <label className="form-label">Data Inicial</label>
            <input className="form-control" type="date" value={filters.dataInicial} onChange={(event) => setFilters({ ...filters, dataInicial: event.target.value })} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Data Final</label>
            <input className="form-control" type="date" value={filters.dataFinal} onChange={(event) => setFilters({ ...filters, dataFinal: event.target.value })} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={tipo} onChange={(event) => setTipo(event.target.value)}>
              <option value="Todos">Todos</option>
              <option value="EMBARQUE">Embarque</option>
              <option value="DESEMBARQUE">Desembarque</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn-ste-primary w-100 justify-content-center" type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-search" />}
              Buscar
            </button>
          </div>
        </form>
      </Card>
      <Card icon="bi-table" title="Resultados">
        <ReportTable
          columns={[
            { header: '#', render: (row) => row.codigo },
            { header: 'Tipo', render: (row) => <Badge value={row.tipo} /> },
            { header: 'Aluno', render: (row) => row.aluno?.nome || '-' },
            { header: 'Viagem', render: (row) => `#${row.viagemId}` },
            { header: 'Data/Hora', render: (row) => row.dataHora ? new Date(row.dataHora).toLocaleString('pt-BR') : '-' }
          ]}
          rows={rows}
          empty="Selecione os filtros e clique em Buscar."
        />
      </Card>
    </>
  );
}

function StudentsByInstitutionReport() {
  const showToast = useToast();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/alunos/relatorios/quantidades-por-instituicao-situacao')
      .then(setRows)
      .catch((error) => showToast(error.message, 'error'));
  }, [showToast]);

  return (
    <>
      <PageHeader title="Alunos por Instituição" subtitle="Distribuição de alunos por instituição e situação de acesso" />
      <Card icon="bi-table" title="Resultados">
        <ReportTable
          columns={[
            { header: 'Instituição', render: (row) => row.instituicao },
            { header: 'Situação', render: (row) => <Badge value={row.situacao} /> },
            { header: 'Quantidade', render: (row) => row.quantidade }
          ]}
          rows={rows}
        />
      </Card>
    </>
  );
}

function StudentsByRouteReport() {
  const showToast = useToast();
  const [routes, setRoutes] = useState([]);
  const [rotaId, setRotaId] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/rotas?include=true')
      .then(setRoutes)
      .catch((error) => showToast(error.message, 'error'));
  }, [showToast]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setRows(await api.get(`/alunos/relatorios/por-rota/${rotaId}`));
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader title="Alunos por Rota" subtitle="Consulte os alunos vinculados a uma rota específica" />
      <Card icon="bi-funnel-fill" title="Filtro">
        <form className="row g-3 align-items-end" onSubmit={submit}>
          <div className="col-md-9">
            <label className="form-label" htmlFor="rotaId">Rota</label>
            <select id="rotaId" className="form-select" value={rotaId} onChange={(event) => setRotaId(event.target.value)} required>
              <option value="">-- Selecione --</option>
              {routes.map((route) => (
                <option value={route.codigo} key={route.codigo}>{route.descricao} - {route.turno}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn-ste-primary w-100 justify-content-center" type="submit"><i className="bi bi-search" /> Buscar</button>
          </div>
        </form>
      </Card>
      <Card icon="bi-table" title="Resultados">
        <ReportTable
          columns={[
            { header: '#', render: (row) => row.codigo },
            { header: 'Aluno', render: (row) => row.nome },
            { header: 'CPF', render: (row) => row.cpf },
            { header: 'Situação', render: (row) => <Badge value={row.situacaoAcesso} /> },
            { header: 'Instituição', render: (row) => row.instituicaoEnsino?.nome || '-' }
          ]}
          rows={rows}
        />
      </Card>
    </>
  );
}

function TripsByDriverReport() {
  const showToast = useToast();
  const [drivers, setDrivers] = useState([]);
  const [filters, setFilters] = useState({ motoristaId: 'Todos', dataInicial: '', dataFinal: '' });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/motoristas')
      .then(setDrivers)
      .catch((error) => showToast(error.message, 'error'));
  }, [showToast]);

  const submit = async (event) => {
    event.preventDefault();
    if (filters.dataInicial && filters.dataFinal && filters.dataInicial > filters.dataFinal) {
      showToast('A data inicial não pode ser posterior à data final.', 'error');
      return;
    }
    let url = `/viagens/relatorios/por-motorista?motoristaId=${filters.motoristaId}`;
    if (filters.dataInicial && filters.dataFinal) url += `&dataInicial=${filters.dataInicial}&dataFinal=${filters.dataFinal}`;
    try {
      setRows(await api.get(url));
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader title="Viagens por Motorista" subtitle="Consulte viagens executadas por motorista" />
      <Card icon="bi-funnel-fill" title="Filtros">
        <form className="row g-3 align-items-end" onSubmit={submit}>
          <div className="col-md-4">
            <label className="form-label">Motorista</label>
            <select className="form-select" value={filters.motoristaId} onChange={(event) => setFilters({ ...filters, motoristaId: event.target.value })}>
              <option value="Todos">Todos os Motoristas</option>
              {drivers.map((driver) => <option value={driver.codigo} key={driver.codigo}>{driver.nome}</option>)}
            </select>
          </div>
          <div className="col-md-3"><label className="form-label">Data Inicial</label><input className="form-control" type="date" value={filters.dataInicial} onChange={(event) => setFilters({ ...filters, dataInicial: event.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Data Final</label><input className="form-control" type="date" value={filters.dataFinal} onChange={(event) => setFilters({ ...filters, dataFinal: event.target.value })} /></div>
          <div className="col-md-2"><button className="btn-ste-primary w-100 justify-content-center" type="submit"><i className="bi bi-search" /> Buscar</button></div>
        </form>
      </Card>
      <Card icon="bi-table" title={`Resultados (${rows.length})`}>
        <ReportTable
          columns={[
            { header: '#', render: (row) => row.codigo },
            { header: 'Data', render: (row) => fmtDate(row.data) },
            { header: 'Saída', render: (row) => row.horarioSaida },
            { header: 'Motorista', render: (row) => row.motorista?.nome || '-' },
            { header: 'Rota', render: (row) => row.rota?.descricao || '-' },
            { header: 'Ônibus', render: (row) => row.onibus?.placa || '-' }
          ]}
          rows={rows}
        />
      </Card>
    </>
  );
}

function FleetUsageReport() {
  return (
    <DateRangeReport
      title="Utilização de Frota"
      subtitle="Consulte a quantidade de viagens por veículo em um período"
      icon="bi-table"
      endpoint="/onibus/relatorios/utilizacao-frota"
      columns={[
        { header: 'Ônibus', render: (row) => row.onibusId },
        { header: 'Placa', render: (row) => <span className="badge bg-secondary font-monospace">{row.placa}</span> },
        { header: 'Modelo', render: (row) => row.modelo },
        { header: 'Capacidade', render: (row) => row.capacidade },
        { header: 'Situação', render: (row) => <Badge value={row.situacao} /> },
        { header: 'Viagens', render: (row) => row.quantidadeViagens }
      ]}
      summary={(rows) => (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="ste-card p-3 d-flex align-items-center gap-3">
              <div className="stat-icon green"><i className="bi bi-truck" /></div>
              <div><h3 className="m-0 fw-bold fs-4 text-accent">{rows.filter((row) => Number(row.quantidadeViagens) > 0).length}</h3><p className="m-0 text-muted small">Veículos Utilizados</p></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="ste-card p-3 d-flex align-items-center gap-3">
              <div className="stat-icon blue"><i className="bi bi-hash" /></div>
              <div><h3 className="m-0 fw-bold fs-4 text-accent">{rows.reduce((sum, row) => sum + Number(row.quantidadeViagens || 0), 0)}</h3><p className="m-0 text-muted small">Soma Total de Viagens</p></div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function LegacyEntity({ name }) {
  return <EntityPage config={entityConfigs[name]} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pages/login.html" element={<LoginPage />} />
      <Route path="/sair" element={<LogoutPage />} />
      <Route path="/pages/sair-sistema.html" element={<LogoutPage />} />
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<DashboardPage />} />
        <Route path="pages/index.html" element={<DashboardPage />} />
        <Route path="alunos" element={<StudentListPage />} />
        <Route path="alunos/novo" element={<StudentFormPage />} />
        <Route path="alunos/:id/editar" element={<StudentFormPage />} />
        <Route path="pages/listagem-aluno.html" element={<StudentListPage />} />
        <Route path="pages/cadastro-aluno.html" element={<StudentFormPage legacy />} />
        <Route path="estados" element={<EntityPage config={entityConfigs.estados} />} />
        <Route path="cidades" element={<EntityPage config={entityConfigs.cidades} />} />
        <Route path="prefeituras" element={<EntityPage config={entityConfigs.prefeituras} />} />
        <Route path="instituicoes-ensino" element={<EntityPage config={entityConfigs.instituicoes} />} />
        <Route path="motoristas" element={<EntityPage config={entityConfigs.motoristas} />} />
        <Route path="onibus" element={<EntityPage config={entityConfigs.onibus} />} />
        <Route path="rotas" element={<EntityPage config={entityConfigs.rotas} />} />
        <Route path="matriculas-transporte" element={<EntityPage config={entityConfigs.matriculas} />} />
        <Route path="viagens" element={<TripsListPage />} />
        <Route path="viagens/nova" element={<TripFormPage />} />
        <Route path="registros-acesso" element={<AccessPage />} />
        <Route path="pages/cadastro-estado.html" element={<LegacyEntity name="estados" />} />
        <Route path="pages/cadastro-cidade.html" element={<LegacyEntity name="cidades" />} />
        <Route path="pages/listagem-prefeitura.html" element={<LegacyEntity name="prefeituras" />} />
        <Route path="pages/cadastro-prefeitura.html" element={<LegacyEntity name="prefeituras" />} />
        <Route path="pages/cadastro-instituicao-ensino.html" element={<LegacyEntity name="instituicoes" />} />
        <Route path="pages/cadastro-motorista.html" element={<LegacyEntity name="motoristas" />} />
        <Route path="pages/cadastro-onibus.html" element={<LegacyEntity name="onibus" />} />
        <Route path="pages/cadastro-rota.html" element={<LegacyEntity name="rotas" />} />
        <Route path="pages/cadastro-matricula-transporte.html" element={<LegacyEntity name="matriculas" />} />
        <Route path="pages/listagem-viagens.html" element={<TripsListPage />} />
        <Route path="pages/registro-viagem.html" element={<TripFormPage />} />
        <Route path="pages/registro-acesso.html" element={<AccessPage />} />
        <Route path="relatorios/alunos-por-rota" element={<StudentsByRouteReport />} />
        <Route path="relatorios/acessos-por-aluno" element={<AccessByStudentReport />} />
        <Route path="relatorios/alunos-por-instituicao-situacao" element={<StudentsByInstitutionReport />} />
        <Route path="relatorios/acessos-por-periodo" element={<AccessByPeriodReport />} />
        <Route path="relatorios/viagens-por-motorista" element={<TripsByDriverReport />} />
        <Route path="relatorios/utilizacao-frota" element={<FleetUsageReport />} />
        <Route path="pages/relatorio-alunos-por-rota.html" element={<StudentsByRouteReport />} />
        <Route path="pages/relatorio-acessos-por-aluno.html" element={<AccessByStudentReport />} />
        <Route path="pages/relatorio-acessos-aluno.html" element={<AccessByStudentReport />} />
        <Route path="pages/relatorio-alunos-instituicao.html" element={<StudentsByInstitutionReport />} />
        <Route path="pages/relatorio-alunos-por-instituicao-situacao.html" element={<StudentsByInstitutionReport />} />
        <Route path="pages/relatorio-acessos-por-periodo.html" element={<AccessByPeriodReport />} />
        <Route path="pages/relatorio-viagens-motorista.html" element={<TripsByDriverReport />} />
        <Route path="pages/relatorio-utilizacao-frota.html" element={<FleetUsageReport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  );
}
