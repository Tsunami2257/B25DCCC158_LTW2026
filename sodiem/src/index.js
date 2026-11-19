import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { NoticeProvider } from './context/NoticeContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <NoticeProvider>
          <App />
        </NoticeProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);