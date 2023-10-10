import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SentEmails() {
    let [sentEmails, setSentEmails] = useState([]);
    let [openEmail, setOpenEmail] = useState(false);
    let [topIcons, setTopIcons] = useState(false);
    let [viewEmail, setViewEmail] = useState([]);
    let [open, setOpen] = useState(false)
    let [popMessage, setPopupMessage] = useState('')
    const userEmail = sessionStorage.getItem("userEmail");

    useEffect(() => {
        getUsersSentEmails()
    }, [])

    async function getUsersSentEmails() {
        try {
            let res = await axios.get(`http://localhost:10500/email/sent/user?emailFrom=${userEmail}`)
            if (res.data.length) {
                setSentEmails(res.data)
            }
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    function emailClick(email) {
        setOpenEmail(true)
        setTopIcons(true)
        setViewEmail(email)
    }

    const backClick = () => {
        setOpenEmail(false)
        setTopIcons(false)
    }

    async function deleteSentEmail(viewEmail) {
        let updatedEmailDetails = {
            sent: 0
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${viewEmail.email_id}`, updatedEmailDetails)
            infoToastMessage('Sent email deleted', 3000)
            getUsersSentEmails()
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    function infoToastMessage(message, time) {
        toast.info(message, {
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
            <Navbar />
            <div style={{ marginTop: "30px" }}>
                <div className="row">
                    <Sidebar />
                    <div className="col border border-dark rounded" style={{ minHeight: "600px", marginRight: "40px" }} >
                        <div className='mt-3 ms-1'>
                            {
                                topIcons ?
                                    <div>
                                        <i className="fs-5 fa-solid fa-arrow-left ms-3 icon" title='Back to Inbox' onClick={backClick}></i>
                                        <i className="fs-5 fa-regular fa-trash-can ms-5 icon delete" title='Delete' onClick={() => deleteSentEmail(viewEmail)}></i>
                                    </div> :
                                    <i className="fs-5 fa-solid fa-arrow-rotate-right icon" title='Refresh' onClick={() => { getUsersSentEmails() }}></i>
                            }
                        </div>
                        {
                            openEmail ?
                                <div className='mt-3'>
                                    <div className='ms-3'>
                                        <p className='fs-4'>{viewEmail.email_subject}</p>
                                    </div>
                                    <div className='ms-3 d-flex justify-content-start'>
                                        <div className='mt-2'>
                                            <i className="fa-regular fa-circle-user fs-4" ></i>
                                        </div>
                                        <div className='ms-2'>
                                            <p className='fs-5'>{viewEmail.email_from_name} {viewEmail.email_from}</p>
                                        </div>
                                    </div>
                                    <div className='col-10 ms-3 fs-6 mb-3' style={{ height: '400px', overflowY: 'auto' }}>{viewEmail.email_body}</div>
                                </div> :
                                <div>
                                    <h5 className="mt-2">Sent Emails</h5>
                                    <div className="" style={{ maxHeight: "510px", overflowY: 'auto' }}>
                                        {
                                            sentEmails.length ? sentEmails.map((e, i) => {
                                                return (
                                                    <div key={i} className="row mt-3 mb-1 p-1 unreadMail rounded-3" style={{ marginLeft: "1px", marginRight: "1px" }}>
                                                        {/* <div className="col-1">
                                                            <i className="fs-5 fa-regular fa-star icon" title="Star" onClick={() => { starClick(e) }}></i>
                                                            <i className="fs-5 fa-solid fa-tag ms-4 icon" title="Mark as Important" onClick={() => { importantClick(e) }}></i>
                                                        </div> */}
                                                        <div className="col icon" style={{ maxWidth: "100%", overflow: "hidden" }} onClick={() => emailClick(e)}>
                                                            <span>{e.email_subject}</span> <span>{e.email_body}</span>
                                                        </div>
                                                        <div className="col-1 ">
                                                            <i className="fs-5 fa-regular fa-trash-can icon delete" title="Delete" onClick={() => deleteSentEmail(e)}></i>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <h5 className='text-center text-danger'>No Sent Emails</h5>
                                        }
                                    </div>
                                </div>
                        }

                    </div>
                </div>
            </div>
            <ToastContainer />
            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={popMessage} action={action} /> : ''
            }
        </>
    );
}

export default SentEmails;
