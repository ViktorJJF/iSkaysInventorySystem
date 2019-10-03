<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12">
        <span class="font-weight-bold">Modelo</span>
        <v-text-field
          dense
          hide-details
          outlined
          v-model="newProduct.model"
          placeholder="Nombre del modelo"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <span class="font-weight-bold">Tipo</span>
        <v-select
          placeholder="Selecciona un Tipo"
          item-text="name"
          item-valur="_id"
          dense
          hide-details
          v-model="newProduct.typeId"
          :items="types"
          item-value="_id"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <span class="font-weight-bold">Marca</span>
        <v-select
          placeholder="Selecciona una Marca"
          item-text="name"
          item-valur="_id"
          dense
          hide-details
          v-model="newProduct.brandId"
          :items="brands"
          item-value="_id"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <span class="font-weight-bold">Color</span>
        <v-select
          dense
          hide-details
          v-model="newProduct.colorId"
          placeholder="Selecciona un color"
          item-text="name"
          item-value="_id"
          :items="colors"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <span class="font-weight-bold">Stock</span>
        <v-text-field
          suffix="unidades"
          dense
          hide-details
          outlined
          v-model="newProduct.stock"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <span class="font-weight-bold">Stock Mínimo</span>
        <v-text-field
          suffix="unidades"
          dense
          hide-details
          outlined
          v-model="newProduct.minStock"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <span class="font-weight-bold">Precio Compra</span>
        <v-text-field
          prefix="S/."
          dense
          hide-details
          outlined
          v-model="newProduct.price"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <span class="font-weight-bold">Precio Venta</span>
        <v-text-field
          prefix="S/."
          dense
          hide-details
          outlined
          v-model="newProduct.purchasePrice"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <span class="font-weight-bold">Descripción</span>
        <v-textarea
          hide-details
          placeholder="Ingresa una descripción"
          outlined
          v-model="newProduct.description"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-btn :loading="loadingButton" color="success" @click="saveProduct(newProduct)">Guardar cambios</v-btn>
  </v-container>
</template>

<script>
import dateFormat from "../../tools/customDate";
import Product from "../../classes/Product";
import { customCopyObject } from "../../tools/customCopyObject";
import { customHttpRequest } from "../../tools/customHttpRequest";
export default {
  data() {
    return {
      loadingButton: false,
      newProduct: customCopyObject(Product)
    };
  },
  mounted() {},
  computed: {
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
  methods: {
    saveProduct(product) {
      //create new product
      this.loadingButton = true;
      customHttpRequest(
        "post",
        "/api/products/create",
        product,
        (err, callback) => {
          if (err) {
            return (this.loadingButton = false);
          }
          this.loadingButton = false;
          this.newProduct = customCopyObject(Product);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>