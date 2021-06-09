/**
* 채팅
*
*/
const socket = io();

const chat = {
	room : "",
	/**
	* 소켓 서버로 메세지 전송 
	* 
	* @param String message 전송할 메세지 
	*/
	send : function (message, userNm) {
		const data = {
			userNm : userNm,
			message : message,
		};
		socket.emit("chat", data);
	},
	/**
	* 채팅 메세지가 항상 하단으로 고정 처리 
	*
	*/
	scrollBottom : function() { 
		const h = $(".chat .contents li").outerHeight();
		const st = h *  $(".chat .contents li").length;
		$(".chat .contents").scrollTop(st);
	},
};

/** 메세지 수신 */
socket.on("chat", (data) => {
	let html = $("#chat_template").html();
	html = html.replace(/<%=message%>/g, data.message);
	$(".chat .contents").append(html);
	chat.scrollBottom();
});

$(function() {
	$(".chat #word").keyup(function(e) {
		if (e.keyCode == 13) { // 엔터키를 입력한 경우 
			const message = $(this).val().trim();
			if (message) { // 전송 문구가 있는 경우는 서버로 전송 
				chat.send(message);
				$(this).val('');
			}
		}
	});
});

/*
socket.emit('chat', '테스트 채팅 메세지');

socket.on('chat', (arg) => {
	console.log(arg);
});
*/
