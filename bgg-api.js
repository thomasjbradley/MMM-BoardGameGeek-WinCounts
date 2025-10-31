const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { XMLParser } = require("fast-xml-parser");

const parseXml = (body) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
    parseAttributeValue: true,
  });
  const pageSize = 100.0; // As per BGG documentation: https://boardgamegeek.com/wiki/page/BGG_XML_API2#toc10
  const xml = parser.parse(body);
  return [xml, Math.ceil(parseFloat(xml.plays.total) / pageSize)];
};

const makeWinCounts = (config) => {
  const wins = {};
  config.names.forEach((name) => {
    const lowerName = name.toLowerCase().trim();
    wins[lowerName] = {
      name: name.trim(),
      wins: 0,
      place: 0,
    };
  });
  return wins;
};

const parseWinCounts = (config, wins, pages) => {
  const lowerNames = config.names.map((n) => n.toLowerCase().trim());
  pages.forEach((xml) => {
    if (!Object.hasOwn(xml, "plays") || !Object.hasOwn(xml.plays, "play")) {
      return;
    }
    xml.plays.play.forEach((play) => {
      if (!Object.hasOwn(play, "players")) {
        return;
      }
      play.players.player.forEach((player) => {
        const pname = player.name.trim().toLowerCase();
        if (!lowerNames.includes(pname)) {
          return;
        }
        wins[pname].wins += player.win;
      });
    });
  });
  sortedWins = Object.values(wins);
  sortedWins.sort((a, b) => b.wins - a.wins);
  sortedWins.forEach((winner, i) => {
    const lower = winner.name.toLowerCase().trim();
    if (wins[lower].wins > 0) {
      wins[lower].place = i + 1;
    }
  });
  return wins;
};

const callAPI = async (apiKey, username, start, end, page) => {
  return await fetch(
    `https://boardgamegeek.com/xmlapi2/plays?username=${username}&mindate=${start}&maxdate=${end}&page=${page}`,
    {
      method: "GET",
      headers: {
        Accept: "text/xml",
        Authorization: `Bearer ${apiKey}`,
        "User-Agent":
          "MMM-BoardGameGeek-WinCounts (https://github.com/thomasjbradley/MMM-BoardGameGeek-WinCounts)",
      },
    },
  );
};

const getWinCounts = async (config) => {
  const wins = makeWinCounts(config);
  const year = new Date().getFullYear();
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const pages = [];
  const firstPageResponse = await callAPI(
    config.apiKey,
    config.username,
    start,
    end,
    1,
  );
  const [firstPage, totalPages] = parseXml(await firstPageResponse.text());
  pages.push(firstPage);
  for (let i = 2; i <= totalPages; i++) {
    const pageResponse = await callAPI(config.apiKey, config.username, start, end, i);
    const [page, _] = parseXml(await pageResponse.text());
    pages.push(page);
  }
  return parseWinCounts(config, wins, pages);
};

module.exports = {
  getWinCounts: getWinCounts,
};
