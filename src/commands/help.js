const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  ComponentType
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Painel de ajuda e comandos"),

  async execute(interaction) {
    return this.run(interaction);
  },

  async executeMessage(message) {
    return this.run(message);
  },

  async run(ctx) {
    // 1. Criar o Embed Principal (Igual ao da foto "Information Panel")
    const embed = new EmbedBuilder()
      .setTitle("📘 Painel de Informações")
      .setDescription(
        "Olá! Aqui você encontra todos os meus comandos. Escolha uma categoria no menu abaixo para ver os detalhes! 👇\n\n" +
        "💸 **Economia**\n" +
        "⚒️ **Trabalhos**\n" +
        "🛒 **Loja & Itens**\n" +
        "🏆 **Social & Ranks**"
      )
      .setColor("#2B2D31") // Cor escura padrão do Discord (Dark Theme)
      .setThumbnail(ctx.client.user.displayAvatarURL());

    // 2. Criar o Menu de Seleção (Dropdown)
    const menu =
      new StringSelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder(
          "Selecione uma categoria..."
        )
        .addOptions([
          {
            label: "Economia",
            description: "Comandos de dinheiro",
            value: "economia",
            emoji: "💸"
          },
          {
            label: "Trabalhos",
            description: "Comandos de trabalho",
            value: "trabalhos",
            emoji: "⛏️"
          },
          {
            label: "Loja & Itens",
            description: "Comandos da loja",
            value: "loja",
            emoji: "🛒"
          },
          {
            label: "Social & Ranks",
            description: "Comandos sociais",
            value: "social",
            emoji: "🏆"
          }
        ]);

    const row = new ActionRowBuilder().addComponents(menu);

    // Envia a mensagem inicial
    const msg = await ctx.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

    // 3. Criar o Coletor (Para ouvir os cliques no menu)
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 300000 // O menu funciona por 10 minutos
    });

    collector.on("collect", async (i) => {

      const authorId =
        ctx.user?.id || ctx.author?.id;

      if (i.user.id !== authorId) {
        return i.reply({
          content: "❌ Esse menu não é para você!",
          ephemeral: true
        });
      }

      if (i.customId !== "help-menu") return;

      let responseEmbed;

      switch (i.values[0]) {

        case "economia":

          responseEmbed =
            new EmbedBuilder()
              .setTitle("💸 Economia")
              .setColor("#00FF00")
              .setDescription(
                "💰 `lu!balance`\n" +
                "Mostra quanto dinheiro você possui na carteira e no banco.\n\n" +

                "🎁 `lu!daily`\n" +
                "Coleta sua recompensa diária gratuita.\n\n" +

                "🏦 `lu!deposit <valor>`\n" +
                "Guarda dinheiro no banco para evitar perdas.\n\n" +

                "🏧 `lu!withdraw <valor>`\n" +
                "Retira dinheiro do banco para sua carteira.\n\n" +

                "💸 `lu!pay <usuário> <valor>`\n" +
                "Transfere dinheiro para outro jogador.\n\n" +

                "🏆 `lu!moneytop`\n" +
                "Mostra os jogadores mais ricos do servidor.\n\n" +

                "🎰 `lu!slots <valor>`\n" +
                "Aposte no caça-níquel da Lucy-chan."
              );

          break;

        case "trabalhos":

          responseEmbed =
            new EmbedBuilder()
              .setTitle("⛏️ Trabalhos")
              .setColor("#ffaa00")
              .setDescription(
                "🧹 `lu!varrer`\n" +
                "Trabalho simples usando uma vassoura.\n\n" +

                "🎣 `lu!pescar`\n" +
                "Pesque peixes para ganhar dinheiro.\n\n" +

                "⛏️ `lu!minerar`\n" +
                "Mine recursos valiosos usando picareta.\n\n" +

                "💻 `lu!hackear`\n" +
                "Tente invadir sistemas para ganhar dinheiro.\n\n" +

                "🪓 `lu!cortar`\n" +
                "Corte árvores usando um machado.\n\n" +

                "🔫 `lu!assaltar`\n" +
                "Roube outros jogadores, mas cuidado com a polícia.\n\n" +

                "⚠️ Todos os trabalhos precisam da ferramenta correta."
              );

          break;

        case "loja":

          responseEmbed =
            new EmbedBuilder()
              .setTitle("🛒 Loja & Itens")
              .setColor("#5865F2")
              .setDescription(
                "🛒 `lu!shop`\n" +
                "Abre a loja de ferramentas.\n\n" +

                "💳 `lu!buy <item>`\n" +
                "Compra ferramentas para desbloquear trabalhos.\n\n" +

                "🎒 `lu!inventory`\n" +
                "Mostra todos os itens que você possui."
              );
          break;

        case "social":

          responseEmbed =
            new EmbedBuilder()
              .setTitle("🏆 Social & Ranks")
              .setColor("#ff00aa")
              .setDescription(
                "👤 `lu!profile`\n" +
                "Mostra seu perfil, nível, XP e reputação.\n\n" +

                "✨ `lu!rep <usuário>`\n" +
                "Dá reputação para outro jogador.\n\n" +

                "🏆 `lu!reptop`\n" +
                "Ranking dos jogadores com mais reputação.\n\n" +

                "💰 `lu!moneytop`\n" +
                "Ranking econômico do servidor."
              );

          break;
      }

      await i.update({
        embeds: [responseEmbed],
        components: [row]
      });
    });

    collector.on("end", async () => {

      const disabledRow =
        new ActionRowBuilder()
          .addComponents(
            menu.setDisabled(true)
          );

      await msg.edit({
        components: [disabledRow]
      }).catch(() => {});
    });
  }
};