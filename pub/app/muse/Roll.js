
import Vue         from 'rollup-plugin-vue'
import Coffee      from 'rollup-plugin-coffee-script'
import Less        from 'rollup-plugin-less'
import NodeResolve from "rollup-plugin-node-resolve";
import commonjs    from 'rollup-plugin-commonjs';


export default [
  { input:          'pub/app/muse/Muse.coffee',
    output: { file: 'pub/app/muse/Muse.js', format:'esm' },
    plugins: [ Vue(), Coffee(), Less(), NodeResolve(), commonjs({extensions:['.js','.coffee']} ) ] },
  { input:          'pub/app/muse/Home.vue',
    output: { file: 'pub/app/muse/Home.js', format:'esm' },
    plugins: [ Vue(), Coffee(), Less(), NodeResolve(), commonjs() ] }

  ]

