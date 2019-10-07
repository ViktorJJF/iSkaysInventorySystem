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
      <v-row>
        <v-col cols="12" sm="6" lg="4">
          <material-stats-card
            sub-icon="mdi-update"
            sub-text="Justo Ahora"
            color="green"
            icon="mdi-account"
            title="Usuarios"
            :value="1"
            small-value="usuarios"
          />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <material-stats-card
            sub-icon="mdi-update"
            sub-text="Justo Ahora"
            color="orange"
            icon="mdi-content-copy"
            title="Productos"
            :value="$store.getters.getProducts.length"
            small-value="Unidades"
          />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <material-stats-card
            color="red"
            icon="mdi-cellphone-dock"
            title="Marcas"
            :value="brands.length"
            sub-icon="mdi-update"
            sub-text="Justo Ahora"
            small-value="marcas"
          />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <material-stats-card
            color="indigo"
            icon="mdi-format-list-bulleted"
            title="Tipos"
            :value="types.length"
            sub-icon="mdi-update"
            sub-text="Justo Ahora"
            small-value="tipos"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="4">
          <material-stats-card
            color="purple"
            icon="mdi-chart-line"
            title="Ventas"
            :value="$store.getters.getTotalOrders"
            sub-icon="mdi-update"
            sub-text="Justo Ahora"
            small-value="completadas"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="4">
          <material-stats-card
            color="pink"
            icon="mdi-store"
            title="Compras"
            :value="$store.getters.getTotalPurchases"
            sub-icon="mdi-update"
            sub-text="Justo Ahora"
            small-value="completadas"
          />
        </v-col>
      </v-row>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="4">
            <material-chart-card
              :data="dailySalesChart.data"
              :options="dailySalesChart.options"
              color="info"
              type="Line"
            >
              <h4 class="title font-weight-light">Ventas mensuales</h4>

              <p class="category d-inline-flex font-weight-light">
                <v-icon color="green" small>mdi-arrow-up</v-icon>
                <span class="green--text">0%</span>&nbsp;
                incremento de ventas este mes
              </p>

              <template v-slot:actions>
                <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
                <span class="caption grey--text font-weight-light">actualizado justo ahora</span>
              </template>
            </material-chart-card>
          </v-col>
          <v-col cols="12" lg="4">
            <material-chart-card
              :data="emailsSubscriptionChart.data"
              :options="emailsSubscriptionChart.options"
              color="red"
              type="Line"
            >
              <h4 class="title font-weight-light">Compras mensuales</h4>
              <p class="category d-inline-flex font-weight-light">
                <v-icon color="green" small>mdi-arrow-up</v-icon>
                <span class="green--text">0%</span>&nbsp;
                incremento de compras este mes
              </p>
              <template v-slot:actions>
                <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
                <span class="caption grey--text font-weight-light">actualizado justo ahora</span>
              </template>
            </material-chart-card>
          </v-col>
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
      emailsSubscriptionChart: {
        data: {
          labels: [
            "En",
            "Fe",
            "Ma",
            "Ab",
            "May",
            "Jun",
            "Jul",
            "Ag",
            "Se",
            "Oc",
            "No",
            "Di"
          ],
          series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dailySalesChart: {
        data: {
          labels: [
            "En",
            "Fe",
            "Ma",
            "Ab",
            "May",
            "Jun",
            "Jul",
            "Ag",
            "Se",
            "Oc",
            "No",
            "Di"
          ],
          series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
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
            this.dailySalesChart.data.series[0][parseInt(data._id)] =
              data.count;
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
