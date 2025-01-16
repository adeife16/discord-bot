const {
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
	commands: [
		// Command for static options
		{
			data: new SlashCommandBuilder()
				.setName("command2")
				.setDescription("Perform specific tasks using static options"),
			async execute(interaction) {
				const optionsMenu = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("static-options")
						.setPlaceholder("Choose an option")
						.addOptions([
							{
								label: "Check Server Info",
								description: "Get details about the server.",
								value: "server_info",
							},
							{
								label: "Get Bot Info",
								description: "Get details about this bot.",
								value: "bot_info",
							},
							{
								label: "List Commands",
								description: "See all available commands.",
								value: "list_commands",
							},
						])
				);

				await interaction.reply({
					content: "Select an option from the dropdown:",
					components: [optionsMenu],
					ephemeral: true,
				});
			},
		},

		// Command to open a ticket
		{
			data: new SlashCommandBuilder()
				.setName("open_ticket")
				.setDescription("Open a new support ticket"),
			async execute(interaction) {
				const guild = interaction.guild;

				// Check if user already has a ticket
				const existingChannel = guild.channels.cache.find(
					(c) => c.name === `ticket-${interaction.user.id}`
				);

				if (existingChannel) {
					return interaction.reply({
						content: "You already have an open ticket!",
						ephemeral: true,
					});
				}

				// Create a new ticket channel
				const ticketChannel = await guild.channels.create({
					name: `ticket-${interaction.user.id}`,
					type: 0, // Text channel
					parent: ticketCategoryId, // Replace with your ticket category ID
					permissionOverwrites: [
						{
							id: guild.roles.everyone.id,
							deny: ["ViewChannel"],
						},
						{
							id: interaction.user.id,
							allow: ["ViewChannel", "SendMessages"],
						},
					],
				});

				await ticketChannel.send(
					`Welcome <@${interaction.user.id}>! A staff member will assist you shortly.`
				);
				await interaction.reply({
					content: `Your ticket has been created: ${ticketChannel}`,
					ephemeral: true,
				});
			},
		},

		// Command to send custom response
		{
			data: new SlashCommandBuilder()
				.setName("command3")
				.setDescription(
					"Send a custom response in the current ticket channel"
				)
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("The message to send")
						.setRequired(true)
				),
			async execute(interaction) {
				if (!interaction.member.permissions.has("ADMINISTRATOR")) {
					return interaction.reply({
						content:
							"You do not have permission to use this command.",
						ephemeral: true,
					});
				}

				const message = interaction.options.getString("message");
				const ticketChannel = interaction.channel;

				if (!ticketChannel.name.startsWith("ticket-")) {
					return interaction.reply({
						content:
							"This command can only be used in a ticket channel.",
						ephemeral: true,
					});
				}

				await ticketChannel.send(message);
				await interaction.reply({
					content: "Message sent to the ticket channel.",
					ephemeral: true,
				});
			},
		},
	],
};
