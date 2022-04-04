require("dotenv").config();
const path = require("path");
const MTProto = require("@mtproto/core");
const { sleep } = require("@mtproto/core/src/utils/common");

const api_id = Number(process.env.API_ID);
const api_hash = process.env.API_HASH;

class API{
    constructor(){
	this.mtproto = new MTProto({
	    api_id,
	    api_hash,
	    storageOptions: {
		path: path.resolve(__dirname, './data/1.json')
	    }
	})
    }

    async call(method, params, options = {}){
	try{
	    const result = await this.mtproto.call(method,params,options);
	    
	    return result;
	}catch(error){
	    console.error(`${method} error:`, error);

	    const {error_code, error_message} = error;

	    if(error_code === 420){
		const seconds = Number(error_message.split("FLOOD_WAIT_")[1])
		const ms = seconds * 1000;

		await sleep(ms);

		return this.call(method, params, options);
	    }

	    if(error_code === 303){
		const [type, dcIdAsString] = error_message.split("_MIGRATE_")

		const dcId = Number(dcIdAsString)

		if(type === "PHONE"){
		    await this.mtproto.setDefaultDc(dcId)
		}else {
		    Object.assign(options,{dcId})
		}

		return this.call(method,params,options)
	    }
	    
	    return Promise.reject(error)
	}
    }

    async getUser(){
	try{
	    const user = await this.call("users.getFullUser",{
		id: {
		    _: "inputUserSelf",
		},
	    });
	    return user;
	} catch(error){
	    return null;
	}
    }

    sendCode(phone){
	try{
	    return this.call("auth.sendCode",{
		phone_number: phone,
		settings: {
		    _: "codeSettings",
		},
	    });
	}catch(error){
	    throw error;
	}
    }

    signIn({ code, phone, phone_code_hash }) {
	return this.call("auth.signIn", {
	    phone_code: code,
	    phone_number: phone,
	    phone_code_hash: phone_code_hash,
	});
    }

    signUp({ phone, phone_code_hash }) {
	return this.call("auth.signUp", {
	    phone_number: phone,
	    phone_code_hash: phone_code_hash,
	    first_name: "MTProto",
	    last_name: "Core",
	});
    }

    getPassword() {
	return this.call("account.getPassword");
    }

    checkPassword({ srp_id, A, M1 }) {
	return this.call("auth.checkPassword", {
	    password: {
		_: "inputCheckPasswordSRP",
		srp_id,
		A,
		M1,
	    },
	});
    }

	sendMessage({message, peer, exntities}){
		try{
			const result = api.call('messages.sendMessage',{
				clear_draft: true,
				peer,
				message,
				exntities,
				random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
				});

			return result;
		}catch(error){
			return error;
		}
		
	}

	editMessage({peer,id,message,exntities = {}}){
		try {
			api.call('messages.editMessage',{
				peer,
				id,
				message,
				exntities
			})
		} catch (error) {
			return error
		}
	}

	async typingMessage({peer,messageId,sendedMessage}){
		try{
			for(let i = 0; i <= sendedMessage.length; i++){
				
				await this.editMessage({
					peer, 
					id: messageId, 
					message: i !== sendedMessage.length ? (sendedMessage.slice(0, i) + '▒') : sendedMessage.slice(0,i)
				})
				await sleep(180);
			}
		}
		catch(error){
			return error
		}
	}

	async resendMessage({peer, messageId, firstMessage, secondMessage}){
		try {
			for(let i = firstMessage.length; i > 0; i--){
				
				await this.editMessage({
					peer, 
					id: messageId, 
					message: i!== 0 ? firstMessage.slice(0,i) + '▒' :firstMessage.slice(0,i)
				})
				await sleep(180);
			}
			this.typingMessage({
				peer,
				messageId,
				sendedMessage: secondMessage,
			})

		} catch (error) {
			return error
		}
	}

	deleteMessage(){

	}

}

const api = new API();

module.exports = api;
