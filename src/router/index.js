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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: '首页',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      },
      {
        path: 'dashboard2',
        name: '统计',
        component: () => import('@/views/dashboard/PanelGroup'),
        meta: { title: '统计', icon: 'dashboard' }
      }
    ]
  },

  // 景点管理模块
  {
    path: '/scenic',
    component: Layout,
    redirect: '/scenic/scenic',
    name: '景点管理',
    meta: { title: '景点管理', icon: '景点' },
    children: [
      {
        path: 'scenic',
        name: '景点列表',
        component: () => import('@/views/scenic/ScenicList'),
        meta: { title: '景点列表', icon: 'table' }
      },
      {
        path: 'publish/baseInfo',
        name: '景点基本信息添加',
        component: () => import('@/views/scenic/publish/ScenicBaseInfo'),
        meta: { title: '发布景点', icon: 'table' }
        // hidden: true
      },
      {
        path: 'publish/baseInfo/:id',
        name: '景点基本信息修改',
        component: () => import('@/views/scenic/publish/ScenicBaseInfo'),
        meta: { title: '发布景点', icon: 'table' },
        hidden: true
      },
      {
        path: 'publish/description/:id',
        name: '景点描述信息',
        component: () => import('@/views/scenic/publish/ScenicDescription'),
        meta: { title: '景点描述信息', icon: 'table', noCache: true },
        hidden: true
      },
      {
        path: 'publish/tips/:id',
        // path: 'publish/tips/445ca83ab2594e2f921992b6a811b336',
        name: '景点提示信息',
        component: () => import('@/views/scenic/publish/ScenicTips'),
        meta: { title: '景点提示信息', icon: 'table', noCache: true },
        hidden: true
      },
      {
        path: 'publish/price/:id',
        // path: 'publish/price/445ca83ab2594e2f921992b6a811b336',
        name: '景点价格信息',
        component: () => import('@/views/scenic/publish/ScenicPrice'),
        meta: { title: '景点价格信息', icon: 'table', noCache: true },
        hidden: true
      },
      {
        path: 'city',
        name: '城市列表',
        component: () => import('@/views/scenic/CityList'),
        meta: { title: '城市列表', icon: 'tree' }
      },
      {
        path: 'hotel',
        name: '酒店管理',
        component: () => import('@/views/scenic/HotelList'),
        meta: { title: '酒店管理', icon: 'tree' }
      }
    ]
  },
  // 用户管理
  {
    path: '/member',
    component: Layout,
    redirect: '/member/list',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: '用户列表',
        component: () => import('@/views/member/list'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'history',
        name: '历史记录',
        component: () => import('@/views/member/History'),
        meta: { title: '历史记录', icon: 'table' }
      },
      {
        path: 'comment',
        name: '评论管理',
        component: () => import('@/views/member/Comment'),
        meta: { title: '评论管理', icon: 'table' }
      }
    ]
  },

  // 文章管理
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: '文章管理',
    meta: { title: '文章管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: '文章列表',
        component: () => import('@/views/article/ArticleList'),
        meta: { title: '文章列表', icon: 'table' }
      },
      {
        path: 'images',
        name: '图片管理',
        component: () => import('@/views/article/ImageList'),
        meta: { title: '图片管理', icon: 'table' }
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
