const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { XMLParser } = require("fast-xml-parser");

const parseWinCounts = (config, body) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
    parseAttributeValue: true,
  });
  const xml = parser.parse(body);
  const lowernames = config.names.map((n) => n.toLowerCase().trim());
  const wins = {};
  try {
    xml.plays.play.forEach((play) => {
      if (!Object.hasOwn(play, "players")) {
        return;
      }
      play.players.player.forEach((player) => {
        const pname = player.name.trim().toLowerCase();
        if (!lowernames.includes(pname)) {
          return;
        }
        if (!Object.hasOwn(wins, pname)) {
          wins[pname] = { name: player.name.trim(), wins: 0 };
        }
        wins[pname].wins += player.win;
      });
    });
  } catch {
    throw new Error("BGG play results not in correct format.");
  }
  return wins;
};

const getWinCounts = async (config) => {
  const response = await fetch(
    `https://boardgamegeek.com/xmlapi2/plays?username=${config.username}`,
    {
      method: "GET",
      headers: {
        Accept: "text/xml",
        "User-Agent":
          "MMM-BoardGameGeek-WinCounts (https://github.com/thomasjbradley/MMM-BoardGameGeek-WinCounts)",
      },
    },
  );
  return parseWinCounts(config, await response.text());
};

module.exports = {
  getWinCounts: getWinCounts,
};
