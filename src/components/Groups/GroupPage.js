import React, { useState } from "react";
import Header from "../../admin/layout/Header";
import GroupBar from "./GroupBar";


function GroupPage(){
    
    return(
        <div>
        <div className="flex h-screen">
            
            <div className="relative  flex-col flex-1">
                {/*  Site header */}
                <Header/>
                <div className="w-full">
                    <div className="bg-gray-200 flex relative ">
                        {/* 그룹페이지*/}
                        
                        {/* 왼쪽 고정 바 */}
                        <GroupBar/>
                        {/* 탭 화면 */}

                        <div className="ml-80">
                        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloreml
                        oremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
                        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlor
                        emloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
                        
                        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloreml
                        oremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
                        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlor
                        emloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
                        
                        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloreml
                        oremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlo
                        remloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
                        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlor
                        emloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlore
                        mloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default GroupPage;