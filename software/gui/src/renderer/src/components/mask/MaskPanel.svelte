<script lang="ts">
  import { onDestroy } from 'svelte'

  type MaskImage = { id: number; file: File; src: string }

  export let onSelect: (file: File) => void = () => {}

  let images: MaskImage[] = []
  let selectedMask: MaskImage | undefined
  let nextId = 0
  let status = 'No masks uploaded.'
  let uploadFailed = false

  function addFiles(event: Event): void {
    const input = event.currentTarget as HTMLInputElement
    const files = Array.from(input.files ?? [])
    const pngFiles = files.filter((file) => file.type === 'image/png' || file.name.toLowerCase().endsWith('.png'))

    images = [...images, ...pngFiles.map((file) => ({ id: nextId++, file, src: URL.createObjectURL(file) }))]
    if (pngFiles.length > 0) {
      status = `${pngFiles.length} PNG file${pngFiles.length === 1 ? '' : 's'} added.`
      uploadFailed = false
    } else if (files.length > 0) {
      status = 'Only PNG images are supported.'
      uploadFailed = true
    }

    input.value = ''
  }

  function selectMask(mask: MaskImage): void {
    selectedMask = mask
    onSelect(mask.file)
    uploadFailed = false
    status = `${mask.file.name} selected.`
  }

  onDestroy(() => images.forEach((image) => URL.revokeObjectURL(image.src)))
</script>

<div class="mask-panel">
  <div class="panel-heading">
    <h2>Mask</h2>
    <label class="upload-button" for="home-mask-files">Upload</label>
    <input id="home-mask-files" type="file" accept="image/png,.png" multiple onchange={addFiles} />
  </div>

  <div class="mask-list" aria-label="Uploaded masks">
    {#each images as image (image.id)}
      <button
        class="mask-item"
        class:active={selectedMask?.id === image.id}
        type="button"
        aria-label={`Select ${image.file.name}`}
        aria-pressed={selectedMask?.id === image.id}
        onclick={() => selectMask(image)}
      >
        <img src={image.src} alt="" />
        <span>{image.file.name}</span>
      </button>
    {:else}
      <div class="empty">Upload PNG masks to see them here.</div>
    {/each}
  </div>

  <p class="status" class:failed={uploadFailed} aria-live="polite">{status}</p>
</div>

<style>
  .mask-panel {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }

  .panel-heading {
    display: flex;
    min-height: 26px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  h2 {
    color: #dbe5ed;
    font-size: 12px;
    font-weight: 500;
  }

  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .upload-button {
    display: inline-flex;
    min-height: 23px;
    align-items: center;
    padding: 0 9px;
    color: #dce6ed;
    cursor: pointer;
    border: 1px solid #63788a;
    background: #203246;
    font-size: 10px;
  }

  .upload-button:hover {
    background: #2a4055;
  }

  .mask-list {
    display: grid;
    min-height: 0;
    flex: 1;
    align-content: start;
    grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
    grid-auto-rows: max-content;
    gap: 7px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 6px;
    overscroll-behavior: contain;
  }

  .mask-list::-webkit-scrollbar {
    width: 7px;
  }

  .mask-list::-webkit-scrollbar-track {
    background: #101c29;
  }

  .mask-list::-webkit-scrollbar-thumb {
    border: 1px solid #101c29;
    background: #405568;
  }

  .mask-list::-webkit-scrollbar-thumb:hover {
    background: #60798f;
  }

  .mask-item {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    color: #c7d3dc;
    cursor: pointer;
    border: 1px solid #334354;
    background: #111f2e;
    text-align: left;
  }

  .mask-item.active {
    border-color: #79a8c4;
    background: #20384b;
  }

  .mask-item img {
    width: 100%;
    height: 65px;
    object-fit: contain;
    background: #0c1722;
  }

  .mask-item span {
    overflow: hidden;
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty,
  .status {
    color: #91a3b2;
    font-size: 9px;
  }

  .empty {
    grid-column: 1 / -1;
    padding-top: 8px;
  }

  .status {
    min-height: 13px;
    margin: 5px 0 0;
  }

  .status.failed {
    color: #d2aa68;
  }
</style>
