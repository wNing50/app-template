<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <strong>App Template</strong>
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </aside>
    <main class="main-panel">
      <RouterView />
    </main>
  </div>
</template>
