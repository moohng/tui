import * as Tan from '../core/index';
import { scaleIn, scaleOut } from "../core/animate";

interface ClickFunction {
  (index: number): Promise<void>;
}

interface Button {
  text: string;
  color?: string;
  className?: string;
  onClick?: ClickFunction;
}

interface DialogOptions {
  title?: string;
  content?: string;
  closable?: boolean;
  className?: string;
  buttons?: (Button | string)[];
}

const Dialog = (options: DialogOptions): Promise<number | void> => {
  const { title, content, buttons, closable, className } = options;

  return new Promise((resolve) => {
    let hide: (index?: number) => void;

    const handleClickMask = () => {
      if (closable) {
        hide();
      }
    };

    const handleClickButton = (index: number, button: Button | string) => {
      if (typeof button !== 'string') {
        Promise.resolve(button.onClick?.(index)).then(() => hide(index));
      }
    };
  
    // 创建 DOM
    let $dialog = (
      <>
        <div className="mask cover" onClick={handleClickMask}></div>
        <div className={['tui-dialog', className]}>
          {title && <div className="tui-dialog__hd">{title}</div>}
          {content && <div className="tui-dialog__content">{content}</div>}
          {buttons?.length && <div className="tui-dialog__ft">{buttons.map((button, index) => <a className={['btn', (button as Button).className]} style={{color: (button as Button).color}} onClick={() => handleClickButton(index, button)}>{(button as Button).text || button}</a>)}</div>}
        </div>
      </>
    );

    $dialog = [].slice.call($dialog.children);
    
    // 显示
    scaleIn($dialog, document.body);

    // 关闭
    hide = index => {
      scaleOut($dialog, true).then(() => {
        resolve(index);
      });
    };
  });
};

export default Dialog;
