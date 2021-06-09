const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on("connection", (socket) => {
	// socket.on -> 데이터 수신, socket.emit 데이터 전송
	socket.on('chat', (arg) => {
		console.log("전송받은 데이터", arg);
		io.emit('chat', arg);
	});
});	

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
	express : app,
	watch : true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
	return res.render('chat');
});

/** 없는 페이지 미들웨어 */
app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url}는 없는 페이지 입니다.`);
	error.status = 404;
	next(error);
});

/** 오류 처리 미들웨어 */
app.use((err, req, res, next) => {
	err.status = err.status || 500;
	res.locals.error = err;
	console.error(err);
	res.status(err.status).render('error');
});

server.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 서버 대기중');
});