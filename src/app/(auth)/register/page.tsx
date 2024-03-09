'use client'

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    language: 'en'
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://oprec-api.labse.in/api/user/', userData);
      console.log('Registration successful:', response.data);
      toast.success('Registration successful, please login to continue.');
    } catch (error:any) {
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="bg-gray-900 border-[4px] border-blue-900 rounded-2xl hover:border-blue-500 transition-all duration-200"
        style={{ maxWidth: '90%', width: '400px' }} 
      >
        <form onSubmit={handleSubmit}>
          <div className="mx-auto flex items-center space-y-4 py-16 px-12 font-semibold text-gray-500 flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 470 468" id="task"><defs><filter id="a" width="111.8%" height="111.9%" x="-5.9%" y="-3.9%" filterUnits="objectBoundingBox"><feOffset dy="5" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4"></feGaussianBlur><feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.078125 0"></feColorMatrix><feOffset dy="4" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset><feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="5.5"></feGaussianBlur><feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.210824275 0"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="shadowMatrixOuter2"></feMergeNode></feMerge></filter><path id="b" d="M9.635 132.808C24.782 59.782 71.388 19.109 144.085 6.822c53.74-9.081 107.5-9.196 161.15.255 74.852 13.185 119.85 56.23 134.185 130.36 11.075 57.29 11.249 115.191-.174 172.427-15.324 72.52-63.132 117.285-135.561 129.527-53.74 9.08-107.5 9.195-161.15-.255-74.852-13.186-120.05-58.38-134.384-132.509-11.64-57.668-10.52-115.935 1.484-173.82z"></path></defs><g fill="none" fill-rule="evenodd"><g transform="translate(-21 -26)"><g><g transform="translate(32 33)"><use fill="#000" filter="url(#a)" xlinkHref="#b"></use><use fill="#3DD736" xlinkHref="#b"></use></g><path fill="#FFF" d="M231.667 123.841c47.352 3.599 85.256 40.985 89.672 88.104h-89.672v-88.103zm-86.115 39.47c16.069-21.798 40.983-36.67 69.448-39.322v84.353l-69.448-45.03zM224.166 103c-64.71 0-117.168 52.458-117.168 117.168 0 64.708 52.459 117.165 117.168 117.165 13.768 0 26.977-2.382 39.249-6.743l-6.32-17.514a97.412 97.412 0 0 1-32.93 5.7c-53.907 0-97.608-43.701-97.608-97.608 0-15.688 3.706-30.507 10.282-43.64l78.16 51.14 106.493-.055c-1.86 24.632-12.86 46.71-29.618 62.857l13.322 13.322c22.267-21.327 36.137-51.356 36.137-84.624 0-64.71-52.459-117.168-117.167-117.168z" transform="translate(32 33)"></path></g></g></g></svg>
            <h1 className="text-white text-2xl">Sign Up to TaskApp</h1>
            <input
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200"
              placeholder="Username"
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
            <input
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200"
              placeholder="Name"
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />
            <input
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200"
              placeholder="Email"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <input
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200"
              placeholder="Password"
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
            <input
              className="w-full p-2 bg-gray-50 rounded-full font-bold text-gray-900 border-[4px] border-gray-700 hover:border-blue-500 transition-all duration-200"
              type="submit"
              value="Sign Up"
            />
            <p>
              Already have an account?
              <a
                className="font-semibold text-white hover:text-blue-500 transition-all duration-200"
                href="/login"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
