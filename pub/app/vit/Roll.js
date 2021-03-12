
import Vue      from 'rollup-plugin-vue'
import Coffee   from 'rollup-plugin-coffee-script'
import Less     from 'rollup-plugin-less'
import commonjs from 'rollup-plugin-commonjs';

export default [
  { input: 'pub/vue/vit/HelloWorld.vue', output: { file: 'pub/vue/vit/HelloWorld.js', format:'esm' },
    plugins: [ Vue(), Less(), Coffee(), commonjs() ] },
  { input: 'pub/app/vit/Vit.vue',        output: { file: 'pub/app/vit/Vit.js',        format:'esm' },
    plugins: [ Vue(), Less(), Coffee(), commonjs() ] }

]

