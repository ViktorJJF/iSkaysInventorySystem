<template>
  <v-navigation-drawer dark v-model="drawer" app>
    <v-list>
      <v-list-item>
        <v-img aspect-ratio="1.7" contain src="/images/fulltec.jpeg"></v-img>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">{{user}}</v-list-item-title>
          <v-list-item-subtitle>{{email}}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon>mdi-menu-down</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list rounded>
      <template v-for="(item, i) in items">
        <v-list-item :key="i" @click :to="{name:item.to}">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-group
        color="white"
        v-for="item in expansionItems"
        :key="item.title"
        v-model="item.active"
        :prepend-icon="item.icon"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          :to="{name:subItem.to}"
          v-for="subItem in item.items"
          :key="subItem.title"
          @click
        >
          <v-list-item-icon>
            <v-icon>{{ subItem.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "mdi-chart-bar",
          text: "Estadísticas",
          to: "statistics"
        },
        {
          icon: "mdi-format-list-checks",
          text: "Inventario",
          to: "listProduct"
        },

        { icon: "mdi-format-list-bulleted", text: "Tipos", to: "type" },
        { icon: "mdi-cellphone-dock", text: "Marcas", to: "brand" }
      ],
      expansionItems: [
        {
          icon: "mdi-cellphone-link",
          title: "Modelos",
          items: [
            {
              icon: "mdi-library-plus",
              title: "Agregar modelo",
              to: "addProduct"
            }
          ]
        },
        {
          icon: "mdi-chart-line",
          title: "Ventas",
          items: [
            {
              icon: "mdi-library-plus",
              title: "Agregar venta",
              to: "addOrder"
            },
            {
              icon: "mdi-format-list-checks",
              title: "Historial de ventas",
              to: "orderHistory"
            }
          ]
        }
      ]
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.toolbar.drawerIcon;
      },
      set(newValue) {
        this.$store.state.toolbar.drawerIcon = newValue;
      }
    },
    user() {
      return this.$store.state.user.firstName;
    },
    email() {
      return this.$store.state.user.email;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>