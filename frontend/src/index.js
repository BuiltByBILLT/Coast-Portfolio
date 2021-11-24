import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserContextProvider } from './contexts/UserContext.js';
import { CartContextProvider } from './contexts/CartContext';
import { QueryClient, QueryClientProvider } from 'react-query'

import './bootstrap.css';
import './index.css';

import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <UserContextProvider>
        <CartContextProvider>
          <Router>
            <App />
          </Router >
        </CartContextProvider>
      </UserContextProvider>
    </Provider>
  </QueryClientProvider>,
  document.getElementById('root')
);

