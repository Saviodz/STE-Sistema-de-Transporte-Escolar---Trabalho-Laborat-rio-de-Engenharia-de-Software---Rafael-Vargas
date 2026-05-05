# Estrutura de Slides e Roteiro - Sistema de Transporte Escolar (STE)

**Instrução para criação dos Slides:** 
O professor definiu um padrão visual de 6 a 7 slides para cada aluno, focando em mostrar blocos de código (`Service`) e o SQL resultante gerado pelo ORM (Sequelize).
Siga rigorosamente a estrutura abaixo para montar a apresentação de cada integrante.

---

## 🚌 Apresentação 1: Processo de Viagem (Marco Antonio)

**Slide 01: Capa**
- **Tema:** Sistema de Transporte Escolar (STE)
- **Processo:** Registro de Viagem
- **Aluno:** Marco Antonio

**Slide 02: Visão Geral do Processo**
- **Detalhes da Viagem:** O registro principal associa uma data a uma Rota, a um Motorista e a um Ônibus.
- **Tabelas Envolvidas (Visual):** Mostrar as colunas principais das tabelas `viagens`, `rotas`, `motoristas` e `onibus`.

**Slide 03: Fluxo de Transação**
- **Código em tela:** Print do método `ViagemService.create()`.
- **Destaques no código:**
  - Abertura da transação: `const t = await sequelize.transaction();`
  - Inserção com transação: `await Viagem.create(..., { transaction: t });`
  - Finalização: `await t.commit();` e `await t.rollback();`

**Slide 04: Regras de Negócio**
- **Cards Visuais:**
  - *Regra 1:* Motorista não pode ter 2 viagens na mesma data.
  - *Regra 2:* Ônibus não pode ter 2 viagens na mesma data.
- **Código em tela:** Print geral do método `verificarRegrasDeNegocio(req)`.

**Slide 05: Implementação da Regra 1**
- **Código em tela:** Trecho do Sequelize verificando o motorista `await Viagem.findAll({ where: { data, motoristaId } })`.
- **SQL Resultante (SQL Tradicional):**
  ```sql
  SELECT id, data, horario_saida, rota_id, motorista_id, onibus_id 
  FROM viagens 
  WHERE data = '2026-04-10' AND motorista_id = 1;
  ```

**Slide 06: Implementação da Regra 2**
- **Código em tela:** Trecho do Sequelize verificando o ônibus `await Viagem.findAll({ where: { data, onibusId } })`.
- **SQL Resultante (SQL Tradicional):**
  ```sql
  SELECT id, data, horario_saida, rota_id, motorista_id, onibus_id 
  FROM viagens 
  WHERE data = '2026-04-10' AND onibus_id = 3;
  ```

---

## 👨‍🎓 Apresentação 2: Processo de Registro de Acesso (José Carlos Ceccon)

**Slide 01: Capa**
- **Tema:** Sistema de Transporte Escolar (STE)
- **Processo:** Registro de Acesso (Catraca)
- **Aluno:** José Carlos Ceccon

**Slide 02: Visão Geral do Processo**
- **Detalhes do Acesso:** O registro controla se o aluno entrou (Embarque) ou saiu (Desembarque) do ônibus em uma determinada viagem.
- **Tabelas Envolvidas (Visual):** Mostrar as colunas principais das tabelas `registros_acesso`, `alunos` e `viagens`.

**Slide 03: Fluxo de Transação**
- **Código em tela:** Print do método `RegistroAcessoService.create()`.
- **Destaques no código:**
  - Objeto de transação `t`.
  - Passagem explícita: `{ transaction: t }` no `RegistroAcesso.create`.
  - O bloco `catch` acionando o `rollback` em caso de falha simultânea.

**Slide 04: Regras de Negócio**
- **Cards Visuais:**
  - *Regra 1:* Máximo de 2 embarques diários por aluno.
  - *Regra 2:* Desembarque exige que haja um embarque prévio sem correspondência.
- **Código em tela:** Print geral do método `verificarRegrasDeNegocio(req)`.

