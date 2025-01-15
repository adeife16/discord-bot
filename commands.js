const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

// Define your commands
const commands = [
	new SlashCommandBuilder()
		.setName("command2")
		.setDescription("Get a static list of options"),
	new SlashCommandBuilder()
		.setName("command3")
		.setDescription("Only Admins can set options for command2")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("set")
				.setDescription("Set options (Admins only)")
				.addStringOption((option) =>
					option
						.setName("options")
						.setDescription("Comma-separated options to set")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("select").setDescription("Select an option")
		),
	new SlashCommandBuilder()
		.setName("create-ticket")
		.setDescription("Create a new support ticket"),
	new SlashCommandBuilder()
		.setName("close-ticket")
		.setDescription("Close the current support ticket"),
].map((command) => command.toJSON());

// Set up the REST client
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		// Register commands for a specific server (guild)
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error("Error registering commands:", error);
	}
})();
