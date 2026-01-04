const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

module.exports = async client => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  const commands = [];
  // Lê apenas arquivos que terminam com .js para evitar erros com pastas ou outros arquivos
  const files = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

  for (const file of files) {
    try {
      const command = require(`../commands/${file}`);
      // Verifica se o comando tem a estrutura correta antes de adicionar
      if (command.data && command.data.toJSON) {
        commands.push(command.data.toJSON());
      } else {
        console.warn(`⚠️ O comando ${file} não tem a propriedade "data" ou "execute".`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar o comando ${file}:`, error);
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  // ID do seu servidor (Guild ID)
  const GUILD_ID = "835589869224329247"; 

  try {
    console.log("⏳ Iniciando atualização dos comandos (/) no servidor...");

    // Usa applicationGuildCommands em vez de applicationCommands para ser instantâneo
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("✅ Comandos registrados com sucesso no servidor!");
  } catch (error) {
    console.error("❌ Erro ao registrar comandos:", error);
  }
};