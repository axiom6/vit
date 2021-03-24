
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref } from 'vue';

  let Tabs = {

    props: { route:String, pages:Object, position:{ default:'full', type:String } },

    setup( props ) {

      const mix = inject( 'mix' );
      const nav = inject( 'nav' );

      nav.setPages(props.route,props.pages);

      const pageKey   = ref( nav.getPageKey(props.route) );
      const pageObj   = null;
      const positions = { left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } };

      const isPage = function (pageArg) {
        return mix.isDef(props.route) && mix.isDef(pageArg); }
      const onPage = function (pageArg) {
        pageKey.value = pageArg;
        if( isPage( pageArg ) ) {
          //console.log( 'Tabs.onPage()', { pageKey:pageKey.value, pageArg:pageArg } )
          nav.setPageKey( props.route, pageArg ); }
        else {
          console.log( 'Tabs.onPage() bad pageKey', { route:props.route, pageKey:pageArg } ); } }
      const doPage = function (pageArg) {
        if( isPage(pageArg) ) {
            onPage(pageArg) ;
            let obj = { source:'Tabs',route:props.route }
            obj.inovKey = mix.hasInov(props.route) ? pageArg : 'None';
            nav.pub(obj); } }
      const stylePos = function () {
        return positions[props.position]; }
      const classTab = function (pageArg) {
        // console.log( 'Tabs.classTab', { pageKey:pageKey.value, pageArg:pageArg } )
        return pageKey.value===pageArg ? 'tabs-tab-active' : 'tabs-tab'; }
      
    return { pageObj, doPage, classTab, stylePos } }

    }

  export default Tabs;
  
</script>

<style scoped lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @tabsFS:3.0*@themeFS;
  
  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;
    position:absolute; left:0; top:@theme-tabs-height*0.5; width:@theme-tabs-width; height:@theme-tabs-height;
    
    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;
      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;
      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;
                                    background-color:@theme-back; color:@theme-fore; }
    .tabs-tab:hover  {              background-color:@theme-hove; color:@theme-back; }
    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }
  
</style>

<!--
      const init = function ()  {
        nav.setPages(props.route,props.pages); // Will only set pages if needed
        let pageArg = nav.getPageKey(props.route);
        console.log( 'Tabs.init()', { route:props.route, pageKey:pageKey.value, pages:props.pages } );
        onPage(pageArg); }

      onMounted( function() {
        mix.subscribe(  "Nav", 'Tabs.vue.'+props.route, (obj) => {
          if( obj.source !== 'Tabs'  ) {
            nextTick( function() {
              init(); } ) } } ) } )
-->