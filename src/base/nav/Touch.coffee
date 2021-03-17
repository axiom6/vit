
class Touch

  constructor:( @stream, @nav ) ->
    @nav.touch = @
    @reset()

  reset:() ->
    @beg =  null
    @end =  null

  listen:( elem ) ->
    elem.addEventListener( "touchstart",  @start,    false )
    elem.addEventListener( "touchend",    @endit,    false )
    elem.addEventListener( "mousedown",   @start,    false )
    elem.addEventListener( "mouseup",     @endit,    false )
    elem.addEventListener( "dblclick",    @dblclick, false )
    #lem.addEventListener( "touchcancel", @cancel,   false )
    #lem.addEventListener( "touchmove",   @move,     false )
    return

  start:(  event ) =>
    event.preventDefault()
    @beg = event
    return

  endit:( event ) =>
    event.preventDefault()
    @end = event
    dir  = 'none'
    if @beg? and @end?
       dir = @swipeDir( @beg.clientX, @beg.clientY, @end.clientX, @end.clientY )
       @nav.dir( dir ) if dir isnt 'none'
    @reset()
    return

  dblclick:( event ) =>
    event.preventDefault()
    dir = if event.shiftKey then 'prev' else 'next'
    @nav.dir( dir )
    @reset()
    return

  swipeDir:( begX, begY, endX, endY ) ->
    dir = "none"
    dx  = endX - begX
    dy  = endY - begY
    ax  = Math.abs(dx)
    ay  = Math.abs(dy)
    # if @end.timeStamp - @beg.timeStamp > 250  # is  long click
    if      ax < 20 and ay < 20
      dir = if event.shiftKey then 'prev' else 'next'
    else if dx <  0 and ax > ay then dir = 'west'
    else if dx >  0 and ax > ay then dir = 'east'
    else if dy <  0 and ay > ax then dir = 'north'
    else if dy >  0 and ay > ax then dir = 'south'
    else                             dir = 'none'
    dir

export default Touch

  ###
  doTouch:( dir ) ->
    @nav.
    if not @nav.dirs[dir]?
      console.error( 'Touch.doTouch() unknown dir', { dir:dir, currKey:@nav.compKey } )
      return
    compKey = @nav.komps[@nav.compKey][dir]
    if compKey? and compKey isnt 'none'
       route   = @nav.toRoute(compKey)
       obj     = { source:'Touch', route:route, compKey:compKey }
       @nav.pub( obj )
    else
      console.error( 'Touch.doTouch()', { dir:dir, currKey:@nav.compKey, compKey:compKey, route:route, komps:@nav.komps } )
    return


  @cancel:(  event ) =>
    event.preventDefault()
    return

  @move:(    event ) =>
    event.preventDefault()
    return
  ###