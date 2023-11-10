import React, { useEffect, useState } from 'react';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^(?! )[A-Za-z -]*(?<! )$/, 'Name can only contain letters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  status: Yup.string().required('Status is required'),
});

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const AddEdit = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    const { name, email, status } = values;
    const statusValue = status === 'active' ? 1 : 0;
    setIsSubmitting(true);

    try {
      const apiEndpoint = router.query.id === 'edit' ? '/api/updateuser' : '/api/createuser';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, status: statusValue, id: router.query.data }),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        toast.success(responseData?.message);
        setTimeout(() => {
          router.push('/users-list');
          resetForm(); // Clear the form on successful submission
        }, 1000);
      } else if (responseData.status === 500) {
        toast.error(responseData?.message);
      } else {
        toast.error(responseData?.message);
      }
    } catch (error) {
      toast.error(responseData?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch user data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/getoneuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: router.query.data,
      });

      setIsSubmitting(true);
      const responseData = await response.json();
      // Set user data
      formik.setValues({
        name: responseData?.user?.name || '',
        email: responseData?.user?.email || '',
        userId: responseData?.user?.userId || '',
        status: responseData?.user?.status === 1 ? 'active' : 'inactive' || 'active',
      });
    } catch (error) {
      toast.error(error);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize Formik using the useFormik hook
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      status: 'active',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    fetchData();
  }, [router.query.data]);

  return (
    <>
      <Head>
        <title>{router.query.id === 'edit' ? 'Edit User' : 'Add User'}</title>
      </Head>

      <Layout>
        <ToastContainer limit={1} theme="colored" autoClose={1000} />
        <div className="flex items-left flex-col mt-5 p-4">
          <div className="bg-slate-50 p-4 rounded-lg shadow-lg h-80vh">
            <h1 className="text-2xl font-semibold mb-4">
              {router.query.id === 'edit' ? 'Edit User' : 'Add User'}
            </h1>
            <hr />
            <form onSubmit={formik.handleSubmit} className="space-y-4 mt-5">
              {/* Form fields */}
              <div className="grid grid-cols-1 gap-4 w-1/3">
                <div className="col-span-1">
                  <div className="space-y-4">
                    <label htmlFor="name" className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-sm">{formik.errors.name}</div>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="space-y-4">
                    <label htmlFor="email" className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-sm">{formik.errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="space-y-4">
                    <label htmlFor="status" className="text-sm font-medium text-gray-600" hidden={router.query.id === 'edit' ? false : true}>
                      UserId
                    </label>
                    <input
                      type="text"
                      id="userId"
                      name="userId"
                      placeholder="Enter your userId"
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.userId}
                      disabled={true}
                      hidden={router.query.id === 'edit' ? false : true}
                    />
                    {/* {formik.touched.userId && formik.errors.userId && (
                    <div className="text-red-500 text-sm">{formik.errors.userId}</div>
                  )} */}
                  </div>
                </div>
                {/* <div className="col-span-1">
                <div className="space-y-4">
                  <label htmlFor="status" className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm">{formik.errors.status}</div>
                  )}
                </div>
              </div> */}
                <div className="col-span-1">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex space-x-4">
                      {statusOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            id={`status_${option.value}`}
                            name="status"
                            value={option.value}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.values.status === option.value}
                          />
                          <label htmlFor={`status_${option.value}`} className="ml-2">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formik.touched.status && formik.errors.status && (
                      <div className="text-red-500 text-sm">{formik.errors.status}</div>
                    )}
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="mt-8">
                    <button
                      type="button"
                      className="bg-red-500 text-white font-semibold rounded p-2 hover:bg-red-600 focus:outline-none w-52"
                      style={{
                        position: 'absolute',
                        bottom: '200px',
                        right: '5%',
                      }}
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.preventDefault()
                        router.push('/users-list')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-semibold rounded p-2 hover:bg-blue-600 focus:outline-none w-52"
                      style={{
                        position: 'absolute',
                        bottom: '200px',
                        left: '72%',
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          Submitting...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddEdit;
