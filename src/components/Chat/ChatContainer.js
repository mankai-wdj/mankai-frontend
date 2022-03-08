import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";
import { IconButton, Menu, MenuItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SettingsIcon from '@mui/icons-material/Settings';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import * as React from 'react';
import { useTranslation } from "react-i18next";
import RoomInviteUserModal from "./RoomInviteUserModal";
function ChatContainer(props) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open1 = Boolean(anchorEl);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const { t }  = useTranslation(['lang']);
    const [following, setFollowing] = useState([]);
    const [toUser, setToUser] = useState({});
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        e.preventDefault();
        setAnchorEl(null);
        setOpen(false);
  };

    const handleFileInput = (e) => {
        setFiles(e.target.files);
    }
    const getMessages = (roomId) => {
                axios.get('api/messages/'+roomId)
                .then(res => {
                    // console.log(res.data.data.reverse());
                    setMessages(res.data.data.reverse());
                })
                .catch(err => {
                    console.log(err);
                })
    }

    useEffect(() => {
        // console.log(files);
        if(files !== null) {
            // console.log(111111111111111);
            sendMessage();
        }
    }, [files]);

    const inviteUser = (room) => {
        var users = JSON.parse(room.users);
        console.log(users);
        setOpen(true);
    }

    const officalCheck = (user) => {
        if(user.position === 'offical'){
            return true;
        }
    }

    const transBotChat = () => {
        let users= JSON.parse(props.room.users);
        // console.log('trans check');
        for (let i = 0; i< users.length; i++) {
            if(users[i].position === 'offical') {
                // console.log('offical');
                axios.post('/api/messageBot/send', {'message' : newMessage, 'room_id' : props.room.id, 'user_id' : users[i].user_id })
                .then(res => {
                    // console.log('trans complete');
                });
            }
        }
    }
    const sendMessage = () => {
        // e.preventDefault();
        // console.log(newMessage === '');
        
        if (newMessage === '') {
            // console.log(files);
            if(files && files.length >= 1){
                // console.log(e.target.files);
                // return ;
                // setFiles(e.target.files);
                console.log(files);
                const formData = new FormData();
                formData.append('room_id', props.room.id);
                formData.append('user_id', props.user.Reducers.user.id);
                for(let i = 0; i< toUser.length; i++){
                    formData.append('to_users[]', toUser[i]['user_id']);
                }
                if(files.length > 1){
                    for(let i = 0; i <files.length; i++ ){
                        formData.append('file[]', files[i]);
                    }
                }else{
                    formData.append('file', files[0]);
                }
                axios.post('api/message/send', formData, {headers: {'Content-Type': 'multipart/from-data'}}).then(res => {
                    console.log(res);
                    setMessages([...messages, res.data]);
                    // getMessages(props.room.id);
                });
                setFiles(null);
                
            }else {
                return;
            }
            return ;

        } else {
            
            // setMessages([...messages, {"message": newMessage, "user" : props.user.Reducers.user}]);
            let toUsers= [];
            for(let i = 0; i< toUser.length; i++){
                toUsers.push(toUser[i]['user_id']);
            }
            axios.post('/api/message/send', {'message' : newMessage, 'room_id' : props.room.id, 'to_users' : toUsers, 'user_id' :props.user.Reducers.user.id })
            .then(res => {
                // console.log(res.data);
                setMessages([...messages, res.data]);
                transBotChat();
                // console.log('message complete');

            });
            
            setNewMessage('');
        }
        
    }
    useEffect(() => {
        // console.log(props.room);
        if(props.room.id && props.user.Reducers.user.id) {
            getMessages(props.room.id);
            // console.log(props.room.id);
            setFollowing(props.user.Reducers.user.following);
            let toUsers = JSON.parse(props.room.users).filter((user) => {
            return user.user_id !== props.user.Reducers.user.id;
            });
            setToUser(toUsers);

            window.Echo.channel('user.'+props.user.Reducers.user.id).listen('.send-message', (e) => {
                console.log(e.message);
                setMessages(messages => ([...messages, e.message]));
    
              }) 
        }
        // console.log(props.room.id == true);
        
        
        
    }, [props.room, props.user]);

    useEffect(() => {
        // console.log(toUser[0]['user_id']);
    }, [toUser]);

    useEffect(() => {
        console.log(messages);
        
    }, [messages]);
    const onKeyPress = (e) => {
        if(e.key ==="Enter")
            sendMessage();
    }
    
    return (
        <div className="w-full h-full">
            {props.room.id ? <div className="border w-full h-full">  
                <IconButton onClick={(e) => {props.deleteChatRoom(e); setMessages([]);}}><CloseIcon /></IconButton>
                <IconButton aria-controls={open1 ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open1 ? 'true' : undefined}
                    onClick={(e) => {handleClick(e);}}  aria-label="more-vert" size="small" >
                    <SettingsIcon />
                </IconButton>
                <Menu
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open1}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    {/* <MenuItem onClick={(e) => {handleClose(e); deleteRoom(room); }}>{t("lang:DELETE")}</MenuItem> */}
                    {/* <MenuItem onClick={deleteRoom} >{t("lang:DELETE")}</MenuItem> */}
                    <MenuItem onClick={(e) => {handleClose(e); inviteUser(props.room)}} >invite</MenuItem>
                    <MenuItem onClick={handleClose}>photos</MenuItem>
                </Menu>
                <RoomInviteUserModal following={following} room={props.room} open={open} user={props.user} handleClose={handleClose} />
                <div className="w-full flex flex-col h-full">
                    <div className="chatBody flex flex-col w-full h-full overflow-y-auto">
                    {messages.map((message, index) => (
                        <Message message={message} user={props.user} key={index} />
                    ))}
                    </div>
                    {JSON.parse(props.room.users).findIndex(officalCheck) ? <div className='border p-2 w-full flex'>
                            <input type='file' multiple onChange={e => handleFileInput(e)} />
                            <input className="w-full border" value={newMessage || ''} onKeyPress={onKeyPress} onChange={(e) => setNewMessage(e.target.value)} type="text" />
                            <button onClick={sendMessage} className="border p-3 ">전송</button>
                    </div> : ''}
                </div>
            </div> : <div className="bg-blue-100 h-full shadow-xl">메세지를 보내보세요</div>}
        </div>
        
    );
}export default ChatContainer;