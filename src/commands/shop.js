const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const shop = require("../data/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Ver a loja"),

  async execute(interaction) {
    // Criando o Embed para a loja
    const embed = new EmbedBuilder()
      .setTitle("🛒 **Loja Lucy-chan**")
      .setColor("#FFD700")  // Cor dourada
      .setDescription("Aqui estão os itens disponíveis na loja:");

    // Organizando os itens em 3 colunas
    const itemsPerColumn = 3;
    let columns = [[], [], []]; // 3 colunas

    Object.values(shop).forEach((item, index) => {
      // Adicionando o item à coluna correspondente
      const columnIndex = index % itemsPerColumn; // Distribui os itens nas 3 colunas
      columns[columnIndex].push(`${item.name}\n R$ ${item.price}`);
    });

    // Adicionando os itens das 3 colunas ao Embed
    for (let i = 0; i < 3; i++) {
      embed.addFields({
        name: "\u200B", // Título vazio
        value: columns[i].join("\n\n"), // Quebra de linha entre os itens
        inline: true  // Coloca os campos em linha
      });
    }

    // Enviar o Embed para o usuário
    interaction.reply({ embeds: [embed] });
  }
};
