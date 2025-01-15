const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const fs = require("fs");
const { token, clientId, guildId } = require("./config.json");

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName, options, member } = interaction;

	if (commandName === "command2") {
		// Your existing logic for /command2
		const staticOptions = [
			{
				label: "Option A",
				description: "Description for Option A",
				value: "A",
			},
			{
				label: "Option B",
				description: "Description for Option B",
				value: "B",
			},
			{
				label: "Option C",
				description: "Description for Option C",
				value: "C",
			},
		];

		await interaction.reply({
			content: "Please select an option:",
			components: [
				{
					type: 1, // Action Row
					components: [
						{
							type: 3, // Select Menu
							customId: "static-select",
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
		// Ensure that only admins can use /command3
		if (!member.permissions.has("Administrator")) {
			return interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
		}

		const subCommand = options.getSubcommand();

		if (subCommand === "set") {
			// Existing logic for setting options
			const newOptions = options
				.getString("options")
				.split(",")
				.map((opt) => opt.trim());
			dynamicOptions = newOptions;

			fs.writeFileSync(
				optionsFile,
				JSON.stringify(dynamicOptions, null, 2)
			);

			return interaction.reply({
				content: `Options updated: ${dynamicOptions.join(", ")}`,
				ephemeral: true,
			});
		}

		if (subCommand === "select") {
			// Existing logic for selecting options
			if (dynamicOptions.length === 0) {
				return interaction.reply({
					content: "No options have been set by the admin.",
					ephemeral: true,
				});
			}

			const optionsMenu = dynamicOptions.map((opt) => ({
				label: opt,
				value: opt,
			}));

			await interaction.reply({
				content: "Please select an option:",
				components: [
					{
						type: 1, // Action Row
						components: [
							{
								type: 3, // Select Menu
								customId: "dynamic-select",
								placeholder: "Choose an option",
								options: optionsMenu,
							},
						],
					},
				],
				ephemeral: true,
			});
		}
	}

	if (commandName === "create-ticket") {
		// Your existing logic for creating a ticket
		const ticketChannel = await interaction.guild.channels.create({
			name: `ticket-${interaction.user.username}`,
			type: 0, // GUILD_TEXT
			permissionOverwrites: [
				{
					id: interaction.guild.roles.everyone.id,
					deny: ["ViewChannel"],
				},
				{
					id: interaction.user.id,
					allow: ["ViewChannel", "SendMessages"],
				},
			],
		});

		await interaction.reply({
			content: `Your support ticket has been created: ${ticketChannel}`,
			ephemeral: true,
		});
	}

	if (commandName === "close-ticket") {
		// Your existing logic for closing a ticket
		const channel = interaction.channel;
		if (!channel.name.startsWith("ticket-")) {
			return interaction.reply({
				content: "This is not a ticket channel.",
				ephemeral: true,
			});
		}

		await channel.delete();
		await interaction.reply({
			content: "Ticket closed successfully.",
			ephemeral: true,
		});
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customId === "static-select") {
		const selected = interaction.values[0];
		await interaction.reply({
			content: `You selected: ${selected}`,
			ephemeral: true,
		});
	}

	if (interaction.customId === "dynamic-select") {
		const selected = interaction.values[0];
		await interaction.reply({
			content: `You selected: ${selected}`,
			ephemeral: true,
		});
	}
});
