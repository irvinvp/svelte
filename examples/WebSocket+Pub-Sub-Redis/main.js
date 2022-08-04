const http = require("http");
const fs = require("fs");
const redis = require("redis");
const amqp = require("amqplib/callback_api");
const WebSocketServer = require("websocket").server;

// #################################   EDITAR SOLO ESTA PARTE  ################################################
const ip_queue = process.env.ip_queue || "conector:conector@localhost"; // servidor de queue
const queue = process.env.queue || "irvin"; // Queue de informacion
const port = parseInt(process.env.port) || 3428; // puerto de escucha
const app_name = process.env.app_name || "APP_irvin_"; // nombre de la aplicacion
const prefetch = parseInt(process.env.prefetch) || 1; // Mensajes por vez

async function service_api(path, method, params, body) {
  let res = { headers: {}, data: "", status: 200 };
  let DB;
  switch (path) {
    case "/": // Index
      res.status = 200;
      res.headers = { "Content-Type": "text/html" };
      res.data = fs.readFileSync("./svelte/public/index.html");
      break;
    case "/worker.js": // worker
      res.status = 200;
      res.headers = { "Content-Type": "application/javascript" };
      res.data = fs.readFileSync("./svelte/public/worker.js");
      break;
    case "/build/bundle.js": // bundle.js
      res.status = 200;
      res.headers = { "Content-Type": "application/javascript" };
      res.data = fs.readFileSync("./svelte/public/build/bundle.js");
      break;
    case "/build/bundle.css": // bundle.css
      res.status = 200;
      res.headers = { "Content-Type": "text/css; charset=utf-8" };
      res.data = fs.readFileSync("./svelte/public/build/bundle.css");
      break;
    case "/api": // API documentation
      res.status = 200;
      res.headers = {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      };
      res.data = fs.readFileSync("./api.html");
      break;
    case "/openapi.json": // API documentation
      res.status = 200;
      res.headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
      res.data = fs.readFileSync("./openapi.json");
      break;
    case "/api/v1/last_position": // API service
      if (method === "GET" && params.has("serial")) {
        res.status = 200;
        res.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        DB = await client.hGet(
          app_name + "last_position",
          params.get("serial")
        );
        res.data = JSON.stringify({
          message: DB,
          serial: params.get("serial"),
        });
      } else {
        res.status = 501;
        res.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        res.data = JSON.stringify({
          message: "Falta parametro serial",
          serial: params.get("serial"),
        });
      }
      break;
    case "/api/v1/last_type": // API service
      if (method === "GET" && params.has("serial")) {
        res.status = 200;
        res.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        DB = await client.hGet(app_name + "last_type", params.get("serial"));
        res.data = JSON.stringify({
          message: DB,
          serial: params.get("serial"),
        });
      } else {
        res.status = 501;
        res.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        res.data = JSON.stringify({
          message: "Falta parametro serial",
          serial: params.get("serial"),
        });
      }
      break;
    case "/api/v1/last_gps": // API service
      if (method === "GET" && params.has("serial")) {
        res.status = 200;
        res.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        DB = await client.hGet(app_name + "last_gps", params.get("serial"));
        DB = JSON.parse(DB);
        res.data = JSON.stringify({
          message: DB,
          serial: params.get("serial"),
        });
      } else {
        res.status = 501;
        res.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        res.data = JSON.stringify({
          message: "Falta parametro serial",
          serial: params.get("serial"),
        });
      }
      break;
    default:
      res.status = 404;
      res.headers = { "Content-Type": "text/plain" };
      res.data = "Not found";
      break;
  }
  return res;
}
async function ws(msg, con, sub_client = null) {
  console.log("ws: " + msg);
  switch (msg.split(",")[0]) {
    case "hello":
      con.send("que onda!");
      break;
    case "n1":
      con.send(msg.split(",")[1]);
      break;
    case "suma":
      con.send(
        "calc," +
          (parseInt(msg.split(",")[1]) + parseInt(msg.split(",")[2])).toString()
      );
      break;
    case "resta":
      con.send(
        "calc," +
          (parseInt(msg.split(",")[1]) - parseInt(msg.split(",")[2])).toString()
      );
      break;
    case "multiplicacion":
      con.send(
        "calc," +
          (parseInt(msg.split(",")[1]) * parseInt(msg.split(",")[2])).toString()
      );
      break;
    case "sub":
      if (sub_client) {
        sub_client.subscribe(msg.split(",")[1], (message) => {
          con.send(message);
        });
      }
      break;
    default:
      con.sendUTF(msg);
      break;
  }
}
async function service_queue(msg) {
  if (msg.length >= 22) {
    let serial = msg.substring(4, 14);
    await client.publish(serial, msg);
    let res = await client.hSet(
      app_name + "last_position",
      serial,
      new Date().toISOString()
    );
    let res2 = await client.hSet(
      app_name + "last_type",
      serial,
      msg.substring(20, 22)
    );
    // read change save
    let res3;
    if (msg.length > 58) {
      res3 = await client.hGet(app_name + "last_gps", serial);
      res3 = JSON.parse(res3);
      if (res3 == null) {
        await client.hSet(
          app_name + "last_gps",
          serial,
          JSON.stringify([calamp_decode(msg)])
        );
      } else {
        res3.push(calamp_decode(msg));
        if (res3.length > 5) {
          res3.shift();
        }
        await client.hSet(app_name + "last_gps", serial, JSON.stringify(res3));
      }
    }
    return res != null && res2 != null && res3 != null ? true : false;
  } else {
    return false;
  }
}
function calamp_decode(msg) {
  let serial = msg.substring(4, 14);
  let type = msg.substring(20, 22);
  let time = 0,
    vel = 0,
    lat = 0,
    lon = 0;
  if ((type == "02" || type == "04" || type == "05") && msg.length > 58) {
    vel = Math.round(parseInt(msg.substring(66, 74), 16) / 27.7778);
    time = parseInt(msg.substring(26, 34), 16);
    lat =
      parseInt(msg.substring(42, 50), 16) > 0x80000000
        ? ((0xffffffff - parseInt(msg.substring(42, 50), 16) + 1) * -1) /
          10000000
        : parseInt(msg.substring(42, 50), 16) / 10000000;
    lon =
      parseInt(msg.substring(50, 58), 16) > 0x80000000
        ? ((0xffffffff - parseInt(msg.substring(50, 58), 16) + 1) * -1) /
          10000000
        : parseInt(msg.substring(50, 58), 16) / 10000000;
  }
  return {
    time: time,
    vel: vel,
    lat: lat,
    lon: lon,
    serial: serial,
    type: type,
  };
}
// ##############################################################################################################

