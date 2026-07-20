const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Transferir dinheiro para outro usuário")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Para quem você vai enviar o dinheiro")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("valor")
        .setDescription("A quantidade de dinheiro para enviar")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    return this.run(interaction, true);
  },

  async executeMessage(message, args) {
    const targetUser =
      message.mentions.users.first() ||
      await message.client.users.fetch(args[0]).catch(() => null);

    const amount = parseInt(args[1]);

    if (!targetUser || isNaN(amount)) {
      return message.reply(
        "❌ Uso correto: `lu!pay @usuario 1000`"
      );
    }

    return this.run(message, false, targetUser, amount);
  },

  async run(ctx, isSlash, targetUserArg = null, amountArg = null) {
    const senderId = isSlash ? ctx.user.id : ctx.author.id;

    const targetUser = isSlash
      ? ctx.options.getUser("usuario")
      : targetUserArg;

    const targetId = targetUser.id;

    const amount = isSlash
      ? ctx.options.getInteger("valor")
      : amountArg;

    // Validações básicas
    if (senderId === targetId) {
      return ctx.reply("❌ Você não pode enviar dinheiro para si mesmo.");
    }

    if (targetUser.bot) {
      return ctx.reply("🤖 Bots não precisam de dinheiro!");
    }

    // Verifica saldo
    db.get(
      "SELECT money FROM users WHERE user_id = ?",
      [senderId],
      (err, sender) => {
        if (err) {
          console.error(err);
          return ctx.reply("❌ Erro ao verificar saldo.");
        }

        if (!sender || sender.money < amount) {
          return ctx.reply(
            "💸 Você não tem dinheiro suficiente na carteira para essa transferência."
          );
        }

        // Verifica destinatário
        db.get(
          "SELECT * FROM users WHERE user_id = ?",
          [targetId],
          (err, receiver) => {

            if (!receiver) {
              db.run(
                "INSERT INTO users (user_id, money, bank) VALUES (?, 0, 0)",
                [targetId]
              );
            }

            // Transferência
            db.serialize(() => {
              db.run(
                "UPDATE users SET money = money - ? WHERE user_id = ?",
                [amount, senderId]
              );

              db.run(
                "UPDATE users SET money = money + ? WHERE user_id = ?",
                [amount, targetId]
              );
            });

            const embed = new EmbedBuilder()
              .setTitle("💸 Transferência Realizada")
              .setColor("#00FF00")
              .setDescription(
                `Você enviou **R$ ${amount}** para **${targetUser.username}**!`
              )
              .setFooter({
                text: `Remetente: ${isSlash ? ctx.user.username : ctx.author.username}`,
                iconURL: isSlash
                  ? ctx.user.displayAvatarURL()
                  : ctx.author.displayAvatarURL(),
              })
              .setTimestamp();

            ctx.reply({ embeds: [embed] });
          }
        );
      }
    );
  },
};