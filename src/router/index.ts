import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS, STORAGE_KEYS } from '@/constants'
import NotesView from '@/views/NotesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CreateNoteView from '@/views/CreateNoteView.vue'
import EditNoteView from '@/views/EditNoteView.vue'
import NoteDetailView from '@/views/NoteDetailView.vue'

/**
 * Route definitions for Notes Tok application.
 * Each route specifies:
 * - `path`: URL pattern
 * - `name`: Named route identifier
 * - `component`: View component to render
 * - `meta`: Custom metadata flags (`requiresAuth`, `guestOnly`) for route guards
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: ROUTE_PATHS.HOME,
    redirect: ROUTE_PATHS.NOTES,
  },
  {
    path: ROUTE_PATHS.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: ROUTE_PATHS.REGISTER,
    name: ROUTE_NAMES.REGISTER,
    component: RegisterView,
    meta: { guestOnly: true },
  },
  {
    path: ROUTE_PATHS.NOTES,
    name: ROUTE_NAMES.NOTES,
    component: NotesView,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTE_PATHS.CREATE_NOTE,
    name: ROUTE_NAMES.CREATE_NOTE,
    component: CreateNoteView,
    meta: { requiresAuth: true },
  },
  {
    path: '/notes/:id',
    name: ROUTE_NAMES.NOTE_DETAIL,
    component: NoteDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/notes/:id/edit',
    name: ROUTE_NAMES.EDIT_NOTE,
    component: EditNoteView,
    meta: { requiresAuth: true },
  },
  {
    // Catch-all route for unmatched URLs - redirects to /notes
    path: '/:pathMatch(.*)*',
    redirect: ROUTE_PATHS.NOTES,
  },
]

/**
 * Vue Router instance configured with HTML5 history mode and scroll-to-top on route change.
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * Global Navigation Guard:
 * 1. Checks if the route requires authentication (`requiresAuth`) - redirects to /login if unauthenticated.
 * 2. Checks if route is for guests only (`guestOnly`) - redirects to /notes if already authenticated.
 * 3. Otherwise allows navigation to continue.
 */
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: ROUTE_NAMES.LOGIN })
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: ROUTE_NAMES.NOTES })
  } else {
    next()
  }
})

export default router
