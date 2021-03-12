
<template>
  <div ref="Btns" class="btns-pane">
    <template v-for="btn in btns">
      <div        :ref="btn.name"  :style="styleBlock(btn.pos)">
        <div   class="btns-center">
          <div class="btns-btn" :style="styleBtn(btn)" @click="pubBtn(btn)">
            <span v-if="btn.check" :class="classCheck(btn)"></span>
            <i    v-if="btn.icon"  :class="classIcons(btn)"></i>
            <img  v-if="btn.img"    class="image" :src="srcImg(btn)" alt=""/>
            <span v-if="btn.title"  class="title" :ref="titleRef(btn)">{{btn.title}}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  // import Data from '../../pub/base/util/Data.js';

  let Btns = {

    props: { name:String, btns:Object },

    methods: {
      pubBtn: function (btn) {
        this.mix().choose(  this.name, btn.name );
        btn.checked = this.mix().choosen( this.name, btn.name );
        // console.log( 'Btns.pubBtn()', this.name, btn.name,  btn.checked );
        this.mix().publish( this.name, btn.name ); },
      aspect: function() {  // Only call in mounted
        let w = this.$refs['Btns']['clientWidth' ];
        let h = this.$refs['Btns']['clientHeight'];
        return h/w; },
      styleBlock: function(p) {
        let sy = 1.0
        let p2 = p[2]===0 ? p[3] : p[2];
        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
        fontSize:(p[3]*0.08)+'em' } },
      styleBtn: function (btn) {
        let back = this.mix().toRgbaHsv( btn.hsv );
        return { color:'black', backgroundColor:back }; },
      classCheck: function (btn) {
        btn.checked = this.mix().choosen( this.name, btn.name );
        // console.log( 'Btns.classCheck()', { checked:btn.checked, name:this.name, choice:btn.name } );
        return btn.checked ? 'check far fa-check-square' : 'check far fa-square'; },
      classIcons: function (btn) {
        return 'icons ' + btn.icon },
      titleRef: function (btn) {
        return 'Title' + btn.name },
      srcImg: function (btn) {
        return '../../css/' + btn.img },
      adjustWidths: function() {
         let names = Object.keys(this.btns)
         for( let name of names ) {
           let btn = this.btns[name];
           if( btn.pos[2]===0 ) {
             let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth']
             btn.elem   = this.$refs[btn.name][0]
             let wb     = btn.elem['clientWidth']
             btn.pos[2] = btn.pos[3]*2.4*wt/wb
             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
             btn.elem.style.width = btn.pos[2]+'%' } }
      } },

    mounted: function () {
      this.asp = this.aspect();
      this.adjustWidths(); }

  }

   export default Btns;

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
.image-radius {
  border-radius: 8px;
  border: solid black 1px;
}
.btns-pane {
  font-size: 2.8vmin;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.btns-center {
  display: grid;
  width: 100%;
  height: 100%;
}
.btns-btn {
  display: grid;
  grid-template-columns: 20fr 24fr 56fr;
  grid-template-areas: "check icons label";
  justify-self: center;
  align-self: center;
  width: 90%;
  height: 80%;
  font-size: inherit;
  font-family: Roboto, sans-serif;
  cursor: pointer;
  border-radius: 16px;
  border: solid black 1px;
}
.check {
  grid-area: check;
  justify-self: center;
  align-self: center;
}
.icons {
  grid-area: icons;
  justify-self: center;
  align-self: center;
}
.image {
  grid-area: icons;
  justify-self: left;
  align-self: center;
  border-radius: 8px;
  border: solid black 1px;
  max-height: 1.5em;
}
.title {
  grid-area: label;
  justify-self: left;
  align-self: center;
  text-align: left;
}


</style>