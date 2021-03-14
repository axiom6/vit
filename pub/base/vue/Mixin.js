var Mixin,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Vis from '../../draw/base/Vis.js';

Mixin = class Mixin {
  constructor(Main, routeNames) {
    Mixin.Main = Main;
    Mixin.routeNames = routeNames;
  }

  mixin() {
    return {
      created: function() {},
      methods: {
        mix: function() { // mix allows Vue components to distinguish global mixin methods
          return {
            
            // Util
            isDef: function(d) {
              return d !== null && typeof d !== 'undefined' && d !== 'None';
            },
            isStr: function(s) {
              return this.isDef(s) && typeof s === "string" && s.length > 0;
            },
            isArray: function(a) {
              return this.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
            },
            inArray: function(e, a) {
              return this.isArray(a) && a.indexOf(e) > -1;
            },
            isChild: function(key) {
              var a, b;
              a = key.charAt(0);
              b = key.charAt(key.length - 1);
              return a === a.toUpperCase() && a !== '$' && b !== '_';
            },
            keys: function(obj) {
              return Object.keys(obj);
            },
            hasElem: function(elem) {
              return (elem != null) && (elem['clientHeight'] != null) && elem['clientHeight'] > 0;
            },
            getElem: function($refs, name) { // Not called
              var elem;
              elem = $refs[name];
              console.log('Mixin.getElem() $refs[name]   ', $refs, elem, name);
              if (!this.hasElem(elem) && (elem[0] != null)) {
                elem = $refs[name][0];
                console.log('Mixin.getElem() $refs[name][0]', $refs, elem, name);
                if (!this.hasElem(elem)) {
                  console.error('Mixin.hasElem() unable to find elem in $refs[name]', name);
                  console.dir($refs);
                  elem = null;
                }
              } else {
                console.error('Mixin.hasElem() unable to find elem in $refs[name][0]', name);
                elem = null;
              }
              return elem;
            },
            styleObj: function(ikwObj, fontSize = void 0) {
              var hsv, style;
              hsv = [30, 90, 90];
              if (this.isDef(ikwObj)) {
                if (this.isDef(ikwObj.hsv)) {
                  hsv = ikwObj.hsv;
                } else if (this.isDef(ikwObj.dir)) {
                  hsv = (function() {
                    switch (ikwObj.dir) {
                      case 'west':
                        return [195, 90, 70];
                      case 'north':
                        return [90, 90, 90];
                      case 'east':
                        return [30, 60, 90];
                      case 'south':
                        return [60, 90, 90];
                      default:
                        return [30, 90, 90];
                    }
                  })();
                }
              }
              style = {
                backgroundColor: Vis.toRgbaHsv(hsv)
              };
              if (fontSize) {
                style['fontSize'] = fontSize + 'rem';
              }
              return style;
            },
            toRgbaHsv: function(hsv) {
              return Vis.toRgbaHsv(hsv);
            },
            // Main
            app: function() {
              return Mixin.Main.myName;
            },
            isMuse: function() {
              return 'Muse' === this.app();
            },
            subscribe: function(subject, source, onMethod) {
              Mixin.Main['stream'].subscribe(subject, source, onMethod);
            },
            publish: function(subject, object) {
              Mixin.Main['stream'].publish(subject, object);
            },
            stream: function() {
              return Mixin.Main.stream;
            },
            batch: function() {
              return Mixin.Main.Batch;
            },
            fontSize: function(scale) { // JavaScript font-size the matches themeFS in theme.less
              var fs, sc;
              fs = Mixin.Main.fontSize != null ? Mixin.Main.fontSize : 2;
              sc = scale != null ? scale : 1;
              return sc * fs + 'vmin';
            },
            fontSizeCss: function(scale) {
              return {
                fontSize: this.fontSize(scale)
              };
            },
            // Nav
            nav: function() {
              if (Mixin.Main.nav == null) {
                console.error('Mixin.nav() null');
              }
              return Mixin.Main.nav;
            },
            touch: function() {
              if (Mixin.Main.touch == null) {
                console.error('Mixin.touch() null');
              }
              return Mixin.Main.touch;
            },
            isTouch: function() {
              return Mixin.Main.touch != null;
            },
            isNav: function() {
              return Mixin.Main.nav != null;
            },
            navRoute: function() {
              if (this.isNav()) {
                return this.nav().route;
              } else if (this.isDir()) {
                return this.dir().route;
              } else {
                return 'None';
              }
            },
            isRoute: function(route) {
              return route === this.navRoute();
            },
            // Batch
            isBatch: function(compk) {
              return Mixin.Main.Batch[compk] != null;
            },
            prin: function() {
              return Mixin.Main.Batch['Prin'].data.pracs;
            },
            comps: function(compk) {
              return Mixin.Main.Batch[compk].data.comps;
            },
            kompsTocs: function() { // For Tocs.vue
              return Mixin.Main.komps;
            },
            routeNames: function() {
              return Mixin.routeNames;
            },
            subset: function(compk, filter) {
              var filts, key, prac, ref;
              filts = {};
              ref = this.pracs(compk);
              for (key in ref) {
                if (!hasProp.call(ref, key)) continue;
                prac = ref[key];
                if (filter(prac)) {
                  filts[key] = prac;
                }
              }
              return filts;
            },
            conns: function(compk) {
              var filter;
              filter = compk !== 'Prin' ? function(prac) {
                return prac.row !== 'Dim';
              } : function(prac) {
                return prac.row === 'Dim';
              };
              return this.subset(compk, filter);
            },
            pracs: function(compk) {
              return Mixin.Main.Batch[compk].data.pracs;
            },
            disps: function(compk, prack) {
              return Mixin.Main.Batch[compk].data[prack].disps;
            },
            areas: function(compk, prack, dispk) {
              return Mixin.Main.Batch[compk].data[prack][dispk].areas;
            },
            items: function(compk, prack, dispk, areak) {
              return Mixin.Main.Batch[compk].data[prack][dispk][areak].items;
            },
            bases: function(compk, prack, dispk, areak, itemk) {
              return Mixin.Main.Batch[compk].data[prack][dispk][areak][itemk].bases;
            },
            // Talk
            compObject: function(compKey) {
              if (Mixin.Main.Batch[compKey] != null) {
                return Mixin.Main.Batch[compKey].data.pracs;
              } else {
                console.error('Mixin.compObject() bad compKey', compKey);
                return {};
              }
            },
            inovObject: function(compKey, inovKey) {
              var compPracs, inovPrac, inovPracs, key, prac, pracs;
              pracs = {};
              if (this.isBatch(compKey)) {
                compPracs = this.pracs(compKey);
                if (this.isDef(inovKey) && inovKey !== compKey && this.isBatch(inovKey)) {
                  inovPracs = this.pracs(inovKey);
// console.log( 'Mixin.inovObject() inovPracs', inovPracs )
                  for (key in compPracs) {
                    prac = compPracs[key];
                    if (prac.column === 'Innovate' && prac.row !== 'Dim') {
                      inovPrac = this.getPrac(inovPracs, prac.row, prac.column, inovKey);
                      pracs[inovPrac.name] = inovPrac;
                    } else {
                      pracs[key] = prac;
                    }
                  }
                } else {
                  pracs = compPracs;
                }
                pracs;
              } else if (compKey !== "Home" && compKey !== "Cube") {
                console.error('Mixin.inovObject() bad compKey or inovKey', {
                  compKey: compKey,
                  inovKey: inovKey
                });
              }
              return pracs;
            },
            hasInov: function(key) {
              return key === 'Info' || key === 'Know' || key === 'Wise';
            },
            getPrac: function(pracs, row, column, inovKey) {
              var key, prac;
              for (key in pracs) {
                prac = pracs[key];
                if (prac.row === row && prac.column === column) {
                  return prac;
                }
              }
              console.error('Mixin.getPrac() missing prac for', {
                inovKey: inovKey,
                row: row,
                column: column
              });
              return {};
            },
            pracObject: function(compKey, inovKey, pracKey) {
              var prac, pracs;
              pracs = this.inovObject(compKey, inovKey);
              prac = {};
              if (pracs[pracKey] != null) {
                prac = pracs[pracKey];
              } else {
                console.error('Mixin.pracObject() unknown pracKey', {
                  compKey: compKey,
                  inovKey: inovKey,
                  pracKey: pracKey,
                  pracs: pracs
                });
              }
              return prac;
            },
            sectObject: function(pracKey, dispKey) {
              var sectObj, sectObjs, talkObj, talkObjs;
              talkObjs = this.compObject('Talk');
              talkObj = talkObjs[pracKey];
              console.log('Mixin.sectObj()', {
                talkObj: talkObj,
                talkKey: pracKey,
                sectKey: dispKey // , sectObj:sectObj
              });
              sectObjs = this.compObject(talkObj.comp);
              talkObj.keys = talkObj.keys != null ? talkObj.keys : Util.childKeys(sectObjs);
              dispKey = dispKey === 'None' || !this.inArray(dispKey, talkObj.keys) ? this.keys(sectObjs)[0] : dispKey;
              sectObj = sectObjs[dispKey];
              if (sectObj == null) {
                console.error('Nav.sectObject null', {
                  pracKey: pracKey,
                  dispKey: dispKey
                });
                sectObj = {};
              }
              sectObj.src = talkObj.src;
              sectObj.name = dispKey;
              sectObj.peys = talkObj.keys;
              sectObj.keys = sectObj.keys != null ? sectObj.keys : Util.childKeys(sectObj);
              if (sectObj.imgsIdx !== this.nav().imgsIdx) { // Trigger reactive render
                sectObj = Object.assign({}, sectObj);
              }
              sectObj.imgsIdx = this.nav().imgsIdx;
              return sectObj;
            },
            presObject: function(sectObj, presKey) {
              var pageObj;
              presKey = presKey === 'None' && (sectObj.keys[0] != null) ? sectObj.keys[0] : presKey;
              pageObj = null;
              if (presKey !== 'None' && (sectObj[presKey] != null)) {
                pageObj = sectObj[presKey];
                pageObj.src = sectObj.src;
                pageObj.name = presKey;
                pageObj.peys = sectObj.keys;
                pageObj.keys = pageObj.keys != null ? pageObj.keys : Util.childKeys(pageObj);
                console.log('Mixin.pageObj()', {
                  dispKey: sectObj.name,
                  presKey: presKey,
                  pageObj: pageObj
                });
              }
              return pageObj;
            },
            dataObject: function(sectObj, presKey) {
              var dataObj;
              dataObj = null;
              if (sectObj.type === 'Prac') {
                dataObj = this.pracObject(sectObj.src, sectObj.name);
              } else if (sectObj.type === 'Disp' && presKey !== 'None') {
                dataObj = this.dispObject(sectObj.src, 'None', sectObj.name, presKey);
              }
              return dataObj;
            },
            dispObject: function(compKey, inovKey, pracKey, dispKey) {
              var disp, prac, pracs;
              disp = {};
              pracs = this.inovObject(compKey, inovKey);
              if (pracs[pracKey] != null) {
                prac = pracs[pracKey];
                if (prac[dispKey] != null) {
                  disp = prac[dispKey];
                } else {
                  console.error('Mixin.dispObject() unknown dispKey', {
                    compKey: compKey,
                    inovKey: inovKey,
                    pracKey: pracKey,
                    dispKey: dispKey
                  });
                }
              } else {
                console.error('Mixin.dispObject() unknown pracKey', {
                  compKey: compKey,
                  inovKey: inovKey,
                  pracKey: pracKey,
                  dispKey: dispKey
                });
              }
              return disp;
            },
            isPageKeyComp: function(pageKey) {
              return pageKey === 'Info' || pageKey === 'Data'; // @app() is 'Muse' and
            },
            
            // Choice
            choice: function() {
              return Mixin.Main.Batch.Choice.data;
            },
            choices: function(name) {
              var obj;
              obj = this.choice()[name];
              if (obj != null) {
                return obj.choices;
              } else {
                console.error('Mixin.choices() bad choice name', {
                  name: name
                });
                return [];
              }
            },
            choose: function(name, choice) {
              var obj;
              obj = this.choice()[name];
              if (obj != null) {
                obj.choices[obj.idx] = choice;
                obj.idx = ++obj.idx % obj.choices.length;
              } else {
                console.error('Mixin.choose() bad choice', {
                  name: name,
                  choice: choice
                });
              }
            },
            choosen: function(name, choice) {
              return (this.choice()[name] != null) && this.inArray(choice, this.choices(name));
            },
            choiceIndex: function(name, choice) {
              var idx, obj;
              obj = this.choice()[name];
              idx = 0;
              if (obj != null) {
                idx = obj.choices.indexOf(choice);
                idx = idx === -1 ? 0 : idx;
              } else {
                console.error('Mixin.choiceIndex() bad choice name', {
                  name: name,
                  idx: idx
                });
              }
              return idx;
            },
            appendImgsHW: function(src, elem) {
              var hw, img;
              hw = {};
              img = new Image();
              img.onload = function() {
                hw.iw = this.width;
                hw.ih = this.height;
                hw.ew = elem['clientWidth'];
                hw.eh = elem['clientHeight'];
                hw.r = Math.min(hw.ew / hw.iw, hw.eh / hw.ih);
                img.width = hw.iw * hw.r;
                img.height = hw.ih * hw.r;
                if (elem.children[0] != null) {
                  // console.log( 'Mixin.appendImgsHW()', hw:hw, { w:img.width, h:img.height } )
                  elem.children[0].remove();
                }
                return elem.append(img);
              };
              return img.src = src;
            }
          };
        },
        // aspectHW:( )
        nav: function() {
          return this.mix().nav();
        }
      }
    };
  }

};

export default Mixin;
