<script lang="ts">
  import { onMount } from 'svelte'

  type Direction = 'y+' | 'x+' | 'y-' | 'x-'
  type RingStep = 1 | 10

  const stageApi = 'http://192.168.0.182:8000'
  let stepSize = 1
  let commandPreview = 'No direction selected'
  let clickedCommand = ''
  let feedbackTimeout: ReturnType<typeof setTimeout> | undefined
  let positionX: number | null = null
  let positionY: number | null = null
  let positionError = false
  let readingPosition = false
  let zeroing = false

  async function refreshPosition(): Promise<void> {
    if (readingPosition) return
    readingPosition = true

    try {
      const [responseX, responseY] = await Promise.all([
        fetch(`${stageApi}/stage/position/x`),
        fetch(`${stageApi}/stage/position/y`)
      ])
      if (!responseX.ok || !responseY.ok) throw new Error('Position request failed')

      const [{ position: x }, { position: y }] = await Promise.all([responseX.json(), responseY.json()])
      if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('Invalid position')
      positionX = x
      positionY = y
      positionError = false
    } catch {
      positionError = true
    } finally {
      readingPosition = false
    }
  }

  onMount(() => {
    void refreshPosition()
    const interval = setInterval(() => void refreshPosition(), 1000)
    return () => clearInterval(interval)
  })

  function flashCommand(command: string): void {
    if (feedbackTimeout) clearTimeout(feedbackTimeout)
    clickedCommand = command
    feedbackTimeout = setTimeout(() => {
      clickedCommand = ''
      feedbackTimeout = undefined
    }, 180)
  }

  function formatStep(value: number): string {
    return Number(value.toFixed(3)).toString()
  }

  function jog(direction: Direction, multiplier: RingStep): void {
    if (!Number.isFinite(stepSize) || stepSize <= 0) {
      commandPreview = 'Enter a step greater than 0'
      return
    }

    const amount = stepSize * multiplier
    const signedAmount = direction.endsWith('-') ? -amount : amount
    const axis = direction.startsWith('x') ? 'X' : 'Y'
    const axisKey = direction.startsWith('x') ? 'x' : 'y'

    flashCommand(`${direction}-${multiplier}`)
    commandPreview = `MOVE ${axis} ${formatStep(signedAmount)} μm`

    void window.electron.ipcRenderer
      .invoke('stage:move', axisKey, signedAmount)
      .then(() => {
        commandPreview = `SENT ${axis} ${formatStep(signedAmount)} μm`
      })
      .catch(() => {
        commandPreview = `FAILED ${axis} ${formatStep(signedAmount)} μm`
      })
  }

  function activateWithKeyboard(
    event: KeyboardEvent,
    direction: Direction,
    multiplier: RingStep
  ): void {
    if (event.repeat) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      jog(direction, multiplier)
    }
  }

  function goHome(): void {
    flashCommand('home')
    commandPreview = 'MOVING HOME…'

    void window.electron.ipcRenderer
      .invoke('stage:home')
      .then(() => {
        commandPreview = 'HOME COMPLETE'
      })
      .catch(() => {
        commandPreview = 'HOME FAILED'
      })
  }

  function setZeroPoint(): void {
    zeroing = true
    flashCommand('zero')
    commandPreview = 'MOVING TO 0.0…'

    void window.electron.ipcRenderer
      .invoke('stage:home')
      .then(() => {
        commandPreview = '0.0 POINT SET'
        void refreshPosition()
      })
      .catch(() => {
        commandPreview = 'ZERO POINT FAILED'
      })
      .finally(() => {
        zeroing = false
      })
  }

  function formatPosition(value: number | null): string {
    return value === null ? '—' : value.toFixed(3)
  }
</script>

