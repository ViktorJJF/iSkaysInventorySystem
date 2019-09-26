<template>
  <custom-card title="Estadísticas" icon="mdi-chart-bar">
    <template v-slot:content>
      <div v-for="product in getProducts" :key="product.id">
        <v-alert prominent type="warning" v-show="product.stock<5">
          <v-row align="center">
            <v-col class="grow">
              Tu producto
              <strong class="underline">{{product.model}}</strong>
              está a punto de agotarse (stock actual: {{product.stock}})
            </v-col>
          </v-row>
        </v-alert>
      </div>
      <v-row justify="center">
        <v-col cols="12" sm="3">
          <dashboard-card title="Usuarios" :qty="1" color="#91C968" icon="mdi-account"></dashboard-card>
        </v-col>
        <v-col cols="12" sm="3">
          <dashboard-card
            title="Tipos"
            :qty="types.length"
            color="#FF7858"
            icon="mdi-format-list-bulleted"
          ></dashboard-card>
        </v-col>
        <v-col cols="12" sm="3">
          <dashboard-card
            title="Marcas"
            :qty="brands.length"
            color="#7BCBEE"
            icon="mdi-cellphone-dock"
          ></dashboard-card>
        </v-col>
        <v-col cols="12" sm="3">
          <dashboard-card title="Modelos" :qty="3" color="#FF7858" icon="mdi-cellphone-link"></dashboard-card>
        </v-col>
        <v-col cols="12" sm="3">
          <dashboard-card title="Ventas" :qty="0" color="#FED762" icon="mdi-chart-line"></dashboard-card>
        </v-col>
      </v-row>
      <v-container>
        <v-row justify="space-around">
          <v-card outlined>
            <v-card-title>
              <span class="headline">Ganancias anuales</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-container fluid>
              <apex-chart width="500" type="line" :options="options" :series="series"></apex-chart>
            </v-container>
          </v-card>
          <v-card outlined>
            <v-card-title>
              <span class="headline">Ventas anuales</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-container fluid>
              <apex-chart width="500" type="bar" :options="options" :series="series2"></apex-chart>
            </v-container>
          </v-card>
        </v-row>
      </v-container>
    </template>
  </custom-card>
</template>

<script>
import dashboardCard from "../components/dashboardCard";
import apexChart from "vue-apexcharts";
export default {
  data() {
    return {
      options: {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: [2017, 2018, 2019, 2020, 2021]
        }
      },
      series: [
        {
          name: "Ganancias (S/.)",
          data: [3000, 4000, 4500, 5000, 7000]
        }
      ],
      series2: [
        {
          name: "Ventas (S/.)",
          data: [3000, 4000, 4500, 5000, 7000]
        }
      ]
    };
  },
  components: {
    dashboardCard,
    apexChart
  },
  computed: {
    getProducts() {
      return this.$store.getters.getProducts;
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
  }
};
</script>
<style>
.underline {
  text-decoration: underline;
}
</style>
