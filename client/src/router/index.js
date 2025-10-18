import { createRouter, createWebHistory } from 'vue-router';
import AnimalsList from '../views/AnimalsList.vue';
import AnimalDetails from '../views/AnimalDetails.vue';

const routes = [
  {
    path: '/',
    name: 'AnimalsList',
    component: AnimalsList
  },
  {
    path: '/animal/:id',
    name: 'AnimalDetails',
    component: AnimalDetails,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