**Slide 05: Implementação das Regras (Buscando o Histórico do Dia)**
- **Código em tela:** Trecho do Sequelize buscando acessos: `RegistroAcesso.findAll({ where: { alunoId, dataHora: { [Op.gte]: inicioDia, [Op.lte]: fimDia } } })`.
- **SQL Resultante (SQL Tradicional):**
  ```sql
  SELECT codigo, tipo, data_hora, aluno_id, viagem_id 
  FROM registros_acesso 
  WHERE aluno_id = 3 
  AND data_hora >= '2026-05-05 00:00:00' 
  AND data_hora <= '2026-05-05 23:59:59';
  ```

**Slide 06: Processamento das Regras (Lógica)**
- **Explicação Visual:** Mostrar como o código javascript separa os registros do banco em variáveis `embarquesHoje` e `desembarquesHoje`, fazendo a validação (`embarquesHoje.length >= 2`).

---

## 🏫 Apresentação 3: Processo de Matrícula de Transporte (Sávio)

**Slide 01: Capa**
- **Tema:** Sistema de Transporte Escolar (STE)
- **Processo:** Matrícula de Transporte
- **Aluno:** Sávio

**Slide 02: Visão Geral do Processo**
- **Detalhes da Matrícula:** Tabela associativa que autoriza um estudante a utilizar uma rota escolar específica permanentemente.
- **Tabelas Envolvidas (Visual):** Mostrar as colunas principais das tabelas `matriculas_transporte`, `alunos` e `rotas`.

**Slide 03: Fluxo de Transação**
- **Código em tela:** Print do método `MatriculaTransporteService.create()`.
- **Destaques no código:**
  - Isolamento do `create` com o objeto `t`.
  - Proteção do banco através do `await t.rollback()` para prevenir locks de linhas e transações órfãs em caso de erro de integridade (FK constraint).

**Slide 04: Regras de Negócio**
- **Cards Visuais:**
  - *Regra 1:* O aluno precisa estar com status "Ativo".
  - *Regra 2:* O aluno não pode ser matriculado 2 vezes na mesma rota.
- **Código em tela:** Print geral do método `verificarRegrasDeNegocio(req)`.

**Slide 05: Implementação da Regra 1**
- **Código em tela:** Trecho verificando o aluno: `await Aluno.findByPk(alunoId)`.
- **SQL Resultante (SQL Tradicional):**
  ```sql
  SELECT codigo, nome, situacao_acesso 
  FROM alunos 
  WHERE codigo = 5;
  ```

**Slide 06: Implementação da Regra 2**
- **Código em tela:** Trecho verificando a duplicidade de matrícula: `await MatriculaTransporte.findOne({ where: { alunoId, rotaId } })`.
- **SQL Resultante (SQL Tradicional):**
  ```sql
  SELECT codigo, aluno_id, rota_id 
  FROM matriculas_transporte 
  WHERE aluno_id = 5 AND rota_id = 2 
  LIMIT 1;
  ```


---
---
---

# 🗣️ ROTEIRO DE FALA (Para os Integrantes lerem na apresentação)
*Aviso: Este roteiro está ajustado para uma fala natural de aproximadamente 4,5 a 5 minutos por aluno e está **dividido por slide** para guiar a apresentação.*

## Roteiro Marco Antonio (Viagem)

**[SLIDE 01: Capa]**
"Boa noite a todos. Dando início à apresentação do projeto do Sistema de Transporte Escolar, eu fiquei responsável por arquitetar o processo de negócio de Viagem."

**[SLIDE 02: Visão Geral do Processo]**
"Só pra contextualizar o nosso cenário, a viagem é o momento central da logística. Como podem ver na estrutura das tabelas em tela, é onde nós juntamos três coisas fundamentais: o motorista, o ônibus e a rota, marcados para uma data e horário específicos. E o nosso maior desafio aqui no backend, pensando nos conceitos da disciplina, é garantir que o banco de dados não seja corrompido se a prefeitura, por algum descuido, tentar escalar o mesmo motorista ou o mesmo veículo em dois lugares simultaneamente."

