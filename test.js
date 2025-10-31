#!/usr/bin/env node

"use strict";

const bggapi = require("./bgg-api.js");

bggapi
  .getWinCounts({
    username: "thomasjbradley",
    apiKey: "YOUR_API_KEY",
    names: ["Thomas", "Liz", "Edith"],
  })
  .then((wins) => {
    console.log(wins);
  });
