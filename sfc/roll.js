
import VueRollup   from 'rollup-plugin-vue'
//port VueTemplate from 'vue-template-compiler'
import LessRollup  from 'rollup-plugin-less'
import NodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs'
//port CssOnly     from 'rollup-plugin-css-only'
import PostCss     from 'rollup-plugin-postcss'

const opts = { target:'browser', preprocessStyles:true, css:true };
//nst post = { plugins:[], inject:true, modules: true, exec:true, use:['less'] };
//nst usep = { less: { javascriptEnabled:true }, stylus: null, sass: null };
//nst post = { minimize:false, modules:true, extract:false }; // , use:usep

export default [
  { input: 'vue/elem/Area.vue', output: { file: 'pub/vue/elem/Area.js', format:'esm' }, // PostCss(post),
    plugins: [ VueRollup(opts), LessRollup(), NodeResolve(), commonjs() ] },
  { input: 'vue/elem/Icon.vue', output: { file: 'pub/vue/elem/Icon.js', format:'esm' },
    plugins: [ VueRollup(opts), LessRollup(), NodeResolve(), commonjs() ] },               // CssOnly(),
  { input: 'vue/elem/Item.vue', output: { file: 'pub/vue/elem/Item.js', format:'esm' },
    plugins: [ VueRollup(opts), LessRollup(), NodeResolve(), commonjs() ] },
  { input: 'vue/elem/Btns.vue', output: { file: 'pub/vue/elem/Btns.js', format:'esm' },
    plugins: [ VueRollup(opts), LessRollup(), NodeResolve(), commonjs() ] },  
  { input: 'vue/elem/Tabs.vue', output: { file: 'pub/vue/elem/Tabs.js', format:'esm' },
    plugins: [ VueRollup(opts), LessRollup(), NodeResolve(), commonjs() ] }

]