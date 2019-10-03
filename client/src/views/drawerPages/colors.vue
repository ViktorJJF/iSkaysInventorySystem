<template>
  <custom-card title="Colores de productos" icon="mdi-format-color-fill">
    <template v-slot:content>
      <v-data-table
        no-results-text="No se encontraron resultados"
        :search="search"
        hide-default-footer
        :headers="headers"
        :items="colors"
        sort-by="calories"
        class="elevation-1"
        @page-count="pageCount = $event"
        :page.sync="page"
        :items-per-page="itemsPerPage"
      >
        <template v-slot:top>
          <v-container>
            <v-row align="center">
              <v-col cols="12" sm="4">
                <span class="font-weight-bold">Filtrar por nombre: {{search}}</span>
                <v-text-field
                  dense
                  hide-details
                  v-model="search"
                  append-icon="search"
                  placeholder="Escribe el nombre del color"
                  single-line
                  outlined
                ></v-text-field>
              </v-col>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="secondary" dark class="mb-2" v-on="on">Agregar Color</v-btn>
                </template>
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
                    >Es necesario colocar el nombre del color</v-alert>
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <span class="font-weight-bold">Nombre</span>
                        <v-text-field
                          dense
                          hide-details
                          clearable
                          class
                          outlined
                          v-model="editedItem.name"
                          placeholder="Nombre del color del producto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <span class="font-weight-bold">Estado</span>
                        <v-select
                          dense
                          hide-details
                          v-model="editedItem.status"
                          :items="[{name:'Activo',value:true},{name:'Inactivo',value:false}]"
                          item-text="name"
                          item-value="value"
                          outlined
                        ></v-select>
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
              <v-col cols="12" sm="12">
                <p>
                  <strong>Total de colores:</strong>
                  {{colors.length}}
                </p>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn class="mr-3" small color="success" @click="editItem(item)">Editar</v-btn>
          <v-btn small color="error" @click="deleteItem(item)">Eliminar</v-btn>
        </template>
        <template v-slot:item.createdAt="{ item }">{{item.createdAt | dateFormat}}</template>
        <template v-slot:no-data>
          <v-alert type="error" :value="true">Aún no cuentas con colores de productos</v-alert>
        </template>
        <template v-slot:item.status="{item}">
          <v-chip v-if="item.status" color="success">Activo</v-chip>
          <v-chip v-else color="error">Inactivo</v-chip>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </template>
  </custom-card>
</template>

<script>
import dateFormat from "../../tools/customDate";
import ColorProduct from "../../classes/ColorProduct";
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
    loadingButton: false,
    validateError: false,
    search: "",
    dialog: false,
    headers: [
      {
        text: "Color",
        align: "left",
        sortable: false,
        value: "name",
        class: "header-styles"
      },
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt"
      },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    colors: [],
    editedIndex: -1,
    editedItem: ColorProduct,
    defaultItem: customCopyObject(ColorProduct)
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Color" : "Editar Color";
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
      this.colors = this.$store.state.colors;
    },
    validateForm() {
      if (!this.editedItem.name) {
        this.validateError = true;
        return false;
      }
      this.validateError = false;
      return true;
    },
    editItem(item) {
      this.editedIndex = this.colors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.colors.indexOf(item);
      let typeId = this.colors[index]._id;
      if (confirm("¿Seguro que deseas eliminar este elemento?")) {
        customHttpRequest("delete", "/api/colors/delete/" + typeId);
        this.colors.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (!this.validateForm()) return false;
      if (this.editedIndex > -1) {
        let typeId = this.colors[this.editedIndex]._id;
        //update type
        this.loadingButton = true;
        customHttpRequest(
          "put",
          "/api/colors/update/" + typeId,
          this.editedItem,
          (err, callback) => {
            if (err) {
              return (this.loadingButton = false);
            }
            Object.assign(this.colors[this.editedIndex], this.editedItem);
            this.loadingButton = false;
            this.close();
          }
        );
      } else {
        //create type
        this.loadingButton = true;
        customHttpRequest(
          "post",
          "/api/colors/create",
          this.editedItem,
          (err, callback) => {
            if (err) {
              return (this.loadingButton = false);
            }
            this.colors.push(callback);
            this.loadingButton = false;
            this.close();
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>