<script lang="ts">
  import { onMount } from 'svelte'

  const cameraUrl = 'http://192.168.0.182:8000/camera/preview'

  let loaded = false
  let unavailable = false
  let loadTimeout: ReturnType<typeof setTimeout> | undefined

  onMount(() => {
    loadTimeout = setTimeout(() => {
      if (!loaded) unavailable = true
    }, 4000)

    return () => {
      if (loadTimeout) clearTimeout(loadTimeout)
    }
  })

  function handleLoad(): void {
    loaded = true
    unavailable = false
    if (loadTimeout) clearTimeout(loadTimeout)
  }

  function handleError(): void {
    unavailable = true
    if (loadTimeout) clearTimeout(loadTimeout)
  }
</script>

<div class="camera-view">
  <img
    class:unavailable
    src={cameraUrl}
    alt="Live camera view"
    onload={handleLoad}
    onerror={handleError}
  />
  {#if unavailable}
    <div class="camera-message">No camera</div>
  {:else if !loaded}
    <div class="camera-message">Loading image…</div>
  {/if}
</div>

<style>
  .camera-view {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 0;
    flex: 1;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-top: 8px;
    background: #101c29;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  img.unavailable {
    display: none;
  }

  .camera-message {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: #91a3b2;
    font-size: 11px;
    pointer-events: none;
  }
</style>
