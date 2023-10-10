import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SpamEmails() {
    let [spamEmails, setSpamEmails] = useState([]);
    let [open, setOpen] = useState(false)
    let [popupMessage, setPopupMessage] = useState('')
    const userEmail = sessionStorage.getItem('userEmail')

    useEffect(() => {
        getAllSpamEmails()
    }, [])

    async function getAllSpamEmails() {
        try {
            let res = await axios.get(`http://localhost:10500/email/all_spam_emails?userEmail=${userEmail}`)
            if (res.data.length) {
                setSpamEmails(res.data)
            }
            else {
                setSpamEmails([])
            }
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
            else {
                if (error.response.status === 404) {

                }
            }
        }
    }

    const handleClick = () => {
        setOpen(true);
    };
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

    async function emptySpamNow() {
        if (spamEmails.length) {
            try {
                await axios.delete(`http://localhost:10500/email/delete_all_spam?userEmail=${userEmail}`)
                infoToastMessage('All spam emails deleted', 3000)
                getAllSpamEmails()
            }
            catch (error) {
                if (!error.response) {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
        else {
            infoToastMessage('No spam emails found', 3000)
        }
    }

    async function deleteSpamClick(email) {
        try {
            await axios.delete(`http://localhost:10500/email/delete?emailId=${email.email_id}`)
            getAllSpamEmails()
            infoToastMessage('Spam email deleted', 3000)
        }
        catch (error) {
            if (!error.response) {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
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
                        <div className='mt-2'>
                            <i className="fs-5 fa-solid fa-arrow-rotate-right icon" title='Refresh'></i>
                        </div>
                        <div className='d-flex flex-direction-row'>
                            <div>
                                <h5 className='mt-2'>Spam Emails</h5>
                            </div>
                            <div className='ms-5 icon'>
                                <button className='btn btn-sm border-danger text-danger mt-1' onClick={() => { emptySpamNow() }}>Empty Spam Now</button>
                            </div>
                        </div>
                        <div className="" style={{ maxHeight: "510px", overflowY: 'auto' }}>
                            {
                                spamEmails.length ? spamEmails.map((e, i) => {
                                    return (
                                        <div key={i} className="row mt-3 mb-1 p-1 unreadMail rounded-3" style={{ marginLeft: '1px', marginRight: '1px' }} >
                                            <div className='col-1'>
                                            </div>
                                            <div className='col icon' style={{ maxWidth: '100%', overflow: 'auto' }}  >
                                                <span>{e.email_subject}</span> <span>{e.email_body}</span>
                                            </div>
                                            <div className='col-1'>
                                                <i className="fs-5 fa-regular fa-trash-can icon delete" title='Delete' onClick={() => { deleteSpamClick(e) }}></i>
                                            </div>
                                        </div>
                                    )
                                }) : <h5 className='text-center text-danger'>No Spam Emails</h5>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={popupMessage} action={action} />
        </>
    )
}

export default SpamEmails