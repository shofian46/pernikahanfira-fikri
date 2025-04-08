import { guest } from './app/guest/guest.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = guest.init();
});