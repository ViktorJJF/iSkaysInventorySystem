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
        >Aún no se agregaron productos a esta venta</v-alert>
        <v-simple-table v-show="order.length>0">
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
              <tr v-for="(product,orderIndex) in order" :key="product.model">
                <td>
                  <v-select
                    placeholder="Seleccione el producto"
                    v-model="product.model"
                    :items="products"
                    item-text="model"
                    item-value="model"
                  ></v-select>
                </td>
                <td>
                  <v-text-field v-model="product.qty" type="number"></v-text-field>
                </td>
                <td>S/.{{getProductPrice(product.model)}}</td>
                <td>S/.{{getProductPrice(product.model)*product.qty}}</td>
                <td>
                  <v-btn small color="error" @click="deleteOrder(orderIndex)">Eliminar</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-row justify="end" class="mr-3">
          <v-card color="light-green lighten-5" class="pa-3">
            <strong class="mr-3">Total:</strong>
            &nbsp;
            <span class="total">S/.{{getTotal()}}</span>
          </v-card>
        </v-row>
        <v-btn color="success">Guardar orden</v-btn>
      </v-container>
    </template>
  </custom-card>
</template>

<script>
export default {
  data() {
    return {
      order: [],
      total: 0
    };
  },
  methods: {
    deleteOrder(orderIndex) {
      this.order.splice(orderIndex, 1);
    },
    addOrder() {
      this.order.push({
        id: 1,
        model: "",
        qty: 1
      });
    },
    getProductPrice(model) {
      return this.$store.getters.getProductPrice(model);
    },
    getTotal() {
      let sum = 0;
      this.order.forEach(product => {
        sum = sum + this.getProductPrice(product.model) * parseInt(product.qty);
      });
      return sum;
    }
  },
  computed: {
    products() {
      return this.$store.getters.getProducts;
    }
  }
};
</script>

<style lang="scss" scoped>
.total {
  font-size: 24px;
}
</style>