**[SLIDE 03: Fluxo de Transação]**
"E é aqui que entra a grande jogada do Sequelize e do gerenciamento de transações. No nosso código de serviço, depois de checar as regras, nós abrimos o `sequelize.transaction()`. Quando a gente guarda esse objeto na variável 't', estamos ordenando ao banco: 'vou iniciar a inserção, mas isole isso. Só efetive quando eu confirmar'.
Passamos essa variável pro `create` e, se tudo der certo, executamos o `await t.commit()`, que é a Garantia da Durabilidade e da Atomicidade operando na prática. Mas se algo falhar — digamos que a rede caia ali no meio — nós invocamos obrigatoriamente no `catch` o `await t.rollback()`. Esse comando é vital. Se ele não estivesse aí, a conexão ficaria presa aguardando timeout, causando vazamento no Pool e podendo travar a tabela inteira pra outras requisições."

**[SLIDE 04: Regras de Negócio]**
"Antes de abrir aquela transação toda, eu implementei uma checagem rigorosa de duas Regras de Negócio. A primeira regra determina que o sistema tem que buscar as viagens daquela data e checar se o ID do motorista já está listado. A segunda regra segue a mesmíssima lógica, mas foca no ônibus, porque afinal, existe uma limitação física: um ônibus não pode estar em duas cidades fazendo rotas diferentes no mesmo momento."

**[SLIDE 05: Implementação da Regra 1]**
"Aqui podemos ver o código exato da implementação da Regra 1. O método `findAll` procura no banco com os parâmetros de data e de motorista. O legal de usar o ORM é que o Sequelize pega esse pequeno trecho de JavaScript e o converte nativamente para a Query tradicional com a cláusula `WHERE`, que está aparecendo logo abaixo. Se a query voltar um registro, bloqueamos a operação ali mesmo."

**[SLIDE 06: Implementação da Regra 2]**
"E na implementação da Regra 2, aplicamos o exato mesmo padrão. O ORM converte a nossa checagem do ônibus num `SELECT` filtrando pelo `onibus_id` naquela data. É uma abordagem performática e que blinda a nossa base contra furos logísticos antes da transação de gravação iniciar. Passo agora a palavra para o José Carlos."

---

## Roteiro José Carlos Ceccon (Registro de Acesso)

**[SLIDE 01: Capa]**
"Obrigado, Marco. Boa noite, pessoal. O processo de negócio que eu assumi no projeto foi o Registro de Acesso."

**[SLIDE 02: Visão Geral do Processo]**
"Basicamente, esse componente é o nosso 'controle de catraca' virtual do ônibus escolar. Quando o aluno passa o cartão, o sistema precisa gravar nas tabelas se a ação daquele exato momento foi um 'Embarque' ou um 'Desembarque'. Parece algo direto, mas quando trazemos isso para a camada de serviços da API, a complexidade é enorme porque precisamos validar todo o histórico temporal diário daquele aluno."

**[SLIDE 03: Fluxo de Transação]**
"E qual o papel das Transações nesse cenário? As validações pesadas das minhas regras ocorrem apenas na leitura, mas o instante exato da gravação do `RegistroAcesso.create` precisa ser estritamente atômico. Imagine que o leitor da catraca dê um curto e dispare dois eventos de embarque no exato mesmo milissegundo para o aluno. Envelopando o insert com a nossa transação 't', ativamos o princípio de Isolamento do SQLite. Ele vai enfileirar e finalizar completamente uma requisição antes de processar a outra. Caso a concorrência cause um erro, o código cai no `catch` e o `t.rollback()` descarta a transação atual imediatamente, descartando o estado sujo."

**[SLIDE 04: Regras de Negócio]**
"Para que a gravação não aceite falhas logísticas, eu delimitei duas regras de negócio. A RN01 é um controle rigoroso de limite e fraude: o aluno só tem o direito de ter 2 embarques processados por dia, que correspondem à ida à escola e à volta pra casa. Já a RN02 é uma regra de integridade estrutural: é proibido gerar um registro de 'Desembarque' se aquele aluno não tiver um 'Embarque' em aberto para balancear a viagem. Fazer um desembarque sem entrar no ônibus seria um dado fantasma na base."

