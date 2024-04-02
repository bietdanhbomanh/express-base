function fileManager() {
    const allCheckbox = $('input[type="checkbox"][name="files"]');

    $('#selectAll').click(function () {
        allCheckbox.prop('checked', true).trigger('change');
    });
    $('#removeSelectAll').click(function () {
        allCheckbox.prop('checked', false).trigger('change');
    });

    allCheckbox.change(function () {
        let anyChecked = false;
        allCheckbox.each(function () {
            if ($(this).is(':checked')) {
                anyChecked = true;
                return false; // Thoát khỏi vòng lặp nếu có checkbox được chọn
            }
        });
        if (anyChecked) {
            $('#delete-selected').removeClass('hidden');
        } else {
            $('#delete-selected').addClass('hidden');
        }
    });

    $('.deleteSingle').click(function (e) {
        let deleting = false;
        if (deleting) return;
        if (main.wait.confirmSubmit()) {
            const file = $(e.target).closest('.file');
            const files = file.find('.truncate').html();
            $.ajax({
                url: '',
                method: 'DELETE',
                data: {
                    files,
                },
                beforeSend: function () {
                    deleting = true;
                },
                success: function (response) {
                    deleting = false;
                    if (response.status) {
                        file.parent().remove();
                        main.wait.toast('Đã xóa ' + files, 'success');
                    } else {
                        main.wait.toast('Vui lòng kiểm tra lại', 'error');
                    }
                },
            });
        }
    });

    $('.uploadFilesBtn').click(function () {
        const input = $('#fileInput');
        input.click();
        input.change(function () {
            $('#fileUpload').submit();
        });
    });

    $('#createFolder').click(function () {
        const name = $('input[name="folder"').val();
        if (name) {
            main.wait.toast('Đang tạo folder', 'success');
            const data = {
                dirName: name,
                action: 'mkdir',
            };
            $.ajax({
                type: 'POST',
                url: '',
                method: 'PUT',
                data,
                success: function (response) {
                    // Hiển thị thông báo thành công
                    if (response.status) {
                        main.wait.toast('Tạo folder thành công', 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } else {
                        main.wait.toast('Vui lòng kiểm tra lại', 'error');
                    }
                },
                error: function (error) {
                    // Hiển thị thông báo lỗi
                    main.wait.toast('Lỗi hệ thống mạng', 'error');
                },
            });
        } else {
            main.wait.toast('Vui lòng nhập tên', 'error');
        }
    });
}

$(document).ready(function () {
    fileManager();
});
