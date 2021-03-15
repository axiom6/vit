import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import LessRollup       from 'rollup-plugin-less'

export default( { command, mode } ) => {
  console.log( 'vite.config.js', { command:command, mode:mode } )

  if( command === 'build' ) {
    return defineConfig({
      plugins: [vue()] } )
  }
  else {
    return defineConfig({
      plugins: [vue()],
      build: { rollupOptions:{ plugins:LessRollup() } } } )
     }
}
