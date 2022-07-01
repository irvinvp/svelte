# Svelte demo + Boostrap 5.1
Ejemplo de proyecto Svelte modificado para incluir Boostrap
## Pasos para realizar desarrollo
Instalar las librerias requeridas
```
npm install
```
Se debe configurar el puerto dentro de **rollup.config.js** que expone el sistema de autoreload
```
!production && livereload({ watch: "public", port: 3429, delay: 300 }),
```
Se debe configurar el puerto de escucha para el servidor HTTP dentro de **package.json**
```
"start": "sirv public --no-clear --host 0.0.0.0 --etag --cors --port 3428"
```
Finalmente para correr el servidor con liveload 
```
npm run dev
```
Una vez terminado para realizar el desarrollo final
```
npm run build
```
Copiar los archivos resultantes dentro de la carpeta **public**
