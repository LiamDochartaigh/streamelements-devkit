import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Widget from '@/views/CustomWidgetEditor.vue'
import WidgetPreview from '@/views/CustomWidget.vue'

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
      name: 'preview-widget',
      component: WidgetPreview
    }
  ]
})

export default router
