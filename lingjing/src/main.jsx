import React from 'react';
import { createRoot } from 'react-dom/client';
import LingjingApp from './LingjingApp.jsx';

// 让页面充满视口, 背景与 App 一致
const s = document.createElement('style');
s.textContent = 'html,body,#root{height:100%;margin:0;}body{background:#080b16;-webkit-tap-highlight-color:transparent;}';
document.head.appendChild(s);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LingjingApp />
  </React.StrictMode>
);
