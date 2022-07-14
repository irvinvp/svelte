<script>
  import { test_1, test_2, test_3, test_4 } from "./stores.js";
  import Sub from "./Sub.svelte";

  let app_name =
    document
      .getElementsByTagName("meta")
      ["application-name"].getAttribute("content") + "_";
  let localStorage = window.localStorage;

  let numero1 = 0;
  let numero2 = 0;
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
    cargando = false;
  };
  let cargando = false;
  function click(oper) {
    test_1.set("Espera....");
    cargando = true;
    console.log("numeros", numero1, numero2);
    worker.postMessage({ oper: oper, numero1: numero1, numero2: numero2 });
  }
  let serial = localStorage.getItem(app_name + "serial");
  async function last_position() {
    let response = await fetch("/api/v1/last_position?serial=" + serial);
    let commands = await response.json();
    test_2.set(commands.message);
  }
  function task(command) {
    worker.postMessage({ oper: command, serial: serial });
  }
  $: {
    if (serial) {
      localStorage.setItem(app_name + "serial", serial);
    }
  }
  if(window.location.hostname == "localhost"){
    console.log("Modo debug");
  }
  else{
    console.log("Modo produccion");
  }
</script>

<Sub />

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <p>
        <button on:click={() => click("suma")}>Suma</button>
        <button on:click={() => click("resta")}>Resta</button>
        <button on:click={() => click("multi")}>Multiplicación</button>
        <button on:click={() => click("sleep")} disabled={cargando}
          >Timer</button
        >
      </p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p>
        <input type="text" bind:value={numero1} />
        <input type="text" bind:value={numero2} />
      </p>
    </div>
  </div>
  <hr />
  <h3>Ejemplo con API</h3>
  <div class="row">
    <div class="col">
      <p>
        <input type="text" bind:value={serial} placeholder="Serial" />
      </p>
      <p>last pos {$test_2}</p>
      <p>
        <button on:click={last_position}>Get last</button>
      </p>
    </div>
  </div>
  <hr />
  <h3>Ejemplo de tarea</h3>
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
</div>

<style>
</style>
