const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moneytop")
    .setDescription("Ranking dos mais ricos"),

  async execute(interaction) {
    return this.run(interaction);
  },

  async executeMessage(message) {
    return this.run(message);
  },

  async run(ctx) {
    const isSlash = !!ctx.commandName;

    db.all(
      "SELECT user_id, money FROM users ORDER BY money DESC",
      [],
      async (err, rows) => {
        if (err) {
          console.error(err);
          return ctx.reply("❌ Erro ao carregar ranking.");
        }

        if (!rows || rows.length === 0) {
          return ctx.reply("❌ Nenhum dado encontrado.");
        }

        const medals = ["🥇", "🥈", "🥉"];
        const topLimit = 10;
        let userPosition = null;

        const embed = new EmbedBuilder()
          .setTitle("🏆 Top Money")
          .setColor("#FFD700")
          .setThumbnail("https://cdn-icons-png.flaticon.com/512/2953/2953363.png");

        for (let i = 0; i < rows.length; i++) {
          if (i >= topLimit) break;

          let username = "Desconhecido";

          try {
            const user = await ctx.client.users.fetch(rows[i].user_id);
            username = user.username;
          } catch {
            username = `[Conta Deletada] (${rows[i].user_id})`;
          }

          const rankIcon = medals[i] || `**${i + 1}.**`;

          const formattedMoney = rows[i].money.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          });

          embed.addFields({
            name: `${rankIcon} ${username}`,
            value: `💸 Dinheiro — R$ ${formattedMoney}`,
            inline: false,
          });

          const authorId = isSlash ? ctx.user.id : ctx.author.id;

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
            : ctx.author.displayAvatarURL(),
        });

        ctx.reply({ embeds: [embed] });
      }
    );
  },
};