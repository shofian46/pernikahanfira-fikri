import { admin } from './app/admin/admin.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = admin.init();
});