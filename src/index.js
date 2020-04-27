import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { logger } from './utils';

const log = logger('index', '#3e3240');
const isDesktop = process.env.DESKTOP;

// declare function for mounting service worker
const mountServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const sw = await navigator.serviceWorker.register('./service-worker.js', {
        scope: '/',
      });
      log('Service Worker registered.');
      log(sw);
    } catch (error) {
      log('Error registering the Service Worker.', 'error');
      log(error);
    }
  }
};

// reset the history to '/' if on desktop app, otherwise it will be "index.html"
if (isDesktop) {
  history.pushState({}, '', '/');
}

// mount react app
ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV === 'production' && !isDesktop) {
  mountServiceWorker();
}
