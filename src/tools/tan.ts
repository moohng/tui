type Props = {
  [key in string]?: any;
};

function createFragment() {
  return document.createDocumentFragment();
}

interface FragmentTag {
  Fragment: DocumentFragment;
}

type TagMap = HTMLElementTagNameMap & FragmentTag;

export const Fragment: keyof FragmentTag = 'Fragment';

export function createElement<K extends keyof TagMap>(node: K | TagMap[K] | HTMLElement, props?: Props, ...children: (HTMLElement | string)[]) {
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
      (node as TagMap[K]).addEventListener(eventType.toLocaleLowerCase(), props[key], false);
    } else {
      const _key = key.replace(/[A-Z0-9]/g, v => '-' + v.toLocaleLowerCase());
      if ((node as any).setAttribute) {
        (node as HTMLElement).setAttribute(_key, props[key] as string || '');
      }
    }
  });
  // 递归子节点
  children.forEach(child => {
    (node as TagMap[K]).append(child);
  });

  return node;
}
