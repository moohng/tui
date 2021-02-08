import * as Tan from '../core';
import { fadeIn, fadeOut } from "../core/animate";
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
}

interface HideFunction {
  (): void
}

const Preview = (options: Options | ImageList, index = 0): HideFunction | void => {
  if (Array.isArray(options)) {
    options = {
      imageList: options,
    };
  }

  const { index: _index = index, imageList, closable = false, onClick } = options;

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
    <div className="tui-preview" onClick={handleClick}>
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

  let swiper: Swiper;

  fadeIn($preview, {
    parent: document.body,
    mounted: () => {
      swiper = new Swiper(($preview as HTMLElement).firstChild as HTMLElement, {
        initialSlide: currentIndex,
        direction: 'horizontal',
        loop: true,
        autoplay: true,
        freeMode: true,
      });
      swiper.on('change', (index) => {
        currentIndex = index;
        document.querySelector('.tui-preview__index')!.textContent = `${currentIndex + 1}/${length}`;
      });
    },
  });

  const hide = () => {
    fadeOut($preview, true).then(() => {
      swiper.destroy();
    });
  };

  return hide;
}

export default Preview;
