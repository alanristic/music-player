import { createRouter, createWebHistory } from 'vue-router'

// Importing the User store
import useUserStore from '@/stores/user'

// Instruct Vue to lazy-load these components only when they are needed (ie. when user navigates to them/that page that uses them)
const Home = () => import('@/views/HomeView.vue')
const About = () => import('@/views/AboutView.vue')
const Manage = () => import('@/views/ManageView.vue')
const NonExistingPage = () => import('@/views/NonExistingPageView.vue')
const SongView = () => import('@/views/SongView.vue')

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'manage',
    // alias: '/manage', // user stays on this, but internally it redirects to new path
    path: '/manage-music',
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log('Manage Router Guard')
      next()
    },
    meta: {
      requiresAuth: true // indicator that this route needs user to be authenticated (aka logged-in) for access
    }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView
  },
  {
    name: '404',
    path: '/404',
    component: NonExistingPage
  },
  {
    path: '/manage',
    redirect: { name: 'manage' } // a redirect, based on NAME property (instead of absolute URL specifying)
  },
  {
    path: '/:catchAll(.*)*', // NOTE: must be last
    redirect: { name: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500' // this is Global styling. Locally on by-element basis takes priority over this one
})

// NEXT must be called or this wil never release the url load to user
// This is a 'Global Guard'
router.beforeEach((from, to, next) => {
  console.log('Global Guard')
  // console.log(to.meta)
  // console.log(to, from)

  if (!to.meta.requiresAuth) {
    // this route doesn't require authenticated user...we let user trough
    next()
    return
  }

  const userStore = useUserStore()

  if (userStore.userLoggedIn) {
    // User is authenticated, so they can proceed
    next()
  } else {
    // User is not autheneticated, so we redirect hem to homepage
    next({ name: 'home' })
  }
})

export default router
