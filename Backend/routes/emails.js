var express = require('express');
var router = express.Router();
const db = require('../config/sqlDb')
// const { hashPassword, hashCompare, createToken, validate } = require('../common/auth')

// get all emails
router.get('/all', async (req, res) => {
    try {
        const queryRes = await db.query('select * from emails')
        if (queryRes[0].length) {
            res.status(200).send(queryRes[0])
        }
        else {
            res.status(404).send({ message: 'Email data not found' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// get all emails of a user
router.get('/all/user', async (req, res) => {
    try {
        const queryRes = await db.query(`select * from emails where email_to='${req.query.emailTo}'`)
        if (queryRes[0].length) {
            res.status(200).send(queryRes[0])
        }
        else {
            res.status(404).send({ message: 'User email data not found' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// get all draft emails of a user
router.get('/draft/user', async (req, res) => {
    try {
        const queryRes = await db.query(`select * from emails where email_from='${req.query.emailFrom}' and draft = 1 and spam = 0 and trash = 0`)
        if (queryRes[0].length) {
            res.status(200).send(queryRes[0])
        }
        else {
            res.status(404).send({ message: 'User draft email data not found' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// get all sent emails of a user
router.get('/sent/user', async (req, res) => {
    try {
        const queryRes = await db.query(`select * from emails where email_from='${req.query.emailFrom}' and sent = 1 and spam = 0 and trash = 0`)
        if (queryRes[0].length) {
            res.status(200).send(queryRes[0])
        }
        else {
            res.status(404).send({ message: 'User draft email data not found' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// sending new email
router.post('/new', async (req, res) => {
    try {
        let { emailTo, emailFrom, emailFromName, emailSub, emailBody, sent, draft } = req.body
        let query = ''
        if (draft == undefined) {
            query = `insert into emails (email_to, email_from, email_from_name, email_subject, email_body, sent) values ('${emailTo}', '${emailFrom}', '${emailFromName}', '${emailSub}', '${emailBody}', '${sent}')`
            let queryRes = await db.query(query)
            let insertedData = await db.query(`select * from emails where email_id='${queryRes[0].insertId}'`)
            res.status(201).send({ message: 'New email sent', emailData: insertedData[0][0] });
        }
        else if (sent == undefined) {
            query = `insert into emails (email_to, email_from, email_from_name, email_subject, email_body, draft) values ('${emailTo}', '${emailFrom}', '${emailFromName}', '${emailSub}', '${emailBody}', '${draft}')`
            let queryRes = await db.query(query)
            let insertedData = await db.query(`select * from emails where email_id='${queryRes[0].insertId}'`)
            res.status(201).send({ message: 'New email sent', emailData: insertedData[0][0] });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// updating email status
router.put('/update', async (req, res) => {
    try {
        let query = ''
        Object.keys(req.body)[0] === 'sent' ? query = `update emails set sent='${req.body.sent}' where email_id=${req.query.emailId}` : ''
        Object.keys(req.body)[0] === 'important' ? query = `update emails set important='${req.body.important}' where email_id=${req.query.emailId}` : ''
        Object.keys(req.body)[0] === 'starred' ? query = `update emails set starred='${req.body.starred}' where email_id=${req.query.emailId}` : ''
        Object.keys(req.body)[0] === 'spam' ? query = `update emails set spam='${req.body.spam}', important=0, sent=0, starred=0, trash=0 where email_id=${req.query.emailId}` : ''
        Object.keys(req.body)[0] === 'is_read' ? query = `update emails set is_read='${req.body.is_read}' where email_id=${req.query.emailId}` : ''
        Object.keys(req.body)[0] === 'trash' ? query = `update emails set trash='${req.body.trash}', sent=0, important=0, starred=0, spam=0, draft=0 where email_id=${req.query.emailId}` : ''
        let queryRes = await db.query(query)
        res.status(200).send(queryRes)
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// get all trash emails of a user
router.get('/all_trash_emails', async (req, res) => {
    try {
        const queryRes = await db.query(`select * from emails where (email_from='${req.query.userEmail}' or email_to='${req.query.userEmail}') and trash=1;`)
        if (queryRes[0].length) {
            res.status(200).send(queryRes[0])
        }
        else {
            res.status(404).send({ message: 'Trash email data not found' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// get all trash emails of a user
router.get('/all_spam_emails', async (req, res) => {
    try {
        const queryRes = await db.query(`select * from emails where (email_from='${req.query.userEmail}' or email_to='${req.query.userEmail}') and spam=1;`)
        if (queryRes[0].length) {
            res.status(200).send(queryRes[0])
        }
        else {
            res.status(404).send({ message: 'Trash email data not found' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// delete all spam emails
router.delete('/delete_all_spam', async (req, res) => {
    try {
        let queryRes = await db.query(`delete from emails where spam=1 and email_to='${req.query.emailTo}'`)
        res.status(200).send({ message: 'Spam emails successfully deleted' })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// delete all trash emails of a user
router.delete('/delete_all_trash', async (req, res) => {
    try {
        await db.query(`delete from emails where (email_from='${req.query.userEmail}' or email_to='${req.query.userEmail}') and trash=1;`)
        res.status(200).send({ message: 'Trash emails successfully deleted' })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

// delete an email
router.delete('/delete', async (req, res) => {
    try {
        await db.query(`delete from emails where email_id=${req.query.emailId}`)
        res.status(200).send({ message: 'email successfully deleted' })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
});

module.exports = router;











































