import { bootstrap } from '../../libs/bootstrap.js';

export const navbar = (() => {

    /**
     * @param {HTMLElement} btn
     * @returns {void}
     */
    const buttonNavHome = (btn) => {
        bootstrap.Tab.getOrCreateInstance(document.getElementById('button-home')).show();
        btn.classList.add('active');
        document.getElementById('button-mobile-setting').classList.remove('active');
    };

    /**
     * @param {HTMLElement} btn
     * @returns {void}
     */
    const buttonNavSetting = (btn) => {
        bootstrap.Tab.getOrCreateInstance(document.getElementById('button-setting')).show();
        btn.classList.add('active');
        document.getElementById('button-mobile-home').classList.remove('active');
    };

    return {
        buttonNavHome,
        buttonNavSetting,
    };
})();