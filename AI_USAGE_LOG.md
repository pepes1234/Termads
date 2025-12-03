# Relatório de Uso de Inteligência Artificial Generativa

Este documento registra todas as interações significativas com ferramentas de IA generativa (como Gemini, ChatGPT, Copilot, etc.) durante o desenvolvimento deste projeto. O objetivo é promover o uso ético e transparente da IA como ferramenta de apoio, e não como substituta para a compreensão dos conceitos fundamentais.

## Política de Uso
O uso de IA foi permitido para as seguintes finalidades:
- Geração de ideias e brainstorming de algoritmos.
- Explicação de conceitos complexos.
- Geração de código boilerplate (ex: estrutura de classes, leitura de arquivos).
- Sugestões de refatoração e otimização de código.
- Debugging e identificação de causas de erros.
- Geração de casos de teste.

É proibido submeter código gerado por IA sem compreendê-lo completamente e sem adaptá-lo ao projeto. Todo trecho de código influenciado pela IA deve ser referenciado neste log.

---

## Registro de Interações

*Copie e preencha o template abaixo para cada interação relevante.*

### Interação 1

- **Data:** 6/11/2025
- **Etapa do Projeto:** 1 - Compressão de Responsividade
- **Ferramenta de IA Utilizada:** GPT-5
- **Objetivo da Consulta:** Eu estava com dificuldades para entender como criar e utilizar resposatividade de telas.

- **Prompt(s) Utilizado(s):**
  1. "Como utilizar clamp para realizar responsividade de tela, dê exemplos."

- **Resumo da Resposta da IA:**
  A IA explicou essa estratégia de responsividade e depois deu exemplos de códigos usando clamp e como deixar mais organizado utilizando variáveis.

- **Análise e Aplicação:**
  A resposta da IA foi extremamente útil para clarear a melhor forma de responsividade e deixar o código muito mais organizado e de fácil visualização.

- **Referência no Código:**
  A lógica inspirada por esta interação foi implementada no arquivo `createAccount.css` e também em outros arquivos css porém em menor quantidade.

---

### Interação 2

- **Data:** 24/11/2025
- **Etapa do Projeto:** 3 - Sistema de ranking e ligas
- **Ferramenta de IA Utilizada:** Copilot PRO
- **Objetivo da Consulta:** Estávamos em dúvida de como organizar as tabelas SQL para criar o sistema de ranking. Precisávamos de ideias de como isso poderia ser feito.

- **Prompt(s) Utilizado(s):**
  1. "Boa noite, estou fazendo um trabalho da faculdade, nele preciso fazer um jogo e ter nele um sistema de ranking geral e semanal e um sistema de ligas. Poderia me ajudar a pensar em como organizar isso nas tabelas do sql (estou usando o sqli no php) e como ficaria mais ou menos a estrutura do código? Utilize como contexto os arquivos desse projeto."
  2. "Queria fazer de um jeito que o usuário pudesse estar só em uma liga ou em nenhuma. Além disso gostaria de salvar na tabela de games as palavras que o usuário tentou para mostrar no histórico."

- **Resumo da Resposta da IA:** 
  A IA explicou quantas tabelas seriam necessárias, quais atributos talvez seriam necessários e duas maneiras de trabalhar com os rankings: a primeira maneira seria sem materializar as tabelas e a segunda seria as materializando. A IA ofereceu também o SQL que poderia ser utilizado para criá-las.

- **Análise e Aplicação:**
  Achamos a resposta da IA muito útil, pois deixou muito mais visível como organizar as tabelas, preferimos a opção de materializar as tabelas, por causa do estilo do projeto. O SQL disponibilizado por ela foi utilizado, mas alterado, colocamos os atributos que realmente queríamos e achávamos necessários.

- **Referência no Código:**
  Isso foi aplicado no arquivo `db_create_tables.php` nos sql a partir da linha 41.

---

### Interação 3

- **Data:** 25/11/2025
- **Etapa do Projeto:** 4 - Sistema de salvar jogo
- **Ferramenta de IA Utilizada:** Copilot PRO
- **Objetivo da Consulta:** Estávamos em dúvida de como salvar o jogo na DB, ainda mais por ter que colocar um json com as palavras que o usuário tentou. Precisávamos de ideias de como isso poderia ser feito.

