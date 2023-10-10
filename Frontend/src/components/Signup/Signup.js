import React, { useState } from 'react'
import { TextField } from '@mui/material'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    var count = 0
    let navigate = useNavigate()
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')
    let [securityCode, setSecurityCode] = useState('')

    function showPasswordClick() {
        const password = document.getElementById('password')
        const cPassword = document.getElementById('cPassword')
        const securityCode = document.getElementById('securityCode')
        count++
        if (count % 2 === 0) {
            password.setAttribute('type', 'password')
            cPassword.setAttribute('type', 'password')
            securityCode.setAttribute('type', 'password')
        }
        else {
            password.removeAttribute('type')
            cPassword.removeAttribute('type')
            securityCode.removeAttribute('type')
        }
    }

    async function nextClick() {
        let userSignupData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            security_key: securityCode
        }
        let userPassword = ''
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
        if ((!firstName || !lastName || !email || !password || !confirmPassword || !securityCode) || (!firstName && !lastName && !email && !password && !confirmPassword && !securityCode)) {
            warnToastMessage('Please enter all details', 3000)
        }
        else {
            if (!email.match(emailPattern)) {
                warnToastMessage('Invalid email address', 3000)
            }
            else if (password !== confirmPassword || confirmPassword !== password) {
                warnToastMessage('Password and confirm password should be same', 3000)
            }
            else {
                try {
                    await axios.get(`http://localhost:10500/user/login?email=${email}&password=${userPassword}`)
                    errorToastMessage('Email address already exist !', 3000)
                }
                catch (error) {
                    if (error.response) {
                        if (error.response.status === 400) {
                            sessionStorage.setItem('userSignupData', JSON.stringify(userSignupData))
                            navigate('/signup/basic-information')
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
    return (
        <>
            <div className="container col-7 shadow rounded position-absolute top-50 start-50 translate-middle">
                <div className='m-4'>
                    <div className='row'>
                        <div className="col-6">
                            <div>
                                <h3 className='mb-1 heading' style={{ fontFamily: 'sans-serif' }}><span className='text-primary'>G</span><span className='text-danger'>o</span><span className='text-warning'>o</span><span className='text-primary'>g</span><span className='text-success'>l</span><span className='text-danger'>e</span></h3>
                                <p className="fs-4 mb-1">Create your Google Account</p>
                                <p className="fs-6">to continue to Gmail</p>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <TextField label="First name" id="fName" size="small" defaultValue={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                                </div>
                                <div className="col">
                                    <TextField label="Last name" id="lName" size="small" defaultValue={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                                </div>
                            </div>
                            <div className='mb-3'>
                                <TextField style={{ width: '100%' }} label="Email Id" id="username" size="small" defaultValue={email} onChange={(e) => { setEmail(e.target.value) }} />
                                <p>You can use letters, numbers & periods</p>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <TextField label="Password" id="password" size="small" type='password' defaultValue={password} onChange={(e) => { setPassword(e.target.value) }} />

                                </div>
                                <div className="col">
                                    <TextField label="Confirm password" id="cPassword" size="small" type='password' defaultValue={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />

                                </div>
                                <p className='mt-1'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                            </div>
                            <div className='row ms-1 me-1'>
                                <TextField label="Account security code" id="securityCode" size="small" type='password' defaultValue={securityCode} onChange={(e) => { setSecurityCode(e.target.value) }} />
                            </div>
                            <div className='mt-2'>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox />} label="Show password & security code" onClick={() => showPasswordClick()} />
                                </FormGroup>
                            </div>
                            <div className='d-flex mt-3 justify-content-between' >
                                <div >
                                    <Button variant="text" onClick={() => navigate('/')}>Sign in instead</Button>
                                </div>
                                <div>
                                    <button className='btn btn-primary' onClick={() => { nextClick() }}>Next</button>
                                </div>
                            </div>
                        </div>
                        <div className="col position-absolute top-50 end-0 translate-middle-y text-center pb-5" style={{ width: '320px', height: '320px', marginRight: '80px' }}>
                            <img src="https://ssl.gstatic.com/accounts/signup/glif/account.svg" alt="" style={{ width: '100%', height: '100%' }} />
                            <p className='m-0'>One account. All of Google</p>
                            <p className='m-0'>working for you.</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Signup