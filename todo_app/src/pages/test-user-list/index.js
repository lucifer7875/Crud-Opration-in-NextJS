import Layout from '@/components/Layout'
import { tryCatchBlock } from '@/components/trycatchblock/TryCatch'
import React, { useEffect, useState } from 'react'
import styles from '../users-list/user.module.css';
import Loader from '@/components/Loader';
import DeleteModel from '@/components/DeleteModel/deleteModel';
import Table from '@/components/Table';
import Router from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';

const Test = ({ posts, initialSearchQuery, orderByQuery, orderTypeQuery }) => {

    const [userData, setUserData] = useState([]);
    const [state, setState] = useState({
        id: '',
        deleteMesage: '',
        previewModal: false,
        deleteModal: false,
        loading: false,
        searchQuery: initialSearchQuery,
        orderBy: orderByQuery,
        orderType: orderTypeQuery
    })
    const columns = [
        {
            name: 'Name',
            selector: (row) => (row?.name ? row?.name : ''),
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => (row?.email ? row?.email : ''),
            sortable: true,
        },
        {
            name: 'User ID',
            selector: (row) => (row?.userId ? row?.userId : ''),
            sortable: true,
            center: true
        },
        {
            name: 'status',
            selector: (row) => (<button className={row.status === 1 ? 'bg-green-600 cursor-not-allowed py-2 px-4 rounded' : 'bg-slate-300 py-2 px-4 rounded cursor-not-allowed opacity-50 '} >{row.status === 1 ? 'Active' : 'Inactive'} </button>),
            sortable: false,
            center: true
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <div
                        title='Edit'
                        className='cursor-pointer'
                        onClick={() => Router.push({ pathname: 'test-form/edit', query: { data: row?.id } })}
                    >

                        <i className="fa-solid fa-pen-to-square text-blue-500 text-base"></i>
                    </div>
                    <div
                        className='fa-sharp fa-solid fa-delete fa-trash ms-4 text-red-500 cursor-pointer text-base'
                        title='Delete'
                        onClick={() => showDeleteModal(row.id)}
                    />

                </>
            ),
            center: true
        },
    ];


    const showDeleteModal = (id) => {
        setState((prev) => ({ ...prev, id: id }))

        if (id) {
            setState((prev) => ({
                ...prev,
                deleteMesage: `Are you sure you want to delete this record?`,
            }))
        }
        setState((prev) => ({ ...prev, deleteModal: true }))
    }


    const Delete = async (settingsId) => {
        try {
            const response = await fetch('/api/deleteuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: settingsId,
            });

            setState((prev) => ({ ...prev, loading: true }))

            if (response.status === 200) {
                const responseData = await response.json();

                setUserData(responseData?.users);

                toast.success("User delete successful")
            } else if (response.status === 401) {

                console.error('Unauthorized');
            } else {

                // Handle other errors
                console.error('Failed to delete user data');
            }
        } catch (error) {

            console.error("Error:", error);
        } finally {
            setState((prev) => ({ ...prev, loading: false }))
            setState((prev) => ({ ...prev, deleteModal: false }))
        }
    }
    const hideDeleteConfirmationModal = () => {
        setState((prev) => ({ ...prev, deleteModal: false }))
    }
    const handleSort = async (column, sortDirection) => {
        if (column.name === 'Name') {
            setState((prev) => ({ ...prev, orderBy: 'name' }))
            setState((prev) => ({ ...prev, orderType: sortDirection }))
        } else if (column.name === 'Email') {
            setState((prev) => ({ ...prev, orderBy: 'email' }))
            setState((prev) => ({ ...prev, orderType: sortDirection }))
        } else if (column.name === 'User ID') {
            setState((prev) => ({ ...prev, orderBy: 'userId' }))
            setState((prev) => ({ ...prev, orderType: sortDirection }))
        }
    }
    useEffect(() => {
        setUserData(posts?.users.reverse())
        // Update the search query in the URL when it changes in the component state
        Router.push(`/test-user-list?searchQuery=${state.searchQuery}&orderBy=${state.orderBy}&orderType=${state.orderType}`);
    }, [state.searchQuery, state.orderBy, state.orderType]);
    return (
        <>
            <Head>
                <title>Users List</title>
            </Head>
            <Layout>
                <div className='mt-5 p-4'>
                    <div className={styles.tableHeadindDiv}>
                        <div className={`${styles.tableDiv} flex flex-no-wrap justify-between`}>
                            <div className="flex flex-no-wrap justify-between items-center">
                                <div className={styles.tableHeadind}>User List</div>
                                <div >
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Search by Name, User Id, Email"
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 ms-3"
                                        value={state.searchQuery}
                                        onChange={(e) => setState((prev) => ({ ...prev, searchQuery: e.target.value }))}
                                    /></div>
                            </div>
                            <div className={` bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center mb-2`} onClick={() => Router.push('/test-form/add')}><i className="fa-solid fa-plus"></i> <span>Add User</span></div>
                        </div>
                    </div>
                    {state.loading ? <Loader /> : <Table title="" columns={columns} data={userData} onSort={handleSort} />}
                </div>
            </Layout >
            <DeleteModel
                showModal={state.deleteModal}
                confirmModal={Delete}
                hideModal={hideDeleteConfirmationModal}
                id={state.id}
                message={state.deleteMesage}
            />
        </>
    )
}

export async function getServerSideProps(context) {
    let { query } = context;

    const searchQuery = query.searchQuery || '';
    const orderByQuery = query.orderBy || 'createdAt';
    const orderTypeQuery = query.orderType || 'desc';
    // Get the token from the context (if available)
    const token = context?.req?.cookies?.token;
    const URL = 'http://localhost:5012/auth/userswithbody'
    console.log("186", URL)
    return tryCatchBlock(token, URL, searchQuery, orderByQuery, orderTypeQuery)
}


export default Test