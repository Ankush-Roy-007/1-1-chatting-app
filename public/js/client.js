 const socket=io();
 
 const form=document.getElementById('send-container');
 const messageinp=document.getElementById('messageinp');
 const messageContainer=document.querySelector('.container');

const append=(message,position)=>{
	const messageElement=document.createElement('div');
	messageElement.innerText=message;
	messageElement.classList.add('message');
	messageElement.classList.add(position);
	messageContainer.append(messageElement);
}

form.addEventListener('submit',(e)=>{
	e.preventDefault();
	const message=messageinp.value;
	append(`you:${message}`,"right");
	socket.emit('send',message);
	messageinp.value='';
	scrollToBottom();

})



const name="Alo";
socket.emit('new-user-joined',name);



// socket.on('user-joined',name=>{
// 	append(`${name} joined the chat`,'right')
// 	scrollToBottom();	
// })

socket.on('receive',data=>{	
	append(`${data.name}: ${data.message}`,'left')
	scrollToBottom();
})

socket.on('left',name=>{
	append(`${name} left the chat`,'left')
})



socket.on('receives',data=>{
	if(name==`${data.name}`){
	append(`You: ${data.message}`,'right');
		messageContainer.scrollTop=messageContainer.scrollHeight;
}
else if (name==`${data.receiversid}`){
	append(`${data.name}: ${data.message}`,'left');
		messageContainer.scrollTop=messageContainer.scrollHeight;
}
})

function scrollToBottom(){
	messageContainer.scrollTop=messageContainer.scrollHeight;
}
