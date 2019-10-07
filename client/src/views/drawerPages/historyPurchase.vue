<template>
  <custom-card title="Historial de compras" icon="mdi-format-list-checks">
    <template v-slot:content>
      <v-col cols="12" sm="12">
        <p>
          <strong>Total de compras:</strong>
          {{$store.getters.getTotalPurchases}}
        </p>
      </v-col>
      <v-data-table
        :loading="!isDataReady"
        loading-text="Cargando datos"
        hide-default-footer
        :headers="headers"
        :items="purchases"
        @page-count="pageCount = $event"
      >
        <template v-slot:no-data>
          <v-alert type="error" :value="true">Aún no cuentas con un historial de compras</v-alert>
        </template>
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
        <template v-slot:item.userId>Administrador</template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="1"></v-pagination>
      </div>
      <v-dialog v-model="dialog" width="500">
        <v-card v-if="isDataReady">
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>Detalle de compra</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <p>
              <strong>ID de la compra:</strong>
              {{purchases.length>0?purchases[selectedOrder]._id:""}}
            </p>
            <p>
              <strong>Usuario:</strong>
              <!-- {{purchases.length>0?purchases[selectedOrder].userId:""}} -->
              Administrador
            </p>
            <p>
              <strong>Detalle de productos comprados:</strong>
            </p>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Producto</th>
                    <th class="text-left">Precio de compra</th>
                    <th class="text-left">Cantidad</th>
                    <th class="text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="purchaseDetail in purchaseDetails" :key="purchaseDetail._id">
                    <td>{{ $store.getters.getProductById(purchaseDetail.productId) }}</td>
                    <td>S/. {{ purchaseDetail.purchasePrice }}</td>
                    <td>{{ purchaseDetail.qty }}</td>
                    <td>S/. {{ purchaseDetail.purchasePrice*purchaseDetail.qty }}</td>
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
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false;clearPurchaseDetails();">De acuerdo</v-btn>
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
    isDataReady: false,
    selectedOrder: 0,
    search: "",
    dialog: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers: [
      { text: "ID de compra", value: "_id" },
      { text: "Usuario", value: "userId" },
      { text: "Fecha", value: "createdAt" },
      { text: "Acciones", value: "actions" }
    ],
    purchases: [],
    purchaseDetails: []
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
      return this.purchaseDetails.reduce(
        (a, b) => a + b.purchasePrice * b.qty,
        0
      );
    }
  },
  created() {
    this.initialData();
  },

  methods: {
    async initialData() {
      // let purchases = this.$store.getters.getPurchases;
      // if (purchases.length > 0) {
      // this.purchases = customCopyObject(purchases);
      // } else {
      this.purchases = await this.$store.dispatch("loadInitialPurchases");
      // }
      this.isDataReady = true;
    },
    showOrderDetail(item) {
      this.selectedOrder = this.purchases.indexOf(item);
      let purchaseId = this.purchases[this.selectedOrder]._id;
      axios
        .get("/api/purchase-details/list", { params: { purchaseId } })
        .then(res => {
          console.log(res);
          if (res.data.ok) {
            this.purchaseDetails = res.data.payload;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    clearPurchaseDetails() {
      this.purchaseDetails = [];
    },
    deleteItem(item) {
      const index = this.purchases.indexOf(item);
      let purchaseId = this.purchases[index]._id;
      if (
        confirm(
          "¿Seguro que deseas eliminar esta compra? Se sumará el stock a los productos del detalle"
        )
      ) {
        this.updateStoreStock(purchaseId);
        this.$store.dispatch("showOverlay", true);
        customHttpRequest(
          "delete",
          "/api/purchases/delete/" + purchaseId,
          null,
          () => {
            this.$store.dispatch("showOverlay", false);
            this.purchases.splice(index, 1);
          }
        );
      }
    },
    updateStoreStock(purchaseId) {
      axios
        .get("/api/purchase-details/list", { params: { purchaseId } })
        .then(res => {
          console.log(res);
          if (res.data.ok) {
            let purchaseDetails = res.data.payload;
            purchaseDetails.forEach(detail => {
              this.$store.dispatch("updateStock", {
                type: "purchase",
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