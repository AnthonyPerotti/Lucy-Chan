const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Sacar dinheiro do banco")
    .addIntegerOption(option =>
      option
        .setName("valor")
        .setDescription("Valor para sacar")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    return this.run(interaction, true);
  },

  async executeMessage(message, args) {

    if (!args[0]) {
      return message.reply(
        "❌ Uso correto: `lu!withdraw 1000`"
      );
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(
        "❌ Valor inválido."
      );
    }

    return this.run(message, false, amount);
  },

  async run(ctx, isSlash, amountArg = null) {

    const id = isSlash
      ? ctx.user.id
      : ctx.author.id;

    const amount = isSlash
      ? ctx.options.getInteger("valor")
      : amountArg;

    db.get(
      "SELECT money, bank FROM users WHERE user_id = ?",
      [id],

      (err, user) => {

        if (err) {
          console.error(err);

          return ctx.reply(
            "❌ Erro ao acessar conta."
          );
        }

        if (!user || user.bank < amount) {
          return ctx.reply(
            "❌ Você não tem esse valor no banco."
          );
        }

        // Remove do banco e adiciona na carteira
        db.run(
          `UPDATE users
           SET bank = bank - ?,
               money = money + ?
           WHERE user_id = ?`,
          [amount, amount, id],

          (err) => {

            if (err) {
              console.error(err);

              return ctx.reply(
                "❌ Erro ao processar transação."
              );
            }

            const embed = new EmbedBuilder()
              .setTitle("🏧 Saque Realizado")
              .setColor("#00FF00")
              .addFields(
                {
                  name: "Valor Sacado",
                  value: `R$ ${amount}`,
                  inline: true
                },
                {
                  name: "Dinheiro na Carteira",
                  value: `R$ ${user.money + amount}`,
                  inline: true
                }
              );

            ctx.reply({
              embeds: [embed]
            });
          }
        );
      }
    );
  },
};