<template>
  <section class="page">
    <h1>Settings</h1>
    <div class="settings-list">
      <label>
        API base URL
        <input :value="apiBaseUrl || 'Not configured'" readonly />
      </label>
      <label>
        Build mode
        <input :value="mode" readonly />
      </label>
    </div>
  </section>
</template>

<script setup>
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const mode = import.meta.env.MODE;
</script>
