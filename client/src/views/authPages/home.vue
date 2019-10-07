<template>
  <div>
    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageBg: "/images/loginbg.jpg"
    };
  }
};
</script>

<style lang="scss" scoped>
</style>