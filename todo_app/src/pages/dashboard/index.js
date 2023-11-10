import Layout from '../../components/Layout'
import UserCountChart from '../../components/UserCountChart';
import React, { useEffect, useState } from 'react'
import Style from "./style.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment/moment';
import Loader from '@/components/Loader';
import '@fortawesome/fontawesome-free/css/all.css';
import UserCountCard from './userCountCard';
import Cookies from 'js-cookie';
import Head from 'next/head';

const Dashboard = () => {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState({
        selectedDate: moment(new Date()).format('YYYY-MM-DD'),
        userCountDayWise: {},
        userCountWeekWise: '',
        weekStartDate: '',
        weekEndDate: ''
    })

    const userCountData = {
        labels: ["Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"],
        data: [],
    };

    Object.keys(state.userCountDayWise).map((item, i) => {
        // userCountData.labels.push(item)
        userCountData.data.push(state.userCountDayWise[item])
    })

    const dateFunction = (startDate) => {
        const currentDate = new Date(startDate);
        const currentDay = currentDate.getDay();
        const startOfWeek = new Date(currentDate);
        //first day of the week (Sunday)
        startOfWeek.setDate(currentDate.getDate() - currentDay);

        const endOfWeek = new Date(currentDate);
        //last day of the week (Saturday)
        endOfWeek.setDate(currentDate.getDate() + (6 - currentDay));

        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);

        setTimeout(() => {

            setState((prev) => ({ ...prev, weekStartDate: startOfWeek }))
            setState((prev) => ({ ...prev, weekEndDate: endOfWeek }))
        }, 2000);

    }


    const handleSelectDate = async (values) => {
        dateFunction(values.target.value)
        setState((prev) => ({ ...prev, selectedDate: values.target.value }))
    };
    const fetchData = async () => {
        try {
            if (Cookies.get('token')) {

                const postData = async () => {
                    const response = await fetch('/api/getusercount', {
                        method: 'POST',
                        body: JSON.stringify(state.selectedDate),
                    })
                    return response.json()
                }
                postData().then((res) => {
                    setLoading(true)
                    if (res.status === 200) {
                        // localStorage.setItem('created-user', JSON.stringify(res?.users))
                        // toast.success(res?.message)
                        setTimeout(() => {
                            setState((prev) => ({ ...prev, userCountDayWise: res.dailyCount }))
                            setState((prev) => ({ ...prev, userCountWeekWise: res.WeeklyCount }))
                            setLoading(false)
                        }, 2000);
                    } else if (res.status === 401) {
                        toast.error(res?.error)
                        setTimeout(() => {
                            setLoading(false)
                        }, 2000);
                    } else if (res.status === 500) {
                        toast.error(res?.message)
                        setTimeout(() => {
                            setLoading(false)
                        }, 2000);
                    }
                })
            }

        } catch (error) {
            toast.error("Login failed");
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        fetchData();
        dateFunction(state.selectedDate)
    }, [state.selectedDate]);

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>

            <Layout>
                <ToastContainer limit={1} theme="colored" autoClose={1000} />

                {loading && <Loader />}
                <div className={`flex flex-row ${loading && `tracking-tight text-gray-900 dark:text-white opacity-20`}`}>
                    <div style={{ width: '70%', paddingLeft: '5%', paddingRight: '5%' }}>
                        <UserCountChart data={userCountData} />
                    </div>
                    <div className="w-1/6 mt-8 ms-8">
                        <div className="">
                            <label htmlFor='date'>Please Select Date</label>
                            <input type="date" className={`${Style.dateInput} mt-2`} id='date' onChange={handleSelectDate} defaultValue={moment(new Date()).format('YYYY-MM-DD')} />
                        </div>

                        {/* week start date and end date */}
                        <div className="flex flex-row mt-12">
                            {state.weekStartDate &&
                                <div>
                                    {/* <label htmlFor='startDate'>Week Start Date</label>
                                <input type="date" id='startDate' name='startDate' className={`${Style.dateInput} mt-2`} onChange={handleSelectDate} value={state.weekStartDate} disabled={true} /> */}
                                    <div>Week Start Date</div>
                                    <div className={`${Style.dateInput} ${Style.m10}`}>{moment(state.weekStartDate).format('LL')}</div>
                                </div>
                            }
                            {state.weekEndDate && <div className='ms-5'>
                                {/* 
                            <label htmlFor='endDate'>Week end Date</label>
                            <input type="date" id='endDate' name='endDate' className={`${Style.dateInput} mt-2`} onChange={handleSelectDate} value={state.weekEndDate} disabled={true} /> */}
                                <div>Week End Date</div>
                                <div className={`${Style.dateInput} ${Style.m10}`}>{moment(state.weekEndDate).format('LL')}</div>
                            </div>}
                        </div>
                        {/* week start date and end date */}


                        <>
                            {state.userCountWeekWise !== undefined && state.userCountWeekWise > 0 && <UserCountCard WeeklyCount={state.userCountWeekWise} />}

                        </>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Dashboard