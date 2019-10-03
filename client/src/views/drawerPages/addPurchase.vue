<template>
  <custom-card title="Realizar compra" icon="mdi-plus">
    <template v-slot:content>
      <v-container>
        <v-btn color="primary" @click="addpurchase">
          <v-icon left>mdi-plus</v-icon>Agregar
        </v-btn>
        <v-alert
          class="my-5"
          v-show="purchase.length==0"
          color="error"
          text
        >Agrega productos a esta compra</v-alert>
        <v-alert text type="error" :value="validateError">Es necesario agregar al menos 1 producto</v-alert>
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
              <tr v-for="(product,purchaseIndex) in purchase" :key="product.productId">
                <td>
                  <v-container>
                    <v-select
                      placeholder="Seleccione el producto"
                      :suffix="'Stock:'+ $store.getters.getproductStock(product.productId)"
                      v-model="product.productId"
                      :items="products"
                      item-text="model"
                      item-value="_id"
                      @change="purchase[purchaseIndex].purchasePrice=getProductPurchasePrice(product.productId)"
                    ></v-select>
                  </v-container>
                </td>
                <td>
                  <v-text-field v-model="product.qty" type="number"></v-text-field>
                </td>
                <td>S/.{{product.purchasePrice}}</td>
                <td>S/.{{product.purchasePrice*product.qty}}</td>
                <td>
                  <v-btn small color="error" @click="deletepurchase(purchaseIndex)">Eliminar</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-row justify="end" class="mr-3">
          <v-card outlined color="red lighten-5" class="pa-3">
            <strong class="mr-3">Total:</strong>
            &nbsp;
            <span class="total">S/.{{getTotal}}</span>
          </v-card>
        </v-row>
        <v-alert text type="error" :value="stockError">La cantidad vendida no puede superar el stock</v-alert>

        <v-btn :loading="loadingButton" color="success" @click="savepurchase">Guardar compra</v-btn>
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
      purchase: [],
      total: 0,
      loadingButton: false,
      validateError: false,
      stockError: false
    };
  },
  methods: {
    deletepurchase(purchaseIndex) {
      this.purchase.splice(purchaseIndex, 1);
    },
    addpurchase() {
      this.purchase.push({
        productId: "",
        qty: 1,
        purchasePrice: 0
      });
    },
    getProductPurchasePrice(model) {
      return this.$store.getters.getProductPurchasePrice(model);
    },
    validateForm() {
      let products = this.purchase;
      let stockSentinel = false;
      if (this.purchase.length === 0) {
        this.validateError = true;
        return false;
      }
      this.stockError = false;
      this.validateError = false;
      return true;
    },
    async savepurchase() {
      if (!this.validateForm()) return false;
      this.loadingButton = true;
      await this.apiCalls();
      this.$store.dispatch("showSnackbar", {
        text: "Venta agregada con éxito",
        color: "success"
      });
      this.loadingButton = false;
      this.purchase = [];
    },
    apiCalls() {
      return new Promise((resolve, reject) => {
        //creating sale
        axios
          .post("/api/purchases/create", {
            userId: this.$store.getters.getUserId
          })
          .then(res => {
            //creating sale details
            let purchaseId = res.data.payload._id;
            this.purchase.forEach(product => {
              axios
                .post("/api/purchase-details/create", {
                  purchaseId: purchaseId,
                  productId: product.productId,
                  purchasePrice: product.purchasePrice,
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
      return this.purchase.reduce(
        (a, b) => a + this.getProductPurchasePrice(b.productId) * b.qty,
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