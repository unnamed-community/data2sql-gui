import i18n from 'i18n';
import { ipcRenderer as ipc } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import Home from './components/Home';

ipc.send('get-system-locale');
ipc.on('system-locale-information', (event, locale) => {
  i18n.configure({
    directory: __dirname + '/../locales',
    register: global,
    defaultLocale: 'en',
    logDebugFn: msg => {
      console.log('[LOCALE DEBUG]', msg);
    },
    logWarnFn: msg => {
      console.log('[LOCALE WARN]', msg);
    },
    logErrorFn: msg => {
      console.log('[LOCALE ERROR]', msg);
    },
  });

  i18n.setLocale(locale);

  ReactDOM.render(<Home />, document.getElementById('root'));
});
