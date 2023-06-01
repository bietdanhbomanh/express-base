(function () {
    'use strict';

    // Dark mode switcher
    $('.dark-mode-switcher').on('click', function () {
        let switcher = $(this).find('.dark-mode-switcher__toggle');
        if ($(switcher).hasClass('dark-mode-switcher__toggle--active')) {
            $(switcher).removeClass('dark-mode-switcher__toggle--active');
            toggleTheme();
        } else {
            $(switcher).addClass('dark-mode-switcher__toggle--active');
            toggleTheme(false);
        }
    });

    function toggleTheme(light = true) {
        const html = $('html');
        if (light) {
            html.removeClass('dark');
            html.addClass('light');
        } else {
            html.removeClass('light');
            html.addClass('dark');
        }
    }
})();
