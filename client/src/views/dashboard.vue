<template>
  <v-app id="keep">
    <toolbar />
    <drawer />
    <v-content v-if="isDataReady">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
    <v-overlay :value="overlay">
      <v-progress-circular :size="70" :width="3" color="primary" indeterminate></v-progress-circular>
      <p class="ml-n3">{{overlayText}}</p>
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    isDataReady: false
  }),
  computed: {
    overlay() {
      return this.$store.state.overlay.active;
    },
    overlayText() {
      return this.$store.state.overlay.text;
    }
  },
  mounted() {
    this.initialData();
  },
  methods: {
    async initialData() {
      this.$store.dispatch("showOverlay", true);
      //initial brands
      await this.$store.dispatch("loadInitialBrands");
      //initial types
      await this.$store.dispatch("loadInitialTypes");
      //initial colors
      await this.$store.dispatch("loadInitialColors");
      //initial inventory
      await this.$store.dispatch("loadInitialInventory");
      //count orders
      await this.$store.dispatch("countOrders");
      //count purchases
      await this.$store.dispatch("countPurchases");
      this.isDataReady = true;
      this.$store.dispatch("showOverlay", false);
      this.$store.dispatch("showSnackbar", {
        text: "Bienvenido",
        color: "success"
      });
    }
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>