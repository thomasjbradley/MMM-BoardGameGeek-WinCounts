# Board Game Geek Win Stats for MagicMirror

Load 100 most recent win stats from plays of a single BGG username & collate based on names from the players to generate stats.

Built using the [Board Game Geek API](https://boardgamegeek.com/wiki/page/BGG_XML_API2).

---

## Installing the module

To install, clone this repo into `~/MagicMirror/modules` directory. Then move in the folder and install required libraries.

```
git clone https://github.com/thomasjbradley/MMM-BoardGameGeek-WinCounts
cd MMM-BoardGameGeek-WinCounts
npm install
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
            module: 'MMM-BoardGameGeek-WinCounts',
            position: 'bottom_left',
            config: {
                username: "thomasjbradley", // The BGG user to grab play stats from
                names: ["Thomas", "Liz", "Edith"], // The filter of names from the plays to aggregate
            }
        }
    ]
}
```

## Configuration options

| Option         | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| username       | The BGG username to grab play stats from                      |
| names          | An array of player names to aggregate wins for                |
| updateInterval | *Optional* How often to update the win stats; Default 4 hours |
