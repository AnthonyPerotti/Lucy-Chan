const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rep")
    .setDescription("Dar um ponto de reputação para um usuário")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("O usuário que vai receber a reputação")
        .setRequired(true)
    ),

  async execute(interaction) {
    return this.run(interaction, true);
  },

  async executeMessage(message, args) {

    const targetUser =
      message.mentions.users.first() ||
      await message.client.users.fetch(args[0]).catch(() => null);

    if (!targetUser) {
      return message.reply(
        "❌ Uso correto: `lu!rep @usuario`"
      );
    }

    return this.run(message, false, targetUser);
  },

  async run(ctx, isSlash, targetUserArg = null) {

    const senderId = isSlash
      ? ctx.user.id
      : ctx.author.id;

    const targetUser = isSlash
      ? ctx.options.getUser("user")
      : targetUserArg;

    const targetId = targetUser.id;

    const now = Date.now();

    const cooldown =
      24 * 60 * 60 * 1000;

    // Não pode dar rep para si mesmo
    if (senderId === targetId) {
      return ctx.reply(
        "❌ Você não pode dar reputação para si mesmo!"
      );
    }

    // Não pode dar rep para bot
    if (targetUser.bot) {
      return ctx.reply(
        "🤖 Bots não precisam de reputação social!"
      );
    }

    // 1. Verifica quem está dando rep
    db.get(
      "SELECT last_rep_given FROM users WHERE user_id = ?",
      [senderId],

      (err, sender) => {

        if (err) {
          console.error(err);

          return ctx.reply(
            "❌ Erro ao acessar o banco de dados."
          );
        }

        // Cooldown
        if (sender) {

          const lastGiven =
            sender.last_rep_given || 0;

          const timeSince =
            now - lastGiven;

          if (timeSince < cooldown) {

            const remaining =
              cooldown - timeSince;

            const hours = Math.floor(
              remaining / (1000 * 60 * 60)
            );

            const minutes = Math.floor(
              (remaining % (1000 * 60 * 60)) /
              (1000 * 60)
            );

            const seconds = Math.floor(
              (remaining % (1000 * 60)) / 1000
            );

            return ctx.reply(
              `⏳ Você já deu reputação hoje.\nVolte em **${hours}h ${minutes}m ${seconds}s**.`
            );
          }
        }

        // Atualiza remetente
        if (!sender) {

          db.run(
            "INSERT INTO users (user_id, last_rep_given) VALUES (?, ?)",
            [senderId, now]
          );

        } else {

          db.run(
            "UPDATE users SET last_rep_given = ? WHERE user_id = ?",
            [now, senderId]
          );
        }

        // Atualiza alvo
        db.get(
          "SELECT * FROM users WHERE user_id = ?",
          [targetId],

          (err, target) => {

            if (err) {
              console.error(err);

              return ctx.reply(
                "❌ Erro ao atualizar reputação."
              );
            }

            if (!target) {

              db.run(
                "INSERT INTO users (user_id, rep) VALUES (?, 1)",
                [targetId]
              );

            } else {

              db.run(
                "UPDATE users SET rep = rep + 1 WHERE user_id = ?",
                [targetId]
              );
            }

            ctx.reply(
              `✨ Você deu **1 ponto de reputação** para **${targetUser.username}**!`
            );
          }
        );
      }
    );
  },
};