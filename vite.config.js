import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import LessRollup       from 'rollup-plugin-less'

//port { promises:fs }              from 'fs'
const { promises: fs } = require("fs")
import path             from 'path'

export default( { command, mode } ) => {

  if( command === 'build' ) {
    console.log( 'vite.config.js build', { command:command, mode:mode } );
    return defineConfig({
      plugins: [vue()] } )
  }
  else if( command === 'serve' ) {
    console.log( 'vite.config.js serve', { command:command, mode:mode } );
    return defineConfig({
      plugins: [vue()] } )
  }
  else {
    return defineConfig({
      plugins: [vue()],
      build: { rollupOptions:{ plugins:LessRollup() } } } )
  }
}
