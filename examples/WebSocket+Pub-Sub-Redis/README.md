# Ejemplo de WebSocket con Pub/Sub
El siguiente ejemplo permite que cada vez que se realiza una conexión por WS se genere una conexión a Redis que puede lanzar subscripciones 
a diferentes evento para recibir en vivo.

![WebSocket + Pub_Sub Redis](https://user-images.githubusercontent.com/10320683/182947601-e3c09ff9-a050-447f-ab60-d6fa25d74db5.png)

## Flujo interno de Pub/Sub
En este flujo se muestra como por una sola conexion TCP es posible enviar y recibir distintas subscripciones, que estan no causan mayores cargas debido
a la forma que gestionan las subscripciones sin guardar los datos.

![Pub_Sub Redis DB](https://user-images.githubusercontent.com/10320683/182956132-908f5f27-0e77-4992-ba3b-2bb4990a0ad8.png)


