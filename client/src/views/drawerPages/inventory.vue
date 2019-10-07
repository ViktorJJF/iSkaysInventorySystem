<template>
  <custom-card title="Consulta de inventario" icon="mdi-magnify">
    <template v-slot:content>
      <v-card>
        <v-tabs v-model="tab" background-color="secondary" centered dark icons-and-text>
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#tab-1">
            Listado de productos
            <v-icon>mdi-format-list-checks</v-icon>
          </v-tab>

          <v-tab href="#tab-2">
            Agregar producto (modelo)
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item :value="'tab-' + 1">
            <v-card flat>
              <v-data-table
                no-results-text="No se encontraron resultados"
                :search="search"
                hide-default-footer
                :headers="headers"
                :items="filteredProducts"
                @page-count="pageCount = $event"
                :page.sync="page"
                :items-per-page="itemsPerPage"
              >
                <template v-slot:top>
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <span class="font-weight-bold">Filtrar por modelo: {{search}}</span>
                        <v-text-field
                          dense
                          hide-details
                          v-model="search"
                          append-icon="search"
                          placeholder="Escribe el modelo del producto"
                          single-line
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <span
                          class="font-weight-bold"
                        >Filtrar por tipo: {{$store.getters.getTypeById(selectedType)}}</span>
                        <v-select
                          clearable
                          @click:clear="showAllTypes()"
                          hide-details
                          dense
                          placeholder="Selecciona un tipo"
                          v-model="selectedType"
                          :items="types"
                          item-text="name"
                          item-value="_id"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <span
                          class="font-weight-bold"
                        >Filtrar por marca: {{$store.getters.getBrandById(selectedBrand)}}</span>
                        <v-select
                          clearable
                          @click:clear="showAllBrands()"
                          hide-details
                          dense
                          placeholder="Selecciona una marca"
                          v-model="selectedBrand"
                          :items="brands"
                          item-text="name"
                          item-value="_id"
                          outlined
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>

                  <v-divider class="mx-4" inset vertical></v-divider>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-btn class="mr-3" small color="success" @click="editItem(item)">Editar</v-btn>
                  <v-btn small color="error" @click="deleteItem(item)">Eliminar</v-btn>
                </template>
                <template v-slot:item.stock="{ item }">
                  {{item.stock}}
                  <v-icon color="green" v-show="item.stock>=5">mdi-checkbox-marked-circle</v-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" color="error" v-show="item.stock<5">mdi-alert-circle</v-icon>
                    </template>
                    <span>Stock por agotarse</span>
                  </v-tooltip>
                </template>
                <template v-slot:item.createdAt="{ item }">{{item.createdAt | dateFormat}}</template>

                <template v-slot:item.price="{ item }">S/.{{item.price}}</template>
                <template
                  v-slot:item.brandId="{ item }"
                >{{$store.getters.getBrandById(item.brandId)}}</template>
                <template v-slot:item.typeId="{ item }">{{$store.getters.getTypeById(item.typeId)}}</template>
                <template
                  v-slot:item.colorId="{ item }"
                >{{$store.getters.getColorById(item.colorId)}}</template>
                <template v-slot:no-data>
                  <v-alert type="error" :value="true">No se encontraron datos</v-alert>
                </template>
              </v-data-table>
              <div class="text-center pt-2">
                <v-pagination v-model="page" :length="pageCount"></v-pagination>
              </div>
              <v-dialog v-model="dialog" max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-container class="pa-5">
                    <v-alert
                      text
                      type="error"
                      :value="validateError"
                    >Es necesario colocar el nombre del modelo</v-alert>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <span class="font-weight-bold">Modelo</span>
                        <v-text-field
                          dense
                          hide-details
                          outlined
                          v-model="editedItem.model"
                          placeholder="Nombre del modelo"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <span class="font-weight-bold">Tipo</span>
                        <v-select
                          dense
                          hide-details
                          v-model="editedItem.typeId"
                          :items="types"
                          item-text="name"
                          item-value="_id"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <span class="font-weight-bold">Marca</span>
                        <v-select
                          dense
                          hide-details
                          v-model="editedItem.brandId"
                          :items="brands"
                          item-text="name"
                          item-value="_id"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <span class="font-weight-bold">Color</span>
                        <v-select
                          dense
                          hide-details
                          v-model="editedItem.colorId"
                          :items="colors"
                          item-text="name"
                          item-value="_id"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <span class="font-weight-bold">Precio de venta</span>
                        <v-text-field
                          prefix="S/."
                          dense
                          hide-details
                          outlined
                          v-model="editedItem.price"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <span class="font-weight-bold">Precio de Compra</span>
                        <v-text-field
                          prefix="S/."
                          dense
                          hide-details
                          outlined
                          v-model="editedItem.purchasePrice"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <span class="font-weight-bold">Stock mínimo</span>
                        <v-text-field
                          suffix="unidades"
                          dense
                          hide-details
                          outlined
                          v-model="editedItem.minStock"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <span class="font-weight-bold">Descripción</span>
                        <v-textarea
                          dense
                          hide-details
                          placeholder="Ingresa una descripción"
                          outlined
                          v-model="editedItem.description"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn outlined color="error" text @click="close">Cancelar</v-btn>
                    <v-btn :loading="loadingButton" color="success" @click="save">Guardar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-' + 2">
            <v-card flat>
              <add-product></add-product>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </template>
  </custom-card>
