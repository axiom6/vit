
<template>
  <div class="disp-pane">
    <d-tabs :route="route" :pages="pages"></d-tabs>
    <d-dims v-if="pages['Dims'].show" :dispObj="dispObj" from="Disp"></d-dims>
    <d-desc v-if="pages['Desc'].show" :dispObj="dispObj" from="Disp"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Dims from '../prac/Dims.vue';
  import Desc from './Desc.vue';
  import { inject, ref, onMounted } from 'vue'
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-dims':Dims, 'd-desc':Desc },

    setup() {

      const mix = inject( 'mix' );
      const nav = inject( 'nav' );
    
      const route   = "Disp";
      const dispObj = ref(null);
      const pages   = {
        Dims: { title:'Disciplines',  key:'Dims', show:true  },
        Desc: { title:'Descriptions', key:'Desc', show:false } };

      const onDisp = function( obj ) {
          nav.setPages( route, pages );
          dispObj.value = mix.dispObject( obj.compKey, obj.inovKey, obj.pracKey, obj.dispKey, true );
          if( !mix.isDef(dispObj.value) ) {
            console.error('Disp.onDisp() disp null',{comp:obj.compKey, prac:obj.pracKey, disp:obj.dispKey } ) } }

        const onNav =  function (obj) {
          if( nav.isMyNav( obj, 'Disp' ) ) {
              onDisp( obj ); } }

        onMounted( function () {
          nav.setPages( route, pages );
          mix.subscribe(  "Nav", 'Disp.vue', (obj) => {
            onNav(obj); } ); } )

    return { route, pages, dispObj} }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disp-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-gray; }
  
</style>

