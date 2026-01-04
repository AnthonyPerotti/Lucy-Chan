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
        const topLimit = 10;
        let userPosition = null;

        const embed = new EmbedBuilder()
          .setTitle("🏆 **Top Rep's**")
          // Cor azulada parecida com a da imagem (Blurple do Discord)
          .setColor("#5865F2") 
          // Adiciona a imagem de medalha no canto direito
          .setThumbnail("https://cdn-icons-png.flaticon.com/512/2583/2583344.png"); 

        for (let i = 0; i < rows.length; i++) {
          if (i >= topLimit) break;

          // Tenta pegar o usuário, se sair do servidor mostra "Desconhecido"
          let username = "Desconhecido";
          try {
            const user = await interaction.client.users.fetch(rows[i].user_id);
            username = user.username;
          } catch (e) {
            username = `[Conta Deletada] (${rows[i].user_id})`;
          }

          // Mantendo sua lógica de medalhas para os 3 primeiros
          const rankIcon = medals[i] || `**${i + 1}.**`;
          
          // Formatação igual à da foto: Nome em cima, Valor em baixo entre colchetes
          embed.addFields({
            name: `${rankIcon} ${username}`,
            value: `🏷️ Reputação - [ ${rows[i].rep} ]`,
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