<template>
  <section class="page">
    <h1>Dashboard</h1>
    <p class="muted">A quiet admin shell for product-specific operations.</p>
    <div class="metric-grid">
      <MetricCard label="API status" :value="status" />
      <MetricCard label="Environment" :value="mode" />
      <MetricCard label="Template" value="Full stack" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { apiGet } from '../api/client';
import MetricCard from '../components/MetricCard.vue';

const mode = import.meta.env.MODE;
const status = ref('Not checked');

onMounted(async () => {
  try {
    const result = await apiGet('/health');
    status.value = result.skipped ? 'Configure API' : 'Healthy';
  } catch {
    status.value = 'Unavailable';
  }
});
</script>
