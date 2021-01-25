import * as React from '../../tools/tan';

interface ToastOptions {
  text?: string; // 字符串 或 html模板
  type?: 'success' | 'error' | 'info' | 'warn' | 'loading' | 'toast';
  margin?: string;
  delay?: number;
  position?: 'top' | 'bottom' | 'center';
}

interface ToastFunction {
  (options: string | ToastOptions): void;
}

interface ToastObject {
  (options: string | ToastOptions): void;
  info: ToastFunction;
  success: ToastFunction;
  error: ToastFunction;
  warn: ToastFunction;
  loading: ToastFunction;
}

const Toast: ToastObject = (options) => {
  if (typeof options === 'string') {
    options = {
      text: options,
    };
  }

  options.type = options.type ?? 'toast';
  
  if (options.type === 'toast') {
    options.position = options.position || 'bottom';
  } else if (options.type === 'loading') {
    options.position = 'center';
  } else {
    options.position = 'top';
  }

  // 创建 DOM
  let $toast = options.type === 'loading' ? (
    <>
      <div class="mask"></div>
      <div class="tui-toast" dataType={options.type} dataPosition={options.position}>
        <i class="tui-icon__loading"></i>
        <span>{options.text ?? ''}</span>
      </div>
    </>
  ) : <div class="tui-toast" dataType={options.type} dataPosition={options.position}>{options.text ?? ''}</div>;

  if ($toast instanceof DocumentFragment) {
    $toast = [].slice.call($toast.children);
  }

  // 显示
  document.body.append(...[].concat($toast));
  setTimeout(() => toggle($toast, 'show'));

  // 隐藏
  const hide = () => {
    toggle($toast, 'show');
    setTimeout(() => {
      removeElement($toast);
    }, 300);
  };

  if (options.type !== 'loading') {
    setTimeout(hide, options.delay ?? 2000);
  }

  return hide;
};

Toast.info = (text: string) => Toast({ text, type: 'info' });
Toast.success = (text: string) => Toast({ text, type: 'success' });
Toast.error = (text: string) => Toast({ text, type: 'error' });
Toast.warn = (text: string) => Toast({ text, type: 'warn' });
Toast.loading = (text: string = '正在加载') => Toast({ text, type: 'loading' });

function toggle(node: HTMLElement | [HTMLElement], className: string) {
  if (Array.isArray(node)) {
    node.forEach(($item) => {
      $item.classList.toggle(className);
    })
  } else {
    node.classList.toggle(className);
  }
}

function removeElement(node: HTMLElement | [HTMLElement]) {
  if (Array.isArray(node)) {
    node.forEach(($item) => {
      $item.remove();
    })
  } else {
    node.remove();
  }
}

export default Toast;
