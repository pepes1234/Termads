# 🎮 Jogo de Digitação (TADS - UFPR)

> Projeto final da disciplina de Desenvolvimento Web do curso de Tecnologia em Análise e Desenvolvimento de Sistemas (TADS) da UFPR. Desenvolvido por Arthur Rangel, Eduardo Pressutto, Lucas Pepes e Rodrigo Yuji.

O projeto consiste em um jogo de palavras, onde o objetivo é acertar uma palavra aleatória escolhida pelo sistema. O usuário possui **6 tentativas** para acertar. O sistema conta com funcionalidades de competição, rankings e gerenciamento de perfil, além de um banco de dados robusto para gerenciar as contas e outras informações.

## 📋 Funcionalidades

O sistema exige autenticação (login/senha) para acesso e oferece as seguintes seções:

* **🔐 Autenticação:** Sistema de Login e Cadastro para proteção e identificação dos jogadores.
* **🕹️ Jogar:** A interface principal do jogo, onde o usuário utiliza suas 6 tentativas para adivinhar a palavra.
* **🏆 Ligas:** Criação e participação em ligas para competir diretamente com outros usuários.
* **📊 Classificação (Ranking):** Um sistema de pontuação global que exibe a posição de todos os usuários.
* **📜 Histórico:** Visualização das partidas anteriores e desempenho do jogador.
* **👤 Perfil:** Gerenciamento de informações da conta do usuário.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando a seguinte stack:

* ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white) **PHP** (Back-end e lógica de negócios)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) **JavaScript** (Interatividade e dinâmica do jogo)
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) **CSS** (Estilização das páginas)
* ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) **MySQL** (Banco de dados)

## ⚙️ Instalação e Configuração

Para rodar o projeto localmente, siga os passos abaixo:

### 1. Configuração do Banco de Dados
Antes de iniciar, é necessário configurar a conexão com o seu banco de dados local.

1. Abra o arquivo `db_credentials.php`.
2. Edite as variáveis com as credenciais do **SEU** ambiente local (host, usuário, senha).

### 2. Criação das Tabelas
Execute o script de criação para estruturar o banco de dados:

```bash
php db_create_tables.php

```
### 3. Para Popular o Banco de Dados (Recomendado)
Para garantir uma melhor experiência e dados iniciais, execute o script para popular as tabelas:

```bash 
php insert_sample_data.php
``` 
O script garante que as tabelas sejam populadas com dados teste.

### 4. Execução do Projeto
Após configurar o banco:
* Crie sua própria conta na página de cadastro.
* Realize o login com a conta criada.
* Aproveite ao máximo nosso jogo!

