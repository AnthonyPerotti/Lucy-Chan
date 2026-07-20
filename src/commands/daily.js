const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgatar recompensa diária"),

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
    const now = Date.now();

    const cooldown = 86400000; // 24h
    const reward = Math.floor(Math.random() * 500) + 500;

    db.get(
      "SELECT * FROM users WHERE user_id = ?",
      [id],
      (err, userData) => {
        if (err) {
          console.error("Erro ao acessar o banco:", err);
          return reply(
            "❌ Ocorreu um erro ao acessar sua conta."
          );
        }

        // Usuário novo
        if (!userData) {
          db.run(
            `INSERT INTO users
             (user_id, money, last_daily)
             VALUES (?, ?, ?)`,
            [id, reward, now],
            () => {
              const embed = new EmbedBuilder()
                .setTitle("💰 Recompensa Diária")
                .setColor("#FFD700")
                .setDescription(
                  `Você recebeu **R$ ${reward}** no daily!`
                )
                .setFooter({
                  text: `Requisitado por ${user.tag}`,
                  iconURL: user.displayAvatarURL()
                })
                .setTimestamp();

              reply({ embeds: [embed] });
            }
          );

          return;
        }

        // Cooldown
        const timeSinceLast = now - userData.last_daily;

        if (timeSinceLast < cooldown) {
          const remaining = cooldown - timeSinceLast;

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

          return reply(
            `⏳ Você já coletou seu daily.\nVolte em **${hours}h ${minutes}m ${seconds}s**.`
          );
        }

        // Atualiza dinheiro
        db.run(
          `UPDATE users
           SET money = money + ?, last_daily = ?
           WHERE user_id = ?`,
          [reward, now, id],
          () => {
            const embed = new EmbedBuilder()
              .setTitle("💰 Recompensa Diária")
              .setColor("#FFD700")
              .setDescription(
                `Você recebeu **R$ ${reward}** no daily!`
              )
              .setFooter({
                text: `Requisitado por ${user.tag}`,
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