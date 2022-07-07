<script>
  import Sub from './Sub.svelte';
  let name = "world";
  let lista = [
    { serial: 10, speed: 43 },
    { serial: 11, speed: 0 },
    { serial: 12, speed: 10 },
    { serial: 13, speed: 0 },
  ];
  let serial_selected = "";
  $: {
    if (serial_selected.length > 10) {
      serial_selected = serial_selected.substring(0, 10);
      alert("ok");
    }
  }
  let serial_click = "Ninguno";
  function click(x) {
    serial_click = x;
  }
  let speed_selected = "";
</script>

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h1>Hello {name}!!</h1>
      <table class="table">
        <thead>
          <tr>
            <th scope="row">Serial</th>
            <th>Speed</th>
          </tr>
        </thead>
        <tbody>
          {#each lista as item}
            {#if item.speed > speed_selected || speed_selected == "" || speed_selected == 0}
              <tr>
                <th
                  style="color: {serial_selected == item.serial
                    ? 'red'
                    : 'black'};"
                >
                  <span
                    on:click|preventDefault={() => {
                      click(item.serial);
                    }}
                  >
                    {item.serial}
                    {serial_selected == item.serial ? "*" : ""}
                  </span>
                </th>
                <td style="color: {item.speed > 0 ? 'red' : 'black'}"
                  >{item.speed} {item.speed > 0 ? "(overspeed)" : ""}</td
                >
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <input type="text" bind:value={serial_selected} />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <input type="text" bind:value={speed_selected} />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <span>Ultimo clic: <strong>{serial_click}</strong></span>
    </div>
  </div>
  {#if speed_selected=="10"}
    <Sub {serial_selected} {speed_selected} />
  {/if}
</div>

<style>
</style>
