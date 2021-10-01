import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import './bootstrap.css';
import './index.css';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import App from './App';

const queryClient = new QueryClient()

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,
  document.getElementById('root')
);

