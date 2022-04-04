require("dotenv").config();
const api = require("./api");
const phone = process.env.PHONE;
const code = process.env.CODE;

async function authorization(){
    const user = await api.getUser();
	this.access_hash = user.users[0].access_hash || null;

    if(!user){

	const {phone_code_hash} = await api.sendCode(phone);

	try{
	    const signInResult = await api.signIn({
		code,
		phone,
		phone_code_hash
	    });
	    console.log(signInResult);

	    if(signInResult._ === "auth.authorizationSignUpRequired"){
		const singUpResult = await api.signUp({
		    phone,
		    phone_code_hash
		});
		console.log(signUpResult);
	    }

	    const newUser = await api.getUser();
		this.access_hash = newUser.users[0].access_hash || null;
	    
	}catch(error){
	    if(error.error_message !== "SESSION_PASSWORD_NEEDED"){

	    console.log(`error:`, error);

	    return;
	   }

	    const password = 'USER_PASSWORD';

	    const {srp_id, current_algo, srp_B } = await getPassword();
	    const { g, p, salt1, salt2 } = current_algo;

	    const {A,M1} = await api.mtproto.crypto.getSRPParams({
		g,
		p,
		salt1,
		salt2,
		gB: srp_B,
		password
	    });

	    const checkPasswordResult = await checkPassword({srp_id, A, M1});
	}
    }

    const result = await api.call("help.getNearestDc");
    // return process.exit(0);
}

module.exports = authorization;

