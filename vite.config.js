import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import LessRollup       from 'rollup-plugin-less'
import { VitePWA }      from 'vite-plugin-pwa'

//import { promises:fs }              from 'fs'
//const { promises: fs } = require("fs")
//import path             from 'path'

const PWAOpts = {
  srcDir:       'dist',
  outDir:       'sw.js',
  registerType: 'autoUpdate',
  strategies:   'injectManifest',
  manifest: {
    name:             'Muse',
    short_name:       'Muse',
    description:      'Humanistic Practices',
    start_url:        'index.html?source=pwa',
    orientation:      'any',
    display:          'standalone',
    background_color: '#000000',
    theme_color:      '#888888',
    dir:              'ltr',
    lang:             'en',
    icons:  [
      { 'src':'android-chrome-192x192.png', 'sizes':'192x192', 'type':'image/png' },
      { 'src':'android-chrome-512x512.png', 'sizes':'512x512', 'type':'image/png', 'purpose':'maskable any' } ]
  },
  workbox: {
    // workbox options for generateSW
  }
}

export default( { command, mode } ) => {

  if( command === 'build' ) {
    console.log( 'vite.config.js build', { command:command, mode:mode } );
    return defineConfig({
      plugins:[vue(),VitePWA(PWAOpts)] } )
  }
  else if( command === 'serve' ) {
    console.log( 'vite.config.js serve', { command:command, mode:mode } );
    return defineConfig({
      plugins:[vue(),VitePWA(PWAOpts)] } )
  }
  else {
    return defineConfig({
      plugins: [vue(),VitePWA(PWAOpts)],
      build: { rollupOptions:{ plugins:LessRollup() } } } )
  }
}
