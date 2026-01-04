const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moneytop")
    .setDescription("Ranking dos mais ricos"),

  async execute(interaction) {
    db.all(
      "SELECT user_id, money FROM users ORDER BY money DESC",
      [],
      async (err, rows) => {
        if (!rows || rows.length === 0) {
          return interaction.reply("❌ Nenhum dado encontrado.");
        }

        const medals = ["🥇", "🥈", "🥉"];
        const topLimit = 10;
        let userPosition = null;

        const embed = new EmbedBuilder()
          .setTitle("🏆 **Top Money**")
          .setColor("#FFD700")  // Dourado
          // Ícone de saco de dinheiro ou troféu
          .setThumbnail("https://cdn-icons-png.flaticon.com/512/2953/2953363.png");

        for (let i = 0; i < rows.length; i++) {
          if (i >= topLimit) break;

          let username = "Desconhecido";
          try {
            const user = await interaction.client.users.fetch(rows[i].user_id);
            username = user.username;
          } catch (e) {
             username = `[Conta Deletada] (${rows[i].user_id})`;
          }

          const rankIcon = medals[i] || `**${i + 1}.**`;
          const formattedMoney = rows[i].money.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

          // Formatação estilo "ficha"
          embed.addFields({
            name: `${rankIcon} ${username}`,
            value: `💸 Dinheiro - R$ ${formattedMoney}`,
            inline: false
          });

          if (rows[i].user_id === interaction.user.id) {
            userPosition = i + 1;
          }
        }

        embed.setFooter({
          text: userPosition
            ? `Sua posição: ${userPosition}`
            : "Você ainda não está no ranking.",
          iconURL: interaction.user.displayAvatarURL()
        });
        
        interaction.reply({ embeds: [embed] });
      }
    );
  }
};