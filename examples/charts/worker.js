console.log("worker.js ON");
let task_interval;
let task_interval_2;
let notif = false;
onmessage = async function (data) {
  let resultado = 0;
  switch (data.data.oper) {
    case "end":
      try {
        clearInterval(task_interval);
      } catch (e) {}
      try {
        clearInterval(task_interval_2);
      } catch (e) {}
      close();
    break;
    case "notif":
      notif = data.data.state;
    break;
    case "suma":
      resultado = parseInt(data.data.numero1) + parseInt(data.data.numero2);
      if (notif) {
        new Notification("Suma", { body: resultado });
      }
      break;
    case "resta":
      resultado = parseInt(data.data.numero1) - parseInt(data.data.numero2);
      if (notif) {
        new Notification("Resta", { body: resultado });
      }
      break;
    case "multi":
      resultado = parseInt(data.data.numero1) * parseInt(data.data.numero2);
      if (notif) {
        new Notification("Multiplicación", { body: resultado });
      }
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

      try {
        clearInterval(task_interval_2);
      } catch (e) {}
      task_interval_2 = setInterval(get_type, 5 * 1000, data.data.serial);
      get_type(data.data.serial);
      break;
    case "stop":
      try {
        clearInterval(task_interval);
      } catch (e) {}
      try {
        clearInterval(task_interval_2);
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
    if (notif) {
      new Notification("Ultima posicion", { body: commands.message });
    }
    last = commands.message;
    postMessage({ type: "task", resultado: commands.message });
  }
}
let last_type = "";
async function get_type(serial) {
  let response = await fetch("/api/v1/last_type?serial=" + serial);
  let commands = await response.json();
  if (last_type !== commands.message) {
    last_type = commands.message;
    postMessage({ type: "task2", resultado: commands.message });
  }
}
