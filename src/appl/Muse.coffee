
import Data             from '../base/util/Data.js'
import Build            from '../base/util/Build.js'
import Stream           from '../base/util/Stream.js'
import Nav              from '../base/nav/Nav.js'
import Touch            from '../base/nav/Touch.js'
#mport Cache            from '../base/util/Cache.js'
import Mixin            from '../base/vue/Mixin.js'

import { createApp }    from 'vue'    #
import { createRouter, createWebHistory } from 'vue-router'
import Home             from '../../vue/appl/Home.vue';

import PrinJson from '../../pub/data/muse/Prin.json'
import RowsJson from '../../pub/data/muse/Rows.json'
import InfoJson from '../../pub/data/muse/Info.json'
import KnowJson from '../../pub/data/muse/Know.json'
import WiseJson from '../../pub/data/muse/Wise.json'
import SoftJson from '../../pub/data/inno/Soft.json'
import DataJson from '../../pub/data/inno/Data.json'
import ScieJson from '../../pub/data/inno/Scie.json'
import MathJson from '../../pub/data/inno/Math.json'


class Muse

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  # 2. Muse.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Muse.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  Muse.start = () ->
    # Data.batchRead( Muse.Batch, Muse.init, Data.refine )
    for key, val of Muse.Batch
      val.data = Data.refine(val.data)
    Muse.init( Muse.Batch )
    return

  Muse.Batch = {
    Prin:     { url:'muse/Prin.json', data:PrinJson } # data:PrinJson }
    Rows:     { url:'muse/Rows.json', data:RowsJson } # data:RowsJson }
    Info:     { url:'muse/Info.json', data:InfoJson } # data:InfoJson }
    Know:     { url:'muse/Know.json', data:KnowJson } # data:KnowJson }
    Wise:     { url:'muse/Wise.json', data:WiseJson } # data:WiseJson }
    Soft:     { url:'inno/Soft.json', data:SoftJson } # data:SoftJson }
    Data:     { url:'inno/Data.json', data:DataJson } # data:DataJson }
    Scie:     { url:'inno/Scie.json', data:ScieJson } # data:ScieJson }
    Math:     { url:'inno/Math.json', data:MathJson } # data:MathJson }
  }

  Muse.routes = [
    { path: '/Home', name:'Home', components:{ Home: Home      } },
    { path: '/Prin', name:'Prin', components:{ Prin: Home.Prin } },
    { path: '/Comp', name:'Comp', components:{ Comp: Home.Comp } },
    { path: '/Prac', name:'Prac', components:{ Prac: Home.Prac } },
    { path: '/Disp', name:'Disp', components:{ Disp: Home.Disp } },
    { path: '/Cube', name:'Cube', components:{ Cube: Home.Cube } }
  ]

  Muse.routeNames = Muse.createRouteNames( Muse.routes )

  # Toc.vue components and routes with no west or east directions
  Muse.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    north:"Cube", prev:"Cube", south:"Prin",  next:"Prin"  }
    Prin:{ title:'Prin', key:'Prin', route:'Prin', pracs:{}, ikw:true,  icon:"fas fa-balance-scale",
    north:"Home", prev:"Home", south:"Info",  next:"Info" }
    Info:{ title:'Info', key:'Info', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-th",
    north:"Prin", prev:"Prin", south:"Know",  next:"Know" }
    Know:{ title:'Know', key:'Know', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-university",
    north:"Info", prev:"Info", south:"Wise",  next:"Wise" }
    Wise:{ title:'Wise', key:'Wise', route:'Comp', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor",
    north:"Know", prev:"Know", south:"Home",  next:"Home" }
    Cube:{ title:'Cube', key:'Cube', route:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes",
    north:"Wise", prev:"Wise", south:"Wise",  next:"Home"  } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Muse.init =   ( batch ) ->
    Muse.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Muse.myName = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Muse.stream = new Stream( subjects, infoSpec )
    Muse.nav    = new Nav(   Muse.stream, batch, Muse.routes, Muse.routeNames, Muse.komps, true )
    Muse.touch  = new Touch( Muse.stream, Muse.nav )
    Muse.build  = new Build( batch, Muse.komps )
    #use.cache  = new Cache( Muse.stream )
    Data.buildInnov( batch, 'Data',   'Info' )
    Data.mergePracs( batch, 'Prin', ['Info','Know','Wise'] ) # 'Data'
    Muse.mergeCols()
    try            # A lot can go wrong with vue3 initialization so trap errors
      Muse.vue3()
    catch error
      console.error( 'Muse.vue3 app.use error', error )
    return

  Muse.vue3 = () ->
    Muse.app = createApp( Home.Dash )
    Muse.mixin = new Mixin(  Muse, Muse.routeNames )
    Muse.nav.setMix(         Muse.mixin.mixin().methods )
    Muse.app.provide('mixg', Muse.mixin.mixin().methods.mix )
    Muse.app.mixin(          Muse.mixin.mixin() )
    router = Muse.router( Muse.routes )
    Muse.app.use(        router )
    Muse.nav.router    = router
    Muse.app.mount('#muse')
    Muse.nav.doRoute( { route:'Home' } )
    return

  # Lazy loader with dynamic import()
  Muse.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # Vue Router Routes
  Muse.router = ( routes ) ->
    createRouter( { routes:routes, history:createWebHistory() } )

  Muse.createRouteNames = ( routes ) ->
    routeNames = []
    for route in routes
      routeNames.push( route.name )
    routeNames

  # Merges principles and innovations into comp practices
  Muse.mergeCols = ( ) ->
    Muse.build.dimDisps() # Add disps to every dim - dimension
    Muse.build.colPracs() # Add pracs to every col
    return

  # Log practices for diagnostics
  Muse.logPracs = ( compk ) ->
    console.log( 'Muse.pracs', Muse.Batch[compk].data[compk].pracs )
    return

export default Muse
