import axios from "axios";
import { useEffect, useState } from "react";

function Message({message: msg, user: user}) {
    const [message, setMessage] = useState(msg);
    useEffect(() => {
        // console.log(user);
    }, [user]);
    useEffect(() => {
        // console.log(message);
        
    }, [message]);
    const translation = (msg) => {
        // console.log(msg);
        // console.log(user.Reducers.user.country);
        // return ;
        if(msg === ''){
            return ;
        }
        axios.post('api/translate/text', {'country' : user.Reducers.user.country, 'text' : msg})
        .then(res => {
            setMessage((prevState) => ({
                ...prevState,
                translation : res.data
            }));
            console.log(message);
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <div>
            <div onDoubleClick={(e) => translation(message.message)} className={user.Reducers.user.id == message.user_id ? 'flex p-1 mr-2 justify-end' : 'flex p-1 ml-2 justify-start'}>
                {message.message ?
                    (<><div>{message.message}</div>{message.translation ? <div>{message.translation}</div> : ''}</>) :
                    (message.file.startsWith('[') ? 
                        JSON.parse(message.file).map((image, index) =>  (<img key={index} className="w-1/2" src={'http://localhost:8000/storage/'+image} /> )): (message.file.startsWith('images') ?
                        <img className="w-full" src={'http://localhost:8000/storage/'+message.file} /> :  <a className="border" href={'http://localhost:8000/storage/'+message.file} >{ message.file.split('_')[1] }</a> )  )}
            </div>
        </div>
    );
}export default Message;