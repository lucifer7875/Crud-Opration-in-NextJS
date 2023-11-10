import Layout from '@/components/Layout'
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { Country, State, City } from 'country-state-city'
import '@fortawesome/fontawesome-free/css/all.css';
import React, { useEffect, useState } from 'react'
import styles from '../users-list/user.module.css';
import CustomCreatableSelect from '@/components/CustomCreatableSelect/CustomCreatableSelect';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from '@/components/ImageUpload/imageUpload';
import Head from 'next/head';

const TestForm = () => {
    const router = useRouter()
    const [intresedArea, setIntresedArea] = useState([])

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .transform(value => value.trim())
            .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed for the name')
            .required('Name is required'),
        email: Yup.string()
            // .trim()
            .email('Invalid email')
            .required('Email is required'),
        userId: Yup.string(),
        mobileNumber: Yup.string().min(10, 'Enter atlist 10 digit').max(10, 'Enter maximum 10 digit').required('Mobile number is required'),
        country: Yup.string().required('Country is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        currentLocation: Yup.string().required('Current Location is required'),
        status: Yup.string().required('Status is required'),
        hobbies: Yup.array().min(1, 'Select at least one hobby'),
        images: Yup.string(),
    });
    const handleSubmit = async (values, { resetForm }) => {
        const statusValue = values.status === 'active' ? 1 : 0;
        try {
            const apiEndpoint = router.query.id === 'edit' ? '/api/updateuser' : '/api/createuser';

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values, status: statusValue, id: router.query.data }),
            });

            const responseData = await response.json();

            if (responseData.status === 200) {
                toast.success(responseData?.message);
                setTimeout(() => {
                    router.push('/test-user-list');
                    resetForm(); // Clear the form on successful submission
                }, 1000);
            } else if (responseData.status === 500) {
                toast.error(responseData?.message);
            } else {
                toast.error(responseData?.message);
            }
        } catch (error) {
            toast.error(responseData?.message);
        }

    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            userId: '',
            mobileNumber: '',
            interestArea: '',
            country: '',
            state: '',
            city: '',
            currentLocation: '',
            status: 'active',
            hobbies: [],
            images: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
    const hobbiesOptions = [
        { label: 'Cricket', value: 'cricket' },
        { label: 'Badminton', value: 'badminton' },
        { label: 'Table Tennis', value: 'table-tennis' },
        { label: 'Carrom', value: 'carrom' },
        { label: 'Volleyball', value: 'volleyball' },
        { label: 'Basketball', value: 'basketball' },
        // Add more hobbies options as needed
    ];


    const Icountry = Country.getAllCountries()
    const IState = State.getAllStates()
    const ICity = City.getAllCities()

    // get countgry name
    function getCountry() {
        return Icountry.map((country) => {
            return <option value={country.isoCode}>{country.name}</option>
        })
    }

    // select state by country code
    const SelectedState = IState.filter((state) => {
        return formik.values.country === state.countryCode
    })

    // select cities by state and country code

    const SelectedCity = ICity.filter((city) => {
        return (
            formik.values.country === city.countryCode && formik.values.state === city.stateCode
        )
    })

    // get all filtered state

    function getState() {
        return (
            SelectedState &&
            SelectedState.map((item) => {
                return <option value={item.isoCode}>{item.name}</option>
            })
        )
    }

    // get all filtered cities

    function getCities() {
        return (
            SelectedCity &&
            SelectedCity.map((item) => {
                return <option value={item.isoCode}>{item.name}</option>
            })
        )
    }
    const fetchData = async () => {
        try {
            const response = await fetch('/api/getoneuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: router.query.data,
            });

            const responseData = await response.json();
            // Set user data
            formik.setValues({
                name: responseData?.user?.name || '',
                email: responseData?.user?.email || '',
                userId: responseData?.user?.userId || '',
                mobileNumber: responseData?.user?.mobileNumber || '',
                interestArea: responseData?.user?.userIntresedArea?.map((data) => data.tag) || '',
                country: responseData?.user?.country || '',
                state: responseData?.user?.state || '',
                city: responseData?.user?.city || '',
                currentLocation: responseData?.user?.currentLocation || '',
                images: responseData?.user?.images || '',
                hobbies: JSON.parse(responseData?.user?.hobbies) || '',
                status: responseData?.user?.status === 1 ? 'active' : 'inactive' || 'active',
            });
        } catch (error) {
            toast.error(error);
            console.error("Error:", error);
        }
    };
    const fetchIntresedAreaData = async () => {
        try {
            const response = await fetch('/api/getallintrestedarea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();
            // Set user data
            setIntresedArea(responseData?.intresedAreas)
        } catch (error) {
            toast.error(error);
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData()
        fetchIntresedAreaData()
    }, [router.query.data])

    console.log("37", formik)

    return (
        <>
            <Head>
                <title>{router.query.id === 'edit' ? 'Edit User' : 'Add User'}</title>
            </Head>
            <Layout>
                <ToastContainer limit={1} theme="colored" autoClose={1000} />
                <div className='p-4'>
                    <div className="bg-slate-150 p-4 rounded-lg shadow-lg h-100vh mt-5">
                        <div className={styles.tableHeadindDiv}>
                            <div className={`${styles.tableDiv} flex flex-no-wrap justify-between`}>
                                <div className="flex flex-no-wrap justify-between items-center">
                                    <h1 className="text-2xl font-semibold mb-4">
                                        {router.query.id === 'edit' ? 'Edit User' : 'Add User'}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='mt-2 p-4'>

                                {/* col 1 */}

                                <div className="grid gap-6 mb-6 md:grid-cols-2 ">
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="name" name='name' className="text-gray-900 dark:text-white me-2  required">Name</label>
                                            {formik.touched.name && !formik.errors.name && (
                                                <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            )}
                                        </div>
                                        <input type="text" name='name' id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} placeholder="Enter Name" />
                                        {formik.touched.name && formik.errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="email" name='email' className="text-gray-900 dark:text-white me-2 required">Email</label>
                                            {formik.touched.email && !formik.errors.email && (
                                                <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            )}
                                        </div>
                                        <input type="email" name='email' id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.email} onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} placeholder="Enter Email" />
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                                        )}
                                    </div>

                                </div>

                                {/* col 2 */}

                                <div className={`grid gap-6 mb-6 ${router.query.id === 'edit' ? `md:grid-cols-3` : `md:grid-cols-2`} `}>
                                    {router.query.id === 'edit' && <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="userId" className="text-gray-900 dark:text-white me-2">User ID</label>
                                            {formik.touched.userId && !formik.errors.userId &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>
                                        <input type="text" id="userId" name='userId' className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled" value={formik.values.userId} onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} placeholder="Enter User ID" disabled={true} />
                                        {formik.touched.userId && formik.errors.userId && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.userId}</p>
                                        )}
                                    </div>}
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="mobileNumber" className="text-gray-900 dark:text-white me-2 required">Mobile Number</label>
                                            {formik.values.mobileNumber &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>
                                        <input type="number" id="mobileNumber" name='mobileNumber' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.mobileNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} placeholder="Enter Mobile Number" />
                                        {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.mobileNumber}</p>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="interestArea" className="text-gray-900 dark:text-white me-2">Intrest Area</label>
                                            {formik.values.interestArea?.length > 0 &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>
                                        <CustomCreatableSelect
                                            className={''}
                                            option={intresedArea}
                                            value={formik.values.interestArea}
                                            onChange={(value) => formik.setFieldValue('interestArea', value)}
                                        />
                                    </div>

                                </div>

                                {/* col 3 */}

                                <div className="grid gap-6 mb-6 md:grid-cols-4 ">
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="country" className="text-gray-900 dark:text-white me-2 required">Country</label>
                                            {formik.values.country &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>

                                        <select id="country" name='country' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.country} onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}>
                                            <option selected value=''>Choose a country</option>
                                            {getCountry()}
                                        </select>
                                        {formik.touched.country && formik.errors.country && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.country}</p>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="state" className="text-gray-900 dark:text-white me-2 required">State</label>
                                            {formik.values.state &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>

                                        <select id="state" name='state' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.state} onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}>
                                            <option selected value=''>Choose a state</option>
                                            {getState()}
                                        </select>
                                        {formik.touched.state && formik.errors.state && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.state}</p>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="city" className="text-gray-900 dark:text-white me-2 required">City</label>
                                            {formik.values.city &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>

                                        <select id="city" name='city' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.city} onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}>
                                            <option selected value=''>Choose a city</option>
                                            {getCities()}
                                        </select>
                                        {formik.touched.city && formik.errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <label htmlFor="currentLocation" className="text-gray-900 dark:text-white me-2 required">Current Location</label>
                                            {formik.values.currentLocation &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div>
                                        <select id="currentLocation" name='currentLocation' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formik.values.currentLocation} onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}>
                                            <option selected value=''>Choose a current location</option>
                                            {getCities()}
                                        </select>
                                        {formik.touched.currentLocation && formik.errors.currentLocation && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.currentLocation}</p>
                                        )}
                                    </div>
                                </div>
                                {/* col 4 */}
                                <div className="grid gap-6 mb-6 md:grid-cols-2 ">
                                    <div >

                                        <div >
                                            <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                                <label htmlFor="hobbies" className="text-gray-900 dark:text-white me-2">Hobbies</label>
                                                {formik.values.hobbies?.length > 0 &&
                                                    <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                                }
                                            </div>
                                            <div className='grid gap-1 items-baseline md:grid-cols-3'>
                                                {hobbiesOptions.map((hobby) => (
                                                    <div key={hobby?.value} className='flex items-center mb-4 mr-4'>
                                                        <input
                                                            id={hobby?.value}
                                                            type='checkbox'
                                                            value={hobby.value}
                                                            checked={formik.values.hobbies.includes(hobby.value)}
                                                            onChange={(e) => {
                                                                const updatedHobbies = e.target.checked
                                                                    ? [...formik.values.hobbies, hobby.value]
                                                                    : formik.values.hobbies.filter((h) => h !== hobby.value);

                                                                formik.setFieldValue('hobbies', updatedHobbies);
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={hobby.value}
                                                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                                        >
                                                            {hobby.label}
                                                        </label>
                                                    </div>
                                                ))}
                                                {formik.touched.hobbies && formik.errors.hobbies && (
                                                    <p className="text-red-500 text-sm mt-1">{formik.errors.hobbies}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {/* <div className='mt-4'>
                                                <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                                    <label htmlFor="status" className="text-gray-900 dark:text-white me-2">Status</label>
                                                    {formik.values.status &&
                                                        <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                                    }
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    <div className='flex items-center'>
                                                        <input
                                                            id='active-1'
                                                            type='radio'
                                                            value={1}
                                                            name='status'
                                                            checked={formik.values.status === 'active'}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <label
                                                            htmlFor='active-1'
                                                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                                        >
                                                            Active
                                                        </label>
                                                    </div>
                                                    <div className='flex items-center'>
                                                        <input
                                                            id='inactive-2'
                                                            type='radio'
                                                            value={0}
                                                            name='status'
                                                            checked={formik.values.status === 'inactive'}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <label
                                                            htmlFor='inactive-2'
                                                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                                        >
                                                            Inactive
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className='mt-4'>
                                                <div className="flex justify-start mb-2 block text-sm font-medium">
                                                    <label htmlFor="status" className="text-gray-900 dark:text-white me-2 required">Status</label>
                                                    {formik.values.status &&
                                                        <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                                    }
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    <div className='flex items-center'>
                                                        <input
                                                            id='active-1'
                                                            type='radio'
                                                            value='active'
                                                            name='status'
                                                            checked={formik.values.status === 'active'}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <label
                                                            htmlFor='active-1'
                                                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                                        >
                                                            Active
                                                        </label>
                                                    </div>
                                                    <div className='flex items-center'>
                                                        <input
                                                            id='inactive-2'
                                                            type='radio'
                                                            value='inactive'
                                                            name='status'
                                                            checked={formik.values.status === 'inactive'}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <label
                                                            htmlFor='inactive-2'
                                                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                                        >
                                                            Inactive
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>



                                    </div>
                                    <div>
                                        {/* <div className="flex justify-start  mb-2 block text-sm font-medium ">
                                            <p className="me-2 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                                            {formik.values.file &&
                                                <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                                            }
                                        </div> */}

                                        {/* <div className="flex items-center justify-center w-full">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                </div>
                                                <input id="dropzone-file" type="file" name='file' className="hidden" value={formik.values.file} onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur} />
                                            </label>
                                        </div> */}
                                        <ImageUpload value={formik.values.file} onBlur={formik.handleBlur} name={'file'} setFieldValue={formik.setFieldValue} getFieldProps={formik.getFieldProps} />
                                        {formik.touched.file && formik.errors.file && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.file}</p>
                                        )}



                                    </div>
                                </div>
                                {/* col 5 */}
                                <div className="grid gap-80 mb-6 justify-end">
                                    <div>
                                        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(e) => {
                                            e.preventDefault()
                                            router.push('/test-user-list')
                                        }}>Cancel</button>
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        // disabled={formik.isSubmitting}
                                        > {formik.isSubmitting ? (
                                            <>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit'
                                        )}</button>

                                    </div>
                                </div>
                            </div>
                        </form >

                    </div >
                </div>
            </Layout >
        </>
    )
}

export default TestForm