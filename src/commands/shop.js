const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const shop = require("../data/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Ver a loja de ferramentas"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("LOJA 🛍️")
      .setColor("#0f0f0f")
      .setDescription("As ferramentas irão te ajudar em trabalhos, com elas você pode ganhar dinheiro! 😜")
      .setThumbnail("https://cdn-icons-png.flaticon.com/512/3081/3081840.png")
      .setFooter({ text: `Loja de ferramentas • ${new Date().toLocaleDateString("pt-BR")}` });

    const fmt = (price) => `R$${price.toLocaleString("pt-BR")}`;

    // --- KIT GARI ---
    // Truque: Name invisível (espaço em cima), Value com o texto (colado em baixo)
    embed.addFields({ name: "\u200B", value: "**⏣ Kit Gari**", inline: false });
    
    embed.addFields([
      { name: `1. ${shop.vassoura.name}`, value: fmt(shop.vassoura.price), inline: true },
      { name: `2. ${shop.esponja.name}`, value: fmt(shop.esponja.price), inline: true },
      { name: "\u200B", value: "\u200B", inline: true } // Espaço vazio para alinhar a grade
    ]);

    // --- KIT PESCADOR ---
    embed.addFields({ name: "\u200B", value: "**⏣ Kit Pescador**", inline: false });

    embed.addFields([
      { name: `3. ${shop.vara.name}`, value: fmt(shop.vara.price), inline: true },
      { name: `4. ${shop.rede.name}`, value: fmt(shop.rede.price), inline: true },
      { name: "\u200B", value: "\u200B", inline: true }
    ]);

    // --- KIT TRABALHADOR ---
    embed.addFields({ name: "\u200B", value: "**⏣ Kit Trabalhador**", inline: false });

    embed.addFields([
      { name: `5. ${shop.pa.name}`, value: fmt(shop.pa.price), inline: true },
      { name: `6. ${shop.faca.name}`, value: fmt(shop.faca.price), inline: true },
      { name: `7. ${shop.enxada.name}`, value: fmt(shop.enxada.price), inline: true },
      
      // Linha de baixo automática
      { name: `8. ${shop.machado.name}`, value: fmt(shop.machado.price), inline: true },
      { name: `9. ${shop.picareta.name}`, value: fmt(shop.picareta.price), inline: true },
      { name: `10. ${shop.martelo.name}`, value: fmt(shop.martelo.price), inline: true }
    ]);

    // --- KIT ROUBO ---
    embed.addFields({ name: "\u200B", value: "**⏣ Kit Roubo**", inline: false });

    embed.addFields([
      { name: `11. ${shop.pistola.name}`, value: fmt(shop.pistola.price), inline: true },
      { name: `12. ${shop.computador.name}`, value: fmt(shop.computador.price), inline: true },
      { name: "\u200B", value: "\u200B", inline: true }
    ]);

    interaction.reply({ embeds: [embed] });
  }
};