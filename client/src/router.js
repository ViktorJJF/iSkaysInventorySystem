import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import {
    isLogged
} from "./tools/isLogged";

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

router.beforeEach(async (to, from, next) => {
    if (!store.state.user) {
        let loginStatus = await isLogged();
        if (loginStatus) {
            store.state.user = loginStatus.user;
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.user) {
            next({
                name: 'login',
                params: {
                    nextUrl: to.fullPath
                }
            })
        } else {
            let user = store.state.user;
            if (to.matched.some(record => record.meta.requiresAuth)) {
                if (user.role == "ADMIN") {
                    next();
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
        if (store.state.user == null) {
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