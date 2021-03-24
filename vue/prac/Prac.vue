
<template>
  <div   class="prac-pane">
    <b-tabs :route="route" :pages="pages"></b-tabs>
    <div class="prac-prac"  v-if="isPrac(pracObj)">
      <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
      <p-conn   v-if="pages['Conn'].show" :pracObj="pracObj" level="Prac"></p-conn>
      <p-desc v-show="pages['Desc'].show" :pracObj="pracObj"></p-desc>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Dirs from './Dirs.vue';
  import Conn from '../comp/Conn.vue';
  import Desc from './Desc.vue';
  import { inject, ref, onMounted, onBeforeMount } from 'vue';
  
  let Prac = {

    components:{ 'b-tabs':Tabs, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

    setup() {

      const mix = inject( 'mix' );
      const nav = inject( 'nav' );

      const route   = "Prac";
      const pracObj = ref(null);
      let   count   = 0;
      
      const pages = {
        Dirs: { title:'Disciplines',  key:'Dirs', show:true  },
        Conn: { title:'Connections',  key:'Conn', show:false },
        Desc: { title:'Descriptions', key:'Desc', show:false } };

      const onPrac = function( obj ) {
        if( !mix.isDef(pracObj.value) || pracObj.value.name !== obj.pracKey ) {
             // console.log( 'Prac.onPrac() obj', obj );
             pracObj.value = mix.pracObject( obj.compKey, obj.inovKey, obj.pracKey );
             pracObj.value.count = { name:'count', count:count++ };
             nav.setPages( route, pages ); } }
             
      const onNav = function( obj ) {
        // console.log( 'Prac.onNav() obj', { obj:obj, route:route } );
        if( nav.isMyNav( obj, route ) ) {
            onPrac( obj ); } }

      const isPrac = function( pracObj ) {
        return mix.isChild( pracObj.name ); }

    onBeforeMount( function () {
      let obj = {}
      obj.compKey = nav.compKey;
      obj.pracKey = nav.pracKey;
      obj.inovKey = nav.inovKey;
      onPrac( obj );  } )

    onMounted( function () {
      // console.log( 'Prac.mounted()', { route:route } );
      nav.setPages( route, pages );
      mix.subscribe(  "Nav", 'Prac.vue', (obj) => {
        onNav(obj); } ); } )
      
    return { route, pracObj, pages, isPrac }; }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @pracFS:2.0*@themeFS;
  
  .prac-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    
    .prac-prac { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-gray; font-size:@pracFS; border-radius:0.5*@pracFS; } }
  
</style>

