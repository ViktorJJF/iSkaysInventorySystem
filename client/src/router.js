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
        path: '/colores',
        name: 'colors',
        component: require('./views/drawerPages/colors.vue').default
    }, {
        path: '/productos/crear',
        name: 'addProduct',
        component: require('./views/drawerPages/addProduct.vue').default
    }, {
        path: '/productos/listado',
        name: 'listProduct',
        component: require('./views/drawerPages/inventory.vue').default
    }, {
        path: '/ventas/crear',
        name: 'addOrder',
        component: require('./views/drawerPages/addOrder.vue').default
    }, {
        path: '/ventas/historial',
        name: 'orderHistory',
        component: require('./views/drawerPages/orderHistory.vue').default
    }, {
        path: '/perfil-usuario',
        name: 'userProfile',
        component: require('./views/drawerPages/userProfile.vue').default
    }, {
        path: '/compras/crear',
        name: 'addPurchase',
        component: require('./views/drawerPages/addPurchase.vue').default
    }, {
        path: '/compras/historial',
        name: 'historyPurchase',
        component: require('./views/drawerPages/historyPurchase.vue').default
    }]
}];

const router = new Router({
    routes,
    mode: 'history'
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
                if (user.role == "ADMIN") {
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