import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Header from "../../admin/layout/Header";
import GroupCreateModal from "../../layouts/GroupCreateModal";


function Group() {

    const [groups,setGroups] = useState([]); 
    const groupChange = useSelector(state=>state.Reducers.groupChange);
    const followId = useSelector(state=>state.Reducers.followId);

    useEffect(()=>{
        axios.get('/api/show/mygroup/'+followId.id)
        .then(res=>{
            console.log(res.data);
            setGroups(res.data)
        })
    },[groupChange])
    // group을 새로 만들때 +1이 되는 값이 groupChange이고 groupChange가 일어날 때마다 새롭게 다시 보여줌.

    
    const listClick=(id)=>{
        window.location.href = 'group/'+id
    }
    const user = useSelector(state=>state.Reducers.user)
    
    return(
        <div>
          


                  
            
            <div className="w-full flex flex-wrap">
            {groups.map((group)=>{
                return(
                    <div className="w-80 shadow-lg mx-5 mt-8 rounded-xl border hover:brightness-50" onClick={()=>listClick(group.id)} key={group.id}>
                        <img className="h-60 rounded-t-xl w-full" src={group.logoImage} alt='null' />
                        <div className=" pt-6 w-fit mx-auto px-4 text-lg font-bold text-black">
                            {group.name}
                        </div>
                        <div className="w-fit mx-auto pb-4">
                            <p className="text-sm text-gray-400">
                                {group.category} / 맴버수 : 30
                                
                            </p>
                        </div>
                    </div> 
            )})}
            </div>
        </div>
    )


}export default Group