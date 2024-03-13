module.exports = function loadHelpers(req, res, next) {
    res.locals.helpers = helpers;
    next();
};
const helpers = {
    generateMenu: function (menu, isOpen = false, isFirst = true) {
        let menuHTML = '<ul class="' + (isOpen ? 'side-menu__sub-open' : '') + '">';

        menu.forEach((item) => {
            if (!item.hidden || !isFirst) {
                menuHTML += '<li>';
                menuHTML +=
                    '<a href="' +
                    (item.javascript || item.url) +
                    '" class="side-menu ' +
                    (item.active ? 'side-menu--active' : '') +
                    '">';
                menuHTML += '<div class="side-menu__icon">';
                menuHTML += '<i data-lucide="' + (item.icon === 'default' ? 'activity' : item.icon) + '"></i>';
                menuHTML += '</div>';
                menuHTML += '<div class="side-menu__title">';
                menuHTML += item.name;

                if (item.children.length) {
                    menuHTML += '<div class="side-menu__sub-icon ' + (item.active ? 'transform rotate-180' : '') + '">';
                    menuHTML += '<i data-lucide="chevron-down"></i>';
                    menuHTML += '</div>';
                }

                menuHTML += '</div>';
                menuHTML += '</a>';

                if (item.children.length) {
                    menuHTML += this.generateMenu(item.children, item.active, false);
                }

                menuHTML += '</li>';

                if (item.devider) {
                    menuHTML += '<li class="side-nav__devider my-4"></li>';
                }
            }
        });

        menuHTML += '</ul>';

        return menuHTML;
    },

    generateMenuMobile: function (menu, isOpen = false, isFirst = true) {
        let menuHTML = `<ul class="${isOpen ? 'menu__sub-open' : ''} ${isFirst ? 'scrollable__content py-2' : ''}">`;

        menu.forEach((item) => {
            if (!item.hidden || !isFirst) {
                menuHTML += `<li>
                    <a href="${item.javascript ?? item.url}" class="menu ${item.active ? 'menu--active' : ''}">
                        <div class="menu__icon">
                            <i data-lucide="${item.icon === 'default' ? 'activity' : item.icon}"></i>
                        </div>
                        <div class="menu__title">
                            ${item.name}`;

                if (item.children.length) {
                    menuHTML += `<div class="menu__sub-icon ${item.active ? 'transform rotate-180' : ''}">
                        <i data-lucide="chevron-down"></i>
                    </div>`;
                }

                menuHTML += `</div>
                    </a>`;

                if (item.children.length) {
                    menuHTML += this.generateMenuMobile(item.children, item.active, false);
                }

                menuHTML += `</li>`;

                if (item.devider) {
                    menuHTML += `<li class="side-nav__devider my-4"></li>`;
                }
            }
        });

        menuHTML += `</ul>`;

        return menuHTML;
    },
};
