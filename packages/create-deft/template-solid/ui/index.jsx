/* @refresh reload */
import {render} from 'deft-solid';
import App from './App';

function initWindow() {
  const window = globalThis.mainWindow || (globalThis.mainWindow = new Window({
    title: 'Deft App',
    width: 400,
    height: 400,
  }));
  window.bindResize((e) => {
    console.log("window resized", e);
  });
  return window;
}

const window = initWindow();

render(() => <App />, window.body);
// Hot reload
//@ts-ignore
module.hot && module.hot.accept();
