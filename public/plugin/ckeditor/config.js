CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.language = 'en';
    config.uiColor = '#AADC6E';
    config.removePlugins = 'exportpdf,easyimage,cloudservices,a11yhelp,about';
    config.removeButtons = 'Save,New,Preview,Print';
    // Add the file browser plugin
    config.filebrowserBrowseUrl = '/admin/file-manager'; // Replace with the actual path to your file browser
    config.filebrowserImageBrowseUrl = '/admin/file-manager'; // Optional: Use a dedicated image browser (if supported by your file browser)
};
