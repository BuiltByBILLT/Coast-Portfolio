import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserContextProvider } from './contexts/UserContext.js';

import './bootstrap.css';
import './index.css';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
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
        <Router>
          <App />
        </Router >
      </UserContextProvider>
    </Provider>
  </QueryClientProvider>,
  document.getElementById('root')
);

