import React from 'react'
import './chooseAccount.css'
import { useNavigate } from 'react-router-dom';

function ChooseAccount() {
    let navigate = useNavigate()
    const foundUsers = JSON.parse(sessionStorage.getItem('foundUsers'))
    console.log(foundUsers);
    function accountSelect(e) {
        sessionStorage.setItem('userFirstName', e.first_name)
        sessionStorage.setItem('userLastName', e.last_name)
        sessionStorage.setItem('userEmail', e.email)
        navigate('/login/password')
        sessionStorage.removeItem("foundUsers");
    }
    return (
        <>
            <div className="container col-3 shadow rounded position-absolute top-50 start-50 translate-middle">
                <div className='m-4'>
                    <div className="text-center">
                        <h3 className='mb-1 heading' style={{ fontFamily: 'sans-serif' }}><span className='text-primary'>G</span><span className='text-danger'>o</span><span className='text-warning'>o</span><span className='text-primary'>g</span><span className='text-success'>l</span><span className='text-danger'>e</span></h3>
                        <p className="fs-5 mt-3">Choose an account</p>
                    </div>
                    {
                        foundUsers.length ? foundUsers.map((e, i) => {
                            return (<div key={i} className="ps-2 pt-1 pb-2 mt-2 rounded-3 d-flex justify-content-start chooseAccount" onClick={() => { accountSelect(e) }}>
                                <div className="fs-3 mt-2">
                                    <i className="fa-regular fa-circle-user"></i>
                                </div>
                                <div className="ms-3 mt-1">
                                    <span>{e.first_name} {e.last_name}</span><br />
                                    <span>{e.email}</span>
                                </div>
                            </div>)
                        }) : ''
                    }
                    <div className="ps-2 pt-1 pb-1 mt-2 rounded-3 d-flex justify-content-start chooseAccount">
                        <div className="fs-3">
                            <i className="fa-regular fa-circle-user"></i>
                        </div>
                        <div className="ms-3 mt-2" onClick={() => { navigate('/login') }}>
                            <p>Use another account</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChooseAccount