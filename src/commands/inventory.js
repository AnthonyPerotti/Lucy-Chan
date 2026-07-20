const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Ver seu inventário"),

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

    db.all(
      "SELECT * FROM inventory WHERE user_id = ?",
      [id],
      (err, items) => {
        if (err) {
          console.error(
            "Erro ao acessar inventário:",
            err
          );

          return reply(
            "❌ Ocorreu um erro ao acessar seu inventário."
          );
        }

        if (!items || items.length === 0) {
          return reply(
            "📦 Seu inventário está vazio."
          );
        }

        const embed = new EmbedBuilder()
          .setTitle("📦 Seu Inventário")
          .setColor("#00FF00")
          .setFooter({
            text: user.username,
            iconURL: user.displayAvatarURL()
          })
          .setTimestamp();

        items.forEach((item) => {
          embed.addFields({
            name: item.item,
            value: "✔️",
            inline: false
          });
        });

        reply({ embeds: [embed] });
      }
    );
  },

  async executeMessage(message, args) {
    return this.execute(message, args);
  }
};