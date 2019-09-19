<template>
  <v-app id="keep">
    <v-app-bar dark app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5">FULL TEC</span>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text color="white" dark v-on="on">
            ejemplo@gmail.com
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item>
          <v-img
            aspect-ratio="1.7"
            contain
            src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
          ></v-img>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">John Leider</v-list-item-title>
            <v-list-item-subtitle>ejemplo@gmail.com</v-list-item-subtitle>
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

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    items: [
      { icon: "mdi-format-list-bulleted", text: "Tipos", to: "type" },
      { icon: "mdi-cellphone-dock", text: "Marcas", to: "brand" }
    ],
    expansionItems: [
      {
        icon: "mdi-cellphone-settings",
        title: "Producto",
        items: [
          {
            icon: "mdi-library-plus",
            title: "Agregar producto",
            to: "addProduct"
          },
          {
            icon: "mdi-format-list-checks",
            title: "Listado de productos",
            to: "listProduct"
          }
        ]
      },
      {
        icon: "mdi-chart-line",
        title: "Órdenes",
        items: [
          {
            icon: "mdi-library-plus",
            title: "Agregar orden",
            to: "addOrder"
          },
          {
            icon: "mdi-format-list-checks",
            title: "Historial de órdenes",
            to: "orderHistory"
          }
        ]
      }
    ]
  })
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>