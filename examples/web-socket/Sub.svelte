<script>
  import { test_1, test_2, test_3, test_4 } from "./stores.js";
  import { onDestroy, onMount } from "svelte";

  onDestroy(() => {
    worker.postMessage({ oper: "end", serial: "" });
  });

  let worker = new Worker("./worker.js");
  worker.onmessage = function (e) {
    console.log("worker", e.data);
    if (e.data.type == "one_time") {
      test_1.set(e.data.resultado);
    }
    if (e.data.type == "task") {
      test_3.set(e.data.resultado);
    }
    if (e.data.type == "task2") {
      test_4.set(e.data.resultado);
    }
  };
  let serial = "";
  function task(command) {
    worker.postMessage({ oper: command, serial: serial });
  }
  let ws_msg;
  let websocket;
  function wsConnect() {
    websocket = new WebSocket("ws://" + location.host);
    websocket.onopen = function (e) {
      console.log("ws conectado");
    };
    websocket.onmessage = function (e) {
      console.log("ws", e.data);
    };
  }
  function wsSend(msg) {
    if (websocket) {
      websocket.send(msg);
    }
  }
  wsConnect();
</script>

<div class="container-fluid">
  <hr />
  <h3>Ejemplo WS</h3>
  <div class="row">
    <div class="col">
      <p>
        <input type="text" bind:value={ws_msg} placeholder="Mensaje WS" />
      </p>
      <p>
        <button on:click={() => wsSend(ws_msg)}>Send MSG</button>
      </p>
    </div>
  </div>
</div>

<div class="container-fluid">
  <hr />
  <h3>Ejemplo de tarea en SUB</h3>
  <div class="row">
    <div class="col">
      <p>
        <input type="text" bind:value={serial} placeholder="Serial" />
      </p>
      <p>last pos {$test_3}</p>
      <p>last type {$test_4}</p>
      <p>
        <button on:click={() => task("run")}>Run</button>
        <button on:click={() => task("stop")}>Stop</button>
      </p>
    </div>
  </div>
  <hr />
</div>

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h3>Resultado {$test_1}</h3>
    </div>
  </div>
</div>

<style>
</style>
