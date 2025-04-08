

import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [state, setState] = useState('Sign Up'); // 'Sign Up' hoặc 'Login'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { backendURL, token, setToken } = useContext(AppContext)

    const navigate = useNavigate()

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(backendURL + '/api/user/register', { name, email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendURL + '/api/user/login', { email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                } else {
                    toast.error(data.message)
                }

            }

        } catch (error) {
            toast.error(error.message)
        }

    };

    useEffect(() => {
        if (token) {
            navigate('/')
        }

    }, [token] )

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 mb-10">
            <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {state === 'Sign Up' ? 'Register' : 'Login'}
                </h2>

                {/* Hiển thị trường tên nếu là đăng ký */}
                {state === 'Sign Up' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); console.log(e) }}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên của bạn"
                            required
                        />
                    </div>
                )}

                {/* Trường email */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập email của bạn"
                        required
                    />
                </div>

                {/* Trường mật khẩu */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        PassWord
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu của bạn"
                        required
                    />
                </div>

                {/* Nút submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    {state === 'Sign Up' ? 'Register' : 'Login'}
                </button>

                {/* Chuyển đổi giữa đăng nhập và đăng ký */}
                <p className="mt-4 text-center">
                    {state === 'Sign Up' ? (
                        <span>
                            Have Account ?{' '}
                            <button
                                type="button"
                                onClick={() => setState('Login')}
                                className="text-blue-500 hover:underline"
                            >
                                Login
                            </button>
                        </span>
                    ) : (
                        <span>
                            Haven't Account ?{' '}
                            <button
                                type="button"
                                onClick={() => setState('Sign Up')}
                                className="text-blue-500 hover:underline"
                            >
                                Register
                            </button>
                        </span>
                    )}
                </p>
            </form>
        </div>
    );
};
