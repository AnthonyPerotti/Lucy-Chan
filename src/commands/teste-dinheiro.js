const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("teste-dinheiro")
    .setDescription("Receber R$ 1000,00 de dinheiro"),

  async execute(interaction) {
    const id = interaction.user.id;
    const reward = 1000;  // Valor fixo de R$ 1000,00

    // Verifica se o usuário já existe no banco de dados
    db.get("SELECT * FROM users WHERE user_id = ?", [id], (err, user) => {
      if (err) {
        console.error("Erro ao acessar o banco de dados:", err);
        return interaction.reply("❌ Ocorreu um erro ao acessar o banco de dados.");
      }

      if (!user) {
        // Se o usuário não existe, cria a conta com R$ 1000
        db.run(
          "INSERT INTO users (user_id, money) VALUES (?, ?)",
          [id, reward],
          function(err) {
            if (err) {
              console.error("Erro ao inserir o usuário:", err);
              return interaction.reply("❌ Não foi possível criar sua conta.");
            }
            interaction.reply(`💰 Você recebeu R$ ${reward},00 de dinheiro!`);
          }
        );
      } else {
        // Se o usuário já existe, adiciona R$ 1000 à conta dele
        db.run(
          "UPDATE users SET money = money + ? WHERE user_id = ?",
          [reward, id],
          function(err) {
            if (err) {
              console.error("Erro ao atualizar o dinheiro do usuário:", err);
              return interaction.reply("❌ Não foi possível adicionar o dinheiro.");
            }
            interaction.reply(`💰 Você recebeu R$ ${reward},00 de dinheiro!`);
          }
        );
      }
    });
  }
};
