import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { frontendTracer } from './components/tracing'
import { env } from './env'

 if (env.REACT_APP_OTEL_ENABLE === "true") {
frontendTracer();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);