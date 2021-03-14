var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../util/Build.js';

Nav = class Nav {
  constructor(stream, batch, routes, routeNames, komps1, isMuse = false) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.routes = routes;
    this.routeNames = routeNames;
    this.komps = komps1;
    this.isMuse = isMuse;
    this.navs = this.addInovToNavs(this.komps);
    this.build = new Build(this.batch);
    this.router = null;
    this.source = 'None';
    this.route = 'Home';
    this.routeLast = 'None';
    this.compKey = 'Home'; // Also specifies current plane
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.warnMsg = 'None';
    this.inovKey = 'None'; // Only used by Tabs to Tocs
    this.presKey = 'None';
    this.imgsIdx = 0;
    this.imgsNum = 0;
    this.mix = null;
    this.pages = {};
    this.keyEvents();
  }

  pub(msg) {
    var obj;
    if (this.msgOK(msg)) {
      obj = this.toObj(msg);
      console.log('Nav.pub()', obj);
      this.doRoute(obj); // Creates route if necessary to publish to
      this.stream.publish('Nav', obj);
    }
  }

  msgOK(msg) {
    var ok;
    ok = true;
    if (this.isMuse && (msg.compKey != null) && !this.hasCompKey(msg.compKey)) {
      ok = false;
    }
    return ok;
  }

  toObj(msg) {
    this.set(msg);
    if (msg.warnMsg == null) {
      this.warnMsg = 'None';
    }
    if (msg.source == null) {
      this.source = 'None';
    }
    this.inovKey = this.mix().isDef(msg.inovKey) ? msg.inovKey : this.compKey;
    return {
      source: this.source,
      route: this.route,
      compKey: this.compKey,
      inovKey: this.inovKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      warnMsg: this.warnMsg,
      imgsIdx: this.imgsIdx
    };
  }

  set(msg) {
    var key, val;
    for (key in msg) {
      if (!hasProp.call(msg, key)) continue;
      val = msg[key];
      this[key] = val;
    }
  }

  setMix(methods) {
    this.mix = methods.mix; // mix
  }

  doRoute(obj) {
    if (obj.route === this.routeLast || this.isInov(obj.route)) {
      return;
    }
    // console.log( 'Nav.doRoute()', { routeNames:@routeNames } )
    if ((obj.route != null) && this.inArray(obj.route, this.routeNames)) {
      this.dirsNavd(obj.route);
      if (this.router != null) {
        this.router.push({
          name: obj.route
        });
      } else {
        console.error('Nav.doRoute() router not set');
      }
      this.routeLast = this.route;
      this.route = obj.route;
    } else {
      console.error('Nav.doRoute() undefined or unnamed route', obj.route);
    }
  }

  doRoute2(obj) {
    var onAbort, onComplete, pushRoute;
    if (obj.route === this.routeLast || this.isInov(obj.route)) {
      return;
    }
    if (obj.route != null) {
      this.dirsNavd(obj.route);
      if (this.router != null) {
        pushRoute = this.inArray(obj.route, ['Home', 'Prin', 'Comp', 'Prac', 'Disp', 'Cube']) ? {
          name: obj.route
        } : {
          path: obj.route // '*/'+ name:'Comp',
        };
        onComplete = function() {
          return console.log('Router.push success', {
            obj: obj,
            push: pushRoute
          });
        };
        onAbort = function(error) {
          return console.log('Router.push failure', {
            obj: obj,
            error: error
          });
        };
        if (this.inArray(obj.route, ['Home', 'Prin', 'Comp', 'Prac', 'Disp', 'Cube'])) {
          this.router.push(pushRoute).then(onComplete).catch(onAbort);
        }
      } else {
        console.error('Nav.doRoute() router not set', onComplete, onAbort); // A contrived path for now
      }
      this.routeLast = this.route;
      this.route = obj.route;
    } else {
      console.error('Nav.doRoute() undefined route');
    }
  }

  hasCompKey(compKey, dir = null) {
    var has;
    has = (compKey != null) && (this.navs != null) && (this.navs[compKey] != null);
    if ((dir != null) && has) {
      return this.navs[compKey][dir] != null;
    } else {
      return has;
    }
  }

  adjCompKey(compKey, dir) {
    if (this.hasCompKey(compKey, dir)) {
      return this.navs[compKey][dir];
    } else {
      return 'None';
    }
  }

  log(msg, warnMsg) {
    msg.warnMsg = warnMsg;
    return console.log('Nav.log()', this.toObj(msg));
  }

  tap() {
    console.log('Nav.tap()');
  }

  keyEvents() {
    var keyDir;
    keyDir = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          return this.dir('east', event);
        case 'ArrowLeft':
          return this.dir('west', event);
        case 'ArrowDown':
          return this.dir('south', event);
        case 'ArrowUp':
          return this.dir('north', event);
        case '+':
          return this.dir('next', event);
        case '-':
          return this.dir('prev', event);
      }
    };
    document.addEventListener('keydown', (event) => {
      return keyDir(event);
    });
  }

  dir(direct, event = null) {
    this.source = direct;
    if (event === null) {
      ({});
    }
    if (this.isMuse) {
      switch (this.route) {
        case 'Comp':
          this.dirComp(direct);
          break;
        case 'Prac':
          this.dirPrac(direct);
          break;
        case 'Disp':
          this.dirDisp(direct);
          break;
        case 'Talk':
          this.dirTalk(direct);
          break;
        default:
          this.dirComp(direct);
      }
    } else {
      this.dirComp(direct, dirs);
    }
    this.dirsNavd(this.route);
  }

  dirComp(dir) {
    var msg;
    msg = {};
    msg.source = `${'Nav.dirComp'}(${dir})`;
    if (this.hasCompKey(this.compKey, dir)) {
      msg.compKey = this.adjCompKey(this.compKey, dir);
      msg.route = this.toRoute(msg.compKey);
      this.doRoute({
        route: msg.route
      });
      this.pub(msg);
    } else if (this.hasActivePageDir(this.route, dir)) {
      this.dirPage(dir);
    } else {
      this.log(msg, {
        warnMsg: `Missing adjacent component for ${dir} ${this.compKey}`
      });
    }
  }

  // Map compKeys to a single Comp route for Muse
  toRoute(compKey) {
    if (this.isMuse && this.inArray(compKey, ['Info', 'Know', 'Wise'])) {
      return 'Comp';
    } else {
      return compKey;
    }
  }

  dirPrac(dir) {
    var adj, msg;
    msg = {};
    msg.source = `${'Nav.dirPrac'}(${dir})`;
    msg.compKey = this.compKey;
    adj = this.adjPracObj(dir);
    if (adj.name !== 'None') {
      if (adj.name !== this.pracKey) {
        msg.pracKey = adj.name;
      }
      if (adj.plane !== this.compKey) {
        msg.compKey = adj.plane;
      }
      this.pub(msg);
    } else {
      this.log(msg, `Missing adjacent practice for ${dir} ${this.compKey} ${this.pracKey}`);
    }
  }

  dirDisp(dir) {
    var adj, ddr, dis, msg, prc;
    msg = {};
    msg.source = `${'Nav.dirDisp'}(${dir})`;
    prc = this.pracs(this.compKey)[this.pracKey];
    dis = prc[this.dispKey];
    adj = this.adjPracObj(dir);
    ddr = dis.dir;
    dis = this.getDispObj(adj, ddr);
    if (adj.name !== 'None') {
      msg.compKey = adj.plane;
      msg.pracKey = adj.name;
      msg.dispKey = dis.name;
      this.pub(msg);
    } else {
      this.log(msg, `Missing adjacent displine for ${dir} ${this.compKey} ${this.pracKey}`);
    }
  }

  dirTalk(dir) {
    var dirs, hasChildren, msg, sectObj;
    dirs = this.dirsNavdTalk();
    if (this.pracKey === 'None' || !dirs[dir]) {
      return;
    }
    msg = {};
    msg.source = `${'Nav.dirTalk'}(${dir})`;
    sectObj = this.mix().sectObject(this.pracKey, this.dispKey);
    hasChildren = this.mix().isArray(sectObj.keys);
    this.dispKey = sectObj.name;
    if (!sectObj['imgs']) {
      this.imgsNum = 0;
    }
    if (!this.mix().isDef(this.pageKey) || !this.mix().inArray(this.pageKey, sectObj.keys)) {
      this.pageKey = sectObj.keys[0];
    }
    if (this.imgsNum > 0 && (dir === 'west' || dir === 'east')) {
      if (dir === 'west') {
        this.imgsIdx = this.prevImg();
      }
      if (dir === 'east') {
        this.imgsIdx = this.nextImg();
      }
    } else if (this.isPageTalk(sectObj, hasChildren, this.presKey)) {
      this.presKey = (function() {
        switch (dir) {
          case 'west':
          case 'north':
          case 'prev':
            return this.prevKey(this.presKey, sectObj.keys);
          case 'east':
          case 'south':
            return this.nextKey(this.presKey, sectObj.keys);
          case 'next             ':
            return this.nextPage(this.presKey, sectObj.keys, sectObj.peys); // Special case
          default:
            return 'None';
        }
      }).call(this);
    } else {
      this.dispKey = (function() {
        switch (dir) {
          case 'west':
            return this.prevKey(this.dispKey, sectObj.peys);
          case 'east':
            return this.nextKey(this.dispKey, sectObj.peys);
          case 'north':
            this.presKey = 'None';
            return this.dispKey;
          case 'south':
            this.presKey = sectObj.keys[0];
            return this.dispKey;
          case 'prev':
            return this.prevKey(this.dispKey, sectObj.peys);
          case 'next':
            return this.nextDisp(this.dispKey, sectObj.keys, sectObj.peys); // Special case
          default:
            return 'None';
        }
      }).call(this);
    }
    // console.log( 'Nav.dirTalk()', { dir:dir, pracKey:@pracKey, dispKey:@dispKey, presKey:@presKey, imgsIdx:@imgsIdx,
    // sectObj:sectObj, hasChildren:hasChildren } )
    msg.dispKey = this.dispKey;
    msg.presKey = this.presKey;
    msg.imgsIdx = this.imgsIdx;
    this.pub(msg);
  }

  prevImg() {
    if (this.imgsIdx > 0) {
      return this.imgsIdx - 1;
    } else {
      return this.imgsNum - 1;
    }
  }

  nextImg() {
    if (this.imgsIdx < this.imgsNum - 1) {
      return this.imgsIdx + 1;
    } else {
      return 0;
    }
  }

  isPageTalk(sectObj, hasChildren, presKey) {
    return this && hasChildren && (sectObj[presKey] != null);
  }

  dirsNavd(route) {
    var dirs;
    dirs = this.dirsNavdTalk(route);
    this.stream.publish('Navd', dirs);
  }

  dirsNavdTalk(route) {
    var dirs, hasChildren, sectObj;
    dirs = {
      west: true,
      east: true,
      north: true,
      south: true,
      prev: true,
      next: true
    };
    if (route !== 'Talk' || this.pracKey === 'None') {
      return dirs;
    }
    sectObj = this.mix().sectObject(this.pracKey, this.dispKey);
    hasChildren = this.mix().isArray(sectObj.keys);
    if (this.isPageTalk(sectObj, hasChildren, this.presKey)) {
      this.dirsNavdTalkPage(dirs, sectObj);
    } else {
      this.dirsNavdTalkSect(dirs, sectObj, hasChildren);
    }
    return dirs;
  }

  dirsNavdTalkSect(dirs, sectObj, hasChildren) {
    dirs.west = sectObj.name !== sectObj.peys[0];
    dirs.prev = dirs.west;
    dirs.east = sectObj.name !== sectObj.peys[sectObj.peys.length - 1];
    dirs.next = dirs.east;
    dirs.north = false;
    dirs.south = hasChildren;
  }

  dirsNavdTalkPage(dirs, sectObj) {
    var pageObj;
    pageObj = this.mix().presObject(sectObj, this.presKey);
    dirs.west = pageObj.name !== sectObj.keys[0];
    dirs.prev = dirs.west;
    dirs.east = pageObj.name !== sectObj.keys[sectObj.keys.length - 1];
    dirs.next = true; // dirs.east
    dirs.north = true;
    dirs.south = false;
  }

  prevKey(key, keys) {
    var kidx, pidx;
    kidx = keys.indexOf(key);
    pidx = kidx - 1;
    if (pidx === -1) {
      pidx = keys.length - 1;
    }
    return keys[pidx];
  }

  nextKey(key, keys) {
    var kidx, nidx;
    kidx = keys.indexOf(key);
    nidx = kidx + 1;
    if (nidx === keys.length) {
      nidx = 0;
    }
    return keys[nidx];
  }

  // Special case
  nextPage(key, keys, peys) {
    if (key !== keys[keys.length - 1]) {
      return this.nextKey(key, keys);
    } else {
      this.dispKey = this.nextKey(this.dispKey, peys);
      return 'None';
    }
  }

  // Special case
  nextDisp(dispKey, keys, peys) {
    if (keys[0] != null) {
      this.presKey = keys[0];
      return dispKey;
    } else {
      this.presKey = 'None';
      return this.nextKey(dispKey, peys);
    }
  }

  dirPage(dir) {
    var msg, pageKey, pagesKey;
    pagesKey = this.getPagesComp(this.route, this.compKey);
    msg = {};
    msg.source = `${'Nav.dirPage'}(${dir})`;
    pageKey = this.hasActivePageDir(this.route, dir) ? this.movePage(this.pages[pagesKey], dir) : 'None';
    if (pageKey !== 'None') {
      this.setPageKey(pagesKey, pageKey);
    } else {
      // @pub( msg )
      this.log(msg, {
        warnMsg: `Cannot find pageKey for ${dir}`
      });
    }
  }

  movePage(page, dir) {
    var idx, len, ndx, pageKey, pagesKey;
    pagesKey = this.getPagesComp(this.route, this.compKey);
    pageKey = this.getPageKey(pagesKey);
    len = page.keys.length;
    if (pageKey !== 'None') {
      idx = page.keys.indexOf(pageKey);
      if (dir === 'east') {
        ndx = this.range(idx + 1, len);
      }
      if (dir === 'west') {
        ndx = this.range(idx - 1, len);
      }
      pageKey = page.keys[ndx];
    } else {
      pageKey = dir === 'east' ? page.keys[0] : page.keys[len - 1];
    }
    return pageKey;
  }

  range(idx, len) {
    var ndx;
    ndx = idx;
    if (ndx >= len) {
      ndx = 0;
    }
    if (ndx < 0) {
      ndx = len - 1;
    }
    return ndx;
  }

  // An important indicator of when Comps and Tabs are instanciated
  setPages(route, pages) {
    if (this.hasPages(route, false)) {
      return;
    }
    this.pages[route] = {};
    this.pages[route].pages = pages;
    this.pages[route].keys = Object.keys(pages);
  }

  // console.log( 'Nav.setPages()', { route:route, has:@hasPages(route), pages:@pages[route] } )
  setPageKey(route, pageKey) {
    var key, page, ref;
    // console.log( 'Nav.setPageKey()', { route:route, pageKey:pageKey, has:@hasPages(route) } )
    if (!this.hasPages(route)) {
      console.log('Nav.setPageKey()', {
        route: route,
        pageKey: pageKey,
        has: this.hasPages(route)
      });
      return;
    }
    ref = this.pages[route].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      page.show = key === pageKey;
    }
  }

  getPageKey(route, logNot = true) {
    var key, page, ref;
    if (!this.hasPages(route, logNot)) {
      return 'None';
    }
    ref = this.pages[route].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return key;
      }
    }
    return 'None';
  }

  // pageKey = @pages[route].keys[0] # Default is first page
  // @pages[route].pages[pageKey].show = true
  // console.log( 'Nav.getPageKey()', { route:route, pageKey:pageKey, has:@hasPages(route) } )
  // pageKey
  getPageDef(pages) {
    var key, page;
    for (key in pages) {
      if (!hasProp.call(pages, key)) continue;
      page = pages[key];
      if (page.show) {
        return key;
      }
    }
    return 'None';
  }

  hasPages(route, logNot = true) {
    var has;
    has = this.isDef(this.pages[route]) && this.isDef(this.pages[route].pages) && this.pages[route].keys.length > 0;
    if (!has && logNot) {
      console.log('Nav.hasPages()', {
        route: route,
        has: has,
        pages: this.pages
      });
    }
    return has;
  }

  hasPageKey(route, pageKey) {
    return this.isDef(pageKey) && this.hasPages(route) && (this.pages[route].pages[pageKey] != null);
  }

  hasActivePage(route) {
    var key, page, ref;
    if (!this.hasPages(route)) {
      return false;
    }
    ref = this.pages[route].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return true;
      }
    }
    return false;
  }

  hasActivePageDir(route, dir) {
    return this.hasActivePage(route) && (dir === 'west' || dir === 'east');
  }

  isMyNav(obj, route) {
    // console.log( 'Nav.isMyNav()', { route1:route, route2:obj.route } )
    return obj.route === route; // and @hasActivePage(route)
  }

  adjPracObj(dir) {
    var adjcObj, pracObj;
    pracObj = this.pracs(this.compKey)[this.pracKey];
    adjcObj = this.build.adjacentPractice(pracObj, dir);
    return adjcObj;
  }

  getDispObj(pracObj, dirDisp) {
    var dispObj;
    dispObj = this.build.getDir(pracObj, dirDisp);
    return dispObj;
  }

  pracs(compKey) {
    return this.batch[compKey].data.pracs;
  }

  disps(compKey, pracKey) {
    return this.batch[compKey].data.pracs[pracKey].disps;
  }

  isDef(d) {
    return d !== null && typeof d !== 'undefined' && d !== 'None';
  }

  isArray(a) {
    return this.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  inArray(e, a) {
    return this.isArray(a) && a.indexOf(e) > -1;
  }

  // --- Innovate --- Inov in one place

    // Across the board Inov detector for compKey pageKey and route
  isInov(route) {
    return this.inArray(route, ['Inov', 'Info', 'Know', 'Wise']);
  }

  addInovToNavs(komps) {
    var navs;
    if (!this.isMuse) {
      return komps != null;
    }
    navs = Object.assign({}, komps);
    navs = this.insInov(navs, 'Info', 'Data', 'Know');
    return navs;
  }

  insInov(navs, prev, inov, next) {
    navs[prev].south = inov;
    navs[prev].next = inov;
    navs[inov] = {
      north: prev,
      prev: prev,
      south: next,
      next: next
    };
    navs[next].north = inov;
    navs[next].prev = inov;
    return navs;
  }

};

export default Nav;
