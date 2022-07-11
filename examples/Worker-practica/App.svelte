<script>
  import { test_1, test_2, test_3 } from "./stores.js";
  import Sub from "./Sub.svelte";

  let numero1 = 0;
  let numero2 = 0;
  let worker = new Worker("./worker.js");
  worker.onmessage = function (e) {
    console.log("worker", e.data);
    test_1.set(e.data.resultado);
  };

  function click() {
    console.log("numeros", numero1, numero2);
    worker.postMessage({ numero1: numero1, numero2: numero2 });
  }
</script>

<Sub />
<div class="container-fluid">
  <div class="row">
    <div class="col">
      <p>
        <button on:click={click}>Suma</button>
        <input type="text" bind:value={numero1} />
        <input type="text" bind:value={numero2} />
      </p>
    </div>
  </div>
</div>

<style>
</style>
