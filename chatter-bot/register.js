import { getDiscordHeaders, API_BASE } from "./util.js";
export async function registerCommands() {
  const commandRegister = `${API_BASE}/applications/${process.env.DISCORD_APP_ID}/commands`;
  const commands = [
    {
      name: "test",
      type: 1,
      description: "Debug test command",
    },
  ];

  for (const cmd of commands) {
    const options = {
      method: "POST",
      headers: getDiscordHeaders(),
      body: JSON.stringify(cmd),
    };
    await fetch(commandRegister, options);
  }
}
