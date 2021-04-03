

<template>
  <div      class="comp-grid-pane">
    <v-revo :source="rows" :columns="cols"></v-revo>
  </div>
</template>

<script type="module">

import Revo from '@revolist/vue3-datagrid';


let Grid = {

  props: { compObj:Object },

  name: 'Grid',

  components: { 'v-revo':Revo },

  setup() {

    const cols = [
      { prop: 'name',    name: 'First'  },
      { prop: 'details', name: 'Second' } ];

    const rows = [ { name: '1', details: 'Item 1' } ];

    return { cols, rows }; }

}
export default Grid;

</script>

<style lang="less">

  @import '../../pub/css/themes/theme.less';

  @gridFS:@themeFS;
  @summFS:1.4*@gridFS;

  .comp-grid-pane {   font-size:@gridFS; color:@theme-fore; border-radius:2.0*@gridFS; display:grid;
    background-color:@theme-back; position:absolute; left:20%;  top: 0;  width: 80%; height:100%;

    .comp-grid-name { font-size:4*@gridFS; color:@theme-fore; justify-self:center; align-self:center; }
  }


</style>