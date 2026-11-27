<script lang="ts">
  import type { ActivePage } from '../../types'

  export let activePage: ActivePage
  export let onNavigate: (page: ActivePage) => void
</script>

<aside class="sidebar" aria-label="Main navigation">
  <nav class="nav-links" aria-label="Pages">
    <button
      class:active={activePage === 'home'}
      class="nav-button"
      type="button"
      aria-label="Home"
      aria-current={activePage === 'home' ? 'page' : undefined}
      title="Home"
      onclick={() => onNavigate('home')}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3.5 10 8.5-7 8.5 7v10.5h-6v-6h-5v6h-6z" />
      </svg>
    </button>

    <button
      class:active={activePage === 'mask'}
      class="nav-button"
      type="button"
      aria-label="Mask"
      aria-current={activePage === 'mask' ? 'page' : undefined}
      title="Mask"
      onclick={() => onNavigate('mask')}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4.5h16v15H4z" />
        <path d="M7.5 8h9M7.5 11h9M7.5 14h5" />
        <circle cx="17" cy="15.5" r="1" />
      </svg>
    </button>
  </nav>

  <div class="sidebar-bottom">
    <button
      class:active={activePage === 'settings'}
      class="nav-button"
      type="button"
      aria-label="Settings"
      aria-current={activePage === 'settings' ? 'page' : undefined}
      title="Settings"
      onclick={() => onNavigate('settings')}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.8 3.5h4.4l.6 2.2a6.8 6.8 0 0 1 1.5.9l2.2-.7 2.2 3.8-1.6 1.7a7 7 0 0 1 0 1.8l1.6 1.7-2.2 3.8-2.2-.7a6.8 6.8 0 0 1-1.5.9l-.6 2.2H9.8l-.6-2.2a6.8 6.8 0 0 1-1.5-.9l-2.2.7-2.2-3.8 1.6-1.7a7 7 0 0 1 0-1.8L3.3 9.7l2.2-3.8 2.2.7a6.8 6.8 0 0 1 1.5-.9z" />
        <circle cx="12" cy="12.3" r="2.7" />
      </svg>
    </button>
  </div>
</aside>

<style>
  .sidebar {
    display: flex;
    flex: 0 0 64px;
    flex-direction: column;
    align-items: center;
    padding: 13px 0;
    background: #0b1522;
    border-right: 1px solid #344252;
  }

  .nav-links,
  .sidebar-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .sidebar-bottom {
    margin-top: auto;
  }

  .nav-button {
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    padding: 0;
    color: #9eacba;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0;
    background: transparent;
  }

  .nav-button:hover {
    background: #1a2a3c;
  }

  .nav-button.active {
    color: #e4edf4;
    border-color: #49647a;
    background: #21384c;
  }

  .nav-button:focus-visible {
    outline: 2px solid #79a8c4;
    outline-offset: 2px;
  }

  .nav-button svg {
    width: 19px;
    height: 19px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linecap: square;
    stroke-linejoin: miter;
  }
</style>
