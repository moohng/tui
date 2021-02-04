import * as Tan from '../packages/core';
import { Dialog, Toast } from '../packages';


function render(node: HTMLElement, parent = document.body) {
  parent.appendChild(node);
}

function Page() {

  const handleClickDialog = () => {
    Dialog({
      title: '提示',
      content: '确认要这样做吗?',
      closable: true,
      buttons: [
        { text: '取消', className: 'text-red', color: 'red' },
        { text: '确定', onClick: (index) => {
          console.log('确定', index);
          const hide = Toast.loading('');
          return new Promise((resolve) => {
            setTimeout(() => {
              hide();
              resolve();
            }, 2000);
          });
        }}
      ],
    }).then(index => {
      console.log('关闭后', index);
    });
  };

  const handleToast = () => {
    Toast('默认提示');
  };
  const handleInfo = () => {
    Toast.info('Info 提示');
  };
  const handleError = () => {
    Toast.error('Error 提示');
  };
  const handleSuccess = () => {
    Toast.success('Success 提示');
  };
  const handleWarn = () => {
    Toast.warn('Warn 提示');
  };

  const handleLoading = () => {
    const hide = Toast.loading('加载中...');

    setTimeout(hide, 3000);
  };

  return (
    <>
      <div className="card">
        <button className="tui-button" onClick={handleToast}>Toast 提示</button>
        <button className="tui-button" onClick={handleLoading}>Toast Loading</button>
        <button className="tui-button" onClick={handleInfo}>Toast Info</button>
        <button className="tui-button" onClick={handleError}>Toast Error</button>
        <button className="tui-button" onClick={handleSuccess}>Toast Success</button>
        <button className="tui-button" onClick={handleWarn}>Toast Warn</button>
        <button className="tui-button" onClick={handleClickDialog}>Dialog 弹窗</button>
      </div>
    </>
  );
}

render(Page(), document.getElementById('app'));
