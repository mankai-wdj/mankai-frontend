import React, {useState} from "react";
import Sidebar from "../../admin/layout/Sidebar"
import Header from "../../admin/layout/Header"
import GroupList from "./GruopList";

function Group() {
    return (

        <div>
            <div className="flex h-screen">
               
                <div className="relative  flex-col flex-1">
                    {/*  Site header */}
                    <Header />
                    <div className="w-full">
                        <div className="bg-gray-200 flex relative ">
                            {/* 그룹메인페이지 : 그룹리스트 */}
                            <GroupList/>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Group;