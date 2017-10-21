# [unmaintained] luminary-legacy

*Home IoT dashboard server*

## Maintenance Notice
I've stopped work on this project permanently. The polling is cool and the usage history "works", but I had no idea how to organize a server and it ended up becoming spaghetti.

I rewrote a lot of this from scratch and called it [filament](https://github.com/PsychoLlama/filament). It uses GraphQL now. GraphQL is cool.

## Why
I'm excited by IoT, dashboards, and IoT dashboards.

And I wanted one for my home.

Here are some of the server features:
- Hue bridge state polling.
- States are diffed, changes pushed to the clients.
- Usage metrics are logged in a database.

Clients developed independently.

## API
First, download the server.

```sh
$ git clone https://GitHub/PsychoLlama/luminary
$ cd luminary
```

Sweet. Now install the dependencies.

```sh
$ npm install
```

You'll need to configure the server, telling it where to find your Hue bridge.

Just follow the prompts.

```sh
$ npm run setup
```

To start the server, you'll need to write a very small script. `luminary` exports a function, you can pass a port number or an http server.

```js
import server from 'luminary'

const port = 8080
server(port)
```

You're golden! Now you can download any client drivers and point them to this server.
