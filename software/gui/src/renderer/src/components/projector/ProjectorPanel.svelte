<script lang="ts">
  import exposureEndImage from '../../assets/exposure-end.png'

  export let selectedMask: File | undefined

  const apiBase = 'http://192.168.0.182:8000'
  let exposureTime = 1
  let busy = false
  let exposureRunning = false
  let status = ''
  let failed = false

  async function postMask(file: File): Promise<void> {
    const form = new FormData()
    form.append('mask', file)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(`${apiBase}/mask/`, {
        method: 'POST',
        body: form,
        signal: controller.signal
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
    } finally {
      clearTimeout(timeout)
    }
  }

  async function displayMask(): Promise<void> {
    if (!selectedMask) {
      status = 'Select a mask first.'
      failed = true
      return
    }

    busy = true
    status = `Sending ${selectedMask.name}…`
    failed = false
    try {
      await postMask(selectedMask)
      status = 'Mask sent to projector.'
    } catch {
      status = 'Could not send mask. Check the API connection.'
      failed = true
    } finally {
      busy = false
    }
  }

  async function createExposureEndMask(): Promise<File> {
    const response = await fetch(exposureEndImage)
    if (!response.ok) throw new Error('Could not load exposure end image')
    const blob = await response.blob()
    return new File([blob], 'exposure-end.png', { type: 'image/png' })
  }

  async function startExposure(): Promise<void> {
    if (!selectedMask) {
      status = 'Select a mask first.'
      failed = true
      return
    }

    const duration = Number(exposureTime)
    if (!Number.isFinite(duration) || duration <= 0) {
      status = 'Enter an exposure time greater than 0 seconds.'
      failed = true
      return
    }

    const maskForExposure = selectedMask
    busy = true
    exposureRunning = false
    failed = false
    status = `Sending ${maskForExposure.name}…`

    try {
      await postMask(maskForExposure)
    } catch {
      status = 'Could not start exposure. Check the API connection.'
      failed = true
      busy = false
      return
    }

    exposureRunning = true
    status = `Exposure in progress · ${duration} sec`
    await new Promise((resolve) => setTimeout(resolve, duration * 1000))
    status = 'Sending exposure end image…'

    try {
      const endMask = await createExposureEndMask()
      await postMask(endMask)
      status = 'Exposure complete. End image sent.'
    } catch {
      status = 'Exposure ended, but the end image could not be sent.'
      failed = true
    } finally {
      busy = false
      exposureRunning = false
    }
  }
</script>

<div class="projector-panel">
  <h2>Projector</h2>

  <div class="projector-controls">
    <button class="action-button display-button" type="button" disabled={busy} onclick={displayMask}>
      {busy ? (exposureRunning ? 'Exposing…' : 'Sending…') : 'Display Mask'}
    </button>

    <div class="exposure-control">
      <label for="exposure-time">Exposure Time</label>
      <div class="exposure-input-row">
        <input id="exposure-time" type="number" min="0.1" step="0.1" disabled={busy} bind:value={exposureTime} />
        <span>sec</span>
      </div>
      <button class="action-button" type="button" disabled={busy} onclick={startExposure}>
        {busy ? (exposureRunning ? 'Exposing…' : 'Sending…') : 'Start Exposure'}
      </button>
    </div>
  </div>
  <p class="status" class:failed aria-live="polite">{status}</p>
</div>

<style>
  .projector-panel {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
  }

  h2 {
    margin-bottom: 12px;
    color: #dbe5ed;
    font-size: 12px;
    font-weight: 500;
  }

  .projector-controls {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
  }

  .exposure-control {
    display: flex;
    min-width: 140px;
    flex-direction: column;
    gap: 6px;
  }

  label,
  .exposure-input-row span {
    color: #91a3b2;
    font-size: 9px;
  }

  .exposure-input-row {
    display: flex;
    height: 30px;
    align-items: center;
    border: 1px solid #455363;
    background: #101c29;
  }

  input {
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 0 8px;
    color: #dbe5ed;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: 10px;
  }

  .exposure-input-row span {
    padding-right: 8px;
  }

  .action-button {
    min-height: 30px;
    padding: 0 10px;
    color: #dce6ed;
    cursor: pointer;
    border: 1px solid #63788a;
    background: #203246;
    font-size: 9px;
  }

  .action-button:hover {
    background: #2a4055;
  }

  .display-button {
    margin-top: 17px;
  }

  .action-button:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  .status {
    min-height: 13px;
    margin: 8px 0 0;
    color: #91a3b2;
    font-size: 9px;
  }

  .status.failed {
    color: #d2aa68;
  }
</style>
