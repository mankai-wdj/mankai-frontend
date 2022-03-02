import { useEffect } from "react";

function Message({message: message, user: user}) {
    useEffect(() => {
        // console.log(user);
    }, [user]);
    return (
        <div>
            <div className={user.Reducers.user.id === message.user.id ? 'flex p-1 mr-2 justify-end' : 'flex p-1 ml-2 justify-start'}>
                {message.message ?
                    message.message :
                    (message.file.startsWith('[') ? 
                        JSON.parse(message.file).map((image, index) =>  (<img key={index} className="w-1/2" src={'http://localhost:8000/storage/'+image} /> )): (message.file.startsWith('images') ?
                        <img className="w-full" src={'http://localhost:8000/storage/'+message.file} /> :  <a className="border" href={'http://localhost:8000/storage/'+message.file} >{ message.file.split('_')[1] }</a> )  )}
            </div>
        </div>
    );
}export default Message;