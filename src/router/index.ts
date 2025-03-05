import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Widget from '../views/CustomWidgetEditor.vue'
import WidgetPreview from '../views/CustomWidgetPreview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/widget',
      name: 'widget',
      component: Widget
    },
    {
      path: '/preview-widget',
      name: 'wigdet-preview',
      component: WidgetPreview
    }
  ]
})

export default router
