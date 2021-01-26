interface PopFunction {
  (node: HTMLElement[]): void
}

function pop() {}

export function transition(node: HTMLElement | HTMLElement[], options: {
  duration?: number;
  delay?: number;
  easing?: string;
  from?: {
    [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
  };
  to?: {
    [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
  };
  before?: PopFunction;
  after?: PopFunction;
  complete?: PopFunction;
}) {
  if (!options.from && !options.to) {
    return;
  }

  options = {
    duration: 300,
    delay: 0,
    easing: 'ease',
    before: pop,
    after: pop,
    complete: pop,
    ...options,
  };

  if (node instanceof DocumentFragment) {
    node = [].slice.call(node.children);
  } else if (node instanceof HTMLElement) {
    node = [node];
  } else if (!Array.isArray(node)) {
    node = []
  }

  options.before(node as [HTMLElement]);

  // 初始状态
  (node as [HTMLElement]).forEach(($item) => {
    $item.style.transition = `all ${options.duration}ms ${options.easing}`;
    options.from && Object.entries(options.from).forEach(([key, value]) => {
      $item.style[key] = value;
    });
  });

  options.after(node as [HTMLElement]);

  // 过渡状态
  setTimeout(() => {
    (node as [HTMLElement]).forEach(($item) => {
      options.from && Object.keys(options.from).forEach((key) => {
        $item.style[key] = '';
      });
      options.to && Object.entries(options.to).forEach(([key, value]) => {
        $item.style[key] = value;
      });
    });
    setTimeout(() => {
      // 结束
      options.complete(node as [HTMLElement]);
    }, options.duration);
  }, options.delay);
}

interface FadeOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  parent?: HTMLElement;
  complete?: () => void;
}

export function fadeIn(node: HTMLElement | HTMLElement[], options?: FadeOptions | HTMLElement) {
  if (options instanceof HTMLElement) {
    options = {
      parent: options,
    };
  }

  return new Promise((resolve) => {
    transition(node, {
      ...(options as FadeOptions) ?? {},
      from: {
        opacity: '0',
      },
      before: (node) => {
        (options as FadeOptions).parent?.append(...node);
      },
      complete: () => {
        (options as FadeOptions).complete?.();
        resolve(undefined);
      },
    });
  });
}

export function fadeOut(node: HTMLElement | HTMLElement[], options: FadeOptions | boolean) {
  let remove: boolean;
  if (typeof options === 'boolean') {
    remove = options;
  }

  return new Promise((resolve) => {
    transition(node, {
      ...(options as FadeOptions) ?? {},
      to: {
        opacity: '0',
      },
      complete: (node) => {
        remove && node.forEach($item => $item.remove());
        (options as FadeOptions).complete?.();
        resolve(undefined);
      },
    });
  });
}
