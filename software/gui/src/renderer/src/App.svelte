<script lang="ts">
  import HomePage from './components/pages/HomePage.svelte'
  import Navbar from './components/layout/Navbar.svelte'
  import SettingsPage from './components/pages/SettingsPage.svelte'
  import type { ActivePage } from './types'

  let activePage: ActivePage = 'home'

  const pageCopy: Record<ActivePage, { title: string; description: string }> = {
    home: { title: 'Workspace', description: 'Lithography mask workspace.' },
    mask: { title: 'Mask', description: 'Lithography mask workspace.' },
    settings: { title: 'Settings', description: 'Application preferences.' }
  }

  function navigateTo(page: ActivePage): void {
    activePage = page
  }
</script>

<svelte:head>
  <title>Lithography Studio</title>
  <meta name="description" content="Lithography Studio workspace" />
</svelte:head>

<div class="app-shell">
  <Navbar {activePage} onNavigate={navigateTo} />

  <main class="main-area">
    {#if activePage === 'settings'}
      <header class="topbar">
        <div class="wordmark">LITHOGRAPHY STUDIO</div>
        <div class="topbar-meta">WORKSPACE&nbsp; / &nbsp;LOCAL</div>
      </header>
    {/if}

    <section class="workspace" class:home-workspace={activePage !== 'settings'} aria-live="polite">
      {#if activePage === 'settings'}
        <div class="page-heading">
          <div class="breadcrumbs">LITHOGRAPHY STUDIO&nbsp; / &nbsp;{activePage.toUpperCase()}</div>
          <h1>{pageCopy[activePage].title}</h1>
          <p>{pageCopy[activePage].description}</p>
        </div>
      {/if}

      {#if activePage !== 'settings'}
        <HomePage />
      {:else}
        <SettingsPage />
      {/if}

      {#if activePage === 'settings'}
        <footer class="page-footer">LITHOGRAPHY STUDIO <span>·</span> {activePage.toUpperCase()}</footer>
      {/if}
    </section>
  </main>
</div>

<style>
  .app-shell {
    display: flex;
    width: 100%;
    height: 100vh;
    min-height: 420px;
    overflow: hidden;
    background: var(--color-background);
  }

  .main-area {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }

  .topbar {
    display: flex;
    min-height: 58px;
    flex: 0 0 58px;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    border-bottom: 1px solid #344252;
  }

  .wordmark,
  .topbar-meta,
  .breadcrumbs,
  .page-footer {
    font-size: 10px;
    letter-spacing: 0.035em;
  }

  .wordmark {
    color: #dbe5ed;
    font-weight: 600;
  }

  .topbar-meta {
    color: #94a3b2;
  }

  .workspace {
    display: flex;
    width: min(100%, 980px);
    min-height: 0;
    flex: 1;
    flex-direction: column;
    align-self: center;
    padding: 40px clamp(26px, 6vw, 76px) 18px;
  }

  .home-workspace {
    width: 100%;
    align-self: stretch;
    padding: 12px;
  }

  .page-heading {
    margin-bottom: 32px;
  }

  .breadcrumbs {
    margin-bottom: 14px;
    color: #94a3b2;
  }

  h1 {
    color: #edf2f6;
    font-size: 27px;
    font-weight: 500;
    letter-spacing: -0.045em;
    line-height: 1.2;
  }

  .page-heading p {
    margin-top: 8px;
    color: #a6b2be;
    font-size: 12px;
  }

  .page-footer {
    display: flex;
    gap: 8px;
    margin-top: auto;
    padding-top: 12px;
    color: #7f8f9e;
    font-size: 9px;
    border-top: 1px solid #334354;
  }

  .page-footer span {
    color: #78a6c1;
  }

  @media (max-height: 620px) {
    .workspace {
      padding-top: 25px;
    }

    .page-heading {
      margin-bottom: 22px;
    }
  }

  @media (max-width: 700px) {
    .topbar {
      padding: 0 18px;
    }

    .workspace {
      padding-right: 22px;
      padding-left: 22px;
    }

    .workspace.home-workspace {
      padding: 12px;
    }
  }
</style>
