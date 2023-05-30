import  { useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';


const useAxiosSecure = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000/', // Replace with your base URL
  });

  useEffect(() => {
    axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) =>  {
        if (error.response) {
          const { status } = error.response;
          if (status === 401 || status === 403) {
            // Logout the user and navigate to the login page
             logOut() 
              .then(() => {
                navigate('/login');
              })
              .catch((logoutError) => {
                console.error('Error logging out:', logoutError);
                // Handle any error that occurs during logout
              });
          }
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate,axiosSecure]);

  return [axiosSecure];
};

export default useAxiosSecure;