// NO EDITAR #################################################################################################
let client = redis.createClient({
  url: process.env.redis || "redis://localhost",
});
client.connect();
if (process.env.TEST != "test") {
  console.log("Iniciando servidor");
  // Server
  let server = http
    .createServer(async (req, res) => {
      let url = new URL(req.url, `http://${req.headers.host}`);
      let path = url.pathname;
      let method = req.method;
      let params = url.searchParams;
      let body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", async () => {
        body = Buffer.concat(body).toString();
        let respuesta = await service_api(path, method, params, body);
        res.writeHead(respuesta.status, respuesta.headers);
        res.end(respuesta.data);
      });
    })
    .listen(port);
  // WebSocket
  let wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
  });
  wsServer.on("request", function (request) {
    let connection = request.accept(null, request.origin);
    let sub_client = redis.createClient({
      url: process.env.redis || "redis://localhost",
    });
    sub_client.connect();
    connection.on("close", function (reasonCode, description) {
      sub_client.quit();
    });
    connection.on("message", function (message) {
      if (message.type === "utf8") {
        ws(message.utf8Data, connection, sub_client);
      }
    });
  });
  // RabbitMQ
  amqp.connect("amqp://" + ip_queue, function (error0, connection) {
    if (error0) console.log("e0", error0);
    connection.createChannel(function (error1, channel) {
      if (error1) console.log("e1", error1);
      channel.prefetch(prefetch);
      channel.consume(queue, async function (msg) {
        await service_queue(msg.content.toString());
        channel.ack(msg);
      });
    });
  });
}
module.exports = { service_api, service_queue, client };
