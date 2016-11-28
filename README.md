# illuminate-server

*Home IoT dashboard server*

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
$ git clone https://GitHub/PsychoLlama/illuminate-server
$ cd illuminate-server
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

To start the server, you'll need to write a very small script. `illuminate-server` exports a function, you can pass a port number or an http server.

```js
import server from 'illuminate-server'

const port = 8080
server(port)
```

You're golden! Now you can download any client drivers and point them to this server.
