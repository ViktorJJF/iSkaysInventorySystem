import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

let routes = [{
    path: '/',
    component: require('./views/authPages/home.vue').default,
    meta: {
        guest: true
    },
    children: [{
        path: '',
        redirect: '/login'
    }, {
        path: '/login',
        name: 'login',
        component: require('./views/authPages/login.vue').default
    }]
}, {
    path: '/',
    component: require('./views/dashboard.vue').default,
    meta: {
        requiresAuth: true
    },
    name: "dashboard",
    redirect: {
        name: 'statistics'
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
}];

const router = new Router({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token') == null) {
            next({
                name: 'login',
                params: {
                    nextUrl: to.fullPath
                }
            })
        } else {
            let user = JSON.parse(localStorage.getItem('user'))
            if (to.matched.some(record => record.meta.requiresAuth)) {
                if (user.role == 1 || user.role == 2) {
                    next()
                } else {
                    next({
                        name: 'dashboard'
                    })
                }
            } else {
                next();
            }
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('token') == null) {
            next()
        } else {
            next({
                name: 'dashboard'
            })
        }
    } else {
        next();
    }
})

export default router;