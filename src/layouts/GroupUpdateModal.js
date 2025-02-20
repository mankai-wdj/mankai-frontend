import { Button, Divider, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageIcon from '@mui/icons-material/Image';
import SettingsIcon from '@mui/icons-material/Settings';

function GroupUpdateModal(props) {

    const [open,setOpen] = useState(false);
    const [preview,setPreview] = useState("")
    const [imageFile,setImageFile] = useState("");
    const [inputText,setInputText] = useState("");
    const [optionSelected,setOptionSelected] = useState("");
    const [groupId,setGroupId] = useState("");
    const [inputPass,setInputPass]=useState("");
    const [onelineIntro, setonelineIntro] = useState("");
    const user = useSelector(state=>state.Reducers.user);

    const options = ["IT","자유","공부","정치","투자","취업"];

    const dispatch = useDispatch()
    
    const ImageHandle =(e) =>{
        setPreview(URL.createObjectURL(e.target.files[0]));
        setImageFile(e.target.files[0])

        console.log(preview)
        // setPreview(e.target.value)
    }
    const textHandle = (e) =>{
        setInputText(e.target.value)
    }
    const ModalOpen =() =>{
        setOpen(true)
    }
    const ModalClose = () =>{
        setOpen(false)
    }
    const passHandle = (e) =>{
        setInputPass(e.target.value)
    }
    const onelineHandle = (e) => {
        setonelineIntro(e.target.value)
    }
    const save =() =>{
        const formData = new FormData();
        formData.append('img', imageFile);
        formData.append('text', inputText);
        formData.append('category',optionSelected);
        formData.append('user_id',user.id);
        formData.append('group_id',groupId);
        formData.append('password',inputPass);
        formData.append('oneline', onelineIntro);     

        axios.post('/api/update/group',formData
        ).then(res=>{
            ModalClose()
            window.location.href = groupId;
        })
    }
    useEffect(()=>{
        setGroupId(props.group.id)
        setImageFile(props.group.logoImage)
        setPreview(props.group.logoImage)
        setInputText(props.group.name)
        setOptionSelected(props.group.category)
        setInputPass(props.group.password)
        setonelineIntro(props.group.onelineintro)
        console.log(props.group)
    },[props.group])

    return(
        <div>
            <button onClick={ModalOpen} ><SettingsIcon className="text-white hover:text-gray-300" sx={{ fontSize:40 }}/></button>
            <Modal 
                open={open}
                onClose={ModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ overflow:"scroll" }}
            >
                <Box className="bg-white w-192 mx-auto mt-5 h-min rounded-xl p-3 relative" >
                    <p className="text-2xl mb-5 font-bold text-center">
                        그룹 수정하기
                    </p>
                    <div className="relative mt-5">
                        {preview
                            ?    <img className="w-full h-72 rounded-xl" src={preview} alt="이미지 에러"/>
                            :    <img className="w-full h-72"src="https://mankai-bucket.s3-ap-northeast-2.amazonaws.com/images/EjqTKgV5GU3U5cTOuUEGIg6303oAiz2Kfl5vS871.jpg" alt="이미지없음"/>
                        }
                        <div className="absolute w-full top-0 left-0">

                            <label
                                className="focus:outline-none flex items-center w-full h-64 justify-center hover:text-gray-300  text-white"
                                htmlFor="input-file"
                            >
                                <ImageIcon sx={{ fontSize: 70 }}></ImageIcon>
                            </label>

                            <input
                                type="file"
                                id="input-file"
                                className="hidden"
                                multiple
                                onChange={ImageHandle}
                            />

                        </div>
                    </div>
                    <div className="my-2 mt-5">
                        <TextField 
                            label="그룹 이름" 
                            type="text" 
                            name="name" 
                            className="w-full mb-5"
                            variant="outlined"
                            value={ inputText } 
                            onChange={ textHandle }
                        />
                        <div className="mt-5">
                        <TextField  
                            label="비밀번호" 
                            type="text" 
                            name="name" 
                            className="w-full mb-5"
                            variant="outlined"
                            value={ inputPass } 
                            onChange={ passHandle }
                            helperText={"공백시 공개 그룹"} 
                        />
                        </div>
                        <div className="mt-5">
                        <TextField  
                            label="그룹 한줄 소개글" 
                            type="text" 
                            name="oneline" 
                            className="w-full mb-5"
                            variant="outlined"
                            value={ onelineIntro } 
                            onChange={ onelineHandle }
                        />
                        </div>
                    </div>
                    카테고리
                    {/* {optionSelected} */}
                    <div className="grid grid-cols-7">
                        
                        {options.map((option) => {
                            return(
                                <div>
                                    {optionSelected == option
                                        ?  <p className="bg-blue-200 border border-gray-400 rounded-lg w-20 text-center py-1">{option}</p>
                                        :  <p className="bg-gray-200 rounded-lg w-20 text-center py-1" onClick={()=>setOptionSelected(option)}>{option}</p>
                                      
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-end mt-10">
                        <Button variant="outlined"  color="success" onClick={save}>수정하기</Button>
                        <Button variant="outlined"  color="error" onClick={ModalClose}>취소하기</Button>
                    </div>
                </Box>
            </Modal>
        
        
        
        </div>
    )
}export default GroupUpdateModal