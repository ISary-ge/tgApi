require("dotenv").config();
const path = require("path");
const MTProto = require("@mtproto/core");

const api_id = Number(process.env.API_ID);
const api_hash = process.env.Api_HASH;

const mtproto = new MTProto({
    api_id,
    api_hash,
    storageOptions: {
	path: path.resolve(__dirname, "./data/1.json"),
    },

});

(async () => {
    try{
	const getNearestDc = await mtproto.call("help.getNearestDc");
	const country = getNearestDc.country;
	console.log("country:" + country);
	return process.exit(0);
    }catch(e){
	console.log(e);
    }
})();
