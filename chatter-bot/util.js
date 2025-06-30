export const API_BASE = "https://discord.com/api/v10";
export const MY_SERVER_ID = "1388918758801936397";
export function getDiscordHeaders() {
  return {
    Authorization: `Bot ${process.env.DISCORD_APP_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function getCategory(name) {
  const channelRes = await fetch(
    `${API_BASE}/guilds/${MY_SERVER_ID}/channels`,
    {
      headers: getDiscordHeaders(),
    },
  );
  const channelJson = await channelRes.json();
  const foundItem = channelJson.find((itm) => {
    return itm.parent_id == null && itm.name === name;
  });
  console.log("SearchRes", foundItem);
  if (foundItem) {
    return foundItem;
  }
  return createChannel(name, 4, null);
}

export async function getChannels() {
  return fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    headers: getDiscordHeaders(),
  });
}

// GUILD_TEXT = 0
// GUILD_CATEGORY = 4
export async function createChannel(name, type, parent) {
  const res = await fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    method: "POST",
    headers: getDiscordHeaders(),
    body: JSON.stringify({
      name: name,
      type: type, // GUILD_TEXT=
      parent_id: parent,
    }),
  });
  return res.json();
}
