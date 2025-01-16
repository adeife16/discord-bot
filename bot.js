const { Client, Intents, Collection } = require("discord.js");
const TOKEN = "your-bot-token-here";

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

client.commands = new Collection();

// Load commands dynamically (if needed)
// Example: require('./commandsLoader')(client);

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (command) {
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error executing the command.",
					ephemeral: true,
				});
			}
		}
	}

	if (
		interaction.isStringSelectMenu() &&
		interaction.customId === "static-options"
	) {
		const option = interaction.values[0];

		if (option === "server_info") {
			const serverInfo = `
        **Server Name**: ${interaction.guild.name}
        **Total Members**: ${interaction.guild.memberCount}
      `;
			await interaction.reply({ content: serverInfo, ephemeral: true });
		}

		if (option === "bot_info") {
			const botInfo = `
        **Bot Name**: ${client.user.username}
        **Created On**: ${client.user.createdAt.toDateString()}
      `;
			await interaction.reply({ content: botInfo, ephemeral: true });
		}

		if (option === "list_commands") {
			const commandsList = `
        **Available Commands**:
        - \`/command2\`: Perform tasks via dropdown options.
        - \`/open_ticket\`: Open a new support ticket.
        - \`/command3\`: Send custom responses in ticket channels (Admins only).
      `;
			await interaction.reply({ content: commandsList, ephemeral: true });
		}
	}
});

// Login to Discord
client.login(TOKEN);
