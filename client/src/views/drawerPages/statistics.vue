<template>
  <v-container>
    <h1>Tablero de control</h1>
    <v-row>
      <v-col cols="12" sm="4">
        <dashboard-card title="Usuarios" :qty="3" color="#91C968"></dashboard-card>
      </v-col>
      <v-col cols="12" sm="4">
        <dashboard-card title="Categorías" :qty="3"></dashboard-card>
      </v-col>
      <v-col cols="12" sm="4">
        <dashboard-card title="Productos" :qty="3"></dashboard-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dashboardCard from "../components/dashboardCard";
export default {
  components: {
    dashboardCard
  }
};
</script>
<style>
</style>
