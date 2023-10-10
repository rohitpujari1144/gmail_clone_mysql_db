import React, { useState } from 'react'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignupBasicInfo() {
    let navigate = useNavigate()
    let [day, setDay] = useState('')
    let [month, setMonth] = useState('Month')
    let [year, setYear] = useState('')
    let [gender, setGender] = useState('Gender')
    var userSignupData = JSON.parse(sessionStorage.getItem('userSignupData'))
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function verifyClick() {
        if ((month === 'Month' || !day || !year || gender === 'Gender') || (month === 'Month' && !day && !year && gender === 'Gender')) {
            warnToastMessage('Please enter all details', 3000)
        }
        else if (day < 1 || day > 31) {
            warnToastMessage('Invalid day', 3000)
        }
        else if (year < 1981 || year > 2023) {
            warnToastMessage('Invalid year', 3000)
        }
        else {
            userSignupData.gender = gender
            sessionStorage.setItem('userSignupData', JSON.stringify(userSignupData))
            navigate('/signup/privacy-terms')
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
    return (
        <>
            <div className="container col-7 shadow rounded position-absolute top-50 start-50 translate-middle">
                <div className='m-4'>
                    <div className='row'>
                        <div className="col-6">
                            <div>
                                <h3 className='mb-1 heading' style={{ fontFamily: 'sans-serif' }}><span className='text-primary'>G</span><span className='text-danger'>o</span><span className='text-warning'>o</span><span className='text-primary'>g</span><span className='text-success'>l</span><span className='text-danger'>e</span></h3>
                                <p className="fs-5">{userSignupData.first_name}, welcome to Google</p>
                                <p className="fs-5"><i className="fa-regular fa-circle-user"></i> {userSignupData.email}</p>
                            </div>
                            <div>
                                <p id='mobileError' className='text-danger'></p>
                                <p className='mt-1'>Google will use this number only for account security. Your number won’t be visible to others. You can choose later whether to use it for other purposes.</p>
                            </div>
                            <div className='row'>
                                <div className="col input-group mt-2">
                                    <select className="form-select" id="monthSelect" defaultValue={month} onChange={(e) => { setMonth(e.target.value) }}>
                                        <option>Month</option>
                                        {
                                            months.length ? months.map((e, i) => {
                                                return (
                                                    <option key={i} value={e}>{e}</option>
                                                )
                                            }) : ''
                                        }
                                    </select>
                                    <p className='mt-1'>Your birthday</p>
                                </div>
                                <div className="col mt-2">
                                    <TextField label="Day" id="day" size="small" defaultValue={day} onChange={(e) => { setDay(e.target.value) }} />
                                </div>
                                <div className="col mt-2">
                                    <TextField label="Year" id="year" size="small" defaultValue={year} onChange={(e) => { setYear(e.target.value) }} />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <select className="form-select" id="gender" defaultValue={gender} onChange={(e) => { setGender(e.target.value) }} >
                                    <option value="Gender">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className='d-flex justify-content-between mt-4' >
                                <div >
                                    <Button variant="text" onClick={() => { navigate('/signup') }}>Back</Button>
                                </div>
                                <div>
                                    <button className='btn btn-primary' onClick={() => { verifyClick() }}>Verify</button>
                                </div>
                            </div>
                        </div>
                        <div className="col position-absolute top-50 end-0 translate-middle-y text-center pb-5" style={{ width: '320px', height: '320px', marginRight: '60px' }}>
                            <img src="https://ssl.gstatic.com/accounts/signup/glif/personal.svg" alt="" style={{ width: '100%', height: '100%' }} />
                            <p className='m-0'>Your personal info is private & safe</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default SignupBasicInfo