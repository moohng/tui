interface FragmentTag {
  Fragment: DocumentFragment;
}

type TagMap = HTMLElementTagNameMap & FragmentTag;

function createFragment() {
  return document.createDocumentFragment();
}

export const Fragment: keyof FragmentTag = 'Fragment';

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
        if (Object.prototype.hasOwnProperty.call(style, k)) {
          (node as HTMLElement).style[k] = style[k];
        }
      }
    } else if (key === 'className') {
      const className = props[key];
      let t: string[] = [];
      let o = {};
      if (Array.isArray(className)) {
        className.forEach(item => {
          if (typeof item === 'string') {
            t.push(...item.split(/\s+|\s*,\s*/));
          } else {
            Object.assign(o, item);
          }
        });
      } else if (typeof className === 'string') {
        t.push(...className.split(/\s+|\s*,\s*/));
      }
      Object.keys(o).forEach(key => {
        if (o[key]) {
          t.push(key);
        }
      });
      (node as HTMLElement).classList.add(...t.filter(i => i));
    } else {
      const _key = key.replace(/[A-Z0-9]/g, v => '-' + v.toLocaleLowerCase());
      if ((node as any).setAttribute) {
        (node as HTMLElement).setAttribute(_key, props[key] as string || '');
      }
    }
  });
  // 递归子节点
  const childNodes = [].flat.call(children, 100);
  (node as TagMap[K]).append(...(childNodes as Node[]));

  return node;
}
