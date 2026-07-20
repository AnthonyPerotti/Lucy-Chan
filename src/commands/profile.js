const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Ver seu perfil"),

  async execute(interaction) {
    return this.run(interaction, true);
  },

  async executeMessage(message) {
    return this.run(message, false);
  },

  async run(ctx, isSlash) {
    const id = isSlash ? ctx.user.id : ctx.author.id;

    const username = isSlash
      ? ctx.user.tag
      : ctx.author.tag;

    const avatarURL = isSlash
      ? ctx.user.displayAvatarURL()
      : ctx.author.displayAvatarURL();

    db.get(
      "SELECT * FROM users WHERE user_id = ?",
      [id],
      (err, user) => {

        if (err) {
          console.error("Erro ao acessar o banco de dados:", err);
          return ctx.reply(
            "❌ Ocorreu um erro ao acessar sua conta."
          );
        }

        if (!user) {
          return ctx.reply("❌ Conta não encontrada.");
        }

        const embed = new EmbedBuilder()
          .setTitle("📦 Seu Perfil")
          .setColor("#00FF00")
          .addFields(
            {
              name: "⚙️ Nível",
              value: `${user.level} (XP: ${user.xp})`,
              inline: true,
            },
            {
              name: "💳 Dinheiro",
              value: `R$ ${user.money}`,
              inline: true,
            },
            {
              name: "🎖️ Rep",
              value: `${user.rep}`,
              inline: true,
            }
          )
          .setFooter({
            text: `Requisitado por ${username}`,
            iconURL: avatarURL,
          })
          .setTimestamp();

        ctx.reply({ embeds: [embed] });
      }
    );
  },
};