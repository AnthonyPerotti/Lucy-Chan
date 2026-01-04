# Lucy-chan - Discord Economy RPG Bot

**Lucy-chan** é um bot de economia e RPG completo para **Discord**, desenvolvido em **Node.js**. O foco do projeto é gamificação, progressão de carreira e interação entre usuários através de um sistema financeiro robusto.

## 🚀 Funcionalidades Principais

### 💸 Sistema Econômico & Bancário
Os usuários possuem uma **Carteira** (dinheiro em mãos) e uma **Conta Bancária** (dinheiro seguro).
- **Gerenciamento:** Comandos `/deposit`, `/withdraw` e `/balance`.
- **Transferências:** Envio de dinheiro entre usuários com `/pay`.
- **Risco (PvP):** Jogadores podem comprar uma **Pistola** e tentar `/assaltar` a carteira de outros usuários. O dinheiro no banco não pode ser roubado.

### ⚒️ Sistema de Trabalhos e Profissões
A economia gira em torno da compra de ferramentas para realizar trabalhos específicos. Cada trabalho possui **Cooldowns**, **Chances de Falha** e **Variação de XP/Dinheiro**.

| Ferramenta | Trabalho | Categoria |
| :--- | :--- | :--- |
| 🧹 Vassoura | `/varrer` | Básico |
| 🧽 Esponja | `/limpar` | Básico |
| 🎣 Vara | `/pescar` | Pescador |
| 🕸️ Rede | `/arrastar` | Pescador |
| ⛏️ Pá | `/cavar` | Trabalhador |
| 🔪 Faca | `/cozinhar` | Trabalhador |
| 🚜 Enxada | `/arar` | Fazendeiro |
| 🪓 Machado | `/cortar` | Lenhador |
| ⛏️ Picareta | `/minerar` | Minerador |
| 🔨 Martelo | `/construir` | Construtor |
| 🔫 Pistola | `/roubar` | Crime (NPCs) |
| 💻 Computador| `/hackear` | Crime (Cyber) |

### 🏆 Progressão e Competitividade
- **Níveis Automáticos:** Ganhar XP nos trabalhos faz o usuário subir de nível automaticamente.
- **Rankings Globais:**
  - `/moneytop`: Os usuários mais ricos do servidor.
  - `/reptop`: Os usuários com maior reputação social.
- **Social:** Sistema de reputação (`/rep`) e perfil personalizável (`/profile`).

## Personalização

A loja de itens pode ser facilmente personalizada no arquivo `src/data/shop.js`, onde novos itens podem ser adicionados ou removidos conforme necessário.

## Licença

Este projeto é licenciado sob a **MIT License**.

