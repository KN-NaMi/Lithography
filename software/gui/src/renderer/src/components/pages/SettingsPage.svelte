<script lang="ts">
  import DataTable from '../ui/DataTable.svelte'

  const preferenceRows = [
    { label: 'Interface font', value: 'IBM Plex Mono', meta: 'CURRENT' },
    { label: 'Color scheme', value: 'Dark navy', meta: 'CURRENT' }
  ]
</script>

<section class="content-section" aria-labelledby="preferences-heading">
  <h2 id="preferences-heading">Preferences</h2>
  <DataTable rows={preferenceRows} />
</section>

<style>
  .content-section {
    margin-bottom: 30px;
  }

  h2 {
    margin-bottom: 9px;
    color: #dbe5ed;
    font-size: 13px;
    font-weight: 600;
  }
</style>
