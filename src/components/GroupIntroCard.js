import { SvgIcon } from "@mui/material"
import GroupIcon from '@mui/icons-material/Group';

function GroupIntroCard(props){
    return(
            <div>
                <div className="shadow-md rounded-xl m-4 border bg-white pb-2">
                    <div className="px-6 mt-8 mb-4">
                        <h1 className="font-bold text-4xl text-center mb-1">{props.group.name}</h1>      
                        <p className="text-center text-gray-600 text-base mb-4 font-normal">{props.group.onelineintro}</p>
                        <div className="flex text-lg justify-center mb-4">
                            <SvgIcon>
                                <GroupIcon ></GroupIcon>
                            </SvgIcon>
                            <p>{props.group_user.length}</p>
                        </div>
                        <div className="flex justify-center">
                            <div
                                className="py-2 px-4 text-xs leading-3 mr-2 text-indigo-700 rounded-full bg-indigo-100">#{props.group.category}
                            </div>
                            <div className="py-2 w-fit px-4 text-xs leading-3 text-indigo-700 rounded-full bg-indigo-100">
                                {props.group.password
                                    ?<div>#비공개 그룹</div>
                                    :<div>#공개 그룹</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )



}export default GroupIntroCard