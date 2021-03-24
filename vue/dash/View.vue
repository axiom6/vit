
<template>
  <div class="view-pane" ref="viewElem">
    <template v-for="view in routeNames">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import {inject, ref, onMounted, nextTick } from 'vue'

  let View = {

    setup() {

      const mix = inject( 'mix' );
      const nav = inject( 'nav' );
    
      const viewElem   = ref(null);
      const routeNames = mix.routeNames();

      onMounted( function () {
        nextTick( function() {          // Enable touch events inside all views}
          let elem = viewElem.value;
          let touchClasses = ['view-pane', 'prac-pane','prac-dirs-pane','conn-prac','prac-desc-pane'];
          nav.touch.listen( elem, touchClasses ); } ) } )

    return { viewElem, routeNames }; }
      
  }

  export default View;

</script>

<style lang="less">

      .view-pane {}
  
</style>

<!--
    mounted: function () {
      this.$nextTick( function() {

      } ) }

    pointer-events:none;
    setup() {
      const elem = ref(null)

      onMounted(() => {
        this.nav.touch.listen(elem);
      })

      return {elem}
    }
    -->



