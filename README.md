# STE - Sistema de Transporte Escolar

Projeto academico desenvolvido para a disciplina de Laboratorio de Engenharia de Software, com foco no gerenciamento de transporte escolar. O sistema centraliza o cadastro de alunos, cidades, prefeituras, instituicoes de ensino, motoristas, onibus, rotas, viagens e registros de acesso.

## Integrantes

- Savio
- Marco
- Jose

## Objetivo do projeto

O STE tem como proposta apoiar o controle operacional do transporte escolar, permitindo:

- cadastrar alunos e vinculos com instituicoes de ensino;
- gerenciar cidades, estados e prefeituras responsaveis;
- cadastrar motoristas e onibus;
- organizar rotas e viagens;
- registrar embarques e desembarques dos alunos.

## Tecnologias utilizadas

- Node.js
- Express
- Sequelize
- PostgreSQL
- SQLite (ha configuracao comentada para uso local/teste)
- HTML, CSS e JavaScript no frontend estatico

## Estrutura geral

O projeto esta dividido em duas partes principais:

- `src/`: backend da aplicacao com rotas, controllers, models, services e configuracao de banco.
- `public/`: frontend estatico servido em `/app`.

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

## Como executar o projeto

### Pre-requisitos

- Node.js instalado
- NPM instalado
- PostgreSQL em execucao local

### Passos

1. Instale as dependencias:

```bash
npm install
```

2. Verifique as configuracoes do banco em `src/config/database-config.js`.

No estado atual do projeto, o backend esta configurado para usar PostgreSQL com os seguintes dados:

- `host`: `localhost`
- `username`: `postgres`
- `password`: `1234`
- `database`: `STE-Sistema-de-Transporte-Escolar`

3. Inicie a aplicacao:

```bash
npm run dev
```

ou

```bash
npm start
```

4. Acesse:

- API: `http://localhost:3333`
- Frontend: `http://localhost:3333/app`

## Observacoes importantes

- Ao iniciar a aplicacao, o arquivo `src/config/database-connection.js` executa `sequelize.sync({ force: true })`.
- Isso significa que as tabelas sao recriadas e os dados de exemplo sao inseridos novamente a cada inicializacao.
- Para ambiente de producao, esse comportamento deve ser revisado antes do deploy.

## Telas disponiveis no frontend

Algumas paginas ja existentes no projeto:

- login
- cadastro de aluno
- cadastro de cidade
- cadastro de instituicao de ensino
- cadastro de motorista
- cadastro de onibus
- cadastro de prefeitura
- cadastro de rota
- listagem de alunos
- listagem de prefeituras
- listagem de viagens
- registro de acesso
- registro de viagem

## Arquivos de apoio

- `collection.json`: colecao para testes de requisicoes da API
- `mermaid.md`: diagrama conceitual das entidades do sistema
- `wireframes.html`: material visual de apoio para a interface

## Licenca

Este projeto esta definido com a licenca `ISC` no arquivo `package.json`.