</template>

<script>
import addProduct from "./addProduct";
import dateFormat from "../../tools/customDate";
import Product from "../../classes/Product";
import { customCopyObject } from "../../tools/customCopyObject";
import { customHttpRequest } from "../../tools/customHttpRequest";
export default {
  components: {
    addProduct
  },
  filters: {
    dateFormat: function(value) {
      return dateFormat(value);
    }
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    loadingButton: false,
    validateError: false,
    tab: null,
    search: "",
    dialog: false,
    selectedType: null,
    selectedBrand: null,
    headers: [
      { text: "Modelo", value: "model" },
      { text: "Tipo", value: "typeId", filterable: false },
      { text: "Marca", value: "brandId", filterable: false },
      { text: "Color", value: "colorId", filterable: false },
      { text: "Stock", value: "stock", filterable: false },
      { text: "Precio de venta", value: "price", filterable: false },
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt"
      },
      { text: "Acciones", value: "action", sortable: false }
    ],
    products: [],
    editedIndex: -1,
    editedItem: Product,
    defaultItem: customCopyObject(Product)
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
    filteredProducts() {
      return this.selectedType || this.selectedBrand
        ? this.products.filter(
            product =>
              (this.selectedType
                ? product.typeId === this.selectedType
                : true) &&
              (this.selectedBrand
                ? product.brandId === this.selectedBrand
                : true)
          )
        : this.products;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.products = this.$store.state.products;
    },
    showAllTypes() {
      this.selectedType = null;
    },
    showAllBrands() {
      this.selectedBrand = null;
    },
    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.products.indexOf(item);
      let productId = this.products[index]._id;
      if (confirm("¿Seguro que deseas eliminar este elemento?")) {
        customHttpRequest("delete", "/api/products/delete/" + productId);
        this.products.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    validateForm() {
      if (!this.editedItem.model) {
        this.validateError = true;
        return false;
      }
      this.validateError = false;
      return true;
    },
    save() {
      if (!this.validateForm()) return false;
      let productId = this.products[this.editedIndex]._id;
      //update type
      this.loadingButton = true;
      customHttpRequest(
        "put",
        "/api/products/update/" + productId,
        this.editedItem,
        (err, callback) => {
          if (err) {
            return (this.loadingButton = false);
          }
          Object.assign(this.products[this.editedIndex], this.editedItem);
          this.loadingButton = false;
          this.close();
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>