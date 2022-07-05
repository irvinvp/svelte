<script>
  let name = "world";
  let lista = [
    { serial: 10, speed: 43 },
    { serial: 11, speed: 0 },
    { serial: 12, speed: 10 },
    { serial: 13, speed: 0 },
  ];
  let serial_selected;
</script>

<div class="container-fluid">
  <div class="row">
    <div class="col-3">
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
            <tr>
              <th
                style="color: {serial_selected == item.serial
                  ? 'red'
                  : 'black'};"
                >{item.serial} {serial_selected == item.serial ? "*" : ""}</th
              >
              <td>{item.speed}</td>
            </tr>
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
</div>

<style>
</style>