**[SLIDE 05: Implementação das Regras (Buscando o Histórico do Dia)]**
"E como nós aplicamos isso na prática? Para evitar consultas custosas, o nosso código junta as validações buscando de uma vez todo o histórico do dia daquele aluno. O Sequelize recebe a cláusula de Maior ou Igual para o início do dia, e Menor ou Igual para o fim do dia. Ele traduz isso diretamente no bloco SQL ali de baixo, trazendo todos os registros gerados naquele intervalo de 24 horas."

**[SLIDE 06: Processamento das Regras (Lógica)]**
"Com o retorno do banco em mãos, meu código JavaScript usa filtros locais para separar o que é embarque e desembarque do dia. Se a variável `embarquesHoje` tiver um tamanho maior ou igual a dois, a RN01 barra tudo e devolve o erro 400. Depois, eu somo os embarques e subtraio os desembarques: se o saldo for menor ou igual a zero, significa que o aluno não está ativamente 'dentro' do veículo, e a RN02 também barra a inserção. Com isso garantimos relatórios cem por cento confiáveis. Passo agora pro Sávio."

---

## Roteiro Sávio (Matrícula de Transporte)

**[SLIDE 01: Capa]**
"Obrigado, José. Boa noite, pessoal. Fechando a nossa arquitetura, o terceiro pilar do STE é a Matrícula de Transporte."

**[SLIDE 02: Visão Geral do Processo]**
"Como demonstra o esquema aqui no slide, a Matrícula atua como a nossa entidade associativa definitiva. É a ponte estrutural que conecta permanentemente um Aluno àquela Rota que o Marco gerencia. É esse registro administrativo que autoriza legalmente o estudante a utilizar a carteirinha no processo que o José acabou de detalhar."

**[SLIDE 03: Fluxo de Transação]**
"E quando nós modelamos a inserção dessa matrícula, o uso transacional do Sequelize foi vital. O `t = await sequelize.transaction()` dita o controle do nosso `create`. E por que nós batemos tanto na tecla da importância de não esquecer o Rollback no `catch`? Numa API rest conectada a um banco compartilhado, ao abrir essa transação nós amarramos a aplicação a uma conexão física. E o banco costuma gerar 'locks', trancando a tabela para manter consistência. Se por um erro na API não chamássemos o `rollback()`, essa transação seria uma zumbi, segurando a memória do servidor e trancando a tabela até o banco dar um timeout de erro, derrubando a nossa aplicação. O rollback explícito devolve o sistema pra estabilidade na mesma fração de segundo."

**[SLIDE 04: Regras de Negócio]**
"E para que a transação nem perca tempo começando à toa, o backend possui um pente-fino com duas regras principais. A primeira regra exige que o aluno esteja obrigatoriamente com a sua situação de acesso como 'Ativo' para prosseguir. E a segunda regra impede uma coisa muito comum: que um funcionário desatento matricule o mesmo aluno, na mesma rota, duas vezes seguidas."

**[SLIDE 05: Implementação da Regra 1]**
"A checagem de status na Regra 1 é o que vemos aqui. Através da função primária `findByPk`, o nosso ORM levanta um `SELECT` rápido buscando aquele cadastro do aluno pela sua chave principal. O código então intercepta a propriedade `situacao_acesso`. Se ele for suspenso, desligado ou qualquer coisa diferente de ativo, o erro é jogado na tela antes do commit."

**[SLIDE 06: Implementação da Regra 2]**
"E na nossa proteção contra duplicidades, nós rodamos um `findOne`, passando uma cláusula `where` composta que une a checagem do ID do aluno e o ID da rota. Reparem ali no SQL que o Sequelize adicionou a trava `LIMIT 1` automaticamente para economizar busca na tabela e ganhar performance no back-end. Caso o banco retorne um resultado, nós impedimos o cadastro duplo e mantemos nossa base íntegra e coerente com a nossa modelagem. E com isso encerramos o fluxo do projeto, muito obrigado pela atenção!"
