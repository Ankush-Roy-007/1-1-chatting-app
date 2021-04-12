const express=require("express");
const mongoose=require("mongoose");
const app=express()
app.use(express.static('public'));
const http=require('http');
const PORT=process.env.PORT||3000;
const server=http.createServer(app);
server.listen(PORT,()=>{
	console.log("started")
})
mongoose.connect("Use your mongodb URL",{ useNewUrlParser: true, useUnifiedTopology: true });
const chatSchema=new mongoose.Schema({
	name:String,
	message:String,
	sendersid:String,
	receiversid:String
})
var s="Alo";					//senders_ID
var g="Ankus";					//Receivers_ID 
const entry=new mongoose.model("collection",chatSchema);

// app.get("/",(req,res)=>{
// 	res.sendFile(__dirname+"/second.html");
// })
// app.get("/self/:uniqueselfid",(req,res)=>{
// 	s=req.params.uniqueselfid;
// 	res.sendFile(__dirname+"/first.html");
// })
// app.get("/friend/:uniquefriendid",(req,res)=>{
// 	f=req.params.uniquefriendid;
// 	res.redirect("/home");
// })
app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
})

const io=require("socket.io")(server);

const users={};


io.on('connection',function(socket){
	socket.on('new-user-joined',function(name){
		console.log("New user", name);
		users[socket.id]=name;
		entry.find({$or: [
			{ sendersid:s,receiversid:g},
			{ sendersid:g,receiversid:s }
		  ]},(err,found)=>{
			found.forEach(function(f){			
			socket.emit('receives',{message:f.message,name:f.name,sendersid:f.sendersid,receiversid:f.receiversid});
		})
		})
		// socket.broadcast.emit('user-joined',name);
	})
socket.on('send',message=>{
	const done=new entry({
		name:users[socket.id],
		message:message,
		sendersid:s,
		receiversid:g
	})
	done.save();
	socket.broadcast.emit('receive',{message:message,name:users[socket.id],sendersid:s,receiversid:g})
})

socket.on('disconnect',message=>{
	// socket.broadcast.emit('left',users[socket.id]);
	delete users[socket.id];
})

})


