const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Depositar dinheiro no banco")
    .addIntegerOption(option =>
      option
        .setName("valor")
        .setDescription("Valor para depositar")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(ctx, args = []) {
    const isSlash = !!ctx.isChatInputCommand;

    const user = isSlash ? ctx.user : ctx.author;

    const reply = (content) => {
      if (isSlash) {
        return ctx.reply(content);
      } else {
        return ctx.channel.send(content);
      }
    };

    const id = user.id;

    let amount;

    if (isSlash) {
      amount = ctx.options.getInteger("valor");
    } else {
      amount = parseInt(args[0]);

      if (!amount || amount <= 0) {
        return reply(
          "❌ Use corretamente:\n`lu!deposit <valor>`"
        );
      }
    }

    db.get(
      "SELECT money, bank FROM users WHERE user_id = ?",
      [id],
      (err, userData) => {
        if (err) {
          return reply("❌ Erro ao acessar conta.");
        }

        if (!userData || userData.money < amount) {
          return reply(
            "❌ Você não tem esse valor na carteira."
          );
        }

        db.run(
          `UPDATE users
           SET money = money - ?,
               bank = bank + ?
           WHERE user_id = ?`,
          [amount, amount, id],
          (err) => {
            if (err) {
              return reply(
                "❌ Erro ao processar transação."
              );
            }

            const embed = new EmbedBuilder()
              .setTitle("🏦 Depósito Realizado")
              .setColor("#00FF00")
              .addFields(
                {
                  name: "💸 Valor Depositado",
                  value: `R$ ${amount}`,
                  inline: true
                },
                {
                  name: "🏦 Saldo Bancário",
                  value: `R$ ${userData.bank + amount}`,
                  inline: true
                }
              )
              .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL()
              })
              .setTimestamp();

            reply({ embeds: [embed] });
          }
        );
      }
    );
  },

  async executeMessage(message, args) {
    return this.execute(message, args);
  }
};