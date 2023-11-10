import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-free/css/all.css';
import Head from 'next/head';

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'At least 1 uppercase character is required')
        .matches(/[a-z]/, 'At least 1 lowercase character is required')
        .matches(/[0-9]/, 'At least 1 number is required')
        .matches(/[#@$?]/, 'At least 1 special character (#@$?) is required')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const Register = () => {
    const router = useRouter();
    const [state, setState] = useState({
        passwordVisible: false,
        confirmPasswordVisible: false
    })

    const handleRegister = async (values) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.status === 201) {
                const responseData = await response.json();
                toast.success(responseData?.message);
                setTimeout(() => {
                    router.push('/');
                }, 2000);
                // Save data when registration is successful
                return responseData;
            } else if (response.status === 401) {
                toast.error('User with this email already exists');
            } else {
                toast.error('Registration failed');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePasswordVisibility = () => {
        setState((pre) => ({ ...pre, passwordVisible: !state.passwordVisible }));
    };

    const handleConfirmPasswordVisibility = () => {
        setState((pre) => ({ ...pre, confirmPasswordVisible: !state.confirmPasswordVisible }));
    };
    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <ToastContainer limit={1} theme="colored" autoClose={1000} />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-4 space-y-4 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center">Register</h1>
                    <Formik
                        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={RegisterSchema}
                        onSubmit={handleRegister}
                    >
                        <Form>
                            <div>
                                <label htmlFor="name" className="block">
                                    Name:
                                </label>
                                <Field
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring"
                                />
                                <ErrorMessage name="name" component="p" className="mt-2 text-red-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block">
                                    Email:
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring"
                                />
                                <ErrorMessage name="email" component="p" className="mt-2 text-red-500" />
                            </div>
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

                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block flex items-center">
                                    Confirm Password:
                                </label>
                                <Field name="confirmPassword">
                                    {({ field }) => (
                                        <div className="flex items-center">
                                            <input
                                                {...field}
                                                type={state.confirmPasswordVisible ? 'text' : 'password'}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring pr-10"
                                            />
                                            <i className="absolute right-3 text-gray-400 cursor-pointer" onClick={handleConfirmPasswordVisibility}>
                                                {state.confirmPasswordVisible ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                            </i>
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="confirmPassword" component="p" className="mt-2 text-red-500" />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
                            >
                                Register
                            </button>
                        </Form>
                    </Formik>
                    <p className="mt-4 text-center">
                        Already have an account?{' '}
                        <Link href="/" className="text-blue-400 hover:text-blue-600" passHref>Login</Link> {/* Link to the login page */}
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
