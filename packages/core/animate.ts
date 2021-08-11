interface PopFunction {
  (node: HTMLElement[]): void
}

type CSSOptions = {
  [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K];
}

interface TransitionOptions {
  /**
   * 动画持续时间
   */
  duration?: number;
  /**
   * 动画延时时间
   */
  delay?: number;
  /**
   * 动画类型
   */
  easing?: string;
  /**
   * 初始状态
   */
  from?: CSSOptions;
  /**
   * 变换状态
   */
  to?: CSSOptions;
  /**
   * 动画即将开始前钩子函数（初始状态）
   */
  before?: PopFunction;
  /**
   * 动画执行结束钩子函数（结束状态）
   */
  complete?: PopFunction;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

function setStyles(node: HTMLElement, styles?: CSSOptions, clear = false) {
  for (const key in styles) {
    if (hasOwnProperty.call(styles, key)) {
      node.style[key] = clear ? '' : styles[key]!;
    }
  }
}

/**
 * 过渡动画
 * @param node 节点
 * @param options 选项
 * @returns
 */
export function transition(node: HTMLElement | HTMLElement[], options: TransitionOptions) {
  if (!options.from && !options.to) {
    return;
  }

  options = Object.assign({
    duration: 300,
    delay: 0,
    easing: 'ease',
  }, options);

  if (node instanceof DocumentFragment) {
    node = [].slice.call(node.children);
  } else if (node instanceof HTMLElement) {
    node = [node];
  }

  if (!Array.isArray(node)) {
    node = [];
  }

  // 初始状态
  node.forEach(($item) => {
    $item.style.transition = `all ${options.duration}ms ${options.easing}`;
    setStyles($item, options.from);
  });

  options.before?.(node);

  // 过渡状态
  setTimeout(() => {
    (node as HTMLElement[]).forEach(($item) => {
      setStyles($item, options.from, true);
      setStyles($item, options.to);
    });
    setTimeout(() => {
      (node as HTMLElement[]).forEach(($item) => {
        $item.style.transition = '';
      });
      // 结束
      options.complete?.(node as HTMLElement[]);
    }, options.duration);
  }, options.delay);
}

interface InOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  parent?: HTMLElement;
  mounted?: () => void;
  complete?: () => void;
}

/**
 * 进入动画（渐入）
 * @param node 节点信息
 * @param options 配置选项
 * @returns
 */
export function fadeIn(node: HTMLElement | HTMLElement[], options?: InOptions | HTMLElement) {
  if (options instanceof HTMLElement) {
    options = {
      parent: options,
    };
  }

  return new Promise<void>((resolve) => {
    transition(node, Object.assign({}, options, {
      from: {
        opacity: '0',
      },
      before: (node) => {
        (options as InOptions)?.parent && HTMLElement.prototype.append.apply((options as InOptions).parent, node);
        (options as InOptions)?.mounted?.();
      },
      complete: () => {
        (options as InOptions)?.complete?.();
        resolve();
      },
    } as TransitionOptions));
  });
}

interface OutOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  remove?: boolean;
  complete?: () => void;
}

/**
 * 渐出动画
 * @param node 节点
 * @param options 选项
 * @returns
 */
export function fadeOut(node: HTMLElement | HTMLElement[], options: OutOptions | boolean) {
  if (typeof options === 'boolean') {
    options = {
      remove: options,
    };
  }

  return new Promise<void>((resolve) => {
    transition(node, Object.assign({}, options, {
      to: {
        opacity: '0',
      },
      complete: (node) => {
        (options as OutOptions)?.remove && node.forEach($item => $item.remove());
        (options as OutOptions)?.complete?.();
        resolve();
      },
    } as TransitionOptions));
  });
}

/**
 * 缩放进入
 * @param node
 * @param options
 * @returns
 */
export function scaleIn(node: HTMLElement | HTMLElement[], options?: InOptions | HTMLElement) {
  if (options instanceof HTMLElement) {
    options = {
      parent: options,
    };
  }

  return new Promise<void>((resolve) => {
    transition(node, Object.assign({}, options, {
      from: {
        opacity: '0',
        transform: 'scale(1.185)',
      },
      before: (node) => {
        (options as InOptions)?.parent && HTMLElement.prototype.append.apply((options as InOptions).parent, node);
        (options as InOptions)?.mounted?.();
      },
      complete: () => {
        (options as InOptions)?.complete?.();
        resolve();
      },
    } as TransitionOptions));
  });
}

/**
 * 缩放淡出
 * @param node
 * @param options
 * @returns
 */
export function scaleOut(node: HTMLElement | HTMLElement[], options?: OutOptions | boolean) {
  if (typeof options === 'boolean') {
    options = {
      remove: options,
    };
  }

  return new Promise<void>((resolve) => {
    transition(node, Object.assign({}, options, {
      to: {
        opacity: '0',
        transform: 'scale(1.185)',
      },
      complete: (node) => {
        (options as OutOptions)?.remove && node.forEach($item => $item.remove());
        (options as OutOptions)?.complete?.();
        resolve();
      },
    } as TransitionOptions));
  });
}
