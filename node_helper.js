/**
 * Board Game Geek Win Counts
 * @author Thomas J Bradley <hey@thomasjbradley.ca>
 * @license MIT
 */

"use strict";

const NodeHelper = require("node_helper");
const bggapi = require("./bgg-api");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-BoardGameGeek-WinCounts helper started");
  },
  getWinCounts: function (config) {
    bggapi.getWinCounts(config).then((wins) => {
      this.sendSocketNotification("BGG_WINS", wins);
    });
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_BGG_WINS") {
      this.getWinCounts(payload);
    }
  },
});
