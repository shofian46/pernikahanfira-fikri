import { storage } from './storage.js';

export const theme = (() => {

    const themeColors = {
        '#000000': '#ffffff',
        '#ffffff': '#000000',
        '#212529': '#f8f9fa',
        '#f8f9fa': '#212529'
    };
    const themeLight = ['#ffffff', '#f8f9fa'];
    const themeDark = ['#000000', '#212529'];

    let isAuto = false;

    /**
     * @type {ReturnType<typeof storage>|null}
     */
    let theme = null;

    /**
     * @type {HTMLElement|null}
     */
    let metaTheme = null;

    /**
     * @type {IntersectionObserver|null}
     */
    let observerLight = null;

    /**
     * @type {IntersectionObserver|null}
     */
    let observerDark = null;

    /**
     * @param {HTMLElement} element 
     */
    const toLight = (element) => {
        const classMap = {
            'text-light': 'text-dark',
            'btn-theme-light': 'btn-theme-dark',
            'bg-dark': 'bg-light',
            'bg-black': 'bg-white',
            'bg-theme-dark': 'bg-theme-light',
            'color-theme-black': 'color-theme-white',
            'btn-outline-light': 'btn-outline-dark',
            'bg-cover-black': 'bg-cover-white'
        };

        Object.entries(classMap).forEach(([oldClass, newClass]) => {
            if (element.classList.contains(oldClass)) {
                element.classList.replace(oldClass, newClass);
            }
        });
    };

    /**
     * @param {HTMLElement} element 
     */
    const toDark = (element) => {
        const classMap = {
            'text-dark': 'text-light',
            'btn-theme-dark': 'btn-theme-light',
            'bg-light': 'bg-dark',
            'bg-white': 'bg-black',
            'bg-theme-light': 'bg-theme-dark',
            'color-theme-white': 'color-theme-black',
            'btn-outline-dark': 'btn-outline-light',
            'bg-cover-white': 'bg-cover-black'
        };

        Object.entries(classMap).forEach(([oldClass, newClass]) => {
            if (element.classList.contains(oldClass)) {
                element.classList.replace(oldClass, newClass);
            }
        });
    };

    /**
     * @returns {void}
     */
    const setLight = () => theme.set('active', 'light');

    /**
     * @returns {void}
     */
    const setDark = () => theme.set('active', 'dark');

    /**
     * @returns {void}
     */
    const onLight = () => {
        setLight();
        document.documentElement.setAttribute('data-bs-theme', 'light');

        const classes = [
            '.text-light',
            '.btn-theme-light',
            '.bg-dark',
            '.bg-black',
            '.bg-theme-dark',
            '.color-theme-black',
            '.btn-outline-light',
            '.bg-cover-black'
        ].join(', ');

        document.querySelectorAll(classes).forEach((e) => observerLight.observe(e));
    };

    /**
     * @returns {void}
     */
    const onDark = () => {
        setDark();
        document.documentElement.setAttribute('data-bs-theme', 'dark');

        const classes = [
            '.text-dark',
            '.btn-theme-dark',
            '.bg-light',
            '.bg-white',
            '.bg-theme-light',
            '.color-theme-white',
            '.btn-outline-dark',
            '.bg-cover-white'
        ].join(', ');

        document.querySelectorAll(classes).forEach((e) => observerDark.observe(e));
    };

    /**
     * @param {string|null} [onDark=null] 
     * @param {string|null} [onLight=null] 
     * @returns {boolean|string}
     */
    const isDarkMode = (onDark = null, onLight = null) => {
        const status = theme.get('active') === 'dark';

        if (onDark && onLight) {
            return status ? onDark : onLight;
        }

        return status;
    };

    /**
     * @returns {void}
     */
    const change = () => isDarkMode() ? onLight() : onDark();

    /**
     * @returns {boolean}
     */
    const isAutoMode = () => isAuto;

    /**
     * @returns {void}
     */
    const initObserver = () => {
        const createObserver = (action, themes) => new IntersectionObserver((es, o) => {

            es.filter((e) => e.isIntersecting).forEach((e) => action(e.target));
            es.filter((e) => !e.isIntersecting).forEach((e) => action(e.target));

            o.disconnect();

            const now = metaTheme.getAttribute('content');
            metaTheme.setAttribute('content', themes.some((i) => i === now) ? themeColors[now] : now);
        });

        observerLight = createObserver(toLight, themeDark);
        observerDark = createObserver(toDark, themeLight);
    };

    /**
     * @returns {void}
     */
    const spyTop = () => {
        const callback = (es) => {
            es.filter((e) => e.isIntersecting).forEach((e) => {
                const themeColor = ['bg-black', 'bg-white'].some((i) => e.target.classList.contains(i))
                    ? isDarkMode(themeDark[0], themeLight[0])
                    : isDarkMode(themeDark[1], themeLight[1]);

                metaTheme.setAttribute('content', themeColor);
            });
        };

        const observerTop = new IntersectionObserver(callback, { rootMargin: '0% 0% -95% 0%' });
        document.querySelectorAll('section').forEach((e) => observerTop.observe(e));
    };

    /**
     * @returns {void}
     */
    const init = () => {
        theme = storage('theme');
        metaTheme = document.querySelector('meta[name="theme-color"]');

        initObserver();

        if (!theme.has('active')) {
            window.matchMedia('(prefers-color-scheme: dark)').matches ? setDark() : setLight();
        }

        switch (document.body.getAttribute('data-theme')) {
            case 'dark':
                setDark();
                break;
            case 'light':
                setLight();
                break;
            default:
                isAuto = true;
        }

        if (isDarkMode()) {
            onDark();
        } else {
            onLight();
        }
    };

    return {
        init,
        spyTop,
        change,
        isDarkMode,
        isAutoMode,
    };
})();