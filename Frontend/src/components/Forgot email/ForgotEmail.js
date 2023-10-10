import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './forgotEmail.css'

function ForgotEmail() {
    let navigate = useNavigate()
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [security_key, setsecurity_key] = useState('')


    async function nextClick() {
        if ((!firstName || !lastName || !security_key) || (!firstName && !lastName && !security_key)) {
            warnToastMessage('Please enter details')
        }
        else {
            try {
                let res = await axios.get(`http://localhost:10500/user/forgot_email?firstName=${firstName}&lastName=${lastName}&securityKey=${security_key}`)
                sessionStorage.setItem('foundUsers', JSON.stringify(res.data))
                navigate('/forgot-email/choose-account')
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage("Invalid details !", 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !')
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
            <div className="forgotEmailMainContainer shadow rounded">
                <div className='m-4'>
                    <div className="text-center">
                        <h3 className='mb-1 heading' style={{ fontFamily: 'sans-serif' }}><span className='text-primary'>G</span><span className='text-danger'>o</span><span className='text-warning'>o</span><span className='text-primary'>g</span><span className='text-success'>l</span><span className='text-danger'>e</span></h3>
                        <p className="fs-5 mb-1">Find your email</p>
                        <p className="fs-6">Enter your account details</p>
                    </div>
                    <div className='text-center mt-4'>
                        <TextField size="small" style={{ width: '100%' }} label="First name" defaultValue={firstName} variant="outlined" onChange={(e) => setFirstName(e.target.value)} />
                        <TextField size="small" className='mt-3' style={{ width: '100%' }} defaultValue={lastName} label="Last name" variant="outlined" onChange={(e) => setLastName(e.target.value)} />
                        <TextField size="small" className='mt-3' style={{ width: '100%' }} defaultValue={security_key} label="Account security code" variant="outlined" onChange={(e) => setsecurity_key(e.target.value)} />
                    </div>
                    <div className="text-center mt-3">
                        Test account security key: 12345
                    </div>
                    <div className='mt-3 d-flex justify-content-between' >
                        <div >
                            <Button variant="text" onClick={() => { navigate('/login') }}>Back to login</Button>
                        </div>
                        <div>
                            <button className='btn btn-primary' onClick={() => { nextClick() }}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default ForgotEmail