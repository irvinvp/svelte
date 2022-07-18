<script>
  import { test_1, test_2, test_3, test_4 } from "./stores.js";
  import Sub from "./Sub.svelte";
  import { onDestroy, onMount } from "svelte";

  let app_name =
    document
      .getElementsByTagName("meta")
      ["application-name"].getAttribute("content") + "_";
  let localStorage = window.localStorage;

  let numero1 =
    localStorage.getItem(app_name + "numero1") == null
      ? 0
      : window.location.hostname == "localhost"
      ? localStorage.getItem(app_name + "numero1")
      : 0;
  let numero2 =
    localStorage.getItem(app_name + "numero2") == null
      ? 0
      : window.location.hostname == "localhost"
      ? localStorage.getItem(app_name + "numero2")
      : 0;
  let worker = new Worker("./worker.js");
  worker.onmessage = function (e) {
    console.log("worker", e.data);
    if (e.data.type == "one_time") {
      test_1.set(e.data.resultado);
      myChart.data.datasets[0].data = [numero1, numero2, e.data.resultado];
      myChart.update();
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
    if (numero1 && window.location.hostname == "localhost") {
      localStorage.setItem(app_name + "numero1", numero1);
    }
    if (numero2 && window.location.hostname == "localhost") {
      localStorage.setItem(app_name + "numero2", numero2);
    }
  }
  if (window.location.hostname == "localhost") {
    console.log("Modo debug");
  } else {
    console.log("Modo produccion");
  }
  function notificaciones() {
    Notification.requestPermission().then((e) => {
      if (e === "granted") {
        worker.postMessage({ oper: "notif", state: true });
      }
    });
  }
  let sub_on = true;
  let myChart;
  onMount(() => {
    // Chart
    let labels = ["Numero 1", "Numero 2", "Resultado"];
    let data = {
      labels: labels,
      datasets: [
        {
          label: "My First dataset2",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: [0, 0, 0],
        },
      ],
    };
    let config = {
      type: "bar",
      data: data,
      options: {},
    };
    myChart = new Chart(document.getElementById("myChart"), config);
  });
</script>

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <p>
        <button
          on:click={() => {
            sub_on = true;
          }}>Sub ON</button
        >
        <button
          on:click={() => {
            sub_on = false;
          }}>Sub OFF</button
        >
      </p>
    </div>
  </div>
</div>

{#if sub_on}
  <Sub />
{/if}

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <div style="width: 500px;">
        <canvas id="myChart" />
      </div>
      <button
        class="btn btn-primary"
        style="margin:20px;"
        on:click={() => {
          myChart.data.datasets[0].data = [0, 20, 5, 18, 0, 20];
          myChart.data.labels = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "X",
          ];
          myChart.update();
        }}
      >
        update
      </button>
    </div>
  </div>
</div>

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
  <h3>Ejemplo de tarea</h3>
  <div class="row">
    <div class="col">
      <button on:click={notificaciones}>notificaciones</button>
    </div>
  </div>
</div>

<style>
</style>
