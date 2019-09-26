<template>
  <custom-card title="Historial de ventas" icon="mdi-format-list-checks">
    <template v-slot:content>
      <v-data-table
        :search="search"
        hide-default-footer
        :headers="headers"
        :items="order"
        sort-by="calories"
        class="elevation-1"
        @page-count="pageCount = $event"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar venta"
              single-line
              hide-details
            ></v-text-field>
            <v-divider class="mx-4" inset vertical></v-divider>
            <div class="flex-grow-1"></div>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-alert type="error" :value="true">Aún no cuentas con un historial de ventas</v-alert>
        </template>
        <template v-slot:item.status="{item}">
          <v-chip v-if="item.status" color="success">Activo</v-chip>
          <v-chip v-else color="error">Inactivo</v-chip>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="1"></v-pagination>
      </div>
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
    headers: [
      { text: "Producto", value: "type" },
      { text: "Cantidad", value: "brand" },
      { text: "Precio", value: "model" },
      { text: "Subtotal", value: "color" }
    ],
    order: []
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
    }
  },
  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.order = this.$store.state.order;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>