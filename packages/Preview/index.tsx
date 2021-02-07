import * as Tan from '../core';
import { fadeIn, fadeOut, transition } from "../core/animate";
import Swiper from '../core/swiper';

type ImageList = string[];

interface EventCallback {
  (index: number): Promise<void>
}

interface Options {
  imageList: ImageList;
  index?: number;
  closable?: boolean;
  onClick?: EventCallback;
  onLongPress?: EventCallback;
}

interface HideFunction {
  (): void
}

function scrollTo(node: HTMLElement, x: number, duration = 300) {
  return new Promise((resolve) => {
    transition(node, {
      duration,
      to: {
        transform: `translateX(${x}px) translateZ(0)`,
      },
      complete: resolve,
    });
  })
}

const Preview = (options: Options | ImageList, index = 0): HideFunction | void => {
  if (Array.isArray(options)) {
    options = {
      imageList: options,
    };
  }

  const { index: _index = index, imageList, closable = false, onClick, onLongPress } = options;

  if (!imageList.length) {
    return;
  }

  let currentIndex = _index; // 当前页数
  const length = imageList.length; // 总页数

  const handleClick = () => {
    onClick?.(currentIndex);
    if (closable) {
      hide();
    }
  };

  const $preview = (
    <div className="tui-preview" onClick={handleClick} onLongPress={onLongPress}>
      <div className="tui-preview__container">
        <div className="tui-preview__wrapper">
          {imageList.map(image => (
            <div className="tui-preview__slide" style={{background: `url(${image}) center / contain no-repeat`}}>
              <i className="dui-icon__loading"></i>
            </div>
          ))}
        </div>
      </div>
      {/* 索引 */}
      <div className="tui-preview__index">{currentIndex + 1}/{length}</div>
    </div>
  );

  document.body.append($preview);

  const swiper = new Swiper(($preview as HTMLElement).firstChild as HTMLElement);
  console.log(swiper);

  fadeIn($preview);

  const hide = () => {
    fadeOut($preview, true);
  };

  return hide;
}

export default Preview;
