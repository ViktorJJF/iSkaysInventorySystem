<template>
  <v-container fluid>
    <v-card outlined>
      <v-container fluid>
        <h1>Agregar modelo</h1>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <p class="body-1 font-weight-bold">Modelo</p>
            <v-text-field outlined v-model="newProduct.model" placeholder="Nombre del modelo"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <p class="body-1 font-weight-bold">Tipo</p>
            <v-select
              v-model="newProduct.type"
              :items="types"
              item-text="name"
              item-value="name"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <p class="body-1 font-weight-bold">Marca</p>
            <v-select
              v-model="newProduct.brand"
              :items="brands"
              item-text="name"
              item-value="name"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="body-1 font-weight-bold">Color</p>
            <v-select v-model="newProduct.color" :items="colors" outlined></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="body-1 font-weight-bold">Stock</p>
            <v-text-field outlined v-model="newProduct.stock" type="number"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="body-1 font-weight-bold">Precio (S/.)</p>
            <v-text-field outlined v-model="newProduct.price" type="number"></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <p class="body-1 font-weight-bold">Descripción</p>
            <v-textarea
              placeholder="Ingresa una descripción"
              outlined
              v-model="newProduct.description"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-btn color="success">Guardar cambios</v-btn>
      </v-container>
    </v-card>
  </v-container>
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