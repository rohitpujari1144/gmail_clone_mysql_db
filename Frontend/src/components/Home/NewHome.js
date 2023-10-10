import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './home.css'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewHome() {
    let [open, setOpen] = useState(false)
    let [viewEmail, setViewEmail] = useState([])
    let [allEmails, setAllEmails] = useState([])
    let [topIcons, setTopIcons] = useState(false)
    let [openEmail, setOpenEmail] = useState(false)
    let [popMessage, setPopupMessage] = useState('')

    let userEmail = sessionStorage.getItem('userEmail')

    useEffect(() => {
        getUsersEmails()
    }, [])

    // users read emails
    let usersReadEmails = allEmails.length ? allEmails.filter((e) => {
        let isRead = e.is_read === 1
        let draft = e.draft === 0
        let trash = e.trash === 0
        let spam = e.spam === 0
        return isRead && draft && trash && spam
    }) : ''

    // users unread emails
    let usersUnreadEmails = allEmails.length ? allEmails.filter((e) => {
        let isUnread = e.is_read === 0
        let draft = e.draft === 0
        let trash = e.trash === 0
        let spam = e.spam === 0
        return isUnread && draft && trash && spam
    }) : ''

    async function getUsersEmails() {
        try {
            let res = await axios.get(`http://localhost:10500/email/all/user?emailTo=${userEmail}`)
            console.log(res);
            setAllEmails(res.data)
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    const handleClick = () => {
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    )

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

    async function markImportantClick(email) {
        if (email.important === 1) {
            infoToastMessage('Email already marked as a important', 3000)
            getUsersEmails()
        }
        else {
            let updatedEmailDetails = {
                important: 1
            }
            try {
                await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
                infoToastMessage('Email marked as a important', 3000)
                getUsersEmails()
            }
            catch (error) {
                if (!error.response) {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    async function deleteClick(email) {
        let updatedEmailDetails = {
            trash: 1
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
            infoToastMessage('Email moved to trash', 3000)
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

    async function markAsReadClick(email) {
        let updatedEmailDetails = {
            is_read: 1
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
            infoToastMessage('Email marked as read', 3000)
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

    async function markAsUnreadClick(email) {
        let updatedEmailDetails = {
            is_read: 0
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
            infoToastMessage('Email marked as unread', 3000)
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

    function emailClick(email) {
        setOpenEmail(true)
        setTopIcons(true)
        setViewEmail(email)
    }

    async function backClick(email) {
        let updatedEmailDetails = {
            is_read: 1
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
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

    async function spamClick(email) {
        let updatedEmailDetails = {
            spam: 1
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
            infoToastMessage('Email moved to spam', 3000)
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

    async function markUnread(email) {
        let updatedEmailDetails = {
            is_read: 0
        }
        try {
            await axios.put(`http://localhost:10500/email/update?emailId=${email.email_id}`, updatedEmailDetails)
            infoToastMessage('Email marked as a unread', 3000)
            setOpenEmail(false)
            setTopIcons(false)
            getUsersEmails()
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    function importantClick(email) {
        let emailInfo = allEmails.length ? allEmails.filter((e) => e._id === email._id) : ''
        if (emailInfo[0].important === true) {
            setPopupMessage('Email already marked as important')
            handleClick()
        }
        else {
            let updatedEmailDetails = {
                important: true
            }
            axios.put(`https://gmail-clone-email-be.onrender.com/updateEmailInfo/${email._id}`, updatedEmailDetails)
                .then((response) => {
                    setPopupMessage('Email marked as important')
                    handleClick()
                })
                .catch((error) => {
                    console.log(error);
                })
        }
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
            <Navbar />
            <div style={{ marginTop: '30px' }} >
                <div className='row'>
                    <Sidebar />
                    <div className='col border border-dark rounded' style={{ height: '600px', marginRight: '40px' }}>
                        <div className='mt-3 ms-1'>
                            {
                                topIcons ?
                                    <div>
                                        <i className="fs-5 fa-solid fa-arrow-left ms-3 icon" title='Back to Inbox' onClick={() => { backClick(viewEmail) }}></i>
                                        <i className="fs-5 fa-solid fa-circle-exclamation ms-5 icon delete" title='Report spam' onClick={() => { spamClick(viewEmail) }}></i>
                                        <i className="fs-5 fa-regular fa-trash-can ms-5 icon delete" title='Delete' onClick={() => { deleteClick(viewEmail) }}></i>
                                        <i className="fs-5 fa-regular fa-envelope ms-5 icon" title='Mark as unread' onClick={() => { markUnread(viewEmail) }}></i>
                                    </div> :
                                    <i className="fs-5 fa-solid fa-arrow-rotate-right icon" title='Refresh' onClick={() => getUsersEmails()}></i>
                            }
                        </div>
                        {
                            openEmail ?
                                <div>
                                    {
                                        <div className='mt-3'>
                                            <div className='ms-3'>
                                                <p className='fs-4'>{viewEmail.email_subject} <i className="fa-solid fa-tag fs-4 icon" title='Mark as important' onClick={() => { markImportantClick(viewEmail) }}></i></p>
                                            </div>
                                            <div className='ms-3 d-flex justify-content-start'>
                                                <div className='mt-2'>
                                                    <i className="fa-regular fa-circle-user fs-4" ></i>
                                                </div>
                                                <div className='ms-2'>
                                                    <p className='fs-5'>{viewEmail.email_from_name} {viewEmail.email_from}</p>
                                                </div>
                                            </div>
                                            <div className='col-10 ms-3 fs-6 mb-3' style={{ height: '400px', overflowY: 'auto' }}>{viewEmail.email_body}
                                                {/* <div className='border' style={{width:'150px', height:'150px'}}>
                                                    <img src={viewEmail.imageInput} alt=""  style={{width:'100%', height:'100%'}}/>
                                                </div> */}
                                            </div>
                                        </div>
                                    }
                                </div> :
                                <div>
                                    {/* inbox emails start */}
                                    <div className='mt-3' style={{ maxWidth: '1250px' }}>
                                        <div>
                                            <h5>Unread</h5>
                                        </div>
                                        <div className=' rounded-3' style={{ height: '180px', overflow: 'auto' }}>
                                            {
                                                usersUnreadEmails.length ? usersUnreadEmails.map((e, i) => {
                                                    return (
                                                        <div key={i} className="row mb-1 p-1 unreadMail rounded-3" style={{ marginLeft: '1px', marginRight: '1px' }} >
                                                            <div className='col-1'>
                                                                <i className="fs-5 fa-regular fa-star icon" title='Star' onClick={() => { markStarClick(e) }}></i>
                                                                <i className="fs-5 fa-solid fa-tag ms-4 icon" title='Mark as Important' onClick={() => { markImportantClick(e) }}></i>
                                                            </div>
                                                            <div className='col icon' style={{ maxWidth: '90%', overflow: 'hidden' }} onClick={() => { emailClick(e) }} >
                                                                <span>{e.email_subject}</span> <span>{e.email_body}</span>
                                                            </div>
                                                            <div className='col-1 '>
                                                                <i className="fs-5 fa-regular fa-trash-can icon delete" title='Delete' onClick={() => { deleteClick(e) }}></i>
                                                                <i className="fs-5 ms-4 fa-regular fa-envelope-open icon" title='Mark as read' onClick={() => { markAsReadClick(e) }}></i>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : <h5 className='text-center text-danger'>No Inbox Emails</h5>
                                            }

                                        </div>
                                    </div>
                                    {/* inbox emails end */}

                                    {/* read emails start */}
                                    <div className='mt-3'>
                                        <div>
                                            <h5>Everything else</h5>
                                        </div>
                                        <div className=' rounded-3' style={{ height: '270px', overflow: 'auto' }}>
                                            {
                                                usersReadEmails.length ? usersReadEmails.map((e, i) => {
                                                    return (
                                                        <div key={i} className="row mb-1 p-1 unreadMail rounded-3" style={{ marginLeft: '1px', marginRight: '1px' }}>
                                                            <div className='col-1'>
                                                                <i className="fs-5 fa-regular fa-star icon" title='Star' onClick={() => { markStarClick(e) }}></i>
                                                                <i className="fs-5 fa-solid fa-tag ms-4 icon" title='Mark as Important' onClick={() => { markImportantClick(e) }}></i>
                                                            </div>
                                                            <div className='col icon' style={{ maxWidth: '100%', overflow: 'auto' }} onClick={() => { emailClick(e) }}>
                                                                <span>{e.email_subject}</span> <span>{e.email_body}</span>
                                                            </div>
                                                            <div className='col-1 '>
                                                                <i className="fs-5 fa-regular fa-trash-can icon delete" title='Delete' onClick={() => { deleteClick(e) }}></i>
                                                                <i className="fs-5 ms-4 fa-regular fa-envelope icon" title='Mark as unread' onClick={() => { markAsUnreadClick(e) }}></i>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : <h5 className='text-center text-danger'>No Read Emails</h5>
                                            }

                                        </div>
                                    </div>
                                    {/* read emails end */}
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
    )
}

export default NewHome