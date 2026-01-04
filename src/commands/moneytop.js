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

        // Criando o Embed
        const embed = new EmbedBuilder()
          .setTitle("🏆 **TOP MONEY**")
          .setColor("#FFD700");  // Cor dourada

        // Adicionando os jogadores do top 10
        for (let i = 0; i < rows.length; i++) {
          if (i >= topLimit) break;

          const user = await interaction.client.users.fetch(rows[i].user_id);
          const medal = medals[i] || "🎖️";

          embed.addFields({
            name: `${medal} **${i + 1}. ${user.username}**`,
            value: `💸 Dinheiro: **R$ ${rows[i].money.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}**`,
            inline: false
          });

          // Verifica a posição do usuário que executou o comando
          if (rows[i].user_id === interaction.user.id) {
            userPosition = i + 1;
          }
        }

        // Adiciona a posição do usuário de forma discreta no final
        embed.setFooter({
          text: userPosition
            ? `Sua posição: ${userPosition}`
            : "Você ainda não está no ranking.",
          iconURL: interaction.user.displayAvatarURL()
        });
        
        // Enviar o Embed com o ranking para o usuário
        interaction.reply({ embeds: [embed] });
      }
    );
  }
};
