console.log("worker.js ON");
onmessage = function (data) {
  let resultado = parseInt(data.data.numero1) + parseInt(data.data.numero2);
  postMessage({ resultado: resultado });
};
