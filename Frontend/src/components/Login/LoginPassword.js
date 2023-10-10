import { TextField } from '@mui/material'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React from 'react'
import './loginPassword.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPassword() {
    let navigate = useNavigate()
    var count = 0

    const userFirstName = sessionStorage.getItem('userFirstName')
    const userLastName = sessionStorage.getItem('userLastName')
    const userEmail = sessionStorage.getItem('userEmail')

    async function nextClick() {
        const password = document.getElementById('password')
        if (password.value === '') {
            warnToastMessage('Please enter password')
        }
        else {
            try {
                let res = await axios.get(`http://localhost:10500/user/login?email=${userEmail}&password=${password.value}`)
                sessionStorage.setItem('userFirstName', res.data.userData.first_name)
                sessionStorage.setItem('userLastName', res.data.userData.last_name)
                sessionStorage.setItem('userEmail', res.data.userData.email)
                successToastMessage('Login successful', 3000)
                setTimeout(() => {
                    navigate('/new-home')
                }, 4000);
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage('Invalid password !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    function showPasswordClick() {
        const password = document.getElementById('password')
        count++
        if (count % 2 === 0) {
            password.setAttribute('type', 'password')
        }
        else {
            password.removeAttribute('type')
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
            <div className="loginPasswordMainCOntainer shadow rounded p-4" >
                <div>
                    <div className="text-center">
                        <h3 className='mb-1 heading' style={{ fontFamily: 'sans-serif' }}><span className='text-primary'>G</span><span className='text-danger'>o</span><span className='text-warning'>o</span><span className='text-primary'>g</span><span className='text-success'>l</span><span className='text-danger'>e</span></h3>
                        <p className="fs-4 mb-1" >Hi {userFirstName} {userLastName}</p>
                        <p className="fs-5">{userEmail}</p>
                    </div>
                    <div>
                        <p className="fs-6">To continue, first verify it's you</p>
                    </div>
                    <div className='text-center mt-4'>
                        <TextField type="password" style={{ width: '100%' }} id="password" label="Enter your password" variant="outlined" />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Show password" onClick={() => { showPasswordClick() }} />
                        </FormGroup>
                    </div>
                    <div className='text-center mt-3'>
                        Test password: userone@12345
                    </div>
                    <div className='d-flex justify-content-between' style={{ marginTop: '30px' }}>
                        <div >
                            <h6 className='text-primary createAccount' onClick={() => navigate('/forgot-password')}>Forgot password ?</h6>
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

export default LoginPassword