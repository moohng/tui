import { Toast } from '../lib';

test('toast', done => {
  const text = 'Hello World';
  Toast(text);

  expect(document.querySelector('.tui-toast').textContent).toBe(text);
  expect(document.querySelector('.tui-toast').getAttribute('data-position')).toBe('bottom');
  setTimeout(() => {
    expect(document.querySelector('.tui-toast')).toBeNull();
    done();
  }, 2500);
});

test('toast success', done => {
  const text = 'Hello World';
  Toast({
    text,
    duration: 1000,
    type: 'success',
    position: 'top',
  });

  expect(document.querySelector('.tui-toast').getAttribute('data-type')).toBe('success');
  expect(document.querySelector('.tui-toast').getAttribute('data-position')).toBe('top');
  setTimeout(() => {
    expect(document.querySelector('.tui-toast')).toBeNull();
    done();
  }, 1500);
});

test('toast info', done => {
  const text = 'Hello World';
  Toast.info(text);

  expect(document.querySelector('.tui-toast').textContent).toBe(text);
  setTimeout(() => {
    expect(document.querySelector('.tui-toast')).toBeNull();
    done();
  }, 2500);
});

test('toast loading', done => {
  const text = '玩命加载中...';
  const hide = Toast.loading(text);

  expect(document.querySelector('.tui-toast span').textContent).toBe(text);
  setTimeout(() => {
    hide();
    setTimeout(() => {
      expect(document.querySelector('.tui-toast')).toBeNull();
      expect(document.querySelector('.mask')).toBeNull();
    }, 100);
    done();
  }, 1000);
});
