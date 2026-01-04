const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

module.exports = async client => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  const commands = [];
  // Lê apenas arquivos que terminam com .js
  const files = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

  for (const file of files) {
    try {
      const command = require(`../commands/${file}`);
      // Verifica se o comando tem a estrutura correta antes de adicionar
      if (command.data && command.data.toJSON) {
        commands.push(command.data.toJSON());
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar o comando ${file}:`, error);
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("⏳ Iniciando atualização dos comandos (Global)...");

    // USANDO applicationCommands (Sem Guild ID) = Registro Global
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Comandos registrados globalmente com sucesso!");
    console.log("ℹ️ Nota: Comandos globais podem levar até 1 hora para aparecer em todos os servidores.");
  } catch (error) {
    console.error("❌ Erro ao registrar comandos:", error);
  }
};