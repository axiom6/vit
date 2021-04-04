<template>
  <div id="app">
    <v-grid
        theme="compact"
        :source="rows"
        :columns="cols"
    ></v-grid>
  </div>
</template>

<script>
import Grid from "@revolist/vue3-datagrid";
export default {
  name: "App",
  components: { 'v-grid':Grid },
  data() {
    return {
      cols: [{ prop: "name" }, { prop: "details" }],
      rows: [{
        name: "1",
        details: "Item 1",
      }]
    };
  }
};
</script>
