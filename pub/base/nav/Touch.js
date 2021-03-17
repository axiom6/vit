var Touch;

Touch = class Touch {
  constructor(stream, nav) {
    //lem.addEventListener( "touchcancel", @cancel,   false )
    //lem.addEventListener( "touchmove",   @move,     false )
    this.start = this.start.bind(this);
    this.endit = this.endit.bind(this);
    this.dblclick = this.dblclick.bind(this);
    this.stream = stream;
    this.nav = nav;
    this.nav.touch = this;
    this.reset();
  }

  reset() {
    this.beg = null;
    return this.end = null;
  }

  listen(elem) {
    elem.addEventListener("touchstart", this.start, false);
    elem.addEventListener("touchend", this.endit, false);
    elem.addEventListener("mousedown", this.start, false);
    elem.addEventListener("mouseup", this.endit, false);
    elem.addEventListener("dblclick", this.dblclick, false);
  }

  start(event) {
    event.preventDefault();
    this.beg = event;
  }

  endit(event) {
    var dir;
    event.preventDefault();
    this.end = event;
    dir = 'none';
    if ((this.beg != null) && (this.end != null)) {
      dir = this.swipeDir(this.beg.clientX, this.beg.clientY, this.end.clientX, this.end.clientY);
      if (dir !== 'none') {
        this.nav.dir(dir);
      }
    }
    this.reset();
  }

  dblclick(event) {
    var dir;
    event.preventDefault();
    dir = event.shiftKey ? 'prev' : 'next';
    this.nav.dir(dir);
    this.reset();
  }

  swipeDir(begX, begY, endX, endY) {
    var ax, ay, dir, dx, dy;
    dir = "none";
    dx = endX - begX;
    dy = endY - begY;
    ax = Math.abs(dx);
    ay = Math.abs(dy);
    // if @end.timeStamp - @beg.timeStamp > 250  # is  long click
    if (ax < 20 && ay < 20) {
      dir = event.shiftKey ? 'prev' : 'next';
    } else if (dx < 0 && ax > ay) {
      dir = 'west';
    } else if (dx > 0 && ax > ay) {
      dir = 'east';
    } else if (dy < 0 && ay > ax) {
      dir = 'north';
    } else if (dy > 0 && ay > ax) {
      dir = 'south';
    } else {
      dir = 'none';
    }
    return dir;
  }

};

export default Touch;

/*
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
*/
