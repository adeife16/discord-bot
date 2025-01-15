const { Client, GatewayIntentBits, REST, Routes, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const { token, clientId, guildId } = require("./config.json");

// Load dynamic options
const optionsFile = "./adminOptions.json";
let dropdownOptions = [];
if (fs.existsSync(optionsFile)) {
    dropdownOptions = JSON.parse(fs.readFileSync(optionsFile, "utf8"));
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Register slash commands
const commands = [
    {
        name: "command2",
        description: "Select an option from the dropdown",
    },
    {
        name: "command3",
        description: "Admins can configure dropdown options",
        options: [
            {
                name: "set-options",
                type: 1, // Sub-command
                description: "Set dropdown options",
                options: [
                    {
                        name: "options",
                        type: 3, // STRING
                        description: "Comma-separated list of options",
                        required: true,
                    },
                ],
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
    console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

    if (interaction.isCommand()) {
        const { commandName, options, member } = interaction;

        if (commandName === "command2") {
            if (dropdownOptions.length === 0) {
                return interaction.reply({
                    content: "No options available. Admins need to configure options using `/command3`.",
                    ephemeral: true,
                });
            }

            const menuOptions = dropdownOptions.map((option, index) => ({
                label: option.label,
                value: `option-${index}`,
                description: option.description || "No description provided",
            }));

            await interaction.reply({
                content: "Please select an option:",
                components: [
                    {
                        type: 1, // Action Row
                        components: [
                            {
                                type: 3, // Select Menu
                                customId: "dropdown-select",
                                placeholder: "Choose an option",
                                options: menuOptions,
                            },
                        ],
                    },
                ],
                ephemeral: true,
            });
        }

        if (commandName === "command3") {
            const subCommand = options.getSubcommand();

            if (subCommand === "set-options") {
                if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({
                        content: "Only administrators can use this command.",
                        ephemeral: true,
                    });
                }

                const newOptions = options
                    .getString("options")
                    .split(",")
                    .map((opt) => {
                        const [label, description] = opt.split(":").map((str) => str.trim());
                        return { label, description: description || null };
                    });

                dropdownOptions = newOptions;

                fs.writeFileSync(optionsFile, JSON.stringify(dropdownOptions, null, 2));
                return interaction.reply({
                    content: `Dropdown options updated successfully!`,
                    ephemeral: true,
                });
            }
        }
    }

    if (interaction.isSelectMenu()) {
        const selectedOption = interaction.values[0];
        const optionIndex = parseInt(selectedOption.split("-")[1], 10);
        const selectedTask = dropdownOptions[optionIndex]?.label;

        if (selectedTask) {
            // Example tasks based on option
            switch (selectedTask.toLowerCase()) {
                case "greet":
                    await interaction.reply({ content: "Hello! How can I assist you today?", ephemeral: true });
                    break;
                case "info":
                    await interaction.reply({ content: "Here's some information for you.", ephemeral: true });
                    break;
                case "help":
                    await interaction.reply({ content: "Here are some resources for assistance.", ephemeral: true });
                    break;
                default:
                    await interaction.reply({
                        content: `You selected: ${selectedTask}, but no task is assigned.`,
                        ephemeral: true,
                    });
            }
        } else {
            await interaction.reply({
                content: "Invalid selection. Please try again.",
                ephemeral: true,
            });
        }
    }
});

client.login(token);
