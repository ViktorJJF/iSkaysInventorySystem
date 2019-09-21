import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        component: require('./views/dashboard.vue').default,
        redirect: {
            name: 'brand'
        },
        children: [{
            path: '/estadisticas',
            name: 'statistics',
            component: require('./views/drawerPages/statistics.vue').default
        }, {
            path: '/marcas',
            name: 'brand',
            component: require('./views/drawerPages/brands.vue').default
        }, {
            path: '/tipos',
            name: 'type',
            component: require('./views/drawerPages/types.vue').default
        }, {
            path: '/productos/crear',
            name: 'addProduct',
            component: require('./views/drawerPages/addProduct.vue').default
        }, {
            path: '/productos/listado',
            name: 'listProduct',
            component: require('./views/drawerPages/listProducts.vue').default
        }, {
            path: '/ordenes/crear',
            name: 'addOrder',
            component: require('./views/drawerPages/addOrder.vue').default
        }, {
            path: '/ordenes/historial',
            name: 'orderHistory',
            component: require('./views/drawerPages/orderHistory.vue').default
        }]
    }]
})