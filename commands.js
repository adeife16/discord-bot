const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

// Define commands
const commands = [
	new SlashCommandBuilder()
		.setName("command2")
		.setDescription("Select an option from the dropdown"),
	new SlashCommandBuilder()
		.setName("command3")
		.setDescription("Admins can configure dropdown options")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("set-options")
				.setDescription("Set dropdown options")
				.addStringOption((option) =>
					option
						.setName("options")
						.setDescription(
							"Comma-separated list of options in 'label:description' format (e.g., 'Greet:Say hello, Help:Provide assistance')"
						)
						.setRequired(true)
				)
		),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});
		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error("Error registering commands:", error);
	}
})();
