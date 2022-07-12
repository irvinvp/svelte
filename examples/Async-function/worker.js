console.log("worker.js ON");
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
      await new Promise(x => setTimeout(x, 5*1000));
      resultado = "OK";
      break;
  }
  postMessage({ resultado: resultado });
};
