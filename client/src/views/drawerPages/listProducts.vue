<template>
  <custom-card title="Consulta de inventario" icon="mdi-magnify">
    <template v-slot:content>
      <v-data-table
        no-results-text="No se encontraron resultados"
        :search="search"
        hide-default-footer
        :headers="headers"
        :items="filteredProducts"
        sort-by="calories"
        class="elevation-1"
        @page-count="pageCount = $event"
      >
        <template v-slot:top>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="4">
                <span class="font-weight-bold">Filtrar por modelo: {{search}}</span>
                <v-text-field
                  hide-details
                  v-model="search"
                  append-icon="search"
                  placeholder="Escribe el modelo del producto"
                  single-line
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <span class="font-weight-bold">Filtrar por tipo: {{selectedType}}</span>
                <v-select
                  clearable
                  @click:clear="showAllTypes()"
                  hide-details
                  dense
                  placeholder="Selecciona un tipo"
                  v-model="selectedType"
                  :items="types"
                  item-text="name"
                  item-value="name"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <span class="font-weight-bold">Filtrar por marca: {{selectedBrand}}</span>
                <v-select
                  clearable
                  @click:clear="showAllBrands()"
                  hide-details
                  dense
                  placeholder="Selecciona una marca"
                  v-model="selectedBrand"
                  :items="brands"
                  item-text="name"
                  item-value="name"
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
        <template v-slot:item.price="{ item }">S/.{{item.price}}</template>
        <template v-slot:no-data>
          <v-alert type="error" :value="true">No se encontraron datos</v-alert>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="1"></v-pagination>
      </div>
      <v-dialog v-model="dialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-container class="pa-5">
            <v-row>
              <v-col cols="12" sm="12">
                <span class="font-weight-bold">Modelo</span>
                <v-text-field
                  hide-details
                  outlined
                  v-model="editedItem.model"
                  placeholder="Nombre del modelo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="font-weight-bold">Tipo</span>
                <v-select
                  hide-details
                  v-model="editedItem.type"
                  :items="types"
                  item-text="name"
                  item-value="name"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="font-weight-bold">Marca</span>
                <v-select
                  hide-details
                  v-model="editedItem.brand"
                  :items="brands"
                  item-text="name"
                  item-value="name"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="font-weight-bold">Color</span>
                <v-select hide-details v-model="editedItem.color" :items="colors" outlined></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="font-weight-bold">Precio de venta (S/.)</span>
                <v-text-field hide-details outlined v-model="editedItem.price" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <span class="font-weight-bold">Descripción</span>
                <v-textarea
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
            <v-btn color="success" @click="save">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </custom-card>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    selectedType: null,
    selectedBrand: null,
    headers: [
      { text: "Tipo", value: "type" },
      { text: "Marca", value: "brand" },
      { text: "Modelo", value: "model" },
      { text: "Color", value: "color" },
      { text: "Stock", value: "stock" },
      { text: "Precio de venta", value: "price" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      type: "",
      brand: "",
      model: "",
      color: "",
      stock: 0,
      price: 0,
      description: ""
    },
    defaultItem: {
      type: "",
      brand: "",
      model: "",
      color: "",
      stock: 0,
      price: 0,
      description: ""
    }
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
              (this.selectedType ? product.type === this.selectedType : true) &&
              (this.selectedBrand ? product.brand === this.selectedBrand : true)
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
      confirm("¿Seguro que deseas eliminar este elemento?") &&
        this.products.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.products[this.editedIndex], this.editedItem);
      } else {
        this.products.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>