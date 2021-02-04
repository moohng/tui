import * as Tan from '../lib/core';

test('jsx', () => {
  const text = 'Hello World';
  const handleClick = (e: MouseEvent) => {
    (e.target as HTMLDivElement).innerText = '你好';
  }
  const test = <div dataType="success" onClick={handleClick}>{text}</div>;

  expect(test.textContent).toBe(text);
  expect(test.getAttribute('data-type')).toBe('success');

  test.click();
  expect(test.innerText).toBe('你好');
});

test('create element', () => {
  const text = 'Hello World';
  const handleClick = (e: MouseEvent) => {
    (e.target as HTMLDivElement).innerText = '你好';
  };
  const test = Tan.createElement('div', {
    class: 'hello',
    dataPosition: 'bottom',
    onClick: handleClick,
  }, Tan.createElement('span', null, text)) as HTMLDivElement;

  expect(test.firstChild.textContent).toBe(text);
  expect(test.dataset.position).toBe('bottom');
  expect(test.classList).toContain('hello');

  test.click();
  expect(test.innerText).toBe('你好');
});
