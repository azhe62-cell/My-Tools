const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

http.createServer((request, response) => {
    let filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    } else {
        // Strip out query params
        filePath = filePath.split('?')[0];
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                response.writeHead(404);
                response.end('404 Not Found');
            }
            else {
                response.writeHead(500);
                response.end('500 Internal Server Error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
