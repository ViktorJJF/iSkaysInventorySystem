<template>
  <v-overlay :value="overlay">
    <v-progress-circular z-index="1" :size="70" :width="3" color="primary" indeterminate></v-progress-circular>
    <!-- <p class="ml-n3">{{overlayText}}</p> -->
  </v-overlay>
</template>

<script>
export default {
  computed: {
    overlay() {
      return this.$store.state.overlay.active;
    },
    overlayText() {
      return this.$store.state.overlay.text;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>