import { Modal } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import {useState} from 'react';
import * as React from 'react';
import axios from "axios";
function RoomInviteUserModal(props) {
    const { t }  = useTranslation(['lang']);
    const [checkedInviteUsers, setCheckedInviteUsers] = useState([]);
    const [complete , setComplete] = useState(false);
    const [close, setClose] = useState(false);
    const changeHandler = (checked, user) => {
        if (checked) {
          setCheckedInviteUsers([...checkedInviteUsers, user]);
        console.log("체크 ");
        } else {
          setCheckedInviteUsers(checkedInviteUsers.filter(el => el !== user));
        console.log("체크 해제");
        }
    };
    React.useEffect(() => {
      if(complete) {
        console.log(complete);

        axios.post('api/user/invite', {"room" : props.room, "user" : props.user.Reducers.user, "inviteUsers" : checkedInviteUsers})
        .then(res => {
            // props.newRoomList(res.data);
            console.log(res.data);
            setComplete(false);
            setCheckedInviteUsers([]);
        })
        
      }
    }, [checkedInviteUsers, complete]);

    const roomInvite = (e) => {
      // setCheckedInviteUsers([...checkedInviteUsers]);
      setComplete(true);
      props.handleClose(e);
    }

    const possibleChecked = checkedInviteUsers.length >= 1;
    const disabled = !possibleChecked;
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return (
        <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            대화상대선택
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ul>
                {props.following.map((follow, index) => (
                  JSON.parse(props.room.users).findIndex(user => user.user_id === follow.id) === -1 ?
                    <li key={index}>{follow.name}<input type="checkbox" id={'check'+index} onChange={e => {
                          changeHandler(e.currentTarget.checked, follow);
                        }}
                        checked={checkedInviteUsers.includes(follow) ? true : false}/>
                    </li> : <li key={index}>{follow.name}<input type="checkbox" disabled id={'check'+index} onChange={e => {
                                  changeHandler(e.currentTarget.checked, follow);
                                }}
                                checked={checkedInviteUsers.includes(follow) ? true : false}/>
                            </li>
                ))}
            </ul>
            
          </Typography>
          <Typography id="modal-modal-footer" sx={{ mt: 2 }}>
            {/* <hr className="mb-2" /> */}
            <Button disabled={disabled} onClick={roomInvite} variant="contained" color="button" size="small">{t("lang:COMPLETE")}</Button>
            <Button onClick={props.handleClose} variant="contained" color="button" size="small">{t("lang:CANCEL")}</Button>
          </Typography>
        </Box>
      </Modal>
    );
}export default RoomInviteUserModal;