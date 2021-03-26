
<template>
  <div class="disp-pane" :key="dispIdx"><!-- -->
    <d-tabs :route="'Disp'" :pages="pages"></d-tabs>
    <d-dims v-if="pages['Dims'].show" :dispObj="dispObj" :from="'Disp'"></d-dims>
    <d-desc v-if="pages['Desc'].show" :dispObj="dispObj" :from="'Disp'"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Dims from '../prac/Dims.vue';
  import Desc from './Desc.vue';
  import { inject, ref, onBeforeMount, onMounted } from 'vue'
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-dims':Dims, 'd-desc':Desc },

    setup() {

      const mix     = inject( 'mix' );
      const nav     = inject( 'nav' );
      const dispObj = ref(null);
      const dispIdx = ref(0);
      const pages   = {
        Dims: { title:'Disciplines',  key:'Dims', show:true  },
        Desc: { title:'Descriptions', key:'Desc', show:false } };

      const onDisp = function( obj ) {
        dispObj.value = mix.dispObject( obj.compKey, obj.inovKey, obj.pracKey, obj.dispKey );
        dispIdx.value++;
        if( mix.isDef(dispObj.value) ) {
          console.log('Disp.onDisp()',
              { comp:obj.compKey, inov:obj.inovKey, prac:obj.pracKey, disp:obj.dispKey, dispObj:dispObj.value } ); }
        else {
          console.error('Disp.onDisp() disp null',
              { comp:obj.compKey, inov:obj.inovKey, prac:obj.pracKey, disp:obj.dispKey } ); }
      }

      const onNav =  function (obj) {
        if( nav.isMyNav( obj, 'Disp' ) ) {
            console.log( 'Disp.onNav() ');
            onDisp( obj ); } }

      onBeforeMount( function () {
        // console.log( 'Disp.onBeforeMount() ');
        let obj = {}
        obj.compKey = nav.compKey;
        obj.pracKey = nav.pracKey;
        obj.inovKey = nav.inovKey;
        obj.dispKey = nav.dispKey;
        onDisp( obj );  } )

      onMounted( function () {
        // console.log( 'Disp.onMounted() ');
        nav.setPages( 'Disp', pages );
        mix.subscribe(  "Nav", 'Disp.vue', (obj) => {
          onNav(obj); } ); } )

    return { pages, dispObj, dispIdx } }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disp-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-back; }
  
</style>

