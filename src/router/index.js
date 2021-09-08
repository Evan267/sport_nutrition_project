import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'LogIn',
    component: () => import('../components/user/LogIn'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../components/user/SignUp'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../components/user/User'),
  },
  {
    path: '/musculation',
    name: 'Musculation',
    component: () => import('../views/Musculation.vue'),
    children: [
      {
        name: "objectifMuscu",
        path: '/musculation/objectif',
        component: () => import("../components/musculation/Objectif")
      },
      {
        name: "createExercice",
        path: '/musculation/createExercice',
        component: () => import("../components/musculation/CreateExercice")
      },
      {
        name: "program",
        path: '/musculation',
        component: () => import("../components/musculation/Program")
      }
    ]
  },
  {
    path: '/nutrition',
    name: 'Nutrition',
    component: () => import('../views/Nutrition.vue'),
    children: [
      {
        name: "objectif",
        path: '/nutrition/objectif',
        component: () => import("../components/nutrition/Objectif")
      },
      {
        name: "createAliment",
        path: '/nutrition/createAliment',
        component: () => import("../components/nutrition/CreateAliment")
      },
      {
        name: "meal",
        path: '/nutrition',
        component: () => import("../components/nutrition/Meal")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "active"
})

export default router
