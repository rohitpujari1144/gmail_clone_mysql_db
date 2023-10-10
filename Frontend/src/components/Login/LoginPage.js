import { TextField } from '@mui/material'
import React from 'react'
import './loginPage.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
    let navigate = useNavigate()
    let userPassword = ''

    async function loginClick() {
        const email = document.getElementById('email')
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
        if (email.value === '') {
            warnToastMessage('Please enter email address', 3000)
        }
        else {
            if (email.value.match(emailPattern)) {
                try {
                    let res = await axios.get(`http://localhost:10500/user/login?email=${email.value}&password=${userPassword}`)
                    sessionStorage.setItem('userFirstName', res.data.userData.first_name)
                    sessionStorage.setItem('userLastName', res.data.userData.last_name)
                    sessionStorage.setItem('userEmail', res.data.userData.email)
                    navigate('/login/password')
                }
                catch (error) {
                    if (error.response) {
                        if (error.response.status === 400) {
                            errorToastMessage('Email address not exist !', 3000)
                        }
                    }
                    else {
                        errorToastMessage('Something went wrong. Please try again !', 3000)
                    }
                }
            }
            else {
                warnToastMessage('Invalid email address !', 3000)
            }
        }
    }

    function warnToastMessage(message, time) {
        toast.warn(message, {
            position: "bottom-left",
            autoClose: time,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    function errorToastMessage(message, time) {
        toast.error(message, {
            position: "bottom-left",
            autoClose: time,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    return (
        <>
            <div className="loginMainContainer shadow rounded">
                <div className='m-4'>
                    <div className="text-center">
                        <h3 className='mb-1 heading' style={{ fontFamily: 'sans-serif' }}><span className='text-primary'>G</span><span className='text-danger'>o</span><span className='text-warning'>o</span><span className='text-primary'>g</span><span className='text-success'>l</span><span className='text-danger'>e</span></h3>
                        <p className="fs-4 mb-1" style={{ fontFamily: 'sans-serif' }}>Sign in</p>
                        <p className="fs-6">to continue to Gmail</p>
                    </div>
                    <TextField style={{ width: '100%' }} id="email" label="Email Id" variant="outlined" />
                    <h6 className='text-primary forgotEmail mt-2' onClick={() => { navigate('/forgot-email') }}>Forgot email ?</h6>
                    <div className='text-center mt-3'>
                        Test email Id: userone@gmail.com
                    </div>
                    <div className='buttonContainer'>
                        <div >
                            <h6 className='text-primary createAccount' onClick={() => { navigate('/signup') }}>Create account</h6>
                        </div>
                        <div>
                            <button className='btn btn-primary' onClick={() => { loginClick() }}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default LoginPage