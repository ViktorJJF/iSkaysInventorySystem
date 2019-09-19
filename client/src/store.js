import Vue from 'vue'
import Vuex from 'vuex'
//plugins
import Axios from 'axios'
Vue.prototype.$http = Axios;


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: [{
            id: 1,
            type: "PANTALLA",
            brand: "SAMSUNG",
            model: "A5 2017 AMOLED",
            color: "NEGRO",
            stock: 2,
            price: 260,
            description: ""
        }, {
            id: 1,
            type: "PANTALLA",
            brand: "SAMSUNG",
            model: "A6 PLUS / A6+ / A605",
            color: "NEGRO",
            stock: 1,
            price: 280,
            description: ""
        }],
        types: [{
                name: "PANTALLA",
                status: 1
            },
            {
                name: "PANTALLA 2",
                status: 0
            }
        ],
        brands: [{
                name: "SAMSUNG",
                status: 1
            },
            {
                name: "HUAWEI",
                status: 1
            },
            {
                name: "LG",
                status: 1
            },
            {
                name: "MOTOROLA",
                status: 1
            },
            {
                name: "NOKIA",
                status: 0
            }
        ],
        colors: ["NEGRO", "LCD", "BLANCO", "DORADO", "AZUL"],
    },
    mutations: {
        updateMasterPoints(state, qty) {
            state.masterPoints += qty;
        }

    },
    actions: {
        updateMasterPoints({
            commit
        }, qty) {
            commit('updateMasterPoints', qty);
        }
    },
    getters: {
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