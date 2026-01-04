const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

module.exports = async client => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  const commands = [];
  const files = fs.readdirSync("./src/commands");

  for (const file of files) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log("✅ Comandos registrados!");
};
