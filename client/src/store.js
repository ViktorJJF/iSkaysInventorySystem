import Vue from "vue";
import Vuex from "vuex";
//plugins
import Axios from "axios";
Vue.prototype.$http = Axios;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || {},
    users: [],
    snackbar: {
      text: "",
      active: false,
      color: "success"
    },
    toolbar: {
      drawerIcon: null
    },
    overlay: {
      active: false,
    },
    products: [],
    types: [],
    brands: [],
    colors: [],
    orders: [],
    totalOrders: 0,
    purchases: [],
    totalPurchases: 0
  },
  mutations: {
    updateMasterPoints(state, qty) {
      state.masterPoints += qty;
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.loggingIn = false;
    },
    auth_success(state, {
      token,
      user
    }) {
      state.status = "success";
      state.token = token;
      state.user = user;
      state.loggingIn = true;
    },
    auth_error(state) {
      state.status = "error";
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
    showOverlay(state, active) {
      state.overlay.active = active;
    },
    loadInitialTypes(state, payload) {
      state.types = payload;
    },
    loadInitialBrands(state, payload) {
      state.brands = payload;
    },
    loadInitialColors(state, payload) {
      state.colors = payload;
    },
    loadInitialInventory(state, payload) {
      state.products = payload;
    },
    loadInitialOrders(state, payload) {
      state.orders = payload;
    },
    loadInitialPurchases(state, payload) {
      state.orders = payload;
    },
    countOrders(state, payload) {
      state.totalOrders = payload;
    },
    countPurchases(state, payload) {
      state.totalPurchases = payload;
    },
    addProduct(state, newProduct) {
      state.products.push(newProduct);
    },
    updateStock(state, {
      type,
      productId,
      qty
    }) {
      let product;
      switch (type) {
        case "order":
          product = state.products.find(product => product._id === productId);
          product.stock -= qty;
          break;
        case "purchase":
          product = state.products.find(product => product._id === productId);
          product.stock += qty;
          break;
        default:
          break;
      }
    }
  },
  actions: {
    updateStock({
      commit
    }, {
      type,
      productId,
      qty
    }) {
      commit("updateStock", {
        type,
        productId,
        qty
      });
    },
    addProduct({
      commit
    }, newProduct) {
      commit("addProduct", newProduct);
    },
    countOrders({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/orders/count")
          .then(res => {
            if (res.data.ok) {
              commit("countOrders", res.data.payload);
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    countPurchases({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/purchases/count")
          .then(res => {
            if (res.data.ok) {
              commit("countPurchases", res.data.payload);
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    loadInitialOrders({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/orders/list")
          .then(res => {
            if (res.data.ok) {
              commit("loadInitialOrders", res.data.payload);
              resolve(res.data.payload);
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    loadInitialPurchases({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/purchases/list")
          .then(res => {
            if (res.data.ok) {
              commit("loadInitialPurchases", res.data.payload);
              resolve(res.data.payload);
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    loadInitialTypes({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/types/list")
          .then(res => {
            if (res.data.ok) {
              commit("loadInitialTypes", res.data.payload);
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    loadInitialInventory({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/products/list")
          .then(res => {
            if (res.data.ok) {
              commit("loadInitialInventory", res.data.payload);
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    loadInitialBrands({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/brands/list")
          .then(res => {
            if (res.data.ok) {
              commit("loadInitialBrands", res.data.payload);
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    loadInitialColors({
      commit
    }) {
      return new Promise((resolve) => {
        axios
          .get("/api/colors/list")
          .then(res => {
            if (res.data.ok) {
              commit("loadInitialColors", res.data.payload);
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    logout({
      commit
    }) {
      commit("logout");
      localStorage.removeItem("token");
      // delete axios.defaults.headers.common['Authorization'];
    },
    showSnackbar({
      commit
    }, {
      text,
      color
    }) {
      commit("showSnackbar", {
        text,
        color
      });
    },
    showOverlay({
      commit
    }, active) {
      commit("showOverlay", active);
    },
    updateMasterPoints({
      commit
    }, qty) {
      commit("updateMasterPoints", qty);
    },
    login({
      commit
    }, user) {
      return new Promise((resolve, reject) => {
        if (user.email != "admin@gmail.com" || user.password != "123456") {
          reject("Usuario o contraseña incorrectos");
        } else {
          let user = {
            _id: "123123abcquew",
            firstName: "Administrador",
            lastName: "Fulltec",
            email: "admin@gmail.com",
            role: 1
          };
          let token = "fsajfiusjdfuisdiufhsuaf";
          commit("auth_success", {
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
      });
    }
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
    getTotalOrders: state => {
      return state.totalOrders;
    },
    getTotalPurchases: state => {
      return state.totalPurchases;
    },
    getOrders: state => {
      return state.orders;
    },
    getPurchases: state => {
      return state.purchases;
    },
    getproductStock: state => id => {
      if (id) {
        return state.products.find(product => product._id == id).stock;
      }
      return 0;
    },
    getProductPrice: state => id => {
      if (id) {
        return state.products.find(product => product._id == id).price;
      }
      return 0;
    },
    getProductPurchasePrice: state => id => {
      if (id) {
        return state.products.find(product => product._id == id).purchasePrice;
      }
      return 0;
    },
    getBrandById: state => id => {
      if (id) {
        let brand = state.brands.find(brand => brand._id == id);
        return brand ? brand.name : "ELIMINADO";
      }
      return "";
    },
    getTypeById: state => id => {
      if (id) {
        let type = state.types.find(type => type._id == id);
        return type ? type.name : "ELIMINADO";
      }
      return "";
    },
    getProductById: state => id => {
      if (id) {
        let product = state.products.find(product => product._id == id);
        return product ? product.model : "ELIMINADO";
      }
      return "";
    },
    getColorById: state => id => {
      if (id) {
        let color = state.colors.find(color => color._id == id);
        return color ? color.name : "ELIMINADO";
      }
      return "";
    },
    getUserId: state => {
      return state.user._id;
    },
    getUserFullName: state => id => {
      if (id) {
        let user = state.users.find(user => user._id == id);
        return user ? user.name : "ELIMINADO";
      }
      return "";
    }
  }
});