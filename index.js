require("./authorization")();
const { sleep } = require("@mtproto/core/src/utils/common");
const { send } = require("express/lib/response");
const api = require("./api");


(async () => {
	
	// const messageInfo = await api.sendMessage({
	// 	message: "Тестовый сообщени1",
	// 	peer: {
	// 		_: 'inputPeerSelf'
	// 	},
	// 	exntities: [
	// 			    {
	// 				_: 'messageEntityBold',
	// 				offset: 6,
	// 				length: 13,
	// 			    },
	// 			]
	// });
	// const NewMessage = messageInfo.updates[1].message.message;
	
	// api.typingMessage({
	// 	peer: {
	// 		_: 'inputPeerSelf'
	// 	},
	// 	messageId: messageInfo.updates[0].id,
	// 	sendedMessage : NewMessage
	// })

	api.mtproto.updates.on('updates',(updates)=>{
		console.log(updates);
		// updates.forEach(update => {
		// 	switch(update._){
		// 		case 'updateNewMessage':
		// 			const messageInfo = update.message;
		// 			let command = null;
		// 			if(command = messageInfo.message.split(' ',2)[0].match(/^.\w+/m)[0]){
		// 				const commandBody = messageInfo.message.substring(command.length+1);
		// 				commandHandle(command, commandBody, messageInfo);
		// 			}
		// 			break;
		// 		default:
		// 			break;
		// 	}
			
		// });
	})

	
	
	const commandHandle = function(command,commandBody, messageInfo){
		switch (command) {
			case '.type':
				api.typingMessage({
					peer:{
						...messageInfo.peer_id,
						_: 'input' + messageInfo.peer_id._[0].toUpperCase() + messageInfo.peer_id._.slice(1),
						access_hash: this.access_hash
					},
					messageId: messageInfo.id,
					sendedMessage: commandBody
				})
				break;
			case '.resend':
				const firstMessage = commandBody.split('~~',2)[0],
					secondMessage = commandBody.split('~~',2)[1];
				console.log(firstMessage);
				console.log(secondMessage);
				api.resendMessage({
					peer:{
						_: 'inputPeerUser',
						user_id: updateInfo.user_id,
						access_hash: this.access_hash
					},
					messageId: updateInfo.id,
					firstMessage,
					secondMessage
				})
				break
			default:
				console.log('дефолтная команда')
				break;
		}
	}

	// api.mtproto.updates.on('updateShortMessage', (updateInfo) => {
	// 	console.log(updateInfo)
	// 	console.log(updateInfo.message.match(/^.\w+/gm))
	// 	if(updateInfo.message.split(' ',2)[0].match(/^.\w+/m) === null){
	// 		console.log('герди')
	// 		return ;
	// 	}
	// 	const command = updateInfo.message.split(' ',2)[0];
	// 	const commandBody = updateInfo.message.substring(command.length+1);
	// 	switch (command) {
	// 		case '.type':
	// 			console.log('type command')
	// 			api.typingMessage({
	// 				peer:{
	// 					_: 'inputPeerUser',
	// 					user_id: updateInfo.user_id,
	// 					access_hash: this.access_hash
	// 				},
	// 				messageId: updateInfo.id,
	// 				sendedMessage: updateInfo.message.slice(6, updateInfo.message.length)
	// 			})
	// 			break;
	// 		case '.resend':
	// 			console.log(commandBody)
	// 			const firstMessage = commandBody.split('~~',2)[0],
	// 				secondMessage = commandBody.split('~~',2)[1];
	// 			console.log(firstMessage);
	// 			console.log(secondMessage);
	// 			api.resendMessage({
	// 				peer:{
	// 					_: 'inputPeerUser',
	// 					user_id: updateInfo.user_id,
	// 					access_hash: this.access_hash
	// 				},
	// 				messageId: updateInfo.id,
	// 				firstMessage,
	// 				secondMessage
	// 			})
	// 			break
	// 		default:
	// 			console.log('дефолтная команда')
	// 			break;
	// 	}
	// })
	

	// process.exit();
	
	

})();

