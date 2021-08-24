const events = require("events"),
	express = require("express"),
	cors = require("cors"),
	{ Webhook } = require("discord-webhook-node"),
	config = require("./config.json"),
	hook = new Webhook(config.webhook),
	app = express()

app.use(cors())


const client = new events.EventEmitter()

app.use("/", (req, res) => {
	const user_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
	const text = `${user_ip} at ${new Date()}`
	client.emit("NewIp", text);
});


client.on("NewIp", text => {
	hook.send(text);
})


app.listen(config.port);
console.log(`IPLogger Running in port ${config.port}`)