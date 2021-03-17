var Touch;

Touch = class Touch {
  constructor(stream, nav) {
    this.start = this.start.bind(this);
    this.endit = this.endit.bind(this);
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
    elem.onpointerdown = this.start;
    elem.onpointerup = this.endit;
  }

  start(event) {
    event.preventDefault();
    console.log('Touch.start()');
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
    console.log('Touch.endit()', {
      dir: dir
    });
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
