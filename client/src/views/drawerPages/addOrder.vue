<template>
  <custom-card title="Realizar venta" icon="mdi-plus">
    <template v-slot:content>
      <v-container>
        <v-btn color="primary" @click="addOrder">
          <v-icon left>mdi-plus</v-icon>Agregar
        </v-btn>
        <v-alert
          class="my-5"
          v-show="order.length==0"
          type="success"
          text
        >Agrega productos a esta venta</v-alert>
        <v-alert text type="error" :value="validateError">Es necesario agregar al menos 01 producto</v-alert>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Producto</th>
                <th class="text-left">Cantidad</th>
                <th class="text-left">Precio</th>
                <th class="text-left">Subtotal</th>
                <th class="text-left">Eliminar producto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product,orderIndex) in order" :key="product.productId">
                <td>
                  <v-container>
                    <v-select
                      placeholder="Seleccione el producto"
                      :suffix="'Stock:'+ $store.getters.getproductStock(product.productId)"
                      v-model="product.productId"
                      :items="products"
                      item-text="model"
                      item-value="_id"
                      @change="order[orderIndex].price=getProductPrice(product.productId)"
                    ></v-select>
                  </v-container>
                </td>
                <td>
                  <v-text-field v-model="product.qty" type="number"></v-text-field>
                </td>
                <td>S/.{{product.price}}</td>
                <td>S/.{{product.price*product.qty}}</td>
                <td>
                  <v-btn small color="error" @click="deleteOrder(orderIndex)">Eliminar</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-row justify="end" class="mr-3">
          <v-card outlined color="light-green lighten-5" class="pa-3">
            <strong class="mr-3">Total:</strong>
            &nbsp;
            <span class="total">S/.{{getTotal}}</span>
          </v-card>
        </v-row>
        <v-alert text type="error" :value="stockError">La cantidad vendida no puede superar el stock</v-alert>

        <v-btn :loading="loadingButton" color="success" @click="saveOrder">Guardar orden</v-btn>
      </v-container>
    </template>
  </custom-card>
</template>

<script>
import dateFormat from "../../tools/customDate";
import { customCopyObject } from "../../tools/customCopyObject";
import { customHttpRequest } from "../../tools/customHttpRequest";
export default {
  data() {
    return {
      order: [],
      total: 0,
      loadingButton: false,
      validateError: false,
      stockError: false
    };
  },
  methods: {
    deleteOrder(orderIndex) {
      this.order.splice(orderIndex, 1);
    },
    addOrder() {
      this.order.push({
        productId: "",
        qty: 1,
        price: 0
      });
    },
    getProductPrice(model) {
      return this.$store.getters.getProductPrice(model);
    },
    validateForm() {
      let products = this.order;
      let stockSentinel = false;
      let stockError = false;
      products.forEach(product => {
        let stock = this.$store.getters.getproductStock(product.productId);
        if (product.qty > stock) {
          return (stockSentinel = true);
        }
      });
      if (stockSentinel === true) {
        this.stockError = true;
        return false;
      }
      if (this.order.length === 0) {
        this.validateError = true;
        return false;
      }
      this.stockError = false;
      this.validateError = false;
      stockSentinel = false;
      return true;
    },
    async saveOrder() {
      if (!this.validateForm()) return false;
      this.loadingButton = true;
      this.$store.dispatch("showOverlay", true);
      await this.apiCalls();
      this.$store.dispatch("showSnackbar", {
        text: "Venta agregada con éxito",
        color: "success"
      });
      this.loadingButton = false;
      this.$store.dispatch("showOverlay", false);
      this.order = [];
    },
    apiCalls() {
      return new Promise((resolve, reject) => {
        //creating sale
        axios
          .post("/api/orders/create", { userId: this.$store.getters.getUserId })
          .then(res => {
            //creating sale details
            let orderId = res.data.payload._id;
            this.order.forEach(product => {
              axios
                .post("/api/order-details/create", {
                  orderId: orderId,
                  productId: product.productId,
                  price: product.price,
                  qty: parseInt(product.qty)
                })
                .then(res => {
                  console.log(res);
                  resolve();
                })
                .catch(err => {
                  console.error(err);
                  reject(err);
                });
            });
          })
          .catch(err => {
            console.error(err);
          });
      });
    }
  },
  computed: {
    products() {
      return this.$store.getters.getProducts;
    },
    getTotal() {
      return this.order.reduce(
        (a, b) => a + this.getProductPrice(b.productId) * b.qty,
        0
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.total {
  font-size: 24px;
}
</style>