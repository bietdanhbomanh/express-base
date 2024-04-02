const stream = require('stream');

module.exports = function (req, res, next) {
    const viewStream = new stream.PassThrough();

    // Ghi lại phản hồi vào viewStream
    const originalSend = res.send;
    res.send = function (data) {
        viewStream.end(data);
        originalSend.call(res, data);
    };

    // Đọc nội dung HTML từ viewStream
    let html = '';
    viewStream.on('data', (chunk) => {
        html += chunk;
    });

    viewStream.on('end', () => {
        console.log(html); // In nội dung HTML sau khi đã đọc từ viewStream
    });

    next();
};
