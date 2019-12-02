
//本地静态路由
export const staticRouter = [
    
    {
        path: '/insideView',
        name: 'insideView',
        ico: "insideView",
        menuCode: "200",
        menuLevel: 1,
        menuName: "专病科研",
        menuOrder: null,
        menuPath: "/insideView",
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '专病科研',
            flag: 'insideView',
            belongToGroup: '',
            openMode: 1
        },
        component: r => require.ensure([], () => r(require('components/common/insideView/view')), 'insideView'),
        children: []
    },
    {
        path: '/',
        name: '/',
        redirect: '/index',
    },
    {
        path: '/notFind',
        name: 'notFind',
        meta: {
            requireAuth: true,
            isKeepAlive: true,
            txt: '找不到页面',
            flag: 'notFind',
            belongToGroup: '',
            openMode: 1
        },
        component: r => require.ensure([], () => r(require('packages/index/not-find')), 'notFind')
    }
]

// 初始化路由
let router = new VueRouter({
    routes: staticRouter
});


export default router