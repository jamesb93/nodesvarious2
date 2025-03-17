<script>
    import * as RNBO from "@rnbo/js"
    import { app } from "$lib/app.svelte"
    import { createDeviceInstance } from '../lib/common/helpers';
    import Voice from '../lib/components/Voice.svelte';
    import { onMount } from 'svelte';
    
    let context = null
    
    async function start() {
      context.resume()
    }
    
    function syncAllParameters() {
      if (!app.device) return;
      
      app.device.scheduleEvent(new RNBO.MessageEvent(
        RNBO.TimeNow,
        "index",
        [...app.indices]
      ));
      
      app.device.scheduleEvent(new RNBO.MessageEvent(
        RNBO.TimeNow,
        "amps",
        [...app.amps]
      ));
      
      app.device.scheduleEvent(new RNBO.MessageEvent(
        RNBO.TimeNow,
        "filter_freq",
        [...app.filterFreqs]
      ));
      
      app.device.scheduleEvent(new RNBO.MessageEvent(
        RNBO.TimeNow,
        "ramp_time",
        app.rampTime
      ));
      
      console.log("All parameters synchronized with device");
    }
    
    onMount(async() => {
      context = new AudioContext();
      const output = context.createGain().connect(context.destination);
      
      app.device = await createDeviceInstance("/nodesvarious.export.json", context, output);
      
      syncAllParameters();
    });
    
    $effect(() => {
      const data = [...app.indices]
      const event = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "index",
        data
      )
      if (app.device) {
        app.device.scheduleEvent(event)
      }
    });
    
    $effect(() => {
      const data = [...app.amps]
      const event = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "amps",
        data
      )
      if (app.device) {
        app.device.scheduleEvent(event)
      }
    });
    
    $effect(() => {
      const data = [...app.filterFreqs]
      const event = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "filter_freq",
        data
      )
      if (app.device) {
        app.device.scheduleEvent(event)
      }
    });
    
    $effect(() => {
      const rampTime = $state.snapshot(app.rampTime)
      console.log(rampTime)
      const event = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "ramp_time",
        rampTime
      )
      if (app.device) {
        app.device.scheduleEvent(event)
      }
    });
   </script>
   
   <main>
     <button onclick={start}>start</button>
     <p>
       Frequency values are defined as a lookup index of a table containing multiples of 2, 3, 5 up to the 78th possible enumation of this pattern.
     </p>
     <div class="voices">
       {#each Array.from({length: 5}) as _, i}
         <Voice voiceNumber={i}></Voice>
       {/each}
     </div>
     <div class='ramp-time'>
       Ramp Time
       { app.rampTime }
       ms
       <input type="range" min=100 max=10000 bind:value={app.rampTime}>
     </div>
   </main>
   
   <style>
     main {
       max-width: 800px;
       margin: 0 auto;
     }
     .voices {
       display: flex;
       flex-direction: row;
       flex-wrap: wrap;
       gap: 1em;
     }
     .ramp-time {
       display: flex;
       flex-direction: row;
       gap: 0.5em;
       align-items: center;
     }
   </style>