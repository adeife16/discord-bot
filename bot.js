const {
	Client,
	GatewayIntentBits,
	REST,
	Routes,
	PermissionsBitField,
} = require("discord.js");
const { token, clientId, guildId } = require("./config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
	],
});

const commands = [
	{
		name: "command2",
		description: "Select a static option from the dropdown menu",
	},
	{
		name: "command3",
		description: "Admins can send a styled button or text to a user",
		options: [
			{
				name: "user",
				type: 6, // USER
				description: "The user to message",
				required: true,
			},
			{
				name: "message",
				type: 3, // STRING
				description:
					"The message content (leave blank for buttons only)",
				required: false,
			},
			{
				name: "button_label",
				type: 3, // STRING
				description: "Label for the button (optional)",
				required: false,
			},
			{
				name: "button_link",
				type: 3, // STRING
				description: "URL for the button (optional)",
				required: false,
			},
		],
	},
];

(async () => {
	const rest = new REST({ version: "10" }).setToken(token);
	try {
		console.log("Registering slash commands...");
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});
		console.log("Slash commands registered.");
	} catch (error) {
		console.error("Error registering commands:", error);
	}
})();

client.on("ready", () => {
	console.log(`Bot is online as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName, options, member } = interaction;

	if (commandName === "command2") {
		const staticOptions = [
			{ label: "Greet", value: "greet", description: "Send a greeting" },
			{
				label: "Info",
				value: "info",
				description: "Provide information",
			},
			{ label: "Help", value: "help", description: "Assist the user" },
		];

		await interaction.reply({
			content: "Please choose an option:",
			components: [
				{
					type: 1, // Action Row
					components: [
						{
							type: 3, // Select Menu
							customId: "static-options",
							placeholder: "Choose an option",
							options: staticOptions,
						},
					],
				},
			],
			ephemeral: true,
		});
	}

	if (commandName === "command3") {
		if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({
				content: "Only administrators can use this command.",
				ephemeral: true,
			});
		}

		const user = options.getUser("user");
		const messageContent = options.getString("message");
		const buttonLabel = options.getString("button_label");
		const buttonLink = options.getString("button_link");

		const components = [];

		if (buttonLabel && buttonLink) {
			components.push({
				type: 1, // Action Row
				components: [
					{
						type: 2, // Button
						style: 5, // Link style
						label: buttonLabel,
						url: buttonLink,
					},
				],
			});
		}

		try {
			if (!messageContent && components.length === 0) {
				return interaction.reply({
					content:
						"You must provide either a message, a button, or both.",
					ephemeral: true,
				});
			}

			await user.send({
				content: messageContent || null,
				components: components.length > 0 ? components : undefined,
			});

			return interaction.reply({
				content: `Message sent to ${user.tag}.`,
				ephemeral: true,
			});
		} catch (error) {
			return interaction.reply({
				content: `Failed to send message to ${user.tag}.`,
				ephemeral: true,
			});
		}
	}
});

client.login(token);
