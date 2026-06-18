# STE - Sistema de Transporte Escolar

Projeto academico desenvolvido para a disciplina de Laboratorio de Engenharia de Software, com foco no gerenciamento de transporte escolar. O sistema centraliza cadastros, operacao de viagens, matriculas em rotas e registros de acesso dos alunos.

## Integrantes

- Savio
- Marco
- Jose

## Objetivo do projeto

O STE apoia o controle operacional do transporte escolar, permitindo:

- cadastrar alunos e vinculos com instituicoes de ensino;
- gerenciar cidades, estados e prefeituras responsaveis;
- cadastrar motoristas e onibus;
- organizar rotas e matricular alunos nas rotas de transporte;
- registrar viagens com motorista e onibus designados;
- registrar embarques e desembarques dos alunos;
- emitir relatorios de alunos por rota, acessos por periodo e utilizacao da frota.

## Tecnologias utilizadas

- Node.js
- Express
- Sequelize
- PostgreSQL
- SQLite (ha configuracao comentada para uso local/teste)
- React
- Vite
- Bootstrap e Bootstrap Icons

## Estrutura geral

O projeto esta dividido nas seguintes partes:

- `src/`: backend da aplicacao com rotas, controllers, models, services e configuracao de banco.
- `frontend/`: aplicacao React usada no desenvolvimento do frontend.
- `public/`: frontend estatico legado e arquivos publicos servidos pelo backend.
- `public/react/`: build gerado do frontend React para acesso pelo backend.

Principais recursos da API:

- `estados`
- `cidades`
- `prefeituras`
- `instituicoes-ensino`
- `alunos`
- `motoristas`
- `onibus`
- `rotas`
- `viagens`
- `matriculas-transporte`
- `registros-acesso`
- `registros-acesso/relatorios/quantidades-por-aluno/:inicio/:termino`
- `alunos/relatorios/quantidades-por-instituicao-situacao`
- `relatorios/alunos-por-rota/:rotaId`
- `relatorios/acessos-por-periodo`

## Como executar o projeto

### Pre-requisitos

- Node.js instalado
- NPM instalado
- PostgreSQL em execucao local

### Instalar dependencias

```bash
npm install
```

### Configurar banco de dados

Verifique as configuracoes em `src/config/database-config.js`.

No estado atual do projeto, o backend esta configurado para usar PostgreSQL com os seguintes dados:

- `host`: `localhost`
- `username`: `postgres`
- `password`: `1234`
- `database`: `STE-Sistema-de-Transporte-Escolar`

### Iniciar o backend

```bash
npm start
```

ou, com reinicio automatico:

```bash
npm run dev
```

Backend/API:

```text
http://localhost:3333
```

### Iniciar o frontend React em desenvolvimento

```bash
npm run frontend:dev
```

Frontend React:

```text
http://localhost:5173
```

O Vite usa proxy para direcionar as chamadas da API para `http://localhost:3333`.

### Gerar build do frontend React

```bash
npm run frontend:build
```

O build e gravado em `public/react/`.

## Observacoes importantes

- Ao iniciar a aplicacao, o arquivo `src/config/database-connection.js` executa sincronizacao das tabelas e insercao de dados de exemplo.
- Esse comportamento recria/popula dados para uso academico e deve ser revisado antes de qualquer uso em producao.
- Durante desenvolvimento, use o frontend React em `http://localhost:5173`.

## Telas disponiveis no frontend React

A aplicacao React possui interface completa para gerenciamento do sistema, com formularios, listagens, edicao e exclusao.

- **Dashboard**: visao geral e acoes rapidas.
- **Cadastros Base**: Estado, Cidade, Instituicao de Ensino e Prefeitura.
- **Operacional**: Motorista, Onibus e Rota.
- **Alunos**: Cadastro, listagem e matricula de transporte.
- **Viagens**: listagem com busca/filtro, registro de nova viagem, previa de rota e edicao em modal.
- **Acessos**: registro de embarque/desembarque com selecao de viagem e aluno.
- **Relatorios**: alunos por rota, acessos por aluno, acessos por periodo, alunos por instituicao, viagens por motorista e utilizacao de frota.
- **Autenticacao**: login simulado e sair do sistema.

## Arquivos de apoio

- `collection.json`: colecao para testes de requisicoes da API.
- `mermaid.md`: diagrama conceitual das entidades do sistema.
- `wireframes.html`: material visual de apoio para a interface.

## Licenca

Este projeto esta definido com a licenca `ISC` no arquivo `package.json`.
