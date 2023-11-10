// pages/login.js

import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.css';
import Head from 'next/head';



const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
const Login = () => {
    const [state, setState] = useState({
        passwordVisible: false,
    })
    const router = useRouter()
    const handleLogin = async (values) => {
        try {
            const postData = async () => {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify(values),
                })
                return response.json()
            }
            postData().then((res) => {

                if (res.status === 200) {
                    toast.success(res?.message?.message)
                    setTimeout(() => {

                        // expired cookie in 1 hour
                        localStorage.setItem('token', res?.message?.token)
                        cookies.set('token', res?.message?.token, { expires: new Date(Date.now() + 3600000) });
                        router.push('/dashboard')
                    }, 2000);
                } else if (res.status === 401) {
                    toast.error(res?.message?.error)
                }
            })

        } catch (error) {
            toast.error("Login failed");
            console.error("Error:", error);
        }

    };

    const handlePasswordVisibility = () => {
        setState((pre) => ({ ...pre, passwordVisible: !state.passwordVisible }));
    };
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <ToastContainer limit={1} theme="colored" autoClose={1000} />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-4 space-y-4 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center">Login</h1>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        <Form>
                            <div>
                                <label className="block">Email:</label>
                                <Field
                                    className="w-full px-4 py-2 border rounded-lg focus:ring"
                                    type="email"
                                    name="email"
                                />
                                <ErrorMessage name="email" component="p" className="mt-2 text-red-500" />
                            </div>
                            {/* <div>
                                <label className="block">Password:</label>
                                <Field
                                    className="w-full px-4 py-2 border rounded-lg focus:ring"
                                    type="password"
                                    name="password"
                                />
                                <ErrorMessage name="password" component="p" className="mt-2 text-red-500" />
                            </div> */}
                            <div className="relative">
                                <label htmlFor="password" className="block flex items-center">

                                    Password:

                                </label>
                                <Field name="password">
                                    {({ field }) => (
                                        <div className="flex items-center">
                                            <input
                                                {...field}
                                                type={state.passwordVisible ? 'text' : 'password'}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring pr-10"
                                            />
                                            <i className="absolute right-3 text-gray-400 cursor-pointer" onClick={handlePasswordVisibility}>
                                                {state.passwordVisible ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                            </i>
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="password" component="p" className="mt-2 text-red-500" />
                            </div>
                            <button
                                className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
                                type="submit"
                            >
                                Login
                            </button>
                        </Form>
                    </Formik>
                    <p className="mt-4 text-center">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-400 hover:text-blue-600 ">Register</Link> {/* Link to the registration page */}
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
