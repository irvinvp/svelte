<script>
  import { test_1, test_2, test_3 } from "./stores.js";
  import Sub from "./Sub.svelte";

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
    cargando = false;
  };
  let cargando = false;
  let serial = "";
  function task(command) {
    worker.postMessage({ oper: command, serial: serial });
  }
</script>

<Sub />

<div class="container-fluid">
  <hr />
  <h3>Ejemplo de tarea</h3>
  <div class="row">
    <div class="col">
      <p>
        <input type="text" bind:value={serial} placeholder="Serial" />
      </p>
      <p>last pos {$test_3}</p>
      <p>
        <button on:click={() => task("run")}>Run</button>
        <button on:click={() => task("stop")}>Stop</button>
      </p>
    </div>
  </div>
</div>

<style>
</style>
