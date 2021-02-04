interface PopFunction {
  (node: HTMLElement[]): void
}

type CSSOptions = {
  [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K];
}

interface TransitionOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  from?: CSSOptions;
  to?: CSSOptions;
  before?: PopFunction;
  after?: PopFunction;
  complete?: PopFunction;
}

export function transition(node: HTMLElement | HTMLElement[], options: TransitionOptions) {
  if (!options.from && !options.to) {
    return;
  }

  options = {
    duration: 300,
    delay: 0,
    easing: 'ease',
    ...options,
  };

  if (node instanceof DocumentFragment) {
    node = [].slice.call(node.children);
  } else if (node instanceof HTMLElement) {
    node = [node];
  } else if (!Array.isArray(node)) {
    node = []
  }

  options.before?.(node as [HTMLElement]);

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  // 初始状态
  (node as [HTMLElement]).forEach(($item) => {
    $item.style.transition = `all ${options.duration}ms ${options.easing}`;
    for (const key in options.from) {
      if (hasOwnProperty.call(options.from, key)) {
        $item.style[key as any] = options.from[key as any] as any;
      }
    }
  });

  options.after?.(node as [HTMLElement]);

  // 过渡状态
  setTimeout(() => {
    (node as [HTMLElement]).forEach(($item) => {
      for (const key in options.from) {
        if (hasOwnProperty.call(options.from, key)) {
          $item.style[key as any] = '';
        }
      }
      for (const key in options.to) {
        if (hasOwnProperty.call(options.to, key)) {
          $item.style[key as any] = options.to[key as any] as any;
        }
      }
    });
    setTimeout(() => {
      // 结束
      options.complete?.(node as [HTMLElement]);
    }, options.duration);
  }, options.delay);
}

interface Options {
  duration?: number;
  delay?: number;
  easing?: string;
  parent?: HTMLElement;
  complete?: () => void;
}

export function fadeIn(node: HTMLElement | HTMLElement[], options?: Options | HTMLElement) {
  if (options instanceof HTMLElement) {
    options = {
      parent: options,
    };
  }

  return new Promise((resolve) => {
    transition(node, {
      ...(options as Options) ?? {},
      from: {
        opacity: '0',
      },
      before: (node) => {
        (options as Options).parent?.append(...node);
      },
      complete: () => {
        (options as Options).complete?.();
        resolve(undefined);
      },
    });
  });
}

export function fadeOut(node: HTMLElement | HTMLElement[], options: Options | boolean) {
  let remove: boolean;
  if (typeof options === 'boolean') {
    remove = options;
  }

  return new Promise((resolve) => {
    transition(node, {
      ...(options as Options) ?? {},
      to: {
        opacity: '0',
      },
      complete: (node) => {
        remove && node.forEach($item => $item.remove());
        (options as Options).complete?.();
        resolve(undefined);
      },
    });
  });
}

export function scaleIn(node: HTMLElement | HTMLElement[], options?: Options | HTMLElement) {
  if (options instanceof HTMLElement) {
    options = {
      parent: options,
    };
  }

  return new Promise((resolve) => {
    transition(node, {
      ...(options as Options) ?? {},
      from: {
        opacity: '0',
        transform: 'scale(1.185)',
      },
      before: (node) => {
        (options as Options).parent?.append(...node);
      },
      complete: () => {
        (options as Options).complete?.();
        resolve(undefined);
      },
    });
  });
}

export function scaleOut(node: HTMLElement | HTMLElement[], options?: Options | boolean) {
  let remove: boolean;
  if (typeof options === 'boolean') {
    remove = options;
  }

  return new Promise((resolve) => {
    transition(node, {
      ...(options as Options) ?? {},
      to: {
        opacity: '0',
        transform: 'scale(1.185)',
      },
      complete: (node) => {
        remove && node.forEach($item => $item.remove());
        (options as Options)?.complete?.();
        resolve(undefined);
      },
    });
  });
}
