
class Touch

  constructor:( @stream, @nav ) ->
    @nav.touch    = @
    @elem         = null
    @reset()          # "tabs-tab","disp-comp","west","east","south","north","cen"
    @touchClasses = []

  reset:() ->
    @beg = null
    @pnt = null

  listen:(  elem, touchClasses ) ->
    @elem         = elem
    @touchClasses = touchClasses
    @elem.addEventListener( 'pointerdown', @start, false )
    @elem.addEventListener( 'pointermove', @movit, false )
    @elem.addEventListener( 'pointerup',   @endit, false )
    return

  start:(  event ) =>
    event.preventDefault()
    console.log( 'Touch.start()', { target:event.target.className, elem:@elem.className } )
    return if not @nav.inArray( event.target.className, @touchClasses ) # A hack for keep touches out
    if not ( event.touches? and event.touches.length > 1 )
      @elem.setPointerCapture( event.pointerId )
    @beg = event
    @pnt = @coord( event, {} )
    # console.log( 'Touch.start()', { x:@beg.clientX, y:@beg.clientY } )
    return

  movit:( event ) =>
    event.preventDefault()
    pnt  = if @pnt? then @pnt else {}
    @pnt = @coord( event, pnt )
    return

  coord:( event, pnt ) ->
    if event.targetTouches?                    # Prefer touch points
       pnt.x = event.targetTouches[0].clientX
       pnt.y = event.targetTouches[0].clientY
    else                                      # Either Mouse event or Pointer Event
       pnt.x = event.clientX
       pnt.y = event.clientY
    # console.log( 'Touch.movit()', { x:@pnt.x, y:@pnt.y, touches:event.targetTouches? } )
    return pnt

  endit:( event ) =>
    event.preventDefault()
    return if event.touches? && event.touches.length > 1
    dir  = 'none'
    if @beg? and @pnt?
       event.target.releasePointerCapture(event.pointerId)
       dir = @swipeDir( @beg.clientX, @beg.clientY, @pnt.x, @pnt.y )
       @nav.dir( dir ) if dir isnt 'none'
       console.log( 'Touch.endit()', { x1:@beg.clientX, y1:@beg.clientY, x2:@pnt.x, y2:@pnt.y, dir:dir } )
    @reset()
    return

  swipeDir:( begX, begY, endX, endY ) ->
    dir = "none"
    dx  = endX - begX
    dy  = endY - begY
    ax  = Math.abs(dx)
    ay  = Math.abs(dy)
    #if ax < 10 and ay < 10
    #   dir = if event.shiftKey then 'prev' else 'next'
    if      dx <  0 and ax > ay then dir = 'west'
    else if dx >  0 and ax > ay then dir = 'east'
    else if dy <  0 and ay > ax then dir = 'north'
    else if dy >  0 and ay > ax then dir = 'south'
    else                             dir = 'none'
    dir

export default Touch 