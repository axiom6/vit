
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  // import Btns from "./Btns";

  let Tabs = {

    props: { route:String, pages:Object, position:{ default:'full', type:String } },
    
    data() { return { pageKey:'None', pageObj:null,
      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
    
    methods: {
      doTabs: function () {
        this.nav().setPages(this.route,this.pages); // Will only set pages if needed
        let first   = this.pageKey==='None' && !this.mix().hasInov(this.route);
        let pageKey = this.nav().getPageKey(this.route);
        // console.log( 'Tabs.init()', obj, { route:this.route, pageKey:pageKey, pages:this.pages } );
        if( first ){ this.doPage(pageKey); }
        else       { this.onPage(pageKey); } },
      isPage: function (pageKey) {
        return this.mix().isDef(this.route) && this.mix().isDef(pageKey); },
      onPage: function (pageKey) {
        if( this.isPage(pageKey) ) {
          this.pageKey = pageKey;
          this.nav().setPageKey( this.route, pageKey ); }
        else {
          console.log( 'Tabs.onPage() bad pageKey', { route:this.route, pageKey:pageKey } ); } },
      doPage: function (pageKey) {
        if( this.isPage(pageKey) ) {
            this.onPage(pageKey) ;
            let obj = { source:'Tabs',route:this.route }
            obj.inovKey = this.mix().hasInov(this.route) ? pageKey : 'None';
             this.nav().pub(obj); } },
      stylePos: function () {
        return this.positions[this.position]; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },
    mounted: function() {
      this.doTabs();
      this.mix().subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs'  ) { // && obj.route === this.route
          this.$nextTick( function() {
            this.doTabs(); } ); } } ); }
    }

  export default Tabs;
  
</script>

<style scoped>

.theme-h1 {
  font-size: 8vmin;
  margin: 2vmin 0 2vmin 0;
  display: grid;
  justify-self: center;
  align-self: center;
  text-align: center;
}
.theme-h2 {
  font-size: 6.4vmin;
  margin: 1.6vmin 0 1.6vmin 0;
  display: grid;
  justify-self: center;
  align-self: center;
  text-align: center;
}
.theme-h3 {
  font-size: 5.12vmin;
  margin: 1.28vmin 0 1.28vmin 0;
  display: grid;
  justify-self: center;
  align-self: center;
  text-align: center;
}
.theme-h4 {
  font-size: 4vmin;
  margin: 1.024vmin 0 1.024vmin 0;
  display: grid;
  justify-self: center;
  align-self: center;
  text-align: center;
}
.theme-h5 {
  font-size: 3.2vmin;
  margin: 0.82vmin 0 0.82vmin 0;
  display: grid;
  justify-self: center;
  align-self: center;
  text-align: center;
}
.theme-h6 {
  font-size: 2.56vmin;
  margin: 0.656vmin 0 0.656vmin 0;
  display: grid;
  justify-self: center;
  align-self: center;
  text-align: center;
}
.theme-p {
  font-size: 2vmin;
  margin: 0.524vmin 0 0.524vmin 0;
  display: grid;
  justify-self: start;
  align-self: center;
  text-align: left;
}
.theme-article {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.theme-header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 20%;
}
.theme-section {
  position: absolute;
  left: 0;
  top: 20%;
  width: 100%;
  height: 60%;
}
.theme-footer {
  position: absolute;
  left: 0;
  top: 80%;
  width: 100%;
  height: 20%;
}
.theme-ul {
  font-size: 4vmin;
  padding: 0;
  margin: 0;
  list-style: none;
  font-weight: bold;
}
.theme-ul li {
  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;
}
.theme-ul li ul {
  font-size: 3.5vmin;
  padding: 0;
  margin: 0;
  list-style: none;
}
.theme-ul li ul li {
  padding-left: 1vmin;
  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;
}
.theme-ul li ul li ul {
  font-size: 3vmin;
  padding: 0;
  margin: 0;
  list-style: none;
}
.theme-ul li ul li ul li {
  padding-left: 1vmin;
  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;
}
.tabs-pane {
  background-color: black;
  font-size: 3vmin;
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 5%;
}
.tabs-pane .tabs-tab {
  display: inline-block;
  margin-left: 2rem;
  padding: 0.2rem 0.3rem 0.1rem 0.3rem;
  border-radius: 12px 12px 0 0;
  border-left: wheat solid thin;
  border-top: wheat solid thin;
  border-right: wheat solid thin;
  background-color: black;
  color: wheat;
}
.tabs-pane .tabs-tab:hover {
  background-color: tan;
  color: black;
}
.tabs-pane .tabs-tab-active {
  display: inline-block;
  margin-left: 2rem;
  padding: 0.2rem 0.3rem 0.1rem 0.3rem;
  border-radius: 12px 12px 0 0;
  border-left: wheat solid thin;
  border-top: wheat solid thin;
  border-right: wheat solid thin;
  background-color: black;
  color: wheat;
}

  
</style>