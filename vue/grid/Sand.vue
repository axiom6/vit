
<template>
  <v-grid :source="rows" :columns="cols"></v-grid>
</template>

<script type="module">

  import Grid from '@revolist/vue3-datagrid';

  let Sand = {

    name: 'Sand',

    components: { 'v-grid':Grid },

    setup() {

      const cols = [
          { prop: 'name',    name: 'First'  },
          { prop: 'details', name: 'Second' } ];

      const rows = [ { name: '1', details: 'Item 1' } ];

      return { cols, rows }; } }

    export default Sand;

</script>