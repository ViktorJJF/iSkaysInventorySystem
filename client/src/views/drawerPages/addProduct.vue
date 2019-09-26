<template>
  <custom-card title="Agregar modelo" icon="mdi-plus">
    <template v-slot:content>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="12">
            <span class="font-weight-bold">Modelo</span>
            <v-text-field
              hide-details
              outlined
              v-model="newProduct.model"
              placeholder="Nombre del modelo"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <span class="font-weight-bold">Tipo</span>
            <v-select
              hide-details
              v-model="newProduct.type"
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
              v-model="newProduct.brand"
              :items="brands"
              item-text="name"
              item-value="name"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <span class="font-weight-bold">Color</span>
            <v-select hide-details v-model="newProduct.color" :items="colors" outlined></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <span class="font-weight-bold">Stock</span>
            <v-text-field hide-details outlined v-model="newProduct.stock" type="number"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <span class="font-weight-bold">Precio (S/.)</span>
            <v-text-field hide-details outlined v-model="newProduct.price" type="number"></v-text-field>
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
        <v-btn color="success">Guardar cambios</v-btn>
      </v-container>
    </template>
  </custom-card>
</template>

<script>
export default {
  data() {
    return {
      newProduct: {
        model: "",
        brand: "",
        type: "",
        color: "NEGRO",
        stock: 0,
        price: 0,
        description: ""
      }
    };
  },
  mounted() {
    this.newProduct.brand = this.brands[0].name;
    this.newProduct.type = this.types[0].name;
  },
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
  }
};
</script>

<style lang="scss" scoped>
</style>