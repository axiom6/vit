import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import LessRollup       from 'rollup-plugin-less'
import { VitePWA }      from 'vite-plugin-pwa'

//import { promises:fs }              from 'fs'
//const { promises: fs } = require("fs")
//import path             from 'path'

const PWAOpts = {
  registerType: 'autoUpdate',
  strategies: 'injectManifest',
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
  } 
};

/*

  injectManifest: {
    swSrc: 'Worker.js' },

  outDir:     'sw.js',
  mode:       'development',
  base:       '/',
  srcDir:     'dist',
  strategies: 'injectManifest',
  injectManifest: {},

  workbox: {
    swSrc: 'public/service-worker.js' },

  outDir:     'sw.js',
  filename:   'generateSW',
  strategies: 'generateSW',
  injectManifest: {
    // workbox options for injectManifest
scope: string
publicPath: string

 ,VitePWA(PWAOpts)
 */

export default( { command, mode } ) => {

  if( command === 'build' ) {
    console.log( 'vite.config.js build', { command:command, mode:mode } );
    return defineConfig({
      plugins:[vue()] } )
  }
  else if( command === 'serve' ) {
    console.log( 'vite.config.js serve', { command:command, mode:mode } );
    return defineConfig({
      plugins:[vue() } )
  }
  else {
    return defineConfig({
      plugins: [vue(),VitePWA(PWAOpts)],
      build: { rollupOptions:{ plugins:LessRollup() } } } )
  }
}
