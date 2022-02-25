import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
function ChatContainer(props) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState(null);

    const handleFileInput = (e) => {
        setFiles(e.target.files);
    }
    const getMessages = (roomId) => {
                axios.get('http://localhost:8000/api/messages/'+roomId)
                .then(res => {
                    setMessages(res.data.data.reverse());
                    // console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
    }

    useEffect(() => {
        // console.log(files);
        if(files !== null) {
            console.log(111111111111111);
            sendMessage();
        }
    }, [files]);

    const sendMessage = () => {
        // e.preventDefault();
        console.log(newMessage === '');
        if (newMessage == '') {
            // console.log(files);
            if(files.length >= 1){
                // console.log(e.target.files);
                // return ;
                // setFiles(e.target.files);
                console.log(files);
                const formData = new FormData();
                formData.append('room_id', props.room.id);
                formData.append('user_id', props.user.Reducers.user.id);
                if(files.length > 1){
                    for(let i = 0; i <files.length; i++ ){
                        formData.append('file[]', files[i]);
                    }
                }else{
                    formData.append('file', files[0]);
                }
                // console.log(files);
                axios.post('api/message/send', formData, {headers: {'Content-Type': 'multipart/from-data'}}).then(response => {
                    console.log(response);
                    getMessages(props.room.id);
                });
                setFiles(null);
                
            }else {
                return;
            }
            return ;

        } else {
            
            // setMessages([...messages, {"message": newMessage, "user" : props.user.Reducers.user}]);
            axios.post('/api/message/send', {'message' : newMessage, 'room_id' : props.room.id, 'user_id' :props.user.Reducers.user.id })
            .then(res => {
                console.log(res.data);
                // setMessages([...messages, res.data]);
            });
            setNewMessage('');
        }
        
    }
    useEffect(() => {
        console.log(props.room);
        if(props.room.id && props.user.Reducers.user.id) {
            getMessages(props.room.id);
        }
    }, [props.room, props.user]);

    useEffect(() => {
        // console.log(messages);
        window.Echo.channel('chat').listen('.send-message', (e) => {
            setMessages(messages => ([...messages, e.message]));

          }) 
   
    },[]);
    
    return (
        <div className="w-full h-full">
            {props.room.id ? <div className="border w-full h-full">  
                <IconButton onClick={(e) => {props.deleteChatRoom(e); setMessages([]);}}><CloseIcon /></IconButton>
                <div className="w-full flex flex-col h-full">
                    <div className="chatBody flex flex-col w-full h-full overflow-y-auto">
                    {messages.map((message, index) => (
                        <Message message={message} user={props.user} key={index} />
                    ))}
                    </div>
                    <div className='border p-2 w-full flex'>
                        {/* <form className="flex w-full" onSubmit={sendMessage}> */}
                            <input type='file' multiple onChange={e => handleFileInput(e)} />
                            <input className="w-full border" value={newMessage || ''} onChange={(e) => setNewMessage(e.target.value)} type="text" />
                            <button onClick={sendMessage} className="border p-3 ">전송</button>
                        {/* </form> */}
                    </div>
                </div>
            </div> : <div className="bg-blue-100 h-full shadow-xl">메세지를 보내보세요</div>}
        </div>
    );
}export default ChatContainer;