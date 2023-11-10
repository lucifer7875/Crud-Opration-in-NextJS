import Layout from '@/components/Layout';
import Table from '../../components/Table';
import React, { useEffect, useState } from 'react';
import styles from './user.module.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Link from 'next/link';
import Router from 'next/router';
import DeleteModel from '../../components/DeleteModel/deleteModel';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';
import Head from 'next/head';


const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [state, setState] = useState({
    id: '',
    deleteMesage: '',
    previewModal: false,
    deleteModal: false,
    loading: false,
    searchQuery: '',
    orderBy: 'createdAt',
    orderType: 'desc'
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
            href={`/user/edit`}
            title='Edit'
            className='cursor-pointer'
            onClick={() => Router.push({ pathname: '/test-form/edit', query: { data: row?.id } })}
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
  const fetchData = async () => {
    try {
      const response = await fetch('/api/getalluser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: state.searchQuery, orderBy: state.orderBy, orderType: state.orderType })
      });


      setState((prev) => ({ ...prev, loading: true }))
      if (response.status === 200) {
        const responseData = await response.json();

        setUserData(responseData?.users);
      } else if (response.status === 401) {

        console.error('Unauthorized');
      } else {

        // Handle other errors
        console.error('Failed to fetch user data');
      }
    } catch (error) {

      console.error("Error:", error);
    } finally {
      // setTimeout(() => {

      // }, 1000);
      setState((prev) => ({ ...prev, loading: false }))
    }
  };

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

  useEffect(() => {
    // if ((JSON.parse(localStorage.getItem('created-user')) || []).length <= 0) {

    const delayDebounceFn = setTimeout(() => {
      // Use the searchValue to fetch relevant data

      fetchData();

    }, 600) // Debounce delay in milliseconds
    return () => clearTimeout(delayDebounceFn)
    // }

  }, [state.searchQuery, state.orderType])


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
                <div className={styles.tableHeading}>User List</div>
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

export default UserList