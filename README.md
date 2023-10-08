# Board Game Geek Win Stats for MagicMirror

**Load 100 most recent win stats from plays of a single BGG username & aggregate win totals from a list of provided plyer names.**

Built using the [Board Game Geek API](https://boardgamegeek.com/wiki/page/BGG_XML_API2).

---

## Instal the module

To install, clone this repo into the `~/MagicMirror/modules` directory. Then move into the folder and install the required dependencies.

```
cd ~/MagicMirror/modules
git clone https://github.com/thomasjbradley/MMM-BoardGameGeek-WinCounts
cd MMM-BoardGameGeek-WinCounts
npm install
```

## Set up the module

Set up the module by adding the following configuration block to the modules array in your `config/config.js` file:

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

## Config options

| Option         | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| username       | The BGG username to grab play stats from                      |
| names          | An array of player names to aggregate wins for                |
| updateInterval | *Optional* How often to update the win stats; Default 4 hours |
