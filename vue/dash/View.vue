
<template>
  <div class="view-pane" :ref="domName">
    <template v-for="view in routeNames">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">

  //import { ref, onMounted } from 'vue';
  
  export default {
    
    data() { return { domName:'view', routeNames:this.mix().routeNames() }; },
    
    methods:{
      show:function() {
        return this.$route.name===null } },
    
    mounted: function () {
      this.$nextTick( function() {
        let elem = this.$refs['view']
        this.nav().touch.listen( elem ); // Enable touch events inside all views
      } ) }
      
    }

</script>

<style lang="less">

      .view-pane {}
  
</style>

<!--
    setup() {
      const elem = ref(null)

      onMounted(() => {
        this.nav().touch.listen(elem);
      })

      return {elem}
    }
    -->



