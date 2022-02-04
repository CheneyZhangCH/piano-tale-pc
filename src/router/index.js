import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/course',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/course/index'),
        name: 'course',
        meta: { title: '课程分类', icon: 'list', noCache: true }
      }
    ]
  },

  {
    path: '/book',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/book/index'),
        name: 'book',
        meta: { title: '教材体系', icon: 'education', noCache: true }
      },
      {
        path: 'detail/:id',
        hidden: true,
        component: () => import('@/views/book/detail'),
        name: 'bookDetail',
        meta: { title: '教材详情', noCache: true }
      },
      {
        path: 'unit/add',
        hidden: true,
        component: () => import('@/views/book/unit/add'),
        name: 'unitAdd',
        meta: { title: '新增单元', noCache: true }
      }
    ]
  },

  {
    path: '/package',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/package/index'),
        name: 'package',
        meta: { title: '课程包', icon: 'component', noCache: true }
      }
    ]
  },

  {
    path: '/timetable',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/timetable/index'),
        name: 'package',
        meta: { title: '课表管理', icon: 'table', noCache: true }
      }
    ]
  },

  {
    path: '/account',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/index'),
        name: 'account',
        meta: { title: '账号管理', icon: 'peoples', noCache: true }
      }
    ]
  },

  {
    path: '/teacher-group',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/teacher-group/index'),
        name: 'teacherGroup',
        meta: { title: '老师分组', icon: 'tree-table', noCache: true }
      }
    ]
  },

  {
    path: '/others',
    component: Layout,
    redirect: '/others/dict',
    alwaysShow: true, // will always show the root menu
    name: 'others',
    meta: {
      title: '其他设置',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'dict',
        component: () => import('@/views/others/dict'),
        name: 'dict',
        meta: { title: '投诉原因', noCache: true }
      },
      {
        path: 'rules',
        component: () => import('@/views/others/rules'),
        name: 'rules',
        meta: { title: '续课规则', noCache: true }
      },
      {
        path: 'train',
        component: () => import('@/views/others/train'),
        name: 'trainTicket',
        meta: { title: '陪练券', noCache: true }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
