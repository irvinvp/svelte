<script>
  import { test_1, test_2 } from "./stores.js";
  import Sub from "./Sub.svelte";
  let name = "world";
  let lista = [
    { serial: 10, speed: 43 },
    { serial: 11, speed: 0 },
    { serial: 12, speed: 10 },
    { serial: 13, speed: 0 },
  ];
  $: {
    if ($test_1 == "10") {
      alert("ok");
    }
  }
  let worker = new Worker("./worker.js");
  worker.onmessage = function (e) {
    console.log("worker", e.data);
  };
</script>

<Sub {lista} {name} />

Var: {$test_1}

<style>
</style>
