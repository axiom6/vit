
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import NodeResolve from 'rollup-plugin-node-resolve'
import commonjs   from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/prac/Prac.vue', output: { file: 'pub/vue/prac/Prac.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] },
  { input: 'vue/comp/Conn.vue', output: { file: 'pub/vue/comp/Conn.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] }
]