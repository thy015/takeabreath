import React, {useContext} from 'react'
import {AuthContext} from "../../hooks/auth.context";
import {Alert, Spin} from "antd";
import {useGet} from "../../hooks/hooks";

const YourCancelRequest = () => {
    const {auth}=useContext(AuthContext)
    const id=auth?.user?.id

    if (!id) {
        return <Alert message="Please try sign in first" type="info" showIcon />;
    }
    const {data,error,loading}=useGet(`http://localhost:4000/api/booking/${id}/cancelRequest`);
    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
    }

    if (error ||data.length===0 || !data) {
        return <Alert message="Notice" description="You haven't make any cancel request." type="info" showIcon />;
    }
    return (
        <>
            <div className='w-[500px]'>
                Your Ongoing Request

            {data.data.map((c, index) => {
                return (
                    <div key={index}>
                        <div className='card-wrapper w-full'>
                            <div className='card-holder'>
                                hi
                            </div>
                        </div>
                    </div>
                )
            })}
            </div>
        </>
    )
}
export default YourCancelRequest
