import { flat } from '@moohng/dan';

interface FragmentTag {
  Fragment: DocumentFragment;
}

type TagMap = HTMLElementTagNameMap & FragmentTag;

function createFragment() {
  return document.createDocumentFragment();
}

export const Fragment: keyof FragmentTag = 'Fragment';

const hasOwnProperty = Object.prototype.hasOwnProperty;
const toString = Object.prototype.toString;

function classnames(className: string | Record<string, boolean> | (Record<string, boolean> | string)[]): string[] {
  if (typeof className === 'string') {
    const splitter = /\s+|\s*,\s*/;
    return className.split(splitter).filter(item => item);
  }
  if (Array.isArray(className)) {
    const r: string[] = [];
    className.forEach(item => {
      r.push.apply(r, classnames(item));
    });
    return r;
  }
  if (toString.call(className) === '[object Object]') {
    return classnames(Object.keys(className).filter(item => className[item]));
  }
  return [];
}

export function createElement<K extends keyof TagMap>(node: K | TagMap[K] | HTMLElement, props?: Record<string, unknown>, ...children: (HTMLElement | string | HTMLElement[] | string[])[]) {
  // 创建 DOM
  if (typeof node === 'string') {
    if (node === Fragment) {
      (node as unknown as DocumentFragment) = createFragment();
    } else {
      node = document.createElement(node);
    }
  }
  // 设置属性
  props && Object.keys(props).forEach(key => {
    // 如果是 on 开头，则为事件监听
    const eventType = key.match(/^on(\w+)$/)?.[1];
    if  (eventType && typeof props[key] === 'function') {
      (node as TagMap[K]).addEventListener(eventType.toLocaleLowerCase(), props[key] as EventListenerOrEventListenerObject, false);
    } else if (key === 'style' && typeof props[key] !== 'string') {
      const style = props[key] as any
      for (const k in style) {
        if (hasOwnProperty.call(style, k)) {
          (node as HTMLElement).style[k] = style[k];
        }
      }
    } else if (key === 'className') {
      const className = classnames(props[key] as any);
      (node as HTMLElement).classList.add.apply((node as HTMLElement).classList, className);
    } else {
      const _key = key.replace(/[A-Z0-9]/g, v => '-' + v.toLocaleLowerCase());
      if ((node as any).setAttribute) {
        (node as HTMLElement).setAttribute(_key, props[key] as string || '');
      }
    }
  });
  // 递归子节点
  const childNodes = flat(children.filter(item => item || typeof item === 'number'));
  (node as TagMap[K]).append.apply((node as TagMap[K]), childNodes as Node[])

  return node;
}
