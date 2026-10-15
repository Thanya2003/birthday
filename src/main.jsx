import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './theme.css';

addEventListener('error', e => { document.documentElement.dataset.err = (document.documentElement.dataset.err || '') + e.message + '; '; });
addEventListener('unhandledrejection', e => { document.documentElement.dataset.err = (document.documentElement.dataset.err || '') + 'promise: ' + (e.reason && e.reason.message || e.reason) + '; '; });

createRoot(document.getElementById('root')).render(<App />);
