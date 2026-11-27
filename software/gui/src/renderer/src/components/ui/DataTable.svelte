<script lang="ts">
  export let rows: { label: string; value: string; meta: string; status?: boolean }[]
</script>

<div class="data-table">
  {#each rows as row}
    <div class="data-row">
      <span>{row.label}</span>
      <span class="value">{row.value}</span>
      <span class:status={row.status} class="meta">{row.meta}</span>
    </div>
  {/each}
</div>

<style>
  .data-table {
    width: 100%;
    border: 1px solid #455363;
    background: #152334;
  }

  .data-row {
    display: grid;
    min-height: 37px;
    grid-template-columns: minmax(120px, 1fr) minmax(100px, 2fr) 90px;
    align-items: center;
    gap: 12px;
    padding: 5px 11px;
    color: #bbc7d1;
    font-size: 11px;
  }

  .data-row + .data-row {
    border-top: 1px solid #334354;
  }

  .value {
    color: #e2eaf0;
  }

  .meta {
    justify-self: end;
    color: #8798a8;
    font-size: 9px;
  }

  .meta.status {
    color: #d2aa68;
  }

  @media (max-width: 700px) {
    .data-row {
      grid-template-columns: minmax(105px, 1fr) minmax(80px, 1.5fr) 75px;
      gap: 8px;
    }
  }
</style>
