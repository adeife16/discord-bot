const { SlashCommandBuilder } = require("discord.js");

module.exports = {
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
			parent: "1329553531694223411", // Replace with your ticket category ID
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
};
