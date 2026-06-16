<template>
  <main class="home">
    <section class="hero">
      <p class="eyebrow">Full-stack starter</p>
      <h1>App Template</h1>
      <p class="lede">
        A deployable web entry for your product: public pages, legal docs,
        API config checks, and static build output are ready to customize.
      </p>
      <div class="actions">
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </div>
    </section>
    <section class="status">
      <span>API environment</span>
      <strong>{{ environment }}</strong>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { fetchPublicConfig } from '../api';

const environment = ref('Checking');

onMounted(async () => {
  try {
    const config = await fetchPublicConfig();
    environment.value = config.environment || 'Unknown';
  } catch {
    environment.value = 'Unavailable';
  }
});
</script>
