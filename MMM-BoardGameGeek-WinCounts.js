/**
 * Board Game Geek Win Counts
 * @author Thomas J Bradley <hey@thomasjbradley.ca>
 * @license MIT Licensed.
 */

"use strict";

Module.register("MMM-BoardGameGeek-WinCounts", {
  result: { loading: "Loading board game win stats...", wins: {} },

  defaults: {
    title: "Board Game Win Counts",
    updateInterval: 1000 * 60 * 15, // Every 15 minutes
    username: "",
    names: [],
  },

  start: function () {
    this.getWinCounts();
    this.scheduleUpdate();
  },

  getDom: function () {
    const div = document.createElement("div");
    const dl = document.createElement("dl");
    div.classList.add("bgg-win-counts-wrapper");
    dl.classList.add("bgg-win-counts");
    if (Object.keys(this.result.wins).length <= 0) {
      const p = document.createElement("p");
      p.innerText = this.result.loading;
      p.classList.add("bgg-loading");
      div.appendChild(p);
      return div;
    }
    this.config.names.forEach((name) => {
      const player = this.result.wins[name.toLowerCase().trim()];
      const group = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      group.classList.add("bgg-winner");
      group.classList.add(`bgg-place-${player.place}`);
      dt.classList.add("bgg-winner-name");
      dt.innerText = player.name;
      dd.classList.add("bgg-winner-count");
      dd.innerText = player.wins;
      group.appendChild(dt);
      group.appendChild(dd);
      dl.appendChild(group);
    });
    div.appendChild(dl);
    return div;
  },

  getWinCounts: function () {
    this.sendSocketNotification("GET_BGG_WINS", this.config);
  },

  scheduleUpdate: function () {
    setInterval(() => {
      this.getWinCounts();
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification == "BGG_WINS") {
      this.result.wins = payload;
      this.updateDom(0);
    }
  },
});
