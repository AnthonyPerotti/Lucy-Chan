const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reptop")
    .setDescription("Ranking de reputação"),

  async execute(interaction) {
    db.all(
      "SELECT user_id, rep FROM users ORDER BY rep DESC",
      [],
      async (err, rows) => {
        if (!rows || rows.length === 0) {
          return interaction.reply("❌ Nenhum dado encontrado.");
        }

        const medals = ["🥇", "🥈", "🥉"];
        const topLimit = 10; // Mostra o top 10
        let userPosition = null;

        // Criando o Embed para o ranking
        const embed = new EmbedBuilder()
          .setTitle("🏆 **Top Rep's**")
          .setColor("#FFD700"); // Cor dourada, pode ser alterada conforme necessário

        // Adicionando os usuários do top 10 ao embed
        for (let i = 0; i < rows.length; i++) {
          if (i >= topLimit) break;

          const user = await interaction.client.users.fetch(rows[i].user_id);
          const medal = medals[i] || "🎖️";

          embed.addFields({
            name: `${medal} **${i + 1}. ${user.username}**`,
            value: `🏷️ Reputação: **${rows[i].rep}**`,
            inline: false
          });

          // Verifica a posição do usuário que executou o comando
          if (rows[i].user_id === interaction.user.id) {
            userPosition = i + 1;
          }
        }

        // Adiciona a posição do usuário de forma discreta no final do embed
        embed.setFooter({
          text: userPosition
            ? `Sua posição: ${userPosition}`
            : "Você ainda não está no ranking.",
          iconURL: interaction.user.displayAvatarURL()
        });

        // Envia o Embed com o ranking para o usuário
        interaction.reply({ embeds: [embed] });
      }
    );
  }
};
