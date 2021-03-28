
import path from 'path'
import resolveExternalsPlugin from 'vite-plugin-resolve-externals'

const  projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // It can be configured here
    resolveExternalsPlugin({
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',

    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(projectRootDir, 'src'),
      },
    ],
    // or here
    externals: {
      axios: 'axios',
    },
  },
});