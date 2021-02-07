import { transition } from "./animate";

interface SwiperOptions {
  /** 切换速度，默认 300ms */
  speed?: number;
  /** 滚动方向，默认 horizontal */
  direction?: 'horizontal' | 'vertical';
  /** 切换效果，默认 slide */
  effect?: 'slide' | 'fade' | 'flip';
  /** 自由模式，默认 false */
  freeMode?: boolean;
  /** 初始页面，默认 0 */
  initialSlide?: number;
  /** 循环默认，默认 false */
  loop?: boolean;
}

interface Position {
  x: number;
  y: number;
}

enum Direction {
  last = 'last',
  next = 'next',
}

class Swiper {

  private container: HTMLElement;
  private wrapper: HTMLElement;
  private offsetList: number[] = [];
  private options: SwiperOptions;
  private directionKey = 'x';
  private currentIndex: number;
  private length: number = 0;

  constructor(selector: string | HTMLElement, options: SwiperOptions = {}) {
    if (typeof selector === 'string') {
      selector = document.querySelector(selector) as HTMLElement;
    }
    this.container = selector;
    this.wrapper = this.container.firstChild as HTMLElement;

    this.options = Object.assign<SwiperOptions, SwiperOptions>({
      direction: 'horizontal',
      speed: 300,
      effect: 'slide',
      freeMode: false,
      initialSlide: 0,
      loop: false,
    }, options);
    if (this.options.direction === 'vertical') {
      this.directionKey = 'y';
    }
    this.currentIndex = this.options.initialSlide || 0;

    this.init();

    // 监听 DOM 变化
    this.container.addEventListener('DOMSubtreeModified', () => {
      this.init();
    }, false);
  }

  init() {
    if (!this.options.freeMode) {
      // 计算 slide 距离
      for (const $item of this.wrapper.children) {
        this.offsetList.push(this.options.direction === 'vertical' ? ($item as HTMLElement).offsetTop : ($item as HTMLElement).offsetLeft);
      }
      console.log(this.offsetList);
    }

    this.length = this.offsetList.length;

    // index
    this.lastPosition[this.directionKey] = -this.offsetList[this.currentIndex];
    this.scrollTo(0);

    // 事件
    this.wrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    this.wrapper.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    this.wrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    this.wrapper.addEventListener('touchcancel', this.handleTouchEnd.bind(this), false);
  }

  private startPosition: Position = { x: 0, y: 0 };

  private handleTouchStart(e: TouchEvent) {
    this.startPosition = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
  }

  private lastPosition: Position = { x: 0, y: 0 };
  private currentPosition: Position = { x: 0, y: 0 };
  private dir?: Direction;

  private lastMovePosition: Position = { x: 0, y: 0 };
  private swipeTimer = 0;

  private handleTouchMove(e: TouchEvent) {
    const { pageX, pageY } = e.touches[0];
    this.currentPosition = {
      x: pageX - this.startPosition.x + this.lastPosition.x,
      y: pageY - this.startPosition.y + this.lastPosition.y,
    };

    if (this.currentPosition[this.directionKey] > this.offsetList[0]) { // 滑出
      this.currentPosition[this.directionKey] = this.currentPosition[this.directionKey] * 0.3;
    } else if (this.currentPosition[this.directionKey] < -this.offsetList[this.length - 1]) {
      this.currentPosition[this.directionKey] = -this.offsetList[this.length - 1] + (this.currentPosition[this.directionKey] + this.offsetList[this.length - 1]) * 0.3;
    }
    this.wrapper.style.transform = `translate${this.directionKey.toLocaleUpperCase()}(${this.currentPosition[this.directionKey]}px) translateZ(0)`;
    this.wrapper.style.transition = '';

    // 滑动很快才生效
    if (pageX < this.lastMovePosition.x || pageY < this.lastMovePosition.y) {
      this.dir = Direction.next;
    } else if (pageX > this.lastMovePosition.x || pageY > this.lastMovePosition.y) {
      this.dir = Direction.last;
    }
    this.lastMovePosition = {
      x: pageX,
      y: pageY,
    };
    clearTimeout(this.swipeTimer);
    this.swipeTimer = window.setTimeout(() => {
      if (this.currentPosition.x < this.lastPosition.x || this.currentPosition.y < this.lastPosition.y) {
        this.dir = Direction.next;
      } else if (this.currentPosition.x > this.lastPosition.x || this.currentPosition.y > this.lastPosition.y) {
        this.dir = Direction.last;
      }
    }, 200);
  }
  
  private handleTouchEnd() {
    if (!this.dir) {
      return;
    }
    // 滑动到第几页了   [0, 375, 750, 1125, 1500]
    const index = this.offsetList.findIndex(item => -this.currentPosition[this.directionKey] < item);
    console.log('滑动到第 %s 页', index);
    
    if (this.dir === Direction.next) { // 向后滑动
      if (index >= 0) {
        if (-this.currentPosition[this.directionKey] - this.offsetList[index - 1] >= 20 || index === 0) {
          this.currentIndex = index;
        } else {
          this.currentIndex = index - 1;
        }
      } else {
        this.currentIndex = this.length - 1;
      }
    } else if (this.dir === Direction.last) { // 向前滑动
      if (index >= 0) {
        if (this.offsetList[index] + this.currentPosition[this.directionKey] >= 20 && index > 0) {
          this.currentIndex = index - 1;
        } else {
          this.currentIndex = index;
        }
      } else {
        this.currentIndex = this.length - 1;
      }
    }

    this.lastPosition[this.directionKey] = -this.offsetList[this.currentIndex];
    // 执行滚动动画
    this.scrollTo();
  }

  private scrollTo(duration = 300) {
    return new Promise((resolve) => {
      transition(this.wrapper, {
        duration,
        to: {
          transform: `translateX(${this.lastPosition[this.directionKey]}px) translateZ(0)`,
        },
        complete: resolve,
      });
    })
  }
}

export default Swiper;
