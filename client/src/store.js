import Vue from 'vue'
import Vuex from 'vuex'
//plugins
import Axios from 'axios'
Vue.prototype.$http = Axios;


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || {},
        snackbar: {
            text: '',
            active: false,
            color: 'success'
        },
        toolbar: {
            drawerIcon: null,
        },
        overlay: {
            active: false,
            text: ''
        },
        products: [{
            id: 1,
            type: "PANTALLA",
            brand: "SAMSUNG",
            model: "A5 2017 AMOLED",
            color: "NEGRO",
            stock: 15,
            price: 260,
            description: ""
        }, {
            id: 2,
            type: "PANTALLA 2",
            brand: "SAMSUNG",
            model: "A6 PLUS / A6+ / A605",
            color: "NEGRO",
            stock: 1,
            price: 280,
            description: ""
        }, {
            id: 2,
            type: "PANTALLA 2",
            brand: "HUAWEI",
            model: "A6 PLUS / A6+ / A605",
            color: "NEGRO",
            stock: 3,
            price: 280,
            description: ""
        }],
        types: [{
                name: "PANTALLA",
                description: "",
                status: 1,
                createdAt: Date.now()
            },
            {
                name: "PANTALLA 2",
                description: "",
                status: 0,
                createdAt: Date.now()
            }
        ],
        brands: [{
                name: "SAMSUNG",
                description: "",
                status: 1,
                createdAt: Date.now()
            },
            {
                name: "HUAWEI",
                description: "",
                status: 1,
                createdAt: Date.now()
            },
            {
                name: "LG",
                description: "",
                status: 1,
                createdAt: Date.now()
            },
            {
                name: "MOTOROLA",
                description: "",
                status: 1,
                createdAt: Date.now()
            },
            {
                name: "NOKIA",
                description: "",
                status: 0,
                createdAt: Date.now()
            }
        ],
        colors: ["NEGRO", "LCD", "BLANCO", "DORADO", "AZUL"],
    },
    mutations: {
        updateMasterPoints(state, qty) {
            state.masterPoints += qty;
        },
        logout(state) {
            state.status = '';
            state.token = '';
            state.loggingIn = false;
        },
        auth_success(state, {
            token,
            user
        }) {
            state.status = 'success';
            state.token = token;
            state.user = user;
            state.loggingIn = true;
        },
        auth_error(state) {
            state.status = 'error'
        },
        showSnackbar(state, {
            text,
            color
        }) {
            state.snackbar.text = text;
            state.snackbar.color = color;
            state.snackbar.active = true;
        },
        initialLoad(state) {
            state.loggingIn = true;
            state.loggingIn = true;
        },
        showOverlay(state, {
            active,
            text
        }) {
            state.overlay.active = active;
            state.overlay.text = text;
        }

    },
    actions: {
        logout({
            commit
        }) {
            commit('logout');
            localStorage.removeItem('token');
            // delete axios.defaults.headers.common['Authorization'];
        },
        showSnackbar({
            commit
        }, {
            text,
            color
        }) {
            commit('showSnackbar', {
                text,
                color
            });
        },
        showOverlay({
            commit
        }, {
            active,
            text
        }) {
            commit('showOverlay', {
                active,
                text
            });
        },
        updateMasterPoints({
            commit
        }, qty) {
            commit('updateMasterPoints', qty);
        },
        login({
            commit
        }, user) {
            return new Promise((resolve, reject) => {
                if (user.email != "admin@gmail.com" || user.password != "123456") {
                    reject("Usuario o contraseña incorrectos");
                } else {
                    let user = {
                        firstName: "Administrador",
                        lastName: "Fulltec",
                        email: "admin@gmail.com",
                        role: 1
                    };
                    let token = "fsajfiusjdfuisdiufhsuaf"
                    commit('auth_success', {
                        token,
                        user
                    });
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    resolve("Bienvenido");
                }

                // commit('auth_request');
                // axios
                //     .post("/api/login", {
                //         email: user.email,
                //         password: user.password
                //     })
                //     .then(res => {
                //         if (res.data.ok) {
                //             console.log(res.data);
                //             const token = res.data.token;
                //             const user = res.data.payload;
                //             localStorage.clear();
                //             localStorage.setItem("token", token);
                //             localStorage.setItem("user", JSON.stringify(user));
                //             axios.defaults.headers.common['Authorization'] = token
                //             commit('auth_success', {
                //                 token,
                //                 user
                //             });
                //             resolve(res.data.message);
                //         }
                //     })
                //     .catch(err => {
                //         commit('auth_error');
                //         localStorage.removeItem('token');
                //         localStorage.removeItem('user');
                //         if (err.response) {
                //             console.error(err.response.data);
                //             reject(err);
                //         }
                //     });
            })
        },
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        getBrands: state => {
            return state.brands;
        },
        getTypes: state => {
            return state.types;
        },
        getColors: state => {
            return state.colors;
        },
        getProducts: state => {
            return state.products;
        },
        getProductPrice: state => model => {
            if (model != "") {
                return state.products.find(product => product.model == model).price;
            }
            return 0;
        }
    }
})