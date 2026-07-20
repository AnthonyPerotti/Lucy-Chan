const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reptop")
    .setDescription("Ranking de reputação"),

  async execute(interaction) {
    return this.run(interaction, true);
  },

  async executeMessage(message) {
    return this.run(message, false);
  },

  async run(ctx, isSlash) {

    db.all(
      "SELECT user_id, rep FROM users ORDER BY rep DESC",
      [],

      async (err, rows) => {

        if (err) {
          console.error(err);
          return ctx.reply(
            "❌ Erro ao carregar ranking."
          );
        }

        if (!rows || rows.length === 0) {
          return ctx.reply(
            "❌ Nenhum dado encontrado."
          );
        }

        const medals = ["🥇", "🥈", "🥉"];

        const topLimit = 10;

        let userPosition = null;

        const embed = new EmbedBuilder()
          .setTitle("🏆 Top Rep's")
          .setColor("#5865F2")
          .setThumbnail(
            "https://cdn-icons-png.flaticon.com/512/2583/2583344.png"
          );

        for (let i = 0; i < rows.length; i++) {

          if (i >= topLimit) break;

          let username = "Desconhecido";

          try {

            const user =
              await ctx.client.users.fetch(
                rows[i].user_id
              );

            username = user.username;

          } catch (e) {

            username =
              `[Conta Deletada] (${rows[i].user_id})`;
          }

          const rankIcon =
            medals[i] || `**${i + 1}.**`;

          embed.addFields({
            name: `${rankIcon} ${username}`,
            value: `🏷️ Reputação - [ ${rows[i].rep} ]`,
            inline: false
          });

          const authorId = isSlash
            ? ctx.user.id
            : ctx.author.id;

          if (rows[i].user_id === authorId) {
            userPosition = i + 1;
          }
        }

        embed.setFooter({
          text: userPosition
            ? `Sua posição: ${userPosition}`
            : "Você ainda não está no ranking.",

          iconURL: isSlash
            ? ctx.user.displayAvatarURL()
            : ctx.author.displayAvatarURL()
        });

        ctx.reply({ embeds: [embed] });
      }
    );
  },
};