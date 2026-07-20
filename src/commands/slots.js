const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const db = require("../database/db");

const fruits = [
  "🍒",
  "🍋",
  "🍉",
  "🍍",
  "💎"
];

// pesos
const weighted = [
  "🍒","🍒","🍒","🍒",
  "🍋","🍋","🍋",
  "🍉","🍉",
  "🍍",
  "💎"
];

const loseMessages = [
  "❌ Lucy-chan pegou suas moedas e saiu correndo.",
  "❌ Você perdeu tudo. A máquina adorou isso.",
  "❌ Talvez apostar não seja seu talento oculto.",
  "❌ A máquina riu da sua tentativa.",
  "❌ Hoje definitivamente não é seu dia.",
  "❌ As frutas decidiram te odiar.",
  "❌ A máquina acabou de comprar outro iate.",
  "❌ Lucy-chan agradece sua contribuição financeira.",
  "❌ Estatisticamente, isso era esperado.",
  "❌ Você perdeu. A casa venceu. Como sempre.",
  "❌ Talvez investir em bolo de pote fosse mais seguro.",
  "❌ Seu dinheiro foi utilizado em pesquisas científicas duvidosas.",
  "❌ A máquina riu de você em binário.",
  "❌ A chance de ganhar era pequena. Bem pequena.",
  "❌ A Lucy-chan usou seu dinheiro para comprar RAM."
];

const winMessages = [
  "🎉 JACKPOT! Lucy-chan ficou impressionada.",
  "💰 Você venceu! A máquina entrou em depressão.",
  "🔥 Isso foi pura sorte absurda.",
  "🎊 As frutas se alinharam perfeitamente.",
  "✨ Lucy-chan aprovou sua jogada."
];

function randomFruit() {
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function getMultiplier(symbol) {

  switch(symbol) {
    case "🍒":
      return 2;

    case "🍋":
      return 3;

    case "🍉":
      return 5;

    case "🍍":
      return 8;

    case "💎":
      return 20;

    default:
      return 0;
  }
}

module.exports = {

  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Jogar no caça-níquel da Lucy-chan")
    .addIntegerOption(option =>
      option
        .setName("aposta")
        .setDescription("Valor da aposta")
        .setRequired(true)
    ),

  async execute(ctx, args = []) {
    const isSlash = typeof ctx.isChatInputCommand === "function" ? ctx.isChatInputCommand() : false;

    const id = isSlash ? ctx.user.id : ctx.author.id;

    let bet;
    if (isSlash) {
      bet = ctx.options.getInteger("aposta");
    } else {
      // Comando personalizado: lu!slots <valor>
      if (!args[0]) {
        return ctx.reply("❌ Você precisa especificar um valor! Exemplo: `lu!slots 1000`");
      }
      bet = parseInt(args[0]);
      if (isNaN(bet)) {
        return ctx.reply("❌ Valor inválido! Use apenas números.");
      }
    }

    // aposta mínima
    if (bet < 100) {
      return ctx.reply(
        "❌ A aposta mínima é R$ 100."
      );
    }

    // aposta máxima
    if (bet > 50000) {
      return ctx.reply(
        "❌ A aposta máxima é R$ 50.000."
      );
    }

    db.get(
      "SELECT * FROM users WHERE user_id = ?",
      [id],
      (err, user) => {

        if (!user) {
          return ctx.reply(
            "❌ Conta não encontrada."
          );
        }

        if (user.money < bet) {
          return ctx.reply(
            "❌ Você não tem dinheiro suficiente."
          );
        }

        // grade 3x3
        const grid = [];

        for (let i = 0; i < 9; i++) {
          grid.push(randomFruit());
        }

        // linha do meio
        const middle = [
          grid[3],
          grid[4],
          grid[5]
        ];

        const win =
          middle[0] === middle[1] &&
          middle[1] === middle[2];

        let resultText = "";

        resultText += "╔══════════════╗\n";
        resultText += `${grid[0]} ${grid[1]} ${grid[2]}\n`;
        resultText += `${grid[3]} ${grid[4]} ${grid[5]} ←\n`;
        resultText += `${grid[6]} ${grid[7]} ${grid[8]}\n`;
        resultText += "╚══════════════╝";

        // vitória
        if (win) {

          const multiplier = getMultiplier(middle[0]);

          const reward = bet * multiplier;

          const winMsg =
            winMessages[
              Math.floor(Math.random() * winMessages.length)
            ];

          db.run(
            "UPDATE users SET money = money - ? + ? WHERE user_id = ?",
            [bet, reward, id]
          );

          const embed = new EmbedBuilder()
            .setTitle("🎰 CAÇA-NÍQUEL")
            .setColor("#00FF00")
            .setDescription(
              `${resultText}\n\n` +
              `🎉 Você ganhou R$ ${reward}!\n` +
              `💸 Multiplicador: x${multiplier}\n\n` +
              `${winMsg}`
            );

          return ctx.reply({
            embeds: [embed]
          });
        }

        // derrota
        db.run(
          "UPDATE users SET money = money - ? WHERE user_id = ?",
          [bet, id]
        );

        const loseMsg =
          loseMessages[
            Math.floor(Math.random() * loseMessages.length)
          ];

        const embed = new EmbedBuilder()
          .setTitle("🎰 CAÇA-NÍQUEL")
          .setColor("#FF0000")
          .setDescription(
            `${resultText}\n\n` +
            `💸 Você perdeu R$ ${bet}\n\n` +
            `${loseMsg}`
          );

        ctx.reply({
          embeds: [embed]
        });

      }
    );
  },

  async executeMessage(message, args) {
    return this.execute(message, args);
  }
};