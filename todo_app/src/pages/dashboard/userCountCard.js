import React from 'react'
import Style from "./style.module.css"
import '@fortawesome/fontawesome-free/css/all.css';
import Router from 'next/router';

const UserCountCard = ({ WeeklyCount }) => {
    return (

        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-8 hover:bg-gray-100">
            <div className="flex justify-end px-4 pt-4">
            </div>
            <div className="flex flex-row items-center p-3">
                <div className={Style.container}>
                    <div className={Style.icon}>
                        <i className="fa-solid fa-people-group"></i>
                    </div>
                </div>
                <div className='ms-3'>
                    <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-white ">Weekly Created User Count</h5>
                    <div className="text-lg text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:text-blue-800" onClick={() => { Router.push('/users-list') }}>{WeeklyCount}</div>
                </div>
            </div>
        </div>

    )
}

export default UserCountCard