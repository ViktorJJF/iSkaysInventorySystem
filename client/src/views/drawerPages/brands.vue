<template>
  <v-container fluid>
    <h1>Marcas</h1>
    <v-data-table
      :search="search"
      hide-default-footer
      :headers="headers"
      :items="brands"
      sort-by="calories"
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar marca"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="flex-grow-1"></div>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Agregar Marca</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-container class="pa-5">
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <p class="body-1 font-weight-bold">Nombre</p>
                    <v-text-field
                      clearable
                      class
                      outlined
                      v-model="editedItem.name"
                      placeholder="Nombre de la marca"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <p class="body-1 font-weight-bold">Estado</p>
                    <v-radio-group row v-model="editedItem.status">
                      <v-radio color="primary" label="Activo" :value="1"></v-radio>
                      <v-radio color="primary" label="Inactivo" :value="0"></v-radio>
                    </v-radio-group>
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
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="success" small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon color="error" small @click="deleteItem(item)">delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-alert type="error" :value="true">Aún no cuentas con marcas de productos</v-alert>
      </template>
      <template v-slot:item.status="{item}">
        <v-chip v-if="item.status" color="success">Activo</v-chip>
        <v-chip v-else color="error">Inactivo</v-chip>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="1"></v-pagination>
    </div>
  </v-container>
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
      {
        text: "Tipo",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    brands: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      status: 1
    },
    defaultItem: {
      name: "",
      status: 1
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva marca" : "Editar marca";
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
      this.brands = this.$store.state.brands;
    },

    editItem(item) {
      this.editedIndex = this.brands.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.brands.indexOf(item);
      confirm("¿Seguro que deseas eliminar este elemento?") &&
        this.brands.splice(index, 1);
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
        Object.assign(this.brands[this.editedIndex], this.editedItem);
      } else {
        this.brands.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>