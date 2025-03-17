<script>
    import { app } from "$lib/app.svelte"
    let { voiceNumber } = $props()
</script>

<div class='container'>
    <div>Sawtooth: {voiceNumber}</div>
    <div>
        Frequency
        <input type="number" bind:value={app.indices[voiceNumber]}>
    </div>
    <div class='range-control'>
        Amp
        <input type="range" min=-60 max=0 bind:value={app.amps[voiceNumber]}>
        { app.amps[voiceNumber] }
    </div>
    <div class='range-control'>
        Filter
        <input type="range" min=30 max=2500 bind:value={app.filterFreqs[voiceNumber]}>
        { app.filterFreqs[voiceNumber] }
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 350px;
        gap: 0.5em;
        flex-grow: 0;
        border: 1px solid grey;
        padding: 1em;
    }

    .range-control {
        display: flex;
        flex-direction: row;
    }
</style>