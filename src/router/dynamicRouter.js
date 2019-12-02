import menuList from '../../static/menuConfig'
import store from '../store/index';
import router from './router'
import utils from 'components/utils';
import {staticRouter} from  './router'

//内页路由
let insideView = staticRouter.find(li=>{
    return li.name == 'insideView';
})
//动态生成路由
let dynamicRouter = [];
menuList.forEach(item=>{
    if(item.componentPath) {
        if(item.meta.openMode === 2) {
            console.log(2)
            console.log(item)
            insideView.children.push({
                path: item.menuPath,
                name: item.menuPath.split('/')[1],
                menuCode: item.menuCode,
                menuLevel: item.menuLevel,
                menuName: item.menuName,
                menuOrder: item.menuOrder,
                menuPath: item.menuPath,
                superiorMenu: item.superiorMenu,
                meta: {
                    requireAuth: item.meta.requireAuth,
                    isKeepAlive: item.meta.isKeepAlive,
                    showMenuList: item.meta.showMenuList,
                    title: item.meta.title,
                    flag: item.meta.flag,
                    belongToGroup: item.meta.belongToGroup,
                    openMode: item.meta.openMode,
                },
                component: resolve => require([`src/pages/index/packages${item.componentPath}`], resolve)
            })
        }else {
            console.log(1)
            console.log(item)
            dynamicRouter.push({
                path: item.menuPath,
                name: item.menuPath.split('/')[1],
                menuCode: item.menuCode,
                menuLevel: item.menuLevel,
                menuName: item.menuName,
                menuOrder: item.menuOrder,
                menuPath: item.menuPath,
                superiorMenu: item.superiorMenu,
                meta: {
                    requireAuth: item.meta.requireAuth,
                    isKeepAlive: item.meta.isKeepAlive,
                    showMenuList: item.meta.showMenuList,
                    title: item.meta.title,
                    flag: item.meta.flag,
                    belongToGroup: item.meta.belongToGroup,
                    openMode: item.meta.openMode,
                },
                component: resolve => require([`src/pages/index/packages${item.componentPath}`], resolve)
            })
        }
    }
})

console.log('====================动态生成的路由==============')
console.log(dynamicRouter)
console.log(staticRouter)
console.log(utils.translateDataToTree(menuList))

store.commit({
    type: 'saveMenuList',
    params: utils.translateDataToTree(menuList)
});

const addDynamicRouter = function() {
    router.addRoutes(dynamicRouter.concat([{
        path: '*',
        redirect:"/notFind"}
    ]));
}

addDynamicRouter();