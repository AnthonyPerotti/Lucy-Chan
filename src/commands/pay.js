const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Transferir dinheiro para outro usuário")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Para quem você vai enviar o dinheiro")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("valor")
        .setDescription("A quantidade de dinheiro para enviar")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const senderId = interaction.user.id;
    const targetUser = interaction.options.getUser("usuario");
    const targetId = targetUser.id;
    const amount = interaction.options.getInteger("valor");

    // Validações básicas
    if (senderId === targetId) {
      return interaction.reply("❌ Você não pode enviar dinheiro para si mesmo.");
    }

    if (targetUser.bot) {
      return interaction.reply("🤖 Bots não precisam de dinheiro!");
    }

    // Verifica o saldo do remetente
    db.get("SELECT money FROM users WHERE user_id = ?", [senderId], (err, sender) => {
      if (err) return interaction.reply("❌ Erro ao verificar saldo.");

      if (!sender || sender.money < amount) {
        return interaction.reply("💸 Você não tem dinheiro suficiente na carteira para essa transferência.");
      }

      // Verifica se o destinatário existe no banco (se não, cria)
      db.get("SELECT * FROM users WHERE user_id = ?", [targetId], (err, receiver) => {
        if (!receiver) {
          db.run("INSERT INTO users (user_id) VALUES (?)", [targetId]);
        }

        // Realiza a transferência (Tira de um, dá para o outro)
        db.serialize(() => {
          db.run("UPDATE users SET money = money - ? WHERE user_id = ?", [amount, senderId]);
          db.run("UPDATE users SET money = money + ? WHERE user_id = ?", [amount, targetId]);
        });

        // Confirmação visual
        const embed = new EmbedBuilder()
          .setTitle("💸 Transferência Realizada")
          .setColor("#00FF00")
          .setDescription(`Você enviou **R$ ${amount}** para **${targetUser.username}**!`)
          .setFooter({ text: `Remetente: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
    });
  }
};