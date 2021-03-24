
<template>
  <div class="prac-disp-pane" @click="doDisp(dispObj.name)">
    <i   :class="dispObj.icon"></i>
    <span class="prac-disp-name">{{dispObj.name}}</span>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';

  let Disp = {
    
    props: { dispObj:Object },

    setup( ) {

      const nav = inject( 'nav' );

      const doDisp = function (dispKey) {
        let obj = { route:"Disp", dispKey:dispKey };
        nav.pub( obj ); }

    return { doDisp }; }
  }
  
  export default Disp;
  
</script>

<style lang="less">

  @import '../../pub/css/themes/theme.less';
  
  @pracDispFS:@themeFS;

  .prac-disp-pane {   display:inline; justify-self:center; align-self:center; text-align:center;
     i     {          display:inline-block;  margin-right: 0.25*@pracDispFS; }
    .prac-disp-name { display:inline-block; } }

</style>