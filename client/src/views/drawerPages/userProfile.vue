<template>
  <div>user profile</div>
</template>

<script>
export default {
  mounted() {
    console.log("Se monto el componente userProfile");
    axios
      .get("/api/session")
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>

<style lang="scss" scoped>
</style>