console.log("worker.js ON");
let task_interval;
onmessage = async function (data) {
  let resultado = 0;
  switch (data.data.oper) {
    case "suma":
      resultado = parseInt(data.data.numero1) + parseInt(data.data.numero2);
      break;
    case "resta":
      resultado = parseInt(data.data.numero1) - parseInt(data.data.numero2);
      break;
    case "multi":
      resultado = parseInt(data.data.numero1) * parseInt(data.data.numero2);
      break;
    case "sleep":
      await new Promise((x) => setTimeout(x, 5 * 1000));
      resultado = "OK";
      break;
    // TASK
    case "run":
      try {
        clearInterval(task_interval);
      } catch (e) {}
      task_interval = setInterval(get_serial, 5 * 1000, data.data.serial);
      get_serial(data.data.serial);
      break;
    case "stop":
      try {
        clearInterval(task_interval);
      } catch (e) {}
      break;
  }
  postMessage({ type: "one_time", resultado: resultado });
};
let last = "";
async function get_serial(serial) {
  let response = await fetch("/api/v1/last_position?serial=" + serial);
  let commands = await response.json();
  if (last !== commands.message) {
    last = commands.message;
    postMessage({ type: "task", resultado: commands.message });
  }
}
