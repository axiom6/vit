
import Util from '../util/Util.js'
import Vis  from '../../draw/base/Vis.js'

class Mixin

  constructor:( Main, routeNames ) ->
    Mixin.Main       = Main
    Mixin.routeNames = routeNames

  mixin:() ->
    return  {

      created: () ->
        return

      methods: {

        mix:() ->

          {   # mix allows Vue components to distinguish global mixin methods

          # Util
          isDef: (d) ->
            d isnt null and typeof (d) isnt 'undefined' and d isnt 'None'
          isStr: (s) ->
            @isDef(s) and typeof (s) == "string" and s.length > 0
          isArray: (a) ->
            @isDef(a) and typeof (a) != "string" and a.length? and a.length > 0
          inArray: (e, a) ->
            @isArray(a) and a.indexOf(e) > -1
          isChild: (key) ->
            a = key.charAt(0)
            b = key.charAt(key.length - 1)
            a is a.toUpperCase() and a isnt '$' and b isnt '_'
          keys: (obj) ->
            Object.keys(obj)
          hasElem: (elem) ->
            elem? and elem['clientHeight']? and elem['clientHeight'] > 0
          getElem: ($refs, name) ->  # Not called
            elem = $refs[name]
            console.log('Mixin.getElem() $refs[name]   ', $refs, elem, name)
            if not @hasElem(elem) and elem[0]?
              elem = $refs[name][0]
              console.log('Mixin.getElem() $refs[name][0]', $refs, elem, name)
              if not @hasElem(elem)
                console.error('Mixin.hasElem() unable to find elem in $refs[name]', name)
                console.dir($refs)
                elem = null
            else
              console.error('Mixin.hasElem() unable to find elem in $refs[name][0]', name)
              elem = null
            elem

          styleObj: (ikwObj, fontSize = undefined) ->
            hsv = [30, 90, 90]
            if @isDef(ikwObj)
              if @isDef(ikwObj.hsv)
                hsv = ikwObj.hsv
              else if @isDef(ikwObj.dir)
                hsv = switch ikwObj.dir
                  when 'west'  then [195, 90, 70]
                  when 'north' then [90, 90, 90]
                  when 'east'  then [30, 60, 90]
                  when 'south' then [60, 90, 90]
                  else
                    [30, 90, 90]
            style = {backgroundColor: Vis.toRgbaHsv(hsv)}
            style['fontSize'] = fontSize + 'rem' if fontSize
            style

          toRgbaHsv: (hsv) ->
            Vis.toRgbaHsv(hsv)

          # Main
          app: () ->
            Mixin.Main.myName
          isMuse: () ->
            'Muse' is @app()
          subscribe: (subject, source, onMethod) ->
            Mixin.Main['stream'].subscribe(subject, source, onMethod)
            return
          publish: (subject, object) ->
            Mixin.Main['stream'].publish(subject, object)
            return
          stream: () ->
            Mixin.Main.stream
          batch: () ->
            Mixin.Main.Batch
          fontSize: (scale) ->  # JavaScript font-size the matches themeFS in theme.less
            fs = if Mixin.Main.fontSize? then Mixin.Main.fontSize else 2
            sc = if scale?               then scale else 1
            sc * fs + 'vmin'
          fontSizeCss: (scale) ->
            {fontSize: @fontSize(scale)}

          # Nav
          nav: () ->
            console.error('Mixin.nav() null') if not Mixin.Main.nav?
            Mixin.Main.nav
          touch: () ->
            console.error('Mixin.touch() null') if not Mixin.Main.touch?
            Mixin.Main.touch
          isTouch: () ->
            Mixin.Main.touch?
          isNav: () ->
            Mixin.Main.nav?
          navRoute: () ->
            if      @isNav() then @nav().route else if @isDir() then @dir().route else 'None'
          isRoute: (route) ->
            route is @navRoute()

          # Batch
          isBatch:(compk) ->
            Mixin.Main.Batch[compk]?
          prin: ()  ->
            Mixin.Main.Batch['Prin'].data.pracs
          comps: (compk) ->
            Mixin.Main.Batch[compk].data.comps
          kompsTocs: () ->   # For Tocs.vue
            Mixin.Main.komps
          routeNames: () ->
            Mixin.routeNames
          subset: (compk, filter) ->
            filts = {}
            for own key, prac of @pracs(compk) when filter(prac)
              filts[key] = prac
            filts
          conns: (compk) ->
            filter = if compk isnt 'Prin' then (prac) -> prac.row isnt 'Dim' else (prac) -> prac.row is 'Dim'
            @subset(compk, filter)
          pracs: (compk) ->
            Mixin.Main.Batch[compk].data.pracs
          disps: (compk, prack) ->
            Mixin.Main.Batch[compk].data[prack].disps
          areas: (compk, prack, dispk) ->
            Mixin.Main.Batch[compk].data[prack][dispk].areas
          items: (compk, prack, dispk, areak) ->
            Mixin.Main.Batch[compk].data[prack][dispk][areak].items
          bases: (compk, prack, dispk, areak, itemk) ->
            Mixin.Main.Batch[compk].data[prack][dispk][areak][itemk].bases

          # Talk
          compObject: (compKey) ->
            if Mixin.Main.Batch[compKey]?
               Mixin.Main.Batch[compKey].data.pracs
            else
               console.error('Mixin.compObject() bad compKey', compKey)
               {}

          inovObject: (compKey,inovKey) ->
            pracs = {}
            if @isBatch(compKey)
              compPracs = @pracs(compKey)
              if @isDef(inovKey) and inovKey isnt compKey and @isBatch(inovKey)
                inovPracs = @pracs(inovKey)
                # console.log( 'Mixin.inovObject() inovPracs', inovPracs )
                for key, prac of compPracs
                  if prac.column is 'Innovate' and prac.row isnt 'Dim'
                    inovPrac = @getPrac(inovPracs,prac.row,prac.column,inovKey)
                    pracs[inovPrac.name] = inovPrac
                  else
                    pracs[key] = prac
              else
                pracs = compPracs
              pracs
            else if compKey isnt "Home" and compKey isnt "Cube"
              console.error('Mixin.inovObject() bad compKey or inovKey', { compKey:compKey, inovKey:inovKey } )
            pracs

          hasInov: (key) ->
            key is 'Info' or key is 'Know' or key is 'Wise'

          getPrac: ( pracs, row, column, inovKey ) ->
            for key, prac of pracs
              return prac if prac.row is row and prac.column is column
            console.error( 'Mixin.getPrac() missing prac for', { inovKey:inovKey, row:row, column:column } )
            {}

          pracObject:( compKey, inovKey, pracKey ) ->
            pracs = @inovObject( compKey, inovKey )
            prac  = {}
            if pracs[pracKey]?
              prac = pracs[pracKey]
            else
              console.error('Mixin.pracObject() unknown pracKey', { compKey:compKey, inovKey:inovKey, pracKey:pracKey, pracs:pracs } )
            prac

          sectObject: (pracKey, dispKey) ->
            talkObjs = @compObject('Talk')
            talkObj = talkObjs[pracKey]
            console.log( 'Mixin.sectObj()', { talkObj:talkObj, talkKey:pracKey, sectKey:dispKey } ) # , sectObj:sectObj
            sectObjs = @compObject(talkObj.comp)
            talkObj.keys = if talkObj.keys?  then talkObj.keys else Util.childKeys(sectObjs)
            dispKey = if dispKey is 'None' or not @inArray(dispKey,talkObj.keys) then @keys(sectObjs)[0] else dispKey
            sectObj = sectObjs[dispKey]
            if not sectObj?
              console.error( 'Nav.sectObject null', { pracKey:pracKey, dispKey:dispKey } )
              sectObj = {}
            sectObj.src = talkObj.src
            sectObj.name = dispKey
            sectObj.peys = talkObj.keys
            sectObj.keys = if sectObj.keys?  then sectObj.keys else Util.childKeys(sectObj)
            sectObj = Object.assign( {}, sectObj ) if sectObj.imgsIdx isnt @nav().imgsIdx  # Trigger reactive render
            sectObj.imgsIdx = @nav().imgsIdx
            sectObj

          presObject:( sectObj, presKey ) ->
            presKey = if presKey is 'None' and sectObj.keys[0]? then sectObj.keys[0] else presKey
            pageObj = null
            if presKey isnt 'None' and sectObj[presKey]?
              pageObj = sectObj[presKey]
              pageObj.src = sectObj.src
              pageObj.name = presKey
              pageObj.peys = sectObj.keys
              pageObj.keys = if pageObj.keys?  then pageObj.keys else Util.childKeys(pageObj)
              console.log( 'Mixin.pageObj()', { dispKey:sectObj.name, presKey:presKey, pageObj:pageObj } )
            pageObj

          dataObject: (sectObj, presKey) ->
            dataObj = null
            if sectObj.type is 'Prac'
              dataObj = @pracObject(sectObj.src, sectObj.name)
            else if sectObj.type is 'Disp' and presKey isnt 'None'
              dataObj = @dispObject(sectObj.src, 'None', sectObj.name, presKey )
            dataObj

          dispObject:( compKey, inovKey, pracKey, dispKey ) ->
            disp = {}
            pracs = @inovObject( compKey, inovKey )
            if pracs[pracKey]?
              prac = pracs[pracKey]
              if prac[dispKey]?
                disp = prac[dispKey]
              else
                console.error( 'Mixin.dispObject() unknown dispKey', { compKey:compKey, inovKey:inovKey, pracKey:pracKey, dispKey:dispKey } )
            else
              console.error( 'Mixin.dispObject() unknown pracKey',   { compKey:compKey, inovKey:inovKey, pracKey:pracKey, dispKey:dispKey } )
            disp

          isPageKeyComp: (pageKey) ->
            pageKey is 'Info' or pageKey is 'Data' # @app() is 'Muse' and

          # Choice
          choice: () ->
            Mixin.Main.Batch.Choice.data
          choices: (name) ->
            obj = @choice()[name]
            if obj?
              obj.choices
            else
              console.error('Mixin.choices() bad choice name', {name: name})
              []
          choose: (name, choice) ->
            obj = @choice()[name]
            if obj?
              obj.choices[obj.idx] = choice;
              obj.idx = ++obj.idx % obj.choices.length;
            else
              console.error('Mixin.choose() bad choice', {name: name, choice: choice})
            return
          choosen: (name, choice) ->
            @choice()[name]? and @inArray(choice, @choices(name))
          choiceIndex: (name, choice) ->
            obj = this.choice()[name]
            idx = 0
            if obj?
              idx = obj.choices.indexOf(choice)
              idx = if idx is -1 then 0 else idx
            else
              console.error('Mixin.choiceIndex() bad choice name', {name: name, idx: idx})
            idx

          appendImgsHW:( src, elem ) ->
            hw  = {}
            img = new Image();
            img.onload = () ->
              hw.iw = this.width
              hw.ih = this.height
              hw.ew = elem['clientWidth']
              hw.eh = elem['clientHeight']
              hw.r  = Math.min( hw.ew/hw.iw, hw.eh/hw.ih )
              img.width  = hw.iw * hw.r
              img.height = hw.ih * hw.r
              # console.log( 'Mixin.appendImgsHW()', hw:hw, { w:img.width, h:img.height } )
              elem.children[0].remove() if elem.children[0]?
              elem.append( img )
            img.src = src

          # aspectHW:( )
        }

        nav:() ->
          @mix().nav()
      }
    }

export default Mixin