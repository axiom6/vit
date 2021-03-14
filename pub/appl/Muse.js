var Muse;

import Data from '../base/util/Data.js';

import Build from '../base/util/Build.js';

import Stream from '../base/util/Stream.js';

import Nav from '../base/nav/Nav.js';

import Touch from '../base/nav/Touch.js';

import Mixin from '../base/vue/Mixin.js';

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHistory
} from 'vue-router';

import Home from '../../vue/appl/Home.vue';

Muse = (function() {
  class Muse {
    static start() {
      Data.batchRead(Muse.Batch, Muse.init, Data.refine);
    }

    static init(batch) {
      var error, infoSpec, subjects;
      Muse.Batch = batch; // Not necessary here, but assigned for compatibilitry
      Muse.myName = 'Muse';
      subjects = ["Nav"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Muse.stream = new Stream(subjects, infoSpec);
      Muse.nav = new Nav(Muse.stream, batch, Muse.routes, Muse.routeNames, Muse.komps, true);
      Muse.touch = new Touch(Muse.stream, Muse.nav.addInovToNavs(Muse.komps));
      Muse.build = new Build(batch, Muse.komps);
      //use.cache  = new Cache( Muse.stream )
      Data.buildInnov(batch, 'Data', 'Info');
      Data.mergePracs(batch, 'Prin', ['Info', 'Know', 'Wise', 'Data']);
      Muse.mergeCols(); // A lot can go wrong with vue3 initialization so trap errors
      try {
        Muse.vue3();
      } catch (error1) {
        error = error1;
        console.error('Muse.vue3 app.use error', error);
      }
    }

    static vue3() {
      var router;
      Muse.mixin = new Mixin(Muse, Muse.routeNames);
      Muse.nav.setMix(Muse.mixin.mixin().methods);
      Muse.app = createApp(Home.Dash);
      Muse.app.mixin(Muse.mixin.mixin());
      router = Muse.router(Muse.routes);
      Muse.app.use(router);
      Muse.nav.router = router;
      Muse.app.mount('#muse');
      Muse.nav.doRoute({
        route: 'Home'
      });
    }

    static lazy(name) {
      var path;
      path = `../../${name}.js`;
      if (path === false) {
        ({});
      }
      return import( /* @vite-ignore */ path );
    }

    static router(routes) {
      return createRouter({
        routes: routes,
        history: createWebHistory()
      });
    }

    static createRouteNames(routes) {
      var i, len, route, routeNames;
      routeNames = [];
      for (i = 0, len = routes.length; i < len; i++) {
        route = routes[i];
        routeNames.push(route.name);
      }
      return routeNames;
    }

    static mergeCols() {
      Muse.build.dimDisps(); // Add disps to every dim - dimension
      Muse.build.colPracs(); // Add pracs to every col
    }

    static logPracs(compk) {
      console.log('Muse.pracs', Muse.Batch[compk].data[compk].pracs);
    }

  };

  // Muse.init( Muse.Batch )
  Muse.Batch = {
    Prin: {
      url: 'muse/Prin.json',
      data: null // data:PrinJson }
    },
    Rows: {
      url: 'muse/Rows.json',
      data: null // data:RowsJson }
    },
    Info: {
      url: 'muse/Info.json',
      data: null // data:InfoJson }
    },
    Know: {
      url: 'muse/Know.json',
      data: null // data:KnowJson }
    },
    Wise: {
      url: 'muse/Wise.json',
      data: null // data:WiseJson }
    },
    Soft: {
      url: 'inno/Soft.json',
      data: null // data:SoftJson }
    },
    Data: {
      url: 'inno/Data.json',
      data: null // data:DataJson }
    },
    Scie: {
      url: 'inno/Scie.json',
      data: null // data:ScieJson }
    },
    Math: {
      url: 'inno/Math.json',
      data: null // data:MathJson }
    },
    Imgs: {
      url: 'imgs/Imgs.json',
      data: null // data:ImgsJson }
    }
  };

  Muse.routes = [
    {
      path: '/Home',
      name: 'Home',
      components: {
        Home: Home
      }
    },
    {
      path: '/Prin',
      name: 'Prin',
      components: {
        Prin: Home.Prin
      }
    },
    {
      path: '/Comp',
      name: 'Comp',
      components: {
        Comp: Home.Comp
      }
    },
    {
      path: '/Prac',
      name: 'Prac',
      components: {
        Prac: Home.Prac
      }
    },
    {
      path: '/Disp',
      name: 'Disp',
      components: {
        Disp: Home.Disp
      }
    },
    {
      path: '/Cube',
      name: 'Cube',
      components: {
        Cube: Home.Cube
      }
    }
  ];

  Muse.routeNames = Muse.createRouteNames(Muse.routes);

  // Toc.vue components and routes with no west or east directions
  Muse.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home",
      north: "Cube",
      prev: "Cube",
      south: "Talk",
      next: "Talk"
    },
    Prin: {
      title: 'Prin',
      key: 'Prin',
      route: 'Prin',
      pracs: {},
      ikw: true,
      icon: "fas fa-balance-scale",
      north: "Home",
      prev: "Home",
      south: "Info",
      next: "Info"
    },
    Info: {
      title: 'Info',
      key: 'Info',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fas fa-th",
      north: "Prin",
      prev: "Prin",
      south: "Know",
      next: "Know"
    },
    Know: {
      title: 'Know',
      key: 'Know',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fas fa-university",
      north: "Info",
      prev: "Info",
      south: "Wise",
      next: "Wise"
    },
    Wise: {
      title: 'Wise',
      key: 'Wise',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fab fa-tripadvisor",
      north: "Know",
      prev: "Know",
      south: "Home",
      next: "Home"
    },
    Cube: {
      title: 'Cube',
      key: 'Cube',
      route: 'Cube',
      pracs: {},
      ikw: false,
      icon: "fas fa-cubes",
      north: "Talk",
      prev: "Wise",
      south: "Wise",
      next: "Home"
    }
  };

  return Muse;

}).call(this);

export default Muse;
