<script>
    export let serial_selected;
    export let speed_selected;
    import { onMount } from "svelte";

    onMount(() => {
        alert("ok");
    });
</script>

<span>
    hola {serial_selected} {speed_selected} 
</span>

<style>

</style>
