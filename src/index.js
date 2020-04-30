import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { logger } from './utils';

const log = logger('index', '#3e3240');

const isProduction = process.env.NODE_ENV === 'production';
const isPrerenderPhase = navigator.userAgent === 'ReactSnap';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}

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

if (isProduction && !isPrerenderPhase) {
  window.__MOUNT_FATHOM = true;
  mountServiceWorker();
}
