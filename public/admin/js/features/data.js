const data = {
    run: {
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

        inputImage: function () {
            function getImageElement(src, type = 0, options = {}) {
                return $(`
                <div
                    class="${
                        type === 0 ? 'w-32 h-32' : 'mb-5 mr-5 w-24 h-24'
                    } relative image-fit cursor-pointer zoom-in"
                >
                    <img class="rounded-md" src="${src}" />
                    ${type !== 0 ? `<input hidden name="${options.name}" value="${src}" />` : ''}
                    <div class="${
                        type === 0 ? '' : 'multi'
                    } removeImage w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 -mr-2 -mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x w-4 h-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </div>
                </div>
                `);
            }

            function uploadFiles(files, currentInput) {
                const formData = new FormData();
                $.each(files, function (key, value) {
                    formData.append('files[]', value);
                });

                $.ajax({
                    url: '/admin/file-manager', // Đường dẫn đến file xử lý upload
                    method: 'PUT',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.status) {
                            main.wait.toast('Thành công', 'success', 'Upload Success');
                            let value = '';
                            if (currentInput.hasClass('multi')) {
                                value = JSON.stringify(response.data);
                            } else {
                                value = response.data[0];
                            }
                            currentInput.val(value).trigger('change');
                        } else {
                            main.wait.toast('Thất bại', 'error', response.message);
                        }
                    },

                    error: function (response) {
                        main.wait.toast('Thất bại', 'error', error.message);
                    },
                });
            }
            const dropZone = $('.dropZone');

            // Xử lý sự kiện khi bắt đầu kéo
            dropZone.on('dragover', function () {
                return false;
            });

            // Xử lý sự kiện khi kết thúc kéo
            dropZone.on('dragleave drop', function () {
                return false;
            });

            dropZone.on('drop', function (e) {
                e.preventDefault();
                const currentInput = $(e.currentTarget).find('input');
                const files = e.originalEvent.dataTransfer.files;
                uploadFiles(files, currentInput);
            });

            dropZone.children('input').on('change', function (e) {
                const input = $(e.currentTarget);
                const dropZone = input.parent();
                if (input.hasClass('multi')) {
                    const inputName = input.attr('id');
                    try {
                        const array = JSON.parse(input.val());
                        array.forEach((element) => {
                            dropZone.find('.preview').append(getImageElement(element, 1, { name: inputName }));
                        });

                        if (array.length === 0) {
                            dropZone.find('.preview').children().remove();
                            dropZone.find('.dz-message').removeClass('hidden');
                        } else {
                            dropZone.find('.dz-message').addClass('hidden');
                        }
                    } catch (error) {
                        dropZone.find('.preview').children().remove();
                        dropZone.find('.dz-message').removeClass('hidden');
                    }
                } else {
                    const data = input.val();

                    if (dropZone.find('img').length === 0) {
                        dropZone.find('.preview').append(getImageElement(data));
                    } else {
                        dropZone.find('img').attr('src', data);
                    }

                    if (!data) {
                        dropZone.find('.preview').children().remove();
                        dropZone.find('.dz-message').removeClass('hidden');
                    } else {
                        dropZone.find('.dz-message').addClass('hidden');
                    }
                }
            });

            dropZone.on('click', '.removeImage', function (e) {
                if ($(e.currentTarget).hasClass('multi')) {
                    $(e.currentTarget).parent().remove();
                    if (dropZone.find('img').length === 0) {
                        dropZone.children('input').val('').trigger('change');
                    }
                } else {
                    dropZone.children('input').val('').trigger('change');
                }
            });

            dropZone.find('.dz-message').on('click', function (e) {
                const currentInput = $(e.currentTarget).closest('.dropZone').find('input');
                let input = $('<input multiple type="file">');
                if (currentInput.hasClass('multi')) {
                    input = $('<input multiple type="file">');
                } else {
                    input = $('<input type="file">');
                }
                input.click();
                input.on('change', function () {
                    const files = input[0].files;
                    uploadFiles(files, currentInput);
                });
            });

            const options =
                'width=' + (window.screen.availWidth - 200) + ',height=' + (window.screen.availHeight - 200);
            let library;
            let currentDrop;

            dropZone.find('.select-library').on('click', function (e) {
                currentDrop = $(e.currentTarget).closest('.dropZone');
                if (currentDrop.hasClass('multi')) {
                    library = window.open('/admin/file-manager?select=true&multi=true', '_blank', options);
                } else {
                    library = window.open('/admin/file-manager?select=true', '_blank', options);
                }
            });
            window.addEventListener('message', function (event) {
                if (currentDrop.hasClass('multi')) {
                    library.eval(`
                                    main.wait.toast('Đã chọn ảnh này', 'success', '', 2)
                                `);
                    const nameInput = currentDrop.children('input').attr('id');
                    const imgElement = getImageElement(event.data, 1, { name: nameInput });
                    currentDrop.find('.preview').append(imgElement);
                    if (currentDrop.find('img').length > 0) {
                        currentDrop.find('.dz-message').addClass('hidden');
                    }
                } else {
                    currentDrop.children('input').val(event.data).trigger('change');
                }
            });
        },

        handleAutoForm: function () {
            $('#title').on('input', () => {
                const val = $('#title').val();
                $('#metaTitle').val(val);
                $('#slug').val(data.wait.toSlug(val));
            });

            $('#description').on('input', () => {
                $('#metaDescription').val($('#description').val());
            });
        },

        tableList: function () {
            let table;
            if ($('#tabulator').length) {
                table = new Tabulator('#tabulator', {
                    ajaxURL: $('#tabulator').attr('ajax'),
                    ajaxConfig: 'POST',
                    sortMode: 'remote',
                    paginationMode: 'remote',
                    filterMode: 'remote',
                    printAsHtml: true,
                    printStyled: true,
                    pagination: true, //enable pagination
                    paginationSize: 5, //optional parameter to request a certain number of rows per page
                    paginationInitialPage: 1, //optional parameter to set the initial page to load
                    paginationSizeSelector: [5, 10, 20, 30],
                    layout: 'fitColumns',
                    responsiveLayout: 'collapse',
                    placeholder: '<h2 class="text-center mt-3">No matching records found</h2>',
                    ajaxContentType: 'json',
                    columns: [
                        // For HTML table
                        {
                            title: '<input class="form-check-input" id="selectAll" type="checkbox">',
                            responsive: 0,
                            headerSort: false,
                            vertAlign: 'middle',
                            hozAlign: 'center',
                            width: 56,
                            formatter(cell, formatterParams) {
                                return `<input class="form-check-input" name="delete" data-id="${
                                    cell.getData()._id
                                }"  type="checkbox">`;
                            },
                        },
                        {
                            title: 'Title',
                            minWidth: 200,
                            responsive: 0,
                            visible: false,
                            field: 'title',
                            vertAlign: 'middle',
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().title}</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Username',
                            minWidth: 200,
                            responsive: 0,
                            visible: false,
                            field: 'username',
                            vertAlign: 'middle',
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().username}</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Display Name',
                            minWidth: 200,
                            responsive: 0,
                            visible: false,
                            field: 'displayName',
                            vertAlign: 'middle',
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().displayName}</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Role',
                            minWidth: 140,
                            responsive: 0,
                            visible: false,
                            field: 'role',
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle',
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().role}</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Email',
                            minWidth: 200,
                            responsive: 0,
                            visible: false,
                            field: 'email',
                            vertAlign: 'middle',
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().email}</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Avatar',
                            width: 120,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            headerSort: false,
                            responsive: 0,
                            field: 'avatar',
                            visible: false,
                            formatter(cell, formatterParams) {
                                return `
                                <div class="w-10 h-10 image-fit zoom-in">
                                  <img alt="Midone - HTML Admin Template" class="rounded-lg border-1 border-white shadow-md" src="${
                                      cell.getData().avatar
                                  }">
                                </div>`;
                            },
                        },

                        {
                            title: 'Thumbnail',
                            width: 120,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            headerSort: false,
                            responsive: 0,
                            field: 'thumbnail',
                            visible: false,

                            formatter(cell, formatterParams) {
                                return `
                                <div class="w-10 h-10 image-fit zoom-in">
                                  <img alt="Midone - HTML Admin Template" class="rounded-lg border-1 border-white shadow-md" src="${
                                      cell.getData().thumbnail
                                  }">
                                </div>`;
                            },
                        },

                        {
                            title: 'Thumbnail',
                            width: 120,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            headerSort: false,
                            responsive: 0,
                            field: 'thumbnail',
                            visible: false,

                            formatter(cell, formatterParams) {
                                return `
                                <div class="w-10 h-10 image-fit zoom-in">
                                  <img alt="Midone - HTML Admin Template" class="rounded-lg border-1 border-white shadow-md" src="${
                                      cell.getData().thumbnail
                                  }">
                                </div>`;
                            },
                        },

                        {
                            title: 'Category',
                            width: 140,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            field: 'category',
                            responsive: 0,
                            visible: false,
                            headerSort: false,

                            formatter(cell, formatterParams) {
                                if (cell.getData().categories) {
                                    const titles = cell
                                        .getData()
                                        .categories.map((object) => '<div>' + object.title + '</div>');
                                    const joinedString = titles.join('');
                                    return `<div>
                                        <div class="font-medium whitespace-nowrap">${joinedString}</div>
                                    </div>`;
                                }
                            },
                        },

                        {
                            title: 'Parent',
                            width: 140,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            visible: false,
                            field: 'parent',
                            responsive: 0,
                            headerSort: false,
                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${
                                        cell.getData().parent ? cell.getData().parent.title : ''
                                    }</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Slug',

                            minWidth: 100,
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu

                            headerSort: false,
                            responsive: 0,
                            field: 'slug',
                            visible: false,
                            formatter(cell, formatterParams) {
                                return `<a class="text-slate-500 flex items-center mr-3" href="javascript:;">
                                <i data-lucide="external-link"></i>${cell.getData().slug}
                                </a>`;
                            },
                        },

                        {
                            title: 'Order',
                            width: 140,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            field: 'order',
                            visible: false,
                            responsive: 0,

                            formatter(cell, formatterParams) {
                                return `<div>
                                    <div class="font-medium whitespace-nowrap">${cell.getData().order ?? ''}</div>
                                </div>`;
                            },
                        },

                        {
                            title: 'Status',
                            width: 140,
                            field: 'status',
                            visible: false,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            visible: false,
                            formatter(cell, formatterParams) {
                                return `<div data-id="${
                                    cell.getData()._id
                                }" class="flex items-center toggleStatus lg:justify-center ${
                                    cell.getData().status === 'on' ? 'text-success' : 'text-danger'
                                }">
                                   <i data-lucide="check-square" class="w-4 h-4 mr-2"></i>
                                   <span>
                                   ${cell.getData().status === 'on' ? 'Active' : 'Inactive'}
                                   </span>
                                   
                               </div>`;
                            },
                        },

                        // {
                        //     title: 'IMAGES',
                        //     minWidth: 200,
                        //     field: 'images',
                        //     hozAlign: 'center',
                        //     vertAlign: 'middle',
                        //     print: false,
                        //     download: false,
                        //     formatter(cell, formatterParams) {
                        //         return `<div class="flex lg:justify-center">
                        //             <div class="intro-x w-10 h-10 image-fit">
                        //                 <img alt="Midone - HTML Admin Template" class="rounded-full" src="/dist/images/${
                        //                     cell.getData().images[0]
                        //                 }">
                        //             </div>
                        //             <div class="intro-x w-10 h-10 image-fit -ml-5">
                        //                 <img alt="Midone - HTML Admin Template" class="rounded-full" src="/dist/images/${
                        //                     cell.getData().images[1]
                        //                 }">
                        //             </div>
                        //             <div class="intro-x w-10 h-10 image-fit -ml-5">
                        //                 <img alt="Midone - HTML Admin Template" class="rounded-full" src="/dist/images/${
                        //                     cell.getData().images[2]
                        //                 }">
                        //             </div>
                        //         </div>`;
                        //     },
                        // },

                        {
                            title: 'Actions',
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            width: 160,
                            responsive: 0,
                            headerSort: false,
                            formatter(cell, formatterParams) {
                                const a = $(`<div class="flex flex-wrap justify-center items-center">
                                    <a class="edit flex items-center mr-3" href="${new URL(
                                        location.href
                                    ).pathname.replace('/list', '/edit')}/${cell.getData()._id}">
                                        <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit
                                    </a>
                                    <a class="delete flex items-center text-danger" href="javascript:;">
                                        <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete
                                    </a>
                                    <a class="copy flex items-center mt-2 text-warning" href="${new URL(
                                        location.href
                                    ).pathname.replace('/list', '/add')}/${cell.getData()._id}">
                                        <i data-lucide="copy" class="w-4 h-4 mr-1"></i> Copy
                                    </a>
                                </div>`);

                                $(a)
                                    .find('.delete')
                                    .on('click', function (e) {
                                        if (main.wait.confirmSubmit()) {
                                            $.ajax({
                                                url: new URL(location.href).pathname.replace('/list', '/ajaxdelete'),
                                                data: {
                                                    _ids: [cell.getData()._id],
                                                },
                                                method: 'DELETE',
                                                success: function (response) {
                                                    // Hiển thị thông báo thành công
                                                    const message = response.message
                                                    if (response.status) {
                                                        main.wait.toast(message, 'success');
                                                        // const row = table.getRow({ _id: cell.getData()._id });
                                                        $(e.target).closest('.tabulator-row').remove();
                                                    } else {
                                                        main.wait.toast(message, 'error');
                                                    }
                                                },
                                                error: function (error) {
                                                    // Hiển thị thông báo lỗi
                                                    main.wait.toast('Lỗi khi thực hiện', 'error');
                                                },
                                            });
                                        }
                                    });

                                return a[0];
                            },
                        },

                        {
                            title: 'Updated At',
                            responsive: 0,
                            width: 160,
                            headerHozAlign: 'center', // Căn giữa ngang tiêu đề
                            hozAlign: 'center', // Căn giữa ngang dữ liệu
                            vertAlign: 'middle', // Căn giữa dọc dữ liệu
                            field: 'updatedAt',
                        },
                    ],
                });

                table.on('renderComplete', function () {
                    const data = table.getData()[0];
                    const trueFields = [];
                    for (const key in data) {
                        if (data[key]) {
                            trueFields.push(key);
                        }
                    }
                    if (trueFields) {
                        trueFields.forEach((element) => {
                            table.showColumn(element);
                        });
                    }
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

            // delete selected
            $(document).on('change', '#selectAll', function (e) {
                const allCheckbox = $('input[type="checkbox"][name="delete"]');
                if ($(e.target).prop('checked')) {
                    allCheckbox.prop('checked', true).trigger('change');
                } else {
                    allCheckbox.prop('checked', false).trigger('change');
                }
            });

            $(document).on('change', 'input[type="checkbox"][name="delete"]', function () {
                let anyChecked = false;
                $('input[type="checkbox"][name="delete"]').each(function () {
                    if ($(this).is(':checked')) {
                        anyChecked = true;
                        return false; // Thoát khỏi vòng lặp nếu có checkbox được chọn
                    }
                });
                if (anyChecked) {
                    $('#delete-selected-record').removeClass('hidden');
                } else {
                    $('#delete-selected-record').addClass('hidden');
                }
            });

            $('#delete-selected-record').click(function () {
                if (main.wait.confirmSubmit()) {
                    const _ids = $('input[type="checkbox"][name="delete"]:checked')
                        .map(function () {
                            return $(this).data('id');
                        })
                        .get();

                    $.ajax({
                        url: new URL(location.href).pathname.replace('/list', '/ajaxdelete'),
                        data: {
                            _ids,
                        },
                        method: 'DELETE',
                        success: function (response) {
                            // Hiển thị thông báo thành công
                            if (response.status) {
                                main.wait.toast(response.message, 'success');
                                $('#selectAll').prop('checked', false).trigger('change');
                                table.replaceData();
                            } else {
                                main.wait.toast(response.message, 'error');
                            }
                        },
                        error: function (error) {
                            // Hiển thị thông báo lỗi
                            main.wait.toast('Lỗi khi thực hiện', 'error');
                        },
                    });
                }
            });

            // toggle Status

            $(document).on('click', '.toggleStatus', function (e) {
                const current = $(e.currentTarget);
                const _id = current.data('id');
                const currentStatus = current.find('span').text().trim() === 'Active';
                $.ajax({
                    url: new URL(location.href).pathname.replace('/list', '/ajaxedit'),
                    data: {
                        _id,
                        status: currentStatus ? 'off' : 'on',
                    },
                    method: 'PATCH',
                    success: function (response) {
                        // Hiển thị thông báo thành công
                        if (response.status) {
                            main.wait.toast('Cập nhật thành công', 'success');
                            console.log(response.data.status);
                            if (currentStatus) {
                                current.addClass('text-danger').removeClass('text-success');
                                current.find('span').text('Inactive');
                            } else {
                                current.addClass('text-success').removeClass('text-danger');
                                current.find('span').text('Active');
                            }
                        } else {
                            main.wait.toast('Cập nhật thất bại vui lòng kiểm tra lại', 'error');
                        }
                    },
                    error: function (error) {
                        // Hiển thị thông báo lỗi
                        main.wait.toast('Lỗi cập nhật', 'error');
                    },
                });
            });
        },

        jsSelector: function () {
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
                        // onDelete: function (values) {
                        //     return confirm(
                        //         values.length > 1
                        //             ? 'Are you sure you want to remove these ' + values.length + ' items?'
                        //             : 'Are you sure you want to remove "' + values[0] + '"?'
                        //     );
                        // },
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
    },
    wait: {
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
    },
    init() {
        for (let key in this.run) {
            this.run[key]();
        }
    },
};

$(document).ready(function () {
    data.init();
});
