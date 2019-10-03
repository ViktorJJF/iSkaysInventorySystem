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
            title="Productos(Modelos)"
            :qty="$store.getters.getProducts.length"
            color="#FF7858"
            icon="mdi-cellphone-link"
          ></dashboard-card>
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
          <dashboard-card
            title="Ventas"
            :qty="$store.getters.getTotalOrders"
            color="#FED762"
            icon="mdi-chart-line"
          ></dashboard-card>
        </v-col>
        <v-col cols="12" sm="3">
          <dashboard-card
            title="Compras"
            :qty="$store.getters.getTotalPurchases"
            color="#FED762"
            icon="mdi-store"
          ></dashboard-card>
        </v-col>
      </v-row>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="5">
            <v-card outlined>
              <v-card-title>
                <span class="headline">Ventas mensuales</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-container fluid>
                <apex-chart
                  v-if="isDataReady"
                  width="500"
                  type="line"
                  :options="options"
                  :series="series"
                ></apex-chart>
              </v-container>
            </v-card>
          </v-col>
          <!-- <v-col cols="12" sm="6">
            <v-card outlined>
              <v-card-title>
                <span class="headline">Ventas anuales</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-container fluid>
                <apex-chart width="500" type="bar" :options="options" :series="series2"></apex-chart>
              </v-container>
            </v-card>
          </v-col>-->
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
      isDataReady: false,
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ],
      options: {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
          ]
        }
      },
      series: [
        {
          name: "Cantidad",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };
  },
  components: {
    dashboardCard,
    apexChart
  },
  mounted() {
    this.getInitialData();
  },
  methods: {
    async getInitialData() {
      //count orders
      await this.$store.dispatch("countOrders");
      //count purchases
      await this.$store.dispatch("countPurchases");
      axios
        .get("/api/orders/count-by-date")
        .then(res => {
          let datas = res.data.payload;
          datas.forEach(data => {
            this.series[0].data[parseInt(data._id)] = data.count;
          });
          this.isDataReady = true;
        })
        .catch(err => {
          console.error(err);
        });
    }
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
