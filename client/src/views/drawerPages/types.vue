<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="700px"
        icon="mdi-format-list-bulleted"
        color="primary"
        title="Tipo de producto"
        text="Tabla resumen de tipos de productos"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="types"
          sort-by="calories"
          @page-count="pageCount = $event"
          :page.sync="page"
          :items-per-page="itemsPerPage"
        >
          <template v-slot:top>
            <v-container>
              <span class="font-weight-bold">Filtrar por nombre: {{search}}</span>
              <v-row align="center">
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    hide-details
                    v-model="search"
                    append-icon="search"
                    placeholder="Escribe el nombre del tipo"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="secondary" dark class="mb-2" v-on="on">Agregar Tipo</v-btn>
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
                        >Es necesario colocar el nombre del tipo</v-alert>
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
                              placeholder="Nombre del tipo de producto"
                            ></v-text-field>
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
                        <v-btn :loading="loadingButton" color="success" @click="save">Guardar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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
            <v-alert type="error" :value="true">Aún no cuentas con tipos de productos</v-alert>
          </template>
          <template v-slot:item.status="{item}">
            <v-chip v-if="item.status" color="success">Activo</v-chip>
            <v-chip v-else color="error">Inactivo</v-chip>
          </template>
        </v-data-table>
        <v-col cols="12" sm="12">
          <span>
            <strong>Total de tipos:</strong>
            {{types.length}}
          </span>
        </v-col>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </material-card>
    </v-row>
  </v-container>
</template>

<script>
import dateFormat from "../../tools/customDate";
import TypeProduct from "../../classes/TypeProduct";
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
        text: "Tipo",
        align: "left",
        sortable: false,
        value: "name",
        class: "header-styles"
      },
      // {
      //   text: "Descripción",
      //   align: "left",
      //   width: "40%",
      //   sortable: false,
      //   value: "description",
      //   filterable: false
      // },
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt"
      },
      // { text: "Estado", value: "status" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    types: [],
    editedIndex: -1,
    editedItem: TypeProduct,
    defaultItem: customCopyObject(TypeProduct)
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Tipo" : "Editar Tipo";
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
      this.types = this.$store.state.types;
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
      this.editedIndex = this.types.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.types.indexOf(item);
      let typeId = this.types[index]._id;
      if (confirm("¿Seguro que deseas eliminar este elemento?")) {
        customHttpRequest("delete", "/api/types/delete/" + typeId);
        this.types.splice(index, 1);
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
        let typeId = this.types[this.editedIndex]._id;
        //update type
        this.loadingButton = true;
        customHttpRequest(
          "put",
          "/api/types/update/" + typeId,
          this.editedItem,
          (err, callback) => {
            if (err) {
              return (this.loadingButton = false);
            }
            Object.assign(this.types[this.editedIndex], this.editedItem);
            this.loadingButton = false;
            this.close();
          }
        );
      } else {
        //create type
        this.loadingButton = true;
        customHttpRequest(
          "post",
          "/api/types/create",
          this.editedItem,
          (err, callback) => {
            if (err) {
              return (this.loadingButton = false);
            }
            this.types.push(callback);
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