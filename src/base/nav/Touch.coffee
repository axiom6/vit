
class Touch

  constructor:( @stream, @nav ) ->
    @nav.touch = @
    @reset()

  reset:() ->
    @beg = null
    @end = null

  listen:( elem ) ->
    elem.onpointerdown = @start
    elem.onpointerup   = @endit
    return

  start:(  event ) =>
    event.preventDefault()
    console.log( 'Touch.start()')
    @beg = event
    return

  endit:( event ) =>
    event.preventDefault()
    @end = event
    dir  = 'none'
    if @beg? and @end?
       dir = @swipeDir( @beg.clientX, @beg.clientY, @end.clientX, @end.clientY )
       @nav.dir( dir ) if dir isnt 'none'
    console.log( 'Touch.endit()', { dir:dir } )
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