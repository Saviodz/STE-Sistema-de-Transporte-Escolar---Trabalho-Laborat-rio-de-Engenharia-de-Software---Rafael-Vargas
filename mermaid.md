classDiagram
direction LR

class Rota
class Cidade
class InstituicaoEnsino
class Aluno
class Prefeitura
class Viagem
class Motorista
class Onibus
class RegistroAcesso

%% ===== Geografia e matrícula =====
Cidade "1" <-- "0..*" InstituicaoEnsino : localizadaEm
InstituicaoEnsino "1" <-- "0..*" Aluno : matriculadoEm
Cidade "1" <-- "0..*" Aluno : resideEm

%% ===== Prefeitura do município (ajuste) =====
Cidade "1" <-- "0..1" Prefeitura : pertenceA

%% Prefeitura paga/autoriza alunos
Prefeitura "1" --> "0..*" Aluno : paga/autoriza

%% ===== Rota (plano) =====
Rota "0..*" --> "1" Cidade : origem
Rota "0..*" --> "1" Cidade : destino
Rota "0..*" -- "0..*" Aluno : vinculado (matriculaTransporte)

%% ===== Viagem (execução) =====
Viagem "0..*" --> "1" Rota : executa
Viagem "0..*" --> "1" Motorista : designa
Viagem "0..*" --> "1" Onibus : utiliza

%% ===== Controle de acesso (ajuste seta) =====
Viagem "1" --> "0..*" RegistroAcesso : gera
RegistroAcesso "0..*" --> "1" Aluno : participa