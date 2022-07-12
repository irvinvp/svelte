<script>
  import { test_1, test_2, test_3 } from "./stores.js";
  import Sub from "./Sub.svelte";

  let numero1 = 0;
  let numero2 = 0;
  let worker = new Worker("./worker.js");
  worker.onmessage = function (e) {
    console.log("worker", e.data);
    test_1.set(e.data.resultado);
    cargando = false;
  };
  let cargando = false;
  function click(oper) {
    test_1.set("Espera....");
    cargando = true;
    console.log("numeros", numero1, numero2);
    worker.postMessage({ oper: oper, numero1: numero1, numero2: numero2 });
  }
  let serial = "";
  async function last_position() {
    let response = await fetch("/api/v1/last_position?serial=" + serial);
    let commands = await response.json();
    test_2.set(commands.message);
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
        {#if cargando == false}
          <button on:click={() => click("sleep")}>Timer</button>
        {/if}
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
</div>

<style>
</style>
