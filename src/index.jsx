import { Preloader } from '@/components/common';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import { onAuthStateFail, onAuthStateSuccess } from '@/redux/actions/authActions';
import configureStore from '@/redux/store/store';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import App from './App';
import firebase from '@/services/firebase';

WebFont.load({
  google: {
    families: ['Tajawal']
  }
});

const { store, persistor } = configureStore();
const root = document.getElementById('app');
const whatsappNumber = import.meta.env.VITE_WSTP_NRO;
const whatsappMessage = import.meta.env.VITE_WSTP_MESSAGE;
const whatsappLink = `https://wa.me/51${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
const businesstitle = 'Samay | Home';



document.addEventListener('DOMContentLoaded', () => {
  const whatsappAnchor = document.getElementById('whatsapp-link');
  if (whatsappAnchor) {
    console.log ("whatsappLink" + whatsappLink)
    whatsappAnchor.href = whatsappLink;
  }
});

// Render the preloader on initial load
render(<Preloader />, root);

firebase.auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(onAuthStateSuccess(user));
  } else {
    store.dispatch(onAuthStateFail('Failed to authenticate'));
  }
  // then render the app after checking the auth state
  render(<App store={store} persistor={persistor} />, root);
});

console.log("whatsappMessage:" + whatsappMessage)

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-src.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
