module.exports = function loadHelpers(req, res, next) {
    res.locals.renderHelper = renderHelper;
    res.locals.urlHelper = urlHelper;
    res.locals.stringHelper = stringHelper;
    next();
};
const renderHelper = {
    menuAdmin: function (menu, isOpen = false, isFirst = true) {
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
                    menuHTML += this.menuAdmin(item.children, item.active, false);
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

    menuMobileAdmin: function (menu, isOpen = false, isFirst = true) {
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
                    menuHTML += this.menuMobileAdmin(item.children, item.active, false);
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


const stringHelper = {

    handleFileName: (filename) => {
        const [name, ext] = filename.split(/\.(?=[^.]+$)/);
        return urlHelper.toSlug(name) + '.' + ext;
    },
    handleDirName: (dir) => {
        return urlHelper.toSlug(dir);
    },
};

const urlHelper = {
    mergeQuery: function (queryString, obj) {
        // Tách các cặp key-value từ chuỗi truy vấn
        const queryParams = new URLSearchParams(queryString);
        
        // Lặp qua các cặp key-value trong object
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Nếu key đã tồn tại trong queryString, thay thế giá trị
                if (queryParams.has(key)) {
                    queryParams.set(key, obj[key]);
                } else {
                    // Nếu không, thêm key-value mới vào queryString
                    queryParams.append(key, obj[key]);
                }
            }
        }

        return queryParams.toString();
    },

    toSlug: function (text) {
        // Chuyển đổi tiếng Việt có dấu thành không dấu
        text = text.toLowerCase();
        text = text.trim();
        text = text.replace(/[áàảạã]/g, 'a');
        text = text.replace(/[ắằẳẵặ]/g, 'a');
        text = text.replace(/[âầấẫậ]/g, 'a');
        text = text.replace(/[ềếểễệ]/g, 'e');
        text = text.replace(/[èéẽẹẻ]/g, 'e');
        text = text.replace(/[íìỉịĩ]/g, 'i');
        text = text.replace(/[óòỏọõ]/g, 'o');
        text = text.replace(/[ốồổỗộ]/g, 'o');
        text = text.replace(/[úùủụũ]/g, 'u');
        text = text.replace(/[ừứửựữ]/g, 'u');
        text = text.replace(/[ýỳỷỵỹ]/g, 'y');
        text = text.replace(/[đ]/g, 'd');
        text = text.replace(/[ờớỡợở]/g, 'o');

        text = text.replace(/[^a-zA-Z0-9\s]/g, '');
        // Thay thế khoảng trắng bằng dấu gạch ngang
        text = text.replace(/\s+/g, '-');

        // Loại bỏ các dấu gạch ngang thừa

        text = text.replace(/-+/g, '-');

        // Loại bỏ dấu gạch ngang ở đầu và cuối chuỗi
        text = text.trim('-');

        return text;
    },
};
