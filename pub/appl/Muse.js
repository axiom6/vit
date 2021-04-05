var Muse;

import Data from '../base/util/Data.js';

import Build from '../base/util/Build.js';

import Stream from '../base/util/Stream.js';

import Nav from '../base/nav/Nav.js';

import Touch from '../base/nav/Touch.js';

import Mix from '../base/vue/Mix.js';

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHistory
} from 'vue-router';

import Home from '../../vue/appl/Home.vue';

import PrinJson from '../../data/muse/Prin.json';

import RowsJson from '../../data/muse/Rows.json';

import InfoJson from '../../data/muse/Info.json';

import KnowJson from '../../data/muse/Know.json';

import WiseJson from '../../data/muse/Wise.json';

import SoftJson from '../../data/inno/Soft.json';

import DataJson from '../../data/inno/Data.json';

import ScieJson from '../../data/inno/Scie.json';

import MathJson from '../../data/inno/Math.json';

Muse = (function() {
  class Muse {
    static start() {
      var key, ref, val;
      Muse.addToHead();
      ref = Muse.Batch;
      for (key in ref) {
        val = ref[key];
        val.data = Data.refine(val.data);
      }
      Muse.init(Muse.Batch);
    }

    static addToHead() {
      var maniElem, siteElem;
      // manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
      // siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
      maniElem = document.createElement('link');
      maniElem.href = "manifest.json";
      maniElem.rel = "manifest";
      maniElem['crossorigin'] = "use-credentials";
      siteElem = document.createElement('link');
      console.log('Location', window.location.href);
      siteElem.href = window.location.href; // "https://vit-muse.web.app/" if window.location.contains('vit-muse')
      siteElem.rel = "canonical";
      document.getElementsByTagName("head")[0].appendChild(maniElem);
      document.getElementsByTagName("head")[0].appendChild(siteElem);
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
      Muse.mix = new Mix(Muse, Muse.routeNames);
      Muse.nav = new Nav(Muse.stream, batch, Muse.routes, Muse.routeNames, Muse.komps, true);
      Muse.touch = new Touch(Muse.stream, Muse.nav);
      Muse.build = new Build(batch, Muse.komps);
      //use.cache  = new Cache( Muse.stream )
      Data.buildInnov(batch, 'Data', 'Info');
      Data.mergePracs(batch, 'Prin', [
        'Info',
        'Know',
        'Wise' // 'Data'
      ]);
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
      Muse.app = createApp(Home.Dash);
      Muse.app.provide('mix', Muse.mix);
      Muse.app.provide('nav', Muse.nav);
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

  Muse.Batch = {
    Prin: {
      url: 'muse/Prin.json',
      data: PrinJson // data:PrinJson }
    },
    Rows: {
      url: 'muse/Rows.json',
      data: RowsJson // data:RowsJson }
    },
    Info: {
      url: 'muse/Info.json',
      data: InfoJson // data:InfoJson }
    },
    Know: {
      url: 'muse/Know.json',
      data: KnowJson // data:KnowJson }
    },
    Wise: {
      url: 'muse/Wise.json',
      data: WiseJson // data:WiseJson }
    },
    Soft: {
      url: 'inno/Soft.json',
      data: SoftJson // data:SoftJson }
    },
    Data: {
      url: 'inno/Data.json',
      data: DataJson // data:DataJson }
    },
    Scie: {
      url: 'inno/Scie.json',
      data: ScieJson // data:ScieJson }
    },
    Math: {
      url: 'inno/Math.json',
      data: MathJson // data:MathJson }
    }
  };

  Muse.routes = [
    {
      path: '/',
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
      south: "Prin",
      next: "Prin"
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
      north: "Wise",
      prev: "Wise",
      south: "Wise",
      next: "Home"
    }
  };

  return Muse;

}).call(this);

export default Muse;
