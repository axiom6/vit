var Touch;

Touch = class Touch {
  constructor(stream, nav) {
    //elem.addEventListener( 'pointerleave',  @endit, false )
    //elem.addEventListener( 'pointerout',    @endit, false )
    this.start = this.start.bind(this);
    // console.log( 'Touch.start()', { x:@beg.clientX, y:@beg.clientY } )
    this.movit = this.movit.bind(this);
    // console.log( 'Touch.movit()', { x:@pnt.x, y:@pnt.y, touches:event.targetTouches? } )
    this.endit = this.endit.bind(this);
    this.stream = stream;
    this.nav = nav;
    this.nav.touch = this;
    this.elem = null;
    this.reset();
  }

  reset() {
    this.beg = null;
    return this.pnt = null;
  }

  listen(elem) {
    this.elem = elem;
    this.elem.addEventListener('pointerdown', this.start, false); // { capture:true  }
    this.elem.addEventListener('pointermove', this.movit, false);
    this.elem.addEventListener('pointerup', this.endit, false);
    this.elem.addEventListener('pointercancel', this.endit, false);
  }

  start(event) {
    event.preventDefault();
    if (!((event.touches != null) && event.touches.length > 1)) {
      this.elem.setPointerCapture(event.pointerId);
    }
    this.beg = event;
    this.pnt = {
      x: this.beg.clientX,
      y: this.beg.clientY
    };
  }

  movit(event) {
    event.preventDefault();
    this.pnt = this.beg != null ? {
      x: this.beg.clientX,
      y: this.beg.clientY
    } : {
      x: 0,
      y: 0
    };
    if (event.targetTouches != null) {
      this.pnt.x = event.targetTouches[0].clientX;
      this.pnt.y = event.targetTouches[0].clientY; // Either Mouse event or Pointer Event
    } else {
      this.pnt.x = event.clientX;
      this.pnt.y = event.clientY; // Prefer touch points
    }
  }

  endit(event) {
    var dir;
    event.preventDefault();
    if ((event.touches != null) && event.touches.length > 1) {
      return;
    }
    dir = 'none';
    if ((this.beg != null) && (this.pnt != null)) {
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
    if (ax < 10 && ay < 10) {
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
