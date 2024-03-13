const dom = $;
const main = {
    run: {
        tippy: function () {
            $('.tooltip').each(function () {
                let options = {
                    content: $(this).attr('title'),
                };

                if ($(this).data('trigger') !== undefined) {
                    options.trigger = $(this).data('trigger');
                }

                if ($(this).data('placement') !== undefined) {
                    options.placement = $(this).data('placement');
                }

                if ($(this).data('theme') !== undefined) {
                    options.theme = $(this).data('theme');
                }

                if ($(this).data('tooltip-content') !== undefined) {
                    options.content = $($(this).data('tooltip-content'))[0];
                }

                $(this).removeAttr('title');

                tippy(this, {
                    arrow: tippy.roundArrow,
                    animation: 'shift-away',
                    ...options,
                });
            });
        },
        tabContent: function () {
            dom('body').on('click', "[role='tab']", function () {
                show(this);
            });

            function show(el) {
                dom(el)
                    .closest("[role='tablist']")
                    .find("[role='tab']")
                    .each(function () {
                        // Trigger "hide.tw.tab" callback function
                        if (dom(this).hasClass('active') && this !== el) {
                            const event = new Event('hide.tw.tab');
                            dom(this)[0].dispatchEvent(event);
                        }

                        // Trigger "show.tw.tab" callback function
                        if (!dom(this).hasClass('active') && this === el) {
                            const event = new Event('show.tw.tab');
                            dom(this)[0].dispatchEvent(event);
                        }
                    });

                // Set active tab nav
                dom(el)
                    .closest("[role='tablist']")
                    .find("[role='tab']")
                    .removeClass('active')
                    .attr('aria-selected', false);
                dom(el).addClass('active').attr('aria-selected', true);

                // Set active tab content
                let elementId = dom(el).attr('data-tw-target');
                let tabContentWidth = dom(elementId).closest('.tab-content').width();
                dom(elementId).closest('.tab-content').children('.tab-pane').removeAttr('style').removeClass('active');
                dom(elementId)
                    .css('width', tabContentWidth + 'px')
                    .addClass('active');
            }

            // Create instance
            function createInstance(el) {
                return {
                    show() {
                        show(el);
                    },
                };
            }

            dom("[role='tab']").each(function () {
                this['__tab'] = createInstance(this);
            });
        },
        tomSelect: function () {
            $('.tom-select').each(function () {
                let options = {
                    plugins: {
                        dropdown_input: {},
                    },
                };

                if ($(this).data('placeholder')) {
                    options.placeholder = $(this).data('placeholder');
                }

                if ($(this).attr('create')) {
                    options.create = $(this).attr('create');
                }

                if ($(this).attr('multiple') !== undefined) {
                    options = {
                        ...options,
                        plugins: {
                            ...options.plugins,
                            remove_button: {
                                title: 'Remove this item',
                            },
                        },
                        persist: false,
                        // create: true,
                        onDelete: function (values) {
                            return confirm(
                                values.length > 1
                                    ? 'Are you sure you want to remove these ' + values.length + ' items?'
                                    : 'Are you sure you want to remove "' + values[0] + '"?'
                            );
                        },
                    };
                }

                if ($(this).data('header')) {
                    options = {
                        ...options,
                        plugins: {
                            ...options.plugins,
                            dropdown_header: {
                                title: $(this).data('header'),
                            },
                        },
                    };
                }

                new TomSelect(this, options);
            });
        },
        ckeditor: function () {
            $('.editor').each(function () {
                const el = this;
                ClassicEditor.create(el).catch((error) => {
                    console.error(error);
                });
            });
            $('.editor-notool').each(function () {
                const el = this;
                ClassicEditor.create(el, { toolbar: [], autoParagraph: false }).catch((error) => {
                    console.error(error);
                });
            });
        },

        datepicker: function () {
            $('.datepicker').each(function () {
                let options = {
                    autoApply: false,
                    singleMode: false,
                    numberOfColumns: 2,
                    numberOfMonths: 2,
                    showWeekNumbers: true,
                    format: 'D MMM, YYYY',
                    dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                    },
                };

                if ($(this).data('single-mode')) {
                    options.singleMode = true;
                    options.numberOfColumns = 1;
                    options.numberOfMonths = 1;
                }

                if ($(this).data('format')) {
                    options.format = $(this).data('format');
                }

                if (!$(this).val()) {
                    let date = dayjs().format(options.format);
                    date += !options.singleMode ? ' - ' + dayjs().add(1, 'month').format(options.format) : '';
                    $(this).val(date);
                }

                new Litepicker({
                    element: this,
                    ...options,
                });
            });
        },

        themeSwitcher: function () {
            const html = $('html');
            $('.dark-mode-switcher').on('click', function () {
                let switcher = $(this).find('.dark-mode-switcher__toggle');
                if ($(switcher).hasClass('dark-mode-switcher__toggle--active')) {
                    $(switcher).removeClass('dark-mode-switcher__toggle--active');
                    html.removeClass('dark');
                    document.cookie = 'theme=light;max-age=31536000;path=/';
                } else {
                    $(switcher).addClass('dark-mode-switcher__toggle--active');
                    html.removeClass('light');
                    html.addClass('dark');
                    document.cookie = 'theme=dark;max-age=31536000;path=/';
                }
            });
        },
        menuMobile: function () {
            if ($('.mobile-menu .scrollable').length) {
                new SimpleBar($('.mobile-menu .scrollable')[0]);
            }

            // Mobile Menu
            $('.mobile-menu-toggler').on('click', function () {
                if ($('.mobile-menu').hasClass('mobile-menu--active')) {
                    $('.mobile-menu').removeClass('mobile-menu--active');
                } else {
                    $('.mobile-menu').addClass('mobile-menu--active');
                }
            });

            $('.mobile-menu')
                .find('.menu')
                .on('click', function () {
                    if ($(this).parent().find('ul').length) {
                        if ($(this).parent().find('ul').first()[0].offsetParent !== null) {
                            $(this).find('.menu__sub-icon').removeClass('transform rotate-180');
                            $(this)
                                .parent()
                                .find('ul')
                                .first()
                                .slideUp(300, function () {
                                    $(this).removeClass('menu__sub-open');
                                });
                        } else {
                            $(this).find('.menu__sub-icon').addClass('transform rotate-180');
                            $(this)
                                .parent()
                                .find('ul')
                                .first()
                                .slideDown(300, function () {
                                    $(this).addClass('menu__sub-open');
                                });
                        }
                    }
                });
        },
        dropDown: function () {
            dom('body').on('click', function (event) {
                let dropdown = dom(event.target).closest('.dropdown');
                let dropdownToggle = dom(dropdown).find("[data-tw-toggle='dropdown']");
                let dropdownBox = dom(dropdown).find('.dropdown-menu').first();
                let activeDropdownBox = dom(event.target).closest('.dropdown-menu').first();
                let dismissButton = dom(event.target).data('tw-dismiss');

                if (
                    (!dom(dropdown).length && !dom(activeDropdownBox).length) ||
                    (dom(dropdownToggle).length && !dom(dropdownBox).length) ||
                    dismissButton == 'dropdown'
                ) {
                    // Hide dropdown
                    hide();
                } else if (!dom(activeDropdownBox).length) {
                    // Show dropdown
                    show(dropdown);
                }
            });

            function findVisibleDropdownToggle(dropdownToggle) {
                return dropdownToggle.filter((key, dropdownToggle) => {
                    return dropdownToggle.offsetParent !== null;
                });
            }

            function hide() {
                dom('.dropdown-menu').each(async function () {
                    if (
                        dom(this).attr('id') !== undefined &&
                        dom('[data-dropdown-replacer="' + dom(this).attr('id') + '"]').length &&
                        dom(this).data('dropdown-programmatically') === undefined
                    ) {
                        let randId = dom(this).attr('id');
                        let dropdownToggle = dom('[data-dropdown-replacer="' + randId + '"]')
                            .parent()
                            .find("[data-tw-toggle='dropdown']");

                        // Animate dropdown
                        dom(this).removeClass('show');

                        // Trigger "hide.tw.dropdown" callback function
                        const event = new Event('hide.tw.dropdown');
                        dom(dropdownToggle).parent()[0].dispatchEvent(event);

                        await setTimeout(() => {
                            // Move dropdown element to body
                            dom('[data-dropdown-replacer="' + randId + '"]').replaceWith(this);

                            // Reset attribute
                            dom(this).removeAttr('style');
                            dom(this).removeAttr('data-popper-placement');

                            // Set aria-expanded to false
                            dom(dropdownToggle).attr('aria-expanded', false);

                            // Trigger "hidden.tw.dropdown" callback function
                            const event = new Event('hidden.tw.dropdown');
                            dom(dropdownToggle).parent()[0].dispatchEvent(event);
                        }, 200);
                    } else if (
                        dom(this).attr('id') !== undefined &&
                        !dom('[data-dropdown-replacer="' + dom(this).attr('id') + '"]').length &&
                        dom(this).hasClass('show') &&
                        dom(this).data('dropdown-programmatically') === undefined
                    ) {
                        dom(this).remove();
                    } else if (dom(this).data('dropdown-programmatically') == 'initiate') {
                        // Set programmatically attribute state
                        dom(this).attr('data-dropdown-programmatically', 'showed');
                    } else if (dom(this).data('dropdown-programmatically') == 'showed') {
                        // Remove programmatically attribute state
                        dom(this).removeAttr('data-dropdown-programmatically');

                        // Hide dropdown
                        hide();
                    }
                });
            }

            // Show dropdown
            async function show(dropdown) {
                let dropdownBox = dom(dropdown).find('.dropdown-menu').first();
                let dropdownToggle = findVisibleDropdownToggle(dom(dropdown).find("[data-tw-toggle='dropdown']"));
                let placement = dom(dropdown).data('tw-placement') ? dom(dropdown).data('tw-placement') : 'bottom-end';
                let randId = '_' + Math.random().toString(36).substr(2, 9);

                // Hide dropdown
                hide();

                if (dom(dropdownBox).length) {
                    // Set aria-expanded to true
                    dom(dropdownToggle).attr('aria-expanded', true);

                    // Set dropdown width
                    dom(dropdown).css('position') == 'static' ? dom(dropdown).css('position', 'relative') : '';
                    dom(dropdownBox).css('width', dom(dropdownBox).css('width'));

                    // Move dropdown element to body
                    dom('<div data-dropdown-replacer="' + randId + '"></div>').insertAfter(dropdownBox);
                    dom(dropdownBox).attr('id', randId).appendTo('body');

                    // Check if dropdown is used inside modal
                    dom('.modal.show').each(function () {
                        if (dom(this).find('[data-dropdown-replacer="' + randId + '"]')) {
                            dom(dropdownBox).css('z-index', dom(this).css('z-index'));
                        }
                    });

                    // Show dropdown
                    dom(dropdownBox).addClass('show');

                    // Trigger "show.tw.dropdown" callback function
                    const event = new Event('show.tw.dropdown');
                    dom(dropdown)[0].dispatchEvent(event);

                    await setTimeout(() => {
                        // Trigger "shown.tw.dropdown" callback function
                        const event = new Event('shown.tw.dropdown');
                        dom(dropdown)[0].dispatchEvent(event);
                    }, 200);
                }

                Popper.createPopper(dropdownToggle[0], dropdownBox[0], {
                    placement,
                });
            }
        },
        sidebar: function () {
            $('.side-menu').on('click', function () {
                if ($(this).parent().find('ul').length) {
                    if ($(this).parent().find('ul').first()[0].offsetParent !== null) {
                        $(this).find('.side-menu__sub-icon').removeClass('transform rotate-180');
                        $(this).removeClass('side-menu--open');
                        $(this)
                            .parent()
                            .find('ul')
                            .first()
                            .slideUp(300, function () {
                                $(this).removeClass('side-menu__sub-open');
                            });
                    } else {
                        $(this).find('.side-menu__sub-icon').addClass('transform rotate-180');
                        $(this).addClass('side-menu--open');
                        $(this)
                            .parent()
                            .find('ul')
                            .first()
                            .slideDown(300, function () {
                                $(this).addClass('side-menu__sub-open');
                            });
                    }
                }
            });
        },
        iconLoader: function () {
            lucide.createIcons();
            dom(`[data-loading-icon]`).each(function () {
                let color = dom(this).data('color') !== undefined ? dom(this).data('color') : dom('body').css('color');
                let classAttr = dom(this).attr('class') !== undefined ? dom(this).attr('class') : '';
                let icons = [
                    {
                        name: 'audio',
                        svg: `
                          <svg width="15" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="${color}" class="${classAttr}">
                              <g transform="matrix(1 0 0 -1 0 80)">
                                  <rect width="10" height="20" rx="3">
                                      <animate attributeName="height"
                                          begin="0s" dur="4.3s"
                                          values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear"
                                          repeatCount="indefinite" />
                                  </rect>
                                  <rect x="15" width="10" height="80" rx="3">
                                      <animate attributeName="height"
                                          begin="0s" dur="2s"
                                          values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear"
                                          repeatCount="indefinite" />
                                  </rect>
                                  <rect x="30" width="10" height="50" rx="3">
                                      <animate attributeName="height"
                                          begin="0s" dur="1.4s"
                                          values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear"
                                          repeatCount="indefinite" />
                                  </rect>
                                  <rect x="45" width="10" height="30" rx="3">
                                      <animate attributeName="height"
                                          begin="0s" dur="2s"
                                          values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear"
                                          repeatCount="indefinite" />
                                  </rect>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'ball-triangle',
                        svg: `
                          <svg width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="${classAttr}">
                              <g fill="none" fill-rule="evenodd">
                                  <g transform="translate(1 1)">
                                      <circle cx="5" cy="50" r="5" fill="${color}">
                                          <animate attributeName="cy"
                                              begin="0s" dur="2.2s"
                                              values="50;5;50;50"
                                              calcMode="linear"
                                              repeatCount="indefinite" />
                                          <animate attributeName="cx"
                                              begin="0s" dur="2.2s"
                                              values="5;27;49;5"
                                              calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="27" cy="5" r="5" fill="${color}">
                                          <animate attributeName="cy"
                                              begin="0s" dur="2.2s"
                                              from="5" to="5"
                                              values="5;50;50;5"
                                              calcMode="linear"
                                              repeatCount="indefinite" />
                                          <animate attributeName="cx"
                                              begin="0s" dur="2.2s"
                                              from="27" to="27"
                                              values="27;49;5;27"
                                              calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="49" cy="50" r="5" fill="${color}">
                                          <animate attributeName="cy"
                                              begin="0s" dur="2.2s"
                                              values="50;50;5;50"
                                              calcMode="linear"
                                              repeatCount="indefinite" />
                                          <animate attributeName="cx"
                                              from="49" to="49"
                                              begin="0s" dur="2.2s"
                                              values="49;5;27;49"
                                              calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                  </g>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'bars',
                        svg: `
                          <svg width="20" viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" fill="${color}" class="${classAttr}">
                              <rect y="10" width="15" height="120" rx="6">
                                  <animate attributeName="height"
                                      begin="0.5s" dur="1s"
                                      values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                                      repeatCount="indefinite" />
                                  <animate attributeName="y"
                                      begin="0.5s" dur="1s"
                                      values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                                      repeatCount="indefinite" />
                              </rect>
                              <rect x="30" y="10" width="15" height="120" rx="6">
                                  <animate attributeName="height"
                                      begin="0.25s" dur="1s"
                                      values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                                      repeatCount="indefinite" />
                                  <animate attributeName="y"
                                      begin="0.25s" dur="1s"
                                      values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                                      repeatCount="indefinite" />
                              </rect>
                              <rect x="60" width="15" height="140" rx="6">
                                  <animate attributeName="height"
                                      begin="0s" dur="1s"
                                      values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                                      repeatCount="indefinite" />
                                  <animate attributeName="y"
                                      begin="0s" dur="1s"
                                      values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                                      repeatCount="indefinite" />
                              </rect>
                              <rect x="90" y="10" width="15" height="120" rx="6">
                                  <animate attributeName="height"
                                      begin="0.25s" dur="1s"
                                      values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                                      repeatCount="indefinite" />
                                  <animate attributeName="y"
                                      begin="0.25s" dur="1s"
                                      values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                                      repeatCount="indefinite" />
                              </rect>
                              <rect x="120" y="10" width="15" height="120" rx="6">
                                  <animate attributeName="height"
                                      begin="0.5s" dur="1s"
                                      values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                                      repeatCount="indefinite" />
                                  <animate attributeName="y"
                                      begin="0.5s" dur="1s"
                                      values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                                      repeatCount="indefinite" />
                              </rect>
                          </svg>
                      `,
                    },
                    {
                        name: 'circles',
                        svg: `
                          <svg width="20" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="${color}" class="${classAttr}">
                              <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                  <animateTransform
                                      attributeName="transform"
                                      type="rotate"
                                      from="0 67 67"
                                      to="-360 67 67"
                                      dur="2.5s"
                                      repeatCount="indefinite"/>
                              </path>
                              <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                  <animateTransform
                                      attributeName="transform"
                                      type="rotate"
                                      from="0 67 67"
                                      to="360 67 67"
                                      dur="8s"
                                      repeatCount="indefinite"/>
                              </path>
                          </svg>
                      `,
                    },
                    {
                        name: 'grid',
                        svg: `
                          <svg width="20" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill="${color}" class="${classAttr}">
                              <circle cx="12.5" cy="12.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="0s" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
                                  <animate attributeName="fill-opacity"
                                  begin="100ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="52.5" cy="12.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="300ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="52.5" cy="52.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="600ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="92.5" cy="12.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="800ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="92.5" cy="52.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="400ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="12.5" cy="92.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="700ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="52.5" cy="92.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="500ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                              <circle cx="92.5" cy="92.5" r="12.5">
                                  <animate attributeName="fill-opacity"
                                  begin="200ms" dur="1s"
                                  values="1;.2;1" calcMode="linear"
                                  repeatCount="indefinite" />
                              </circle>
                          </svg>
                      `,
                    },
                    {
                        name: 'hearts',
                        svg: `
                          <svg width="30" viewBox="0 0 140 64" xmlns="http://www.w3.org/2000/svg" fill="${color}" class="${classAttr}">
                              <path d="M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.717-6.002 11.47-7.65 17.305-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z" fill-opacity=".5">
                                  <animate attributeName="fill-opacity"
                                      begin="0s" dur="1.4s"
                                      values="0.5;1;0.5"
                                      calcMode="linear"
                                      repeatCount="indefinite" />
                              </path>
                              <path d="M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.592-2.32 17.307 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z" fill-opacity=".5">
                                  <animate attributeName="fill-opacity"
                                      begin="0.7s" dur="1.4s"
                                      values="0.5;1;0.5"
                                      calcMode="linear"
                                      repeatCount="indefinite" />
                              </path>
                              <path d="M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z" />
                          </svg>
                      `,
                    },
                    {
                        name: 'oval',
                        svg: `
                          <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="${color}" class="${classAttr}">
                              <g fill="none" fill-rule="evenodd">
                                  <g transform="translate(1 1)" stroke-width="4">
                                      <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                                      <path d="M36 18c0-9.94-8.06-18-18-18">
                                          <animateTransform
                                              attributeName="transform"
                                              type="rotate"
                                              from="0 18 18"
                                              to="360 18 18"
                                              dur="1s"
                                              repeatCount="indefinite"/>
                                      </path>
                                  </g>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'puff',
                        svg: `
                          <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="${color}" class="${classAttr}">
                              <g fill="none" fill-rule="evenodd" stroke-width="4">
                                  <circle cx="22" cy="22" r="1">
                                      <animate attributeName="r"
                                          begin="0s" dur="1.8s"
                                          values="1; 20"
                                          calcMode="spline"
                                          keyTimes="0; 1"
                                          keySplines="0.165, 0.84, 0.44, 1"
                                          repeatCount="indefinite" />
                                      <animate attributeName="stroke-opacity"
                                          begin="0s" dur="1.8s"
                                          values="1; 0"
                                          calcMode="spline"
                                          keyTimes="0; 1"
                                          keySplines="0.3, 0.61, 0.355, 1"
                                          repeatCount="indefinite" />
                                  </circle>
                                  <circle cx="22" cy="22" r="1">
                                      <animate attributeName="r"
                                          begin="-0.9s" dur="1.8s"
                                          values="1; 20"
                                          calcMode="spline"
                                          keyTimes="0; 1"
                                          keySplines="0.165, 0.84, 0.44, 1"
                                          repeatCount="indefinite" />
                                      <animate attributeName="stroke-opacity"
                                          begin="-0.9s" dur="1.8s"
                                          values="1; 0"
                                          calcMode="spline"
                                          keyTimes="0; 1"
                                          keySplines="0.3, 0.61, 0.355, 1"
                                          repeatCount="indefinite" />
                                  </circle>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'rings',
                        svg: `
                          <svg width="30" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="${color}" class="${classAttr}">
                              <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="3">
                                  <circle cx="22" cy="22" r="6" stroke-opacity="0">
                                      <animate attributeName="r"
                                          begin="1.5s" dur="3s"
                                          values="6;22"
                                          calcMode="linear"
                                          repeatCount="indefinite" />
                                      <animate attributeName="stroke-opacity"
                                          begin="1.5s" dur="3s"
                                          values="1;0" calcMode="linear"
                                          repeatCount="indefinite" />
                                      <animate attributeName="stroke-width"
                                          begin="1.5s" dur="3s"
                                          values="2;0" calcMode="linear"
                                          repeatCount="indefinite" />
                                  </circle>
                                  <circle cx="22" cy="22" r="6" stroke-opacity="0">
                                      <animate attributeName="r"
                                          begin="3s" dur="3s"
                                          values="6;22"
                                          calcMode="linear"
                                          repeatCount="indefinite" />
                                      <animate attributeName="stroke-opacity"
                                          begin="3s" dur="3s"
                                          values="1;0" calcMode="linear"
                                          repeatCount="indefinite" />
                                      <animate attributeName="stroke-width"
                                          begin="3s" dur="3s"
                                          values="2;0" calcMode="linear"
                                          repeatCount="indefinite" />
                                  </circle>
                                  <circle cx="22" cy="22" r="8">
                                      <animate attributeName="r"
                                          begin="0s" dur="1.5s"
                                          values="6;1;2;3;4;5;6"
                                          calcMode="linear"
                                          repeatCount="indefinite" />
                                  </circle>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'spinning-circles',
                        svg: `
                          <svg width="20" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg" class="${classAttr}">
                              <g fill="none" fill-rule="evenodd">
                                  <g transform="translate(2 1)" stroke="${color}" stroke-width="1.5">
                                      <circle cx="42.601" cy="11.462" r="5" fill-opacity="1" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="1;0;0;0;0;0;0;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="49.063" cy="27.063" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;1;0;0;0;0;0;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="42.601" cy="42.663" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;0;1;0;0;0;0;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="27" cy="49.125" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;0;0;1;0;0;0;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="11.399" cy="42.663" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;0;0;0;1;0;0;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="4.938" cy="27.063" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;0;0;0;0;1;0;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="11.399" cy="11.462" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;0;0;0;0;0;1;0" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="27" cy="5" r="5" fill-opacity="0" fill="${color}">
                                          <animate attributeName="fill-opacity"
                                              begin="0s" dur="1.3s"
                                              values="0;0;0;0;0;0;0;1" calcMode="linear"
                                              repeatCount="indefinite" />
                                      </circle>
                                  </g>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'tail-spin',
                        svg: `
                          <svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="${classAttr}">
                              <defs>
                                  <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                                      <stop stop-color="${color}" stop-opacity="0" offset="0%"/>
                                      <stop stop-color="${color}" stop-opacity=".631" offset="63.146%"/>
                                      <stop stop-color="${color}" offset="100%"/>
                                  </linearGradient>
                              </defs>
                              <g fill="none" fill-rule="evenodd">
                                  <g transform="translate(1 1)">
                                      <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3">
                                          <animateTransform
                                              attributeName="transform"
                                              type="rotate"
                                              from="0 18 18"
                                              to="360 18 18"
                                              dur="0.9s"
                                              repeatCount="indefinite" />
                                      </path>
                                      <circle fill="${color}" cx="36" cy="18" r="1">
                                          <animateTransform
                                              attributeName="transform"
                                              type="rotate"
                                              from="0 18 18"
                                              to="360 18 18"
                                              dur="0.9s"
                                              repeatCount="indefinite" />
                                      </circle>
                                  </g>
                              </g>
                          </svg>
                      `,
                    },
                    {
                        name: 'three-dots',
                        svg: `
                          <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="${color}" class="${classAttr}">
                              <circle cx="15" cy="15" r="15">
                                  <animate attributeName="r" from="15" to="15"
                                          begin="0s" dur="0.8s"
                                          values="15;9;15" calcMode="linear"
                                          repeatCount="indefinite" />
                                  <animate attributeName="fill-opacity" from="1" to="1"
                                          begin="0s" dur="0.8s"
                                          values="1;.5;1" calcMode="linear"
                                          repeatCount="indefinite" />
                              </circle>
                              <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                                  <animate attributeName="r" from="9" to="9"
                                          begin="0s" dur="0.8s"
                                          values="9;15;9" calcMode="linear"
                                          repeatCount="indefinite" />
                                  <animate attributeName="fill-opacity" from="0.5" to="0.5"
                                          begin="0s" dur="0.8s"
                                          values=".5;1;.5" calcMode="linear"
                                          repeatCount="indefinite" />
                              </circle>
                              <circle cx="105" cy="15" r="15">
                                  <animate attributeName="r" from="15" to="15"
                                          begin="0s" dur="0.8s"
                                          values="15;9;15" calcMode="linear"
                                          repeatCount="indefinite" />
                                  <animate attributeName="fill-opacity" from="1" to="1"
                                          begin="0s" dur="0.8s"
                                          values="1;.5;1" calcMode="linear"
                                          repeatCount="indefinite" />
                              </circle>
                          </svg>
                      `,
                    },
                ];

                let self = this;
                icons.forEach(function (icon) {
                    if (dom(self).data('loading-icon') == icon.name) {
                        dom(self).replaceWith(icon.svg);
                    }
                });
            });
        },
        jsSubmit: function () {
            $('form.noEnterSubmit').on('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
                }
            });
            $('form.jsSubmit').submit(function (event) {
                event.preventDefault(); // Prevent the default form submission
                if ($(this).valid()) {
                    const button = $(this).find('[type="submit"]');
                    button.prop('disabled', 'true');
                    icon = button.find('.hidden').removeClass('hidden');

                    let formData = {
                        url: $(this).attr('action'), // The form's action attribute
                        method: $(this).attr('method'), // The form's method attribute
                    };

                    if ($(this).hasClass('uploadFile')) {
                        formData = {
                            ...formData,
                            data: new FormData(this), // Serialize the form data
                            processData: false,
                            contentType: false,
                        };
                    } else {
                        formData = {
                            ...formData,
                            data: $(this).serialize(),
                        };
                    }

                    $.ajax({
                        ...formData,
                        success: function (response) {
                            console.log(response);
                            button.removeAttr('disabled');
                            icon.addClass('hidden');
                            if (response.status) {
                                location.reload();
                            } else {
                                main.wait.toast(response.message, 'error');
                                console.log(response);
                                if (response.form) {
                                    Object.keys(response.form).forEach((element) => {
                                        const parrent = $('[name="' + element + '"]')
                                            .parent()
                                            .addClass('has-error');

                                        const errorMessage = $(
                                            '<div class="error text-danger mt-2">' + response.form[element] + '</div>'
                                        );

                                        parrent.append(errorMessage);

                                        setTimeout(function () {
                                            errorMessage.remove();
                                            parrent.removeClass('has-error');
                                        }, 3000);
                                    });
                                }
                            }
                        },
                        error: function (xhr, status, error) {
                            button.removeAttr('disabled');
                            icon.addClass('hidden');
                            main.wait.toast('Lỗi server', 'error');
                        },
                    });
                }
            });
        },
        validatorForm: function () {
            $.extend($.validator.messages, {
                required: 'Vui lòng nhập trường này.',
                email: 'Hãy nhập email chính xác.',
                minlength: $.validator.format('Vui lòng nhập nhiều hơn {0} ký tự.'),
            });

            $.validator.addMethod(
                'noWhitespace',
                function (value, element) {
                    return !/\s/.test(value);
                },
                'Password should not contain whitespace.'
            );

            $('form.validate').validate({
                invalidHandler: function (event, validator) {
                    // Xóa tất cả các lớp lỗi trước khi thêm lớp lỗi mới
                    $('.input-form').removeClass('has-error');

                    // Lặp qua tất cả các trường không hợp lệ và thêm lớp lỗi cho phần tử cha
                    $.each(validator.errorList, function (index, error) {
                        $(error.element).closest('.input-form').addClass('has-error');
                    });
                },

                success: function (label) {
                    // Xóa lớp "has-error" khi trường được sửa đúng
                    label.closest('.input-form').removeClass('has-error');
                },
                errorElement: 'div',

                errorPlacement: function (error, element) {
                    error.addClass('text-danger mt-2');
                    error.insertAfter(element);
                },
            });
        },

        tableData: function () {
            if ($('#tabulator').length) {
                // Setup Tabulator
                let table = new Tabulator('#tabulator', {
                    ajaxURL: 'https://dummy-data.left4code.com',
                    ajaxFiltering: true,
                    sortMode: 'remote',
                    printAsHtml: true,
                    printStyled: true,
                    filterMode: 'remote',
                    pagination: true, //enable pagination
                    paginationMode: 'remote',
                    paginationSize: 5, //optional parameter to request a certain number of rows per page
                    paginationInitialPage: 1, //optional parameter to set the initial page to load
                    paginationSizeSelector: [5, 10, 20, 30],
                    layout: 'fitColumns',
                    responsiveLayout: 'collapse',
                    placeholder: '<h2 class="text-center mt-3">No matching records found</h2>',
                    columns: [
                        {
                            formatter: 'responsiveCollapse',
                            width: 40,
                            minWidth: 30,
                            hozAlign: 'center',
                            resizable: false,
                            headerSort: false,
                        },

                        // For HTML table
                        {
                            title: 'PRODUCT NAME',
                            minWidth: 200,
                            responsive: 0,
                            field: 'name',
                            vertAlign: 'middle',
                            print: false,
                            download: false,
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().name}</div>
                                    <div class="text-slate-500 text-xs whitespace-nowrap">${
                                        cell.getData().category
                                    }</div>
                                </div>`;
                            },
                        },
                        {
                            title: 'IMAGES',
                            minWidth: 200,
                            field: 'images',
                            hozAlign: 'center',
                            vertAlign: 'middle',
                            print: false,
                            download: false,
                            formatter(cell, formatterParams) {
                                return `<div class="flex lg:justify-center">
                                    <div class="intro-x w-10 h-10 image-fit">
                                        <img alt="Midone - HTML Admin Template" class="rounded-full" src="/dist/images/${
                                            cell.getData().images[0]
                                        }">
                                    </div>
                                    <div class="intro-x w-10 h-10 image-fit -ml-5">
                                        <img alt="Midone - HTML Admin Template" class="rounded-full" src="/dist/images/${
                                            cell.getData().images[1]
                                        }">
                                    </div>
                                    <div class="intro-x w-10 h-10 image-fit -ml-5">
                                        <img alt="Midone - HTML Admin Template" class="rounded-full" src="/dist/images/${
                                            cell.getData().images[2]
                                        }">
                                    </div>
                                </div>`;
                            },
                        },
                        {
                            title: 'REMAINING STOCK',
                            minWidth: 200,
                            field: 'remaining_stock',
                            hozAlign: 'center',
                            vertAlign: 'middle',
                            print: false,
                            download: false,
                        },
                        {
                            title: 'STATUS',
                            minWidth: 200,
                            field: 'status',
                            hozAlign: 'center',
                            vertAlign: 'middle',
                            print: false,
                            download: false,
                            formatter(cell, formatterParams) {
                                return `<div class="flex items-center lg:justify-center ${
                                    cell.getData().status ? 'text-success' : 'text-danger'
                                }">
                                    <i data-lucide="check-square" class="w-4 h-4 mr-2"></i> ${
                                        cell.getData().status ? 'Active' : 'Inactive'
                                    }
                                </div>`;
                            },
                        },
                        {
                            title: 'ACTIONS',
                            minWidth: 200,
                            field: 'actions',
                            responsive: 1,
                            hozAlign: 'center',
                            vertAlign: 'middle',
                            print: false,
                            download: false,
                            formatter(cell, formatterParams) {
                                let a = $(`<div class="flex lg:justify-center items-center">
                                    <a class="edit flex items-center mr-3" href="javascript:;">
                                        <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit
                                    </a>
                                    <a class="delete flex items-center text-danger" href="javascript:;">
                                        <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete
                                    </a>
                                </div>`);
                                $(a)
                                    .find('.edit')
                                    .on('click', function () {
                                        alert('EDIT');
                                    });

                                $(a)
                                    .find('.delete')
                                    .on('click', function () {
                                        alert('DELETE');
                                    });

                                return a[0];
                            },
                        },

                        // For print format
                        {
                            title: 'PRODUCT NAME',
                            field: 'name',
                            visible: false,
                            print: true,
                            download: true,
                        },
                        {
                            title: 'CATEGORY',
                            field: 'category',
                            visible: false,
                            print: true,
                            download: true,
                        },
                        {
                            title: 'REMAINING STOCK',
                            field: 'remaining_stock',
                            visible: false,
                            print: true,
                            download: true,
                        },
                        {
                            title: 'STATUS',
                            field: 'status',
                            visible: false,
                            print: true,
                            download: true,
                            formatterPrint(cell) {
                                return cell.getValue() ? 'Active' : 'Inactive';
                            },
                        },
                        {
                            title: 'IMAGE 1',
                            field: 'images',
                            visible: false,
                            print: true,
                            download: true,
                            formatterPrint(cell) {
                                return cell.getValue()[0];
                            },
                        },
                        {
                            title: 'IMAGE 2',
                            field: 'images',
                            visible: false,
                            print: true,
                            download: true,
                            formatterPrint(cell) {
                                return cell.getValue()[1];
                            },
                        },
                        {
                            title: 'IMAGE 3',
                            field: 'images',
                            visible: false,
                            print: true,
                            download: true,
                            formatterPrint(cell) {
                                return cell.getValue()[2];
                            },
                        },
                    ],
                });

                table.on('renderComplete', function () {
                    lucide.createIcons();
                });

                // Redraw table onresize
                window.addEventListener('resize', () => {
                    table.redraw();
                    lucide.createIcons();
                });

                // Filter function
                function filterHTMLForm() {
                    let field = $('#tabulator-html-filter-field').val();
                    let type = $('#tabulator-html-filter-type').val();
                    let value = $('#tabulator-html-filter-value').val();
                    table.setFilter(field, type, value);
                }

                // On submit filter form
                $('#tabulator-html-filter-form')[0].addEventListener('keypress', function (event) {
                    let keycode = event.keyCode ? event.keyCode : event.which;
                    if (keycode == '13') {
                        event.preventDefault();
                        filterHTMLForm();
                    }
                });

                // On click go button
                $('#tabulator-html-filter-go').on('click', function (event) {
                    filterHTMLForm();
                });

                // On reset filter form
                $('#tabulator-html-filter-reset').on('click', function (event) {
                    $('#tabulator-html-filter-field').val('name');
                    $('#tabulator-html-filter-type').val('like');
                    $('#tabulator-html-filter-value').val('');
                    filterHTMLForm();
                });

                // Export
                $('#tabulator-export-csv').on('click', function (event) {
                    table.download('csv', 'data.csv');
                });

                $('#tabulator-export-json').on('click', function (event) {
                    table.download('json', 'data.json');
                });

                $('#tabulator-export-xlsx').on('click', function (event) {
                    window.XLSX = xlsx;
                    table.download('xlsx', 'data.xlsx', {
                        sheetName: 'Products',
                    });
                });

                $('#tabulator-export-html').on('click', function (event) {
                    table.download('html', 'data.html', {
                        style: true,
                    });
                });

                // Print
                $('#tabulator-print').on('click', function (event) {
                    table.print();
                });
            }
        },
    },
    wait: {
        toast: function toast(title = 'Success', type = 'error', content = '', duration = 10, html = '') {
            const toast = document.querySelector('#toast');
            if (toast) {
                const toastItem = document.createElement('div');
                toastItem.style.animation = `drop 0.4s linear, fadeout 0.4s linear ${duration}s forwards`;
                toastItem.classList.add('toast', `toast--${type}`);
                if (html) {
                    toastItem.innerHTML = `
                    <div class="toast__header">
                        <span class="toast__lable">${title} </span>
                        <span class="toast__time"></span>
                    </div>
                    ${html}
                    <i class="toast__close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x-square" data-lucide="x-square" class="lucide lucide-x-square block mx-auto"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                    </i>
                    `;
                } else {
                    toastItem.innerHTML = `
                            <div class="toast__header">
                                <span class="toast__lable">${title} </span>
                                <span class="toast__time"></span>
                            </div>
                            <div ${content ? '' : 'style="display:none"'} class="toast__body">
                                <p class="toast__content">
                                    ${content}
                                </p>
                            </div>
                            <i class="toast__close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x-square" data-lucide="x-square" class="lucide lucide-x-square block mx-auto"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                            </i>
                            `;
                }

                // Get the first child of the parent
                const firstChild = toast.firstChild;

                // Insert the child element before the first child
                toast.insertBefore(toastItem, firstChild);

                // toast.appendChild(toastItem);
                setTimeout(() => {
                    if (toastItem) {
                        toastItem.remove();
                    }
                }, parseInt(duration) * 1000 + 400);
                toastItem.onclick = function (e) {
                    const close = e.target.closest('.toast__close');
                    if (close) {
                        toastItem.style.animation = `fadefast 0.4s linear backwards`;
                        setTimeout(() => {
                            toastItem.remove();
                        }, 300);
                    }
                };
            }
        },
        confirmSubmit: function () {
            if (confirm('Bạn có chắc chắn với hành động này không?')) {
                return true; // Tiếp tục gửi biểu mẫu
            } else {
                return false; // Hủy gửi biểu mẫu
            }
        },
    },
    init() {
        for (let key in this.run) {
            this.run[key]();
        }
    },
};

$(document).ready(function () {
    main.init();
});
