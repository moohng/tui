import * as Tan from '../core/index';
import { fadeIn, fadeOut } from '../core/animate';

interface ToastOptions {
  text?: string; // 字符串 或 html模板
  type?: 'success' | 'error' | 'info' | 'warn' | 'loading' | 'toast';
  margin?: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
}

interface ToastHide {
  (): void;
}

interface ToastFunction {
  (text: string): ToastHide;
}

interface ToastObject {
  (options: string | ToastOptions): ToastHide;
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
  fadeIn($toast, document.body);

  // 隐藏
  const hide = () => {
    fadeOut($toast, true);
  };

  if (options.type !== 'loading') {
    setTimeout(hide, options.duration ?? 2000);
  }

  return hide;
};

Toast.info = (text: string) => Toast({ text, type: 'info' });
Toast.success = (text: string) => Toast({ text, type: 'success' });
Toast.error = (text: string) => Toast({ text, type: 'error' });
Toast.warn = (text: string) => Toast({ text, type: 'warn' });
Toast.loading = (text: string = '正在加载') => Toast({ text, type: 'loading' });

export default Toast;
