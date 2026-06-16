import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import LoginView from '../views/LoginView.vue';
import SettingsView from '../views/SettingsView.vue';

export const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/login', name: 'login', component: LoginView },
];

export const router = createRouter({
  history: typeof window === 'undefined' ? createMemoryHistory() : createWebHistory(),
  routes,
});
