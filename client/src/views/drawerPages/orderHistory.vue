<template>
  <custom-card title="Historial de ventas" icon="mdi-format-list-checks">
    <template v-slot:content>
      <v-col cols="12" sm="12">
        <p>
          <strong>Total de ventas:</strong>
          {{$store.getters.getTotalOrders}}
        </p>
      </v-col>
      <v-data-table
        :loading="!isDataReady"
        loading-text="Cargando datos"
        hide-default-footer
        :headers="headers"
        :items="orders"
        @page-count="pageCount = $event"
        :page.sync="page"
        :items-per-page="itemsPerPage"
      >
        <template v-slot:no-data>
          <v-alert type="error" :value="true">Aún no cuentas con un historial de ventas</v-alert>
        </template>
        <template v-slot:item.userId>Administrador</template>
        <template v-slot:item.actions="{item}">
          <v-btn
            small
            color="secondary"
            class="mr-3"
            @click.stop="dialog=true;showOrderDetail(item)"
          >Ver detalle</v-btn>
          <v-btn small color="error" @click="deleteItem(item)">Eliminar</v-btn>
        </template>
        <template v-slot:item.createdAt="{ item }">{{item.createdAt | dateFormat}}</template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>Detalle de venta</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <p>
              <strong>ID de la venta:</strong>
              {{orders.length>0?orders[selectedOrder]._id:""}}
            </p>
            <p>
              <strong>Usuario:</strong>
              <!-- {{orders.length>0?orders[selectedOrder].userId:""}} -->
              Administrador
            </p>
            <p>
              <strong>Detalle de productos:</strong>
            </p>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Producto</th>
                    <th class="text-left">Precio</th>
                    <th class="text-left">Cantidad</th>
                    <th class="text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="orderDetail in orderDetails" :key="orderDetail._id">
                    <td>{{ $store.getters.getProductById(orderDetail.productId) }}</td>
                    <td>S/. {{ orderDetail.price }}</td>
                    <td>{{ orderDetail.qty }}</td>
                    <td>S/. {{ orderDetail.price*orderDetail.qty }}</td>
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
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false;clearOrderDetail();">De acuerdo</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </custom-card>
</template>

<script>
import dateFormat from "../../tools/customDate";
import { customCopyObject } from "../../tools/customCopyObject";
import { customHttpRequest } from "../../tools/customHttpRequest";
export default {
  filters: {
    dateFormat: function(value) {
      return dateFormat(value);
    }
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    isDataReady: false,
    selectedOrder: 0,
    search: "",
    dialog: false,
    headers: [
      { text: "ID de venta", value: "_id" },
      { text: "Usuario", value: "userId" },
      { text: "Fecha", value: "createdAt" },
      { text: "Acciones", value: "actions" }
    ],
    orders: [],
    orderDetails: []
  }),
  computed: {
    formTitle() {
      return "Editar producto";
    },
    brands() {
      return this.$store.getters.getBrands;
    },
    types() {
      return this.$store.getters.getTypes;
    },
    colors() {
      return this.$store.getters.getColors;
    },
    getTotal() {
      return this.orderDetails.reduce((a, b) => a + b.price * b.qty, 0);
    }
  },
  created() {
    this.initialData();
  },

  methods: {
    async initialData() {
      // let orders = this.$store.getters.getOrders;
      // if (orders.length > 0) {
      // this.orders = customCopyObject(orders);
      // } else {
      this.orders = await this.$store.dispatch("loadInitialOrders");
      // }
      this.isDataReady = true;
    },
    showOrderDetail(item) {
      this.selectedOrder = this.orders.indexOf(item);
      let orderId = this.orders[this.selectedOrder]._id;
      axios
        .get("/api/order-details/list", { params: { orderId } })
        .then(res => {
          console.log(res);
          if (res.data.ok) {
            this.orderDetails = res.data.payload;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    clearOrderDetail() {
      this.orderDetails = [];
    },
    deleteItem(item) {
      const index = this.orders.indexOf(item);
      let orderId = this.orders[index]._id;
      if (
        confirm(
          "¿Seguro que deseas eliminar esta venta? Se sumará el stock a los productos del detalle"
        )
      ) {
        this.updateStoreStock(orderId);
        this.$store.dispatch("showOverlay", true);
        customHttpRequest(
          "delete",
          "/api/orders/delete/" + orderId,
          null,
          () => {
            this.$store.dispatch("showOverlay", false);
            this.orders.splice(index, 1);
          }
        );
      }
    },
    updateStoreStock(orderId) {
      axios
        .get("/api/order-details/list", { params: { orderId } })
        .then(res => {
          console.log(res);
          if (res.data.ok) {
            let orderDetails = res.data.payload;
            orderDetails.forEach(detail => {
              this.$store.dispatch("updateStock", {
                type: "order",
                productId: detail.productId,
                qty: -parseInt(detail.qty)
              });
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>