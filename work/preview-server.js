const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.mp4':'video/mp4'};
http.createServer((req,res)=>{const requested=req.url==='/'?'index.html':decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'');const file=path.resolve(root,requested);if(!file.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)})}).listen(4173,'127.0.0.1');
