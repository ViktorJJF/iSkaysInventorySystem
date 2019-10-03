<template>
  <custom-card title="Marcas" icon="mdi-cellphone-dock">
    <template v-slot:content>
      <v-data-table
        no-results-text="No se encontraron resultados"
        :search="search"
        hide-default-footer
        :headers="headers"
        :items="brands"
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
                  placeholder="Escribe el nombre de la marca"
                  single-line
                  outlined
                ></v-text-field>
              </v-col>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="secondary" dark class="mb-2" v-on="on">Agregar Marca</v-btn>
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
                    >Es necesario colocar el nombre de la marca</v-alert>
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
                      <v-col cols="12" sm="12">
                        <span class="font-weight-bold">Descripción</span>
                        <v-textarea
                          hide-details
                          placeholder="Ingresa una descripción"
                          outlined
                          v-model="editedItem.description"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <span class="font-weight-bold">Estado</span>
                        <v-select
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
            </v-row>
          </v-container>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn class="mr-3" small color="success" @click="editItem(item)">Editar</v-btn>
          <v-btn small color="error" @click="deleteItem(item)">Eliminar</v-btn>
        </template>
        <template v-slot:no-data>
          <v-alert type="error" :value="true">Aún no cuentas con marcas de productos</v-alert>
        </template>
        <template v-slot:item.createdAt="{ item }">{{item.createdAt | dateFormat}}</template>
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
import BrandProduct from "../../classes/BrandProduct";
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
        value: "name"
      },
      {
        text: "Descripción",
        align: "left",
        sortable: false,
        value: "description"
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
    brands: [],
    editedIndex: -1,
    editedItem: BrandProduct,
    defaultItem: customCopyObject(BrandProduct)
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
    validateForm() {
      if (!this.editedItem.name) {
        this.validateError = true;
        return false;
      }
      this.validateError = false;
      return true;
    },
    editItem(item) {
      this.editedIndex = this.brands.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.brands.indexOf(item);
      let brandsId = this.brands[index]._id;
      if (confirm("¿Seguro que deseas eliminar este elemento?")) {
        customHttpRequest("delete", "/api/brands/delete/" + brandsId);
        this.brands.splice(index, 1);
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
        let brandId = this.brands[this.editedIndex]._id;
        //update brand
        this.loadingButton = true;
        customHttpRequest(
          "put",
          "/api/brands/update/" + brandId,
          this.editedItem,
          (err, callback) => {
            if (err) {
              return (this.loadingButton = false);
            }
            Object.assign(this.brands[this.editedIndex], this.editedItem);
            this.loadingButton = false;
            this.close();
          }
        );
      } else {
        //create brand
        this.loadingButton = true;
        customHttpRequest(
          "post",
          "/api/brands/create",
          this.editedItem,
          (err, callback) => {
            if (err) {
              return (this.loadingButton = false);
            }
            this.brands.push(callback);
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