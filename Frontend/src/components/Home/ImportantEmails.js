import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ImportantEmails() {
    let [openEmail, setOpenEmail] = useState(false)
    let [topIcons, setTopIcons] = useState(false)
    let [viewEmail, setViewEmail] = useState([])
    let [allEmails, setAllEmails] = useState([])
    let [open, setOpen] = useState(false)
    let [popupMessage, setPopupMessage] = useState('')
    let userEmail = sessionStorage.getItem('userEmail');


    useEffect(() => {
        getUsersEmails()
    }, [])

    async function getUsersEmails() {
        let res = await axios.get(`http://localhost:10500/email/all/user?emailTo=${userEmail}`)
        // console.log(res);
        setAllEmails(res.data)
    }

    let importantEmails = allEmails.length ? allEmails.filter((e) => e.important === 1) : ''

    async function markStarClick(email) {
        if (email.starred === 1) {
            infoToastMessage('Email already marked as a star', 3000)
            getUsersEmails()
        }
        else {
            let updatedEmailDetails = {
                starred: 1
            }
            try {
                await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
                infoToastMessage('Email marked as a star', 3000)
                getUsersEmails()
            }
            catch (error) {
                if (!error.response) {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    async function removeFromImportantClick(email) {
        let updatedEmailDetails = {
            important: 0
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
            infoToastMessage('Email removed from important', 3000)
            getUsersEmails()
            setOpenEmail(false)
            setTopIcons(false)
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    function deleteClick(email) {
        const trashEmailDetails = {
            trash: true,
            starred: false,
            important: false,
            read: null,
            spam: false
        }
        // axios.put(`https://gmail-clone-email-be.onrender.com/updateEmailInfo/${email._id}`, trashEmailDetails)
        //     .then((response) => {
        //         setPopupMessage('Email successfully deleted')
        //         handleClick()
        //         setOpenEmail(false)
        //         setTopIcons(false)
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
    }

    function emailClick(email) {
        setOpenEmail(true)
        setTopIcons(true)
        setViewEmail(email)
    }

    function backClick() {
        setOpenEmail(false)
        setTopIcons(false)
    }

    function reportSpamClick(viewEmail) {
        let spamEmail = {
            starred: false,
            important: false,
            read: null,
            spam: true
        }
        // axios.put(`https://gmail-clone-email-be.onrender.com/updateEmailInfo/${viewEmail._id}`, spamEmail)
        //     .then((response) => {
        //         setPopupMessage('Email marked as spam')
        //         handleClick()
        //         setOpenEmail(false)
        //         setTopIcons(false)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
    }

    const handleClick = () => {
        setOpen(true)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    };

    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    )

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
            <div style={{ marginTop: '30px' }}>
                <div className='row'>
                    <Sidebar />
                    <div className='col border border-dark rounded' style={{ minHeight: '600px', marginRight: '40px' }}>
                        <div className='mt-3 ms-1'>
                            {
                                topIcons ?
                                    <div>
                                        <i className="fs-5 fa-solid fa-arrow-left ms-3 icon" title='Back to Inbox' onClick={() => { backClick() }}></i>
                                        <i className="fs-5 fa-solid fa-circle-exclamation ms-5 icon delete" title='Report spam' onClick={() => { reportSpamClick(viewEmail) }}></i>
                                        <i className="fs-5 fa-regular fa-trash-can ms-5 icon delete" title='Delete' onClick={() => { deleteClick(viewEmail) }}></i>
                                    </div> :
                                    <i className="fs-5 fa-solid fa-arrow-rotate-right icon" title='Refresh'></i>
                            }
                        </div>
                        {
                            openEmail ?
                                <div>
                                    {
                                        <div className='mt-3'>
                                            <div className='ms-3'>
                                                <p className='fs-4'>{viewEmail.email_subject} <i className="fa-solid fa-tag fs-4 icon" title='Remove from Important' onClick={() => { removeFromImportantClick(viewEmail) }}></i></p>
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
                                        </div>
                                    }
                                </div> :
                                <div>
                                    <h5 className='mt-2'>Important Emails</h5>
                                    <div className="" style={{ maxHeight: "510px", overflowY: 'auto' }}>
                                        {
                                            importantEmails.length ? importantEmails.map((e, i) => {
                                                return (
                                                    <div key={i} className="row mt-3 mb-1 p-1 unreadMail rounded-3" style={{ marginLeft: '1px', marginRight: '1px' }} >
                                                        <div className='col-1'>
                                                            <i className="fs-5 fa-regular fa-star icon" title='Star' onClick={() => { markStarClick(e) }}></i>
                                                            <i className="fs-5 fa-solid fa-tag ms-4 icon" title='Remove from Important' onClick={() => { removeFromImportantClick(e) }}></i>
                                                        </div>
                                                        <div className='col icon' style={{ maxWidth: '100%', overflow: 'auto' }} onClick={() => { emailClick(e) }}  >
                                                            <span>{e.email_subject}</span> <span>{e.email_body}</span>
                                                        </div>
                                                        <div className='col-1 '>
                                                            <i className="fs-5 fa-regular fa-trash-can icon delete" title='Delete' onClick={() => { deleteClick(e) }}></i>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <h5 className='text-center text-danger'>No Important Emails</h5>
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={popupMessage} action={action} />
        </>
    )
}

export default ImportantEmails