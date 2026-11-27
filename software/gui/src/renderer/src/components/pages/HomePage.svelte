<script lang="ts">
  import CameraView from '../camera/CameraView.svelte'
  import JogControl from '../motion/JogControl.svelte'
  import MaskPanel from '../mask/MaskPanel.svelte'
  import ProjectorPanel from '../projector/ProjectorPanel.svelte'

  let selectedMask: File | undefined
</script>

<div class="home-grid">
  <section class="home-tile camera-tile" aria-label="Camera">
    <h2>Camera</h2>
    <CameraView />
  </section>
  <section class="home-tile motion-tile" aria-label="Motion">
    <h2>Motion</h2>
    <JogControl />
  </section>
  <section class="home-tile mask-tile" aria-label="Mask">
    <MaskPanel onSelect={(file) => (selectedMask = file)} />
  </section>
  <section class="home-tile projector-tile" aria-label="Projector">
    <ProjectorPanel {selectedMask} />
  </section>
</div>

<style>
  .home-grid {
    display: grid;
    flex: 1;
    min-height: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(150px, 1fr));
    gap: 12px;
  }

  .home-tile {
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid #455363;
    background: #152334;
  }

  .motion-tile {
    display: flex;
    flex-direction: column;
  }

  .camera-tile {
    display: flex;
    flex-direction: column;
  }

  .mask-tile {
    display: flex;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
  }

  .projector-tile {
    display: flex;
    min-height: 0;
    flex-direction: column;
  }

  .motion-tile h2 {
    flex: 0 0 auto;
  }

  h2 {
    color: #dbe5ed;
    font-size: 12px;
    font-weight: 500;
  }

  @media (max-width: 700px) {
    .home-grid {
      grid-template-rows: repeat(2, minmax(125px, 1fr));
      gap: 8px;
    }

    .home-tile {
      padding: 10px;
    }
  }
</style>
