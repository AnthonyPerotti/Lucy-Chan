const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder, 
  ComponentType 
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Painel de ajuda e comandos"),

  async execute(interaction) {
    // 1. Criar o Embed Principal (Igual ao da foto "Information Panel")
    const mainEmbed = new EmbedBuilder()
      .setTitle("📘 Painel de Informações")
      .setDescription(
        "Olá! Aqui você encontra todos os meus comandos. Escolha uma categoria no menu abaixo para ver os detalhes! 👇\n\n" +
        "💸 **Economia**\n" +
        "⚒️ **Trabalhos**\n" +
        "🛒 **Loja & Itens**\n" +
        "🏆 **Social & Ranks**"
      )
      .setColor("#2B2D31") // Cor escura padrão do Discord (Dark Theme)
      .setThumbnail(interaction.client.user.displayAvatarURL());

    // 2. Criar o Menu de Seleção (Dropdown)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("Selecione uma categoria...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Início")
          .setDescription("Voltar para o painel principal")
          .setValue("home")
          .setEmoji("🏠"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Economia")
          .setDescription("Comandos de dinheiro e diário")
          .setValue("economy")
          .setEmoji("💸"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Trabalhos")
          .setDescription("Lista de trabalhos para ganhar dinheiro")
          .setValue("jobs")
          .setEmoji("⚒️"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Loja & Itens")
          .setDescription("Comprar itens e ver inventário")
          .setValue("shop")
          .setEmoji("🛒"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Social & Ranks")
          .setDescription("Perfil, reputação e rankings")
          .setValue("social")
          .setEmoji("🏆")
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Envia a mensagem inicial
    const response = await interaction.reply({
      embeds: [mainEmbed],
      components: [row],
    });

    // 3. Criar o Coletor (Para ouvir os cliques no menu)
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 600000 // O menu funciona por 10 minutos
    });

    collector.on("collect", async (i) => {
      // Garante que só quem digitou o comando pode mexer no menu
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "❌ Esse menu não é para você!", ephemeral: true });
      }

      const value = i.values[0]; // O que a pessoa selecionou
      let newEmbed;

      // 4. Lógica de Troca de Páginas
      if (value === "economy") {
        newEmbed = new EmbedBuilder()
          .setTitle("💸 Comandos de Economia")
          .setColor("#00FF00")
          .addFields(
            { name: "`/balance`", value: "Vê quanto dinheiro você tem no bolso e no banco.", inline: false },
            { name: "`/daily`", value: "Pega sua recompensa diária (a cada 24h).", inline: false }
          );
      } 
      
      else if (value === "jobs") {
        newEmbed = new EmbedBuilder()
          .setTitle("⚒️ Comandos de Trabalho")
          .setColor("#FF8C00") // Laranja
          .setDescription("Use estes comandos se você tiver a ferramenta necessária!")
          .addFields(
            { name: "🔹 Básicos", value: "`/varrer` (Vassoura)\n`/limpar` (Esponja)", inline: true },
            { name: "🔹 Pescador", value: "`/pescar` (Vara)\n`/arrastar` (Rede)", inline: true },
            { name: "🔹 Trabalhador I", value: "`/cavar` (Pá)\n`/cozinhar` (Faca)\n`/arar` (Enxada)", inline: true },
            { name: "🔹 Trabalhador II", value: "`/cortar` (Machado)\n`/minerar` (Picareta)\n`/construir` (Martelo)", inline: true },
            { name: "🔹 Crime", value: "`/roubar` (Pistola)\n`/hackear` (Computador)", inline: true }
          );
      } 
      
      else if (value === "shop") {
        newEmbed = new EmbedBuilder()
          .setTitle("🛒 Loja e Inventário")
          .setColor("#FFFF00") // Amarelo
          .addFields(
            { name: "`/shop`", value: "Abre a loja para ver preços e kits.", inline: false },
            { name: "`/buy [item]`", value: "Compra uma ferramenta. Ex: `/buy item:vassoura`.", inline: false },
            { name: "`/inventory`", value: "Mostra quais ferramentas você já comprou.", inline: false }
          );
      } 
      
      else if (value === "social") {
        newEmbed = new EmbedBuilder()
          .setTitle("🏆 Social e Rankings")
          .setColor("#5865F2") // Azul Discord
          .addFields(
            { name: "`/profile`", value: "Mostra seu cartão de perfil com Nível e XP.", inline: false },
            { name: "`/rep [user]`", value: "Dá um ponto de reputação para um amigo.", inline: false },
            { name: "`/reptop`", value: "Mostra o ranking de quem tem mais reputação.", inline: false },
            { name: "`/moneytop`", value: "Mostra o ranking dos mais ricos do servidor.", inline: false }
          );
      } 
      
      else {
        // Se escolheu "Início" ou qualquer outra coisa, volta para o principal
        newEmbed = mainEmbed;
      }

      // Atualiza a mensagem
      await i.update({ embeds: [newEmbed], components: [row] });
    });

    // Quando o tempo acabar, desativa o menu
    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        selectMenu.setDisabled(true).setPlaceholder("Menu expirado")
      );
      interaction.editReply({ components: [disabledRow] }).catch(() => {});
    });
  }
};