<div class="motion-control">
  <svg class="jog-wheel" viewBox="0 0 320 320" role="group" aria-label="Motion jog wheel">
    <g
      class:clicked={clickedCommand === 'y+-10'}
      class="wheel-segment outer-segment"
      role="button"
      tabindex="0"
      aria-label="Move Y positive by ten steps"
      onclick={() => jog('y+', 10)}
      onkeydown={(event) => activateWithKeyboard(event, 'y+', 10)}
    >
      <path d="M54 54 A150 150 0 0 1 266 54 L234 86 A105 105 0 0 0 86 86 Z" />
    </g>
    <g
      class:clicked={clickedCommand === 'x+-10'}
      class="wheel-segment outer-segment"
      role="button"
      tabindex="0"
      aria-label="Move X positive by ten steps"
      onclick={() => jog('x+', 10)}
      onkeydown={(event) => activateWithKeyboard(event, 'x+', 10)}
    >
      <path d="M266 54 A150 150 0 0 1 266 266 L234 234 A105 105 0 0 0 234 86 Z" />
    </g>
    <g
      class:clicked={clickedCommand === 'y--10'}
      class="wheel-segment outer-segment"
      role="button"
      tabindex="0"
      aria-label="Move Y negative by ten steps"
      onclick={() => jog('y-', 10)}
      onkeydown={(event) => activateWithKeyboard(event, 'y-', 10)}
    >
      <path d="M266 266 A150 150 0 0 1 54 266 L86 234 A105 105 0 0 0 234 234 Z" />
    </g>
    <g
      class:clicked={clickedCommand === 'x--10'}
      class="wheel-segment outer-segment"
      role="button"
      tabindex="0"
      aria-label="Move X negative by ten steps"
      onclick={() => jog('x-', 10)}
      onkeydown={(event) => activateWithKeyboard(event, 'x-', 10)}
    >
      <path d="M54 266 A150 150 0 0 1 54 54 L86 86 A105 105 0 0 0 86 234 Z" />
    </g>

    <g
      class:clicked={clickedCommand === 'y+-1'}
      class="wheel-segment inner-segment"
      role="button"
      tabindex="0"
      aria-label="Move Y positive by one step"
      onclick={() => jog('y+', 1)}
      onkeydown={(event) => activateWithKeyboard(event, 'y+', 1)}
    >
      <path d="M86 86 A105 105 0 0 1 234 86 L201 119 A58 58 0 0 0 119 119 Z" />
      <text class="inner-multiplier" x="160" y="102">×1</text>
    </g>
    <g
      class:clicked={clickedCommand === 'x+-1'}
      class="wheel-segment inner-segment"
      role="button"
      tabindex="0"
      aria-label="Move X positive by one step"
      onclick={() => jog('x+', 1)}
      onkeydown={(event) => activateWithKeyboard(event, 'x+', 1)}
    >
      <path d="M234 86 A105 105 0 0 1 234 234 L201 201 A58 58 0 0 0 201 119 Z" />
      <text class="inner-multiplier" x="218" y="160">×1</text>
    </g>
    <g
      class:clicked={clickedCommand === 'y--1'}
      class="wheel-segment inner-segment"
      role="button"
      tabindex="0"
      aria-label="Move Y negative by one step"
      onclick={() => jog('y-', 1)}
      onkeydown={(event) => activateWithKeyboard(event, 'y-', 1)}
    >
      <path d="M234 234 A105 105 0 0 1 86 234 L119 201 A58 58 0 0 0 201 201 Z" />
      <text class="inner-multiplier" x="160" y="218">×1</text>
    </g>
    <g
      class:clicked={clickedCommand === 'x--1'}
      class="wheel-segment inner-segment"
      role="button"
      tabindex="0"
      aria-label="Move X negative by one step"
      onclick={() => jog('x-', 1)}
      onkeydown={(event) => activateWithKeyboard(event, 'x-', 1)}
    >
      <path d="M86 234 A105 105 0 0 1 86 86 L119 119 A58 58 0 0 0 119 201 Z" />
      <text class="inner-multiplier" x="102" y="160">×1</text>
    </g>

    <g class="outer-labels" aria-hidden="true">
        <text x="160" y="30">Y</text>
        <text class="multiplier-label" x="160" y="55">×10</text>
      <text x="290" y="160">X</text>
      <text class="multiplier-label" x="265" y="160">×10</text>
        <text x="160" y="290">−Y</text>
        <text class="multiplier-label" x="160" y="265">×10</text>
      <text x="30" y="160">−X</text>
      <text class="multiplier-label" x="55" y="160">×10</text>
    </g>

    <circle class="center-disc" cx="160" cy="160" r="37" />
    <g
      class:clicked={clickedCommand === 'home'}
      class="home-control"
      role="button"
      tabindex="0"
      aria-label="Go home"
      onclick={goHome}
      onkeydown={(event) => {
        if (event.repeat) return

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          goHome()
        }
      }}
    >
      <circle class="home-hit-area" cx="160" cy="160" r="36" />
      <path class="home-icon" d="m143 157 17-14 17 14v20h-11v-11h-12v11h-11z" />
    </g>
  </svg>

  <div class="step-panel">
    <label class="step-label" for="motion-step">Base step</label>
    <div class="step-input-wrap">
      <input id="motion-step" type="number" min="0.001" step="any" bind:value={stepSize} />
      <span>μm</span>
    </div>
    <p class="step-note">Inner ring: ×1<br />Outer ring: ×10</p>
    <div class="position-panel" aria-live="polite">
      <span class="position-title">Current position</span>
      <div class="position-value"><span>X</span><strong>{formatPosition(positionX)}</strong><span>μm</span></div>
      <div class="position-value"><span>Y</span><strong>{formatPosition(positionY)}</strong><span>μm</span></div>
      {#if positionError}<span class="position-error">Position unavailable</span>{/if}
    </div>
    <button class="zero-button" type="button" disabled={zeroing} onclick={setZeroPoint}>
      {zeroing ? 'Setting…' : 'Set 0.0'}
    </button>
  </div>

  <output class="command-preview" aria-live="polite">{commandPreview}</output>
</div>

<style>
  .motion-control {
    display: grid;
    min-height: 0;
    flex: 1;
    grid-template-columns: minmax(0, 1fr) minmax(120px, 140px);
    grid-template-rows: minmax(0, 1fr) auto;
    align-items: center;
    column-gap: clamp(18px, 3vw, 42px);
    row-gap: 4px;
    color: #bbc7d1;
  }

  .jog-wheel {
    display: block;
    width: clamp(190px, 18vw, 260px);
    max-height: 100%;
    grid-column: 1;
    grid-row: 1;
    align-self: center;
    justify-self: center;
    overflow: visible;
  }

  .wheel-segment {
    cursor: pointer;
    outline: none;
  }

  .wheel-segment path {
    stroke: #344354;
    stroke-width: 5;
    transition: fill 120ms ease-out;
  }

  .outer-segment path {
    fill: #263646;
  }

  .inner-segment path {
    fill: #1d2b3a;
  }

  .wheel-segment.clicked path {
    fill: #49647a;
  }

  .wheel-segment:focus-visible path {
    fill: #49647a;
  }

  .wheel-segment text {
    fill: #c8d2dc;
    font-family: inherit;
    font-size: 17px;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
  }

  .wheel-segment .inner-multiplier {
    fill: #aab8c4;
    font-size: 11px;
  }

  .outer-labels text {
    fill: #d4dde5;
    font-family: inherit;
    font-size: 17px;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
  }

  .outer-labels .multiplier-label {
    fill: #91a1af;
    font-size: 10px;
  }

  .center-disc {
    fill: #172433;
    stroke: #526273;
    stroke-width: 1;
    pointer-events: none;
  }

  .home-control {
    cursor: pointer;
    outline: none;
  }

  .home-icon {
    fill: none;
    stroke: #d7e0e8;
    stroke-width: 2;
    stroke-linejoin: round;
  }

  .home-hit-area {
    fill: transparent;
    pointer-events: all;
  }

  .home-control.clicked .home-icon {
    stroke: #9dc1d8;
  }

  .home-control:focus-visible .home-icon {
    stroke: #9dc1d8;
  }

  .command-preview {
    min-height: 11px;
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
    color: #91a3b2;
    font-size: 8px;
    text-align: center;
  }

  .step-panel {
    display: flex;
    width: 100%;
    grid-column: 2;
    grid-row: 1;
    justify-self: start;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .step-label {
    color: #c8d3dc;
    font-size: 10px;
  }

  .step-input-wrap {
    display: flex;
    height: 34px;
    align-items: center;
    border: 1px solid #465666;
    background: #111f2e;
  }

  input {
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 0 8px;
    color: #e2eaf0;
    font: inherit;
    font-size: 11px;
    border: 0;
    outline: 0;
    background: transparent;
  }

  .step-input-wrap span {
    padding-right: 8px;
    color: #8798a8;
    font-size: 9px;
  }

  .step-note {
    color: #8192a1;
    font-size: 8px;
    line-height: 1.6;
  }

  .position-panel {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 5px;
    border-top: 1px solid #334354;
  }

  .position-title {
    margin-bottom: 2px;
    color: #91a3b2;
    font-size: 9px;
  }

  .position-value {
    display: grid;
    grid-template-columns: 14px 1fr auto;
    align-items: baseline;
    gap: 5px;
    color: #91a3b2;
    font-size: 9px;
  }

  .position-value strong {
    color: #dbe5ed;
    font-size: 10px;
    font-weight: 500;
    text-align: right;
  }

  .position-error {
    color: #d2aa68;
    font-size: 8px;
  }

  .zero-button {
    min-height: 28px;
    padding: 0 8px;
    color: #dce6ed;
    cursor: pointer;
    border: 1px solid #63788a;
    background: #203246;
    font-size: 9px;
  }

  .zero-button:hover:not(:disabled) {
    background: #2a4055;
  }

  .zero-button:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  @media (max-width: 1100px) {
    .motion-control {
      grid-template-columns: minmax(0, 1fr) minmax(112px, 124px);
      gap: 12px;
    }

    .jog-wheel {
      width: clamp(160px, 17vw, 210px);
    }

    .step-panel {
      width: 100%;
    }
  }

  @media (max-width: 700px) {
    .motion-control {
      grid-template-columns: minmax(0, 1fr) 74px;
      gap: 8px;
    }

    .jog-wheel {
      width: min(100%, 154px);
    }

    .step-panel {
      width: 74px;
    }

    .step-label,
    .step-note {
      font-size: 8px;
    }

    .position-value strong {
      font-size: 8px;
    }

    input {
      padding: 0 4px;
      font-size: 10px;
    }

    .step-input-wrap span {
      padding-right: 4px;
      font-size: 8px;
    }
  }
</style>