- **Prompt(s) Utilizado(s):**
  1. "Boa noite, preciso salvar a partida do usuário na DB após ele terminá-la, poderia me explicar como isso pode ser feito e dar exemplos de códigos?"

- **Resumo da Resposta da IA:** 
  A IA explicou que seria bom criar uma função e chamá-la num endpoint save_game.php, que deveria ser consumido pelo js após o jogo finalizar. A IA forneceu códigos que foram usados como base para as alterações.

- **Análise e Aplicação:**
  Achamos a resposta da IA muito útil, pois foi possível entender como se daria o fluxo das informações, implementar conciente do que estava acontecendo e ficou fácil de consumir no js. Depois já foi possível saber como fazer a parte de pegar o histórico. Os código foram utilizados como base para os que foram implementados, sofrendo algumas alterações.

- **Referência no Código:**
  Isso foi aplicado na função record_game() no arquivo `db_functions.php` na linha 138 e na criação do arquivo `save_game.php`.


### Interação 3

- *Data:* 01/12/2025
- *Etapa do Projeto:* Final - Criação do README.md
- *Ferramenta de IA Utilizada:* Gemini 3 PRO
- *Objetivo da Consulta:* Nunca havíamos criado um arquivo README em markdown.

- *Prompt(s) Utilizado(s):*
  1. "Olá, preciso criar um arquivo em markdown com as seguintes informações: o que é o projeto - É um projeto desenvolvido para ser projeto final da matéria de Desenvolvimento Web do curso TADS da UFPR. Feito por Rodrigo Yuji, Eduardo Pressutto, Lucas Pepes e Arthur Rangel. O projeto é um jogo de digitação, assim como solicitado, onde os usuários tem 6 tentativas para acertar a palavra escolhida aleatoriamente pelo nosso sistema. Dentro do jogo, é possível criar ligas para os usuários competirem entre si, além do usuário automaticamente já participar do ranking total do jogo, em um sistema de pontuação também criado. Além disso você também pode ver seu histórico de partidas, entre outras informações. Por fim, contamos com um banco de dados, para lidar com todas as contas de jogadores e quaisquer outras informações. Portanto, para um usuário acessar ao jogo, é preciso que ele possua uma conta e realize login com ela. 

Contamos com as seguintes páginas: 
- Jogar
- Ligas
- Classificação
- Histórico
- Perfil

O projeto foi desenvolvido em PHP, CSS e JS.

Antes de rodar o projeto, é preciso alterar as informações do arquivo db_credentials.php para as credenciais do SEU banco de dados. Após isso, rode o arquivo db_create_tables.php e, para melhor experiência, rode em seguida o arquivo insert_sample_data.php - para que as tabelas sejam populadas. Após isso, crie sua própria conta e aproveite!. - A partir destas informações, como você pode me ajudar?"

- *Resumo da Resposta da IA:* 
    A IA criou parte do arquivo markdown baseado nas informações dadas. 

- *Análise e Aplicação:*
    Utilizamos o arquivo em markdown para finalizar o resto do README, baseado na gramática oferecida pela IA. Assim, finalizamos o arquivo README com o resto das informações.
- *Referência no Código:*
    Isso foi aplicado no arquivo README.md.

---

### Interação 4

- **Data:** 24/11/2025
- **Etapa do Projeto:** Trocar acentuação no jogo
- **Ferramenta de IA Utilizada:** Copilot PRO
- **Objetivo da Consulta:** Precisava acentuar as palavras conforme a palavra original independente
do que o usuario escolher, por questão estética

- **Prompt(s) Utilizado(s):**
  1. "estou desenvolvendo um jogo de palavras semelhante ao termo que puxa de um documento as palavras, no termo original as palavras são acentuadas corretamente ao usuario inserir, gostaria de fazer igual, como posso fazer?"

- **Resumo da Resposta da IA:** 
  Explicou que daria pra fazer isso transformando em UNICODE e me enviou 1 exemplo.

- **Análise e Aplicação:**
  Apliquei em conjunto a ela, tive alguns receios pelo modo ela utilizou pois ela carrega todas as palavras na página e consulta em 1 array, porém foi o único jeito que encontrei.

- **Referência no Código:**
  aplicado na main.js nas funções normalizeWord.