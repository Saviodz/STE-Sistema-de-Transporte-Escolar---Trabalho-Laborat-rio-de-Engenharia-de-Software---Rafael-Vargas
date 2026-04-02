# STE - Sistema de Transporte Escolar

Projeto desenvolvido como requisito para a disciplina de **Laboratório de Engenharia de Software**.

## Equipe
- Marco Antonio
- José Carlos
- Sávio

## Sobre o Projeto
O **STE (Sistema de Transporte Escolar)** é um sistema modelado para auxiliar prefeituras e instituições de ensino no gerenciamento da locomoção de alunos entre municípios. O sistema visa estruturar as rotas, os veículos (ônibus), os motoristas, as matrículas dos alunos no transporte e os registros de acesso (embarque/desembarque) das viagens.

Este repositório contém a implementação do **Banco de Dados (Código)**, referente à **Atividade 08 (PDS)**, estruturada em Node.js com ORM Sequelize.

### Classes de Modelo Implementadas (Mínimo de 4 seeds por classe)
Foram implementadas 11 classes de modelo baseadas no diagrama de classes do projeto, todas contendo associações e validações:
1. `Estado`
2. `Cidade`
3. `Prefeitura`
4. `InstituicaoEnsino`
5. `Aluno`
6. `Motorista`
7. `Onibus`
8. `Rota`
9. `Viagem`
10. `MatriculaTransporte` (Tabela associativa Aluno ↔ Rota)
11. `RegistroAcesso`

> **Nota para Avaliação:** O seed (`database-connection.js`) insere automaticamente no mínimo 4 registros funcionais para **cada uma** das classes listadas acima, cumprindo o requisito da rubrica.

---

## Estrutura do Projeto
O projeto está estruturado em camadas básicas:
```text
/src
 ├── config/
 │    ├── database-config.js      // Configurações do Sequelize (SQLite e PostgreSQL)
 │    └── database-connection.js  // Inicialização, associações e inserts de dados (seed)
 ├── models/                      // Definições das classes de modelo
 │    ├── Aluno.js
 │    ├── ...
 └── server.js                    // Ponto de entrada da aplicação
```

## Configuração do Banco de Dados

Para esta atividade, adotamos o **SQLite** como banco de dados principal da aplicação. Ao executar o projeto, o arquivo `database.sqlite` é criado automaticamente e recebe a carga inicial com pelo menos 4 registros por classe, cumprindo rigorosamente as especificações da rubrica.

O projeto está configurado para rodar os seeds e estruturar as tabelas (force sync) toda vez que for iniciado na configuração de desenvolvimento (teste).

### Executando o Projeto (Padrão: SQLite)
Esta é a configuração oficial para rodar e testar a aplicação sem a necessidade de instalar motores complexos:
1. No terminal integrado (pasta raiz do projeto), instale as dependências:
   ```bash
   npm install
   ```
2. Inicie a aplicação:
   ```bash
   npm start
   ```
3. O servidor subirá e você notará que o script gerou um arquivo chamado `database.sqlite` na raiz. É nesse banco que todas as nossas 11 tabelas foram geradas e populadas (no mínimo 4 itens por classe).

> **Observação Opcional (PostgreSQL)**: Caso haja interesse em escalar o projeto para um pipeline relacional tradicional, o arquivo `src/config/database-config.js` contém em estado inativo (comentado) um bloco de configuração para `PostgreSQL`. A apresentação oficial deste trabalho usa estritamente SQLite.
