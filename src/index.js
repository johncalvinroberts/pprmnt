import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { logger } from './utils';

const log = logger('index', '#3e3240');

ReactDOM.render(<App />, document.getElementById('root'));

(async () => {
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
})();
