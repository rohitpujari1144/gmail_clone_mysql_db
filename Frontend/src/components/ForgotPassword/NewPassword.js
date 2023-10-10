import React, { useState } from 'react'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './newPassword.css'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewPassword() {
    var count = 0
    let navigate = useNavigate()
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')
    let [security_key, setsecurity_key] = useState('')

    function showPasswordClick() {
        const newPassword = document.getElementById('newPassword')
        const confirmPassword = document.getElementById('confirmPassword')
        const securityKey = document.getElementById('securityKey')
        count++
        if (count % 2 === 0) {
            newPassword.setAttribute('type', 'password')
            confirmPassword.setAttribute('type', 'password')
            securityKey.setAttribute('type', 'password')
        }
        else {
            newPassword.removeAttribute('type')
            confirmPassword.removeAttribute('type')
            securityKey.removeAttribute('type')
        }
    }

    async function changePasswordClick() {
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
        if ((!email || !password || !confirmPassword || !security_key) || (!email && !password && !confirmPassword && !security_key)) {
            warnToastMessage('Please enter all details !', 3000)
        }
        else {
            if (!email.match(emailPattern)) {
                warnToastMessage('Invalid email address !', 3000)
            }
            else if (password !== confirmPassword || confirmPassword !== password) {
                warnToastMessage('Password and confirm password should be same !', 3000)
            }
            else {
                let newPassword = {
                    password: password
                }
                try {
                    await axios.put(`http://localhost:10500/user/update_password?email=${email}&security_key=${security_key}`, newPassword)
                    successToastMessage('Password successfully changed', 3000)
                    setTimeout(() => {
                        navigate('/login/password')
                    }, 4000);
                }
                catch (error) {
                    if (error.response) {
                        if (error.response.status === 400) {
                            errorToastMessage('Invalid details !', 3000)
                        }
                    }
                    else {
                        errorToastMessage('Something went wrong. Please try again !', 3000)
                    }
                }
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

    function successToastMessage(message, time) {
        toast.success(message, {
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
            <div className='container shadow col-4 rounded position-absolute top-50 start-50 translate-middle d-flex justify-content-center'>
                <div className='w-50'>
                    <h4 className='mt-2 text-center'>Enter Details</h4>
                    <div className='m-3'>
                        <TextField label="Email Id" className='md-small' id="username" size="small" onChange={(e) => { setEmail(e.target.value) }} />
                        <span id='usernameError' className='text-danger' ></span>
                    </div>
                    <div className='m-3' >
                        <TextField label="Account security code" className='md-small' id="securityKey" type='password' size="small" onChange={(e) => { setsecurity_key(e.target.value) }} />
                        <span id='securityKeyError' className='text-danger' ></span>
                    </div>
                    <div className='m-3'>
                        <TextField label="New password" id="newPassword" size="small" type='password' onChange={(e) => { setPassword(e.target.value) }} />
                        <span id='newPasswordError' className='text-danger'></span>
                    </div>
                    <div className='m-3'>
                        <TextField label="Confirm password" id="confirmPassword" size="small" type='password' onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        <span id='confirmPasswordError' className='text-danger'></span>
                    </div>
                    <div className='ms-3'>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Show password" onClick={() => { showPasswordClick() }} />
                        </FormGroup>
                    </div>
                    <div className='text-center mb-1'>
                        <span id='emailsecurity_keyError' className="text-danger"></span>
                    </div>
                    <div className='text-center mt-2'>
                        Test details, <br />email id: userone@gmail.com<br />account security key: 12345
                    </div>
                    <div className='mb-3 mt-3 text-center'>
                        <Button variant="contained" onClick={() => changePasswordClick()}>change password</Button>
                    </div>
                    <div className='text-center mb-3'>
                        <h6 className='text-primary backToLogin' onClick={() => { navigate('/login') }}>back to login</h6>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default NewPassword