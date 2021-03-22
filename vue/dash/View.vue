
<template>
  <div class="view-pane" :ref="refn">
    <template v-for="view in routeNames">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">

  export default {
    
    data() { return { refn:'view', routeNames:this.mix().routeNames() }; },
    
    methods:{
      show:function() {
        return this.$route.name===null } },

    mounted: function () {
      this.$nextTick( function() {
        let elem = this.$refs['view'];
        let touchClasses = ['view-pane', 'prac-pane','prac-dirs-pane','conn-prac','prac-desc-pane'];
        this.nav().touch.listen( elem, touchClasses );
      } ) }// Enable touch events inside all views}
      
    }

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
        this.nav().touch.listen(elem);
      })

      return {elem}
    }
    -->



