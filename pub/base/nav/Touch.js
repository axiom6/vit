var Touch;

Touch = class Touch {
  constructor(stream, nav) {
    this.start = this.start.bind(this);
    // console.log( 'Touch.start()', { x:@beg.clientX, y:@beg.clientY } )
    this.movit = this.movit.bind(this);
    this.endit = this.endit.bind(this);
    this.stream = stream;
    this.nav = nav;
    this.nav.touch = this;
    this.elem = null;
    this.reset(); // "tabs-tab","disp-comp","west","east","south","north","cen"
    this.touchClasses = [];
  }

  reset() {
    this.beg = null;
    return this.pnt = null;
  }

  listen(elem, touchClasses) {
    this.elem = elem;
    this.touchClasses = touchClasses;
    this.elem.addEventListener('pointerdown', this.start, false);
    this.elem.addEventListener('pointermove', this.movit, false);
    this.elem.addEventListener('pointerup', this.endit, false);
  }

  start(event) {
    event.preventDefault();
    console.log('Touch.start()', {
      target: event.target.className,
      elem: this.elem.className
    });
    if (!this.nav.inArray(event.target.className, this.touchClasses)) { // A hack for keep touches out
      return;
    }
    if (!((event.touches != null) && event.touches.length > 1)) {
      this.elem.setPointerCapture(event.pointerId);
    }
    this.beg = event;
    this.pnt = this.coord(event, {});
  }

  movit(event) {
    var pnt;
    event.preventDefault();
    pnt = this.pnt != null ? this.pnt : {};
    this.pnt = this.coord(event, pnt);
  }

  coord(event, pnt) {
    if (event.targetTouches != null) {
      pnt.x = event.targetTouches[0].clientX;
      pnt.y = event.targetTouches[0].clientY; // Either Mouse event or Pointer Event
    } else {
      pnt.x = event.clientX;
      pnt.y = event.clientY; // Prefer touch points
    }
    // console.log( 'Touch.movit()', { x:@pnt.x, y:@pnt.y, touches:event.targetTouches? } )
    return pnt;
  }

  endit(event) {
    var dir;
    event.preventDefault();
    if ((event.touches != null) && event.touches.length > 1) {
      return;
    }
    dir = 'none';
    if ((this.beg != null) && (this.pnt != null)) {
      event.target.releasePointerCapture(event.pointerId);
      dir = this.swipeDir(this.beg.clientX, this.beg.clientY, this.pnt.x, this.pnt.y);
      if (dir !== 'none') {
        this.nav.dir(dir);
      }
      console.log('Touch.endit()', {
        x1: this.beg.clientX,
        y1: this.beg.clientY,
        x2: this.pnt.x,
        y2: this.pnt.y,
        dir: dir
      });
    }
    this.reset();
  }

  swipeDir(begX, begY, endX, endY) {
    var ax, ay, dir, dx, dy;
    dir = "none";
    dx = endX - begX;
    dy = endY - begY;
    ax = Math.abs(dx);
    ay = Math.abs(dy);
    //if ax < 10 and ay < 10
    //   dir = if event.shiftKey then 'prev' else 'next'
    if (dx < 0 && ax > ay) {
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
