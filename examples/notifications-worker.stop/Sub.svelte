<script>
  import { test_1, test_2, test_3, test_4 } from "./stores.js";
  import { onDestroy } from "svelte";

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
</script>

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

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h3>Resultado {$test_1}</h3>
    </div>
  </div>
</div>

<style>
</style>
