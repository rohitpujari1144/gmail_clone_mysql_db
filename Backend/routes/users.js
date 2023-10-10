var express = require('express');
var router = express.Router();
const db = require('../config/sqlDb')
const { hashPassword, hashCompare, createToken, validate } = require('../common/auth')

// get all users
router.get('/all', async (req, res) => {
  try {
    const queryRes = await db.query('select * from users')
    if (queryRes[0].length) {
      res.status(200).send(queryRes[0])
    }
    else {
      res.status(404).send({ message: 'User data not found' })
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
});

// add user
router.post('/add', async (req, res) => {
  try {
    let hashedPassword = await hashPassword(req.body.password)
    // req.body.forEach(async (row, index) => {
    //   let hashedPassword = await hashPassword(req.body.password)
    //   sqlQuery += `('${row.name}', '${row.email}', '${hashedPassword}')`
    //   if (index < req.body.length - 1) {
    //     sqlQuery += ', '
    //   }
    // })
    let sqlQuery = `insert into users (first_name, last_name, email, password, security_key, gender) values ('${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', '${hashedPassword}', '${req.body.security_key}', '${req.body.gender}')`
    let queryRes = await db.query(sqlQuery)
    let insertedData = await db.query(`select * from users where id=${queryRes[0].insertId}`)
    res.status(201).send(insertedData[0])
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
})

// get one user
router.get('/get_one', async (req, res) => {
  try {
    const queryRes = await db.query(`select * from users where email='${req.query.email}'`)
    if (queryRes[0].length) {
      res.status(200).send(queryRes[0])
    }
    else {
      res.status(404).send({ message: 'User data not found' })
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
})

// user login
router.get('/login', async (req, res) => {
  try {
    if (req.query.password == '') {
      const queryRes = await db.query(`select * from users where email='${req.query.email}'`)
      if (queryRes[0].length) {
        res.status(200).send({ userData: queryRes[0][0] })
      }
      else {
        res.status(400).send({ message: 'No user found' })
      }
    }
    else {
      const queryRes = await db.query(`select * from users where email='${req.query.email}'`)
      if (queryRes[0].length) {
        let passwordCheck = await hashCompare(req.query.password, queryRes[0][0].password)
        if (passwordCheck) {
          let token = createToken({ name: queryRes[0][0].name, email: queryRes[0][0].email })
          res.status(200).send({ message: 'Login successful', userData: queryRes[0][0], tokenData: token })
        }
        else {
          res.status(400).send({ message: 'Invalid login credentials' })
        }
      }
      else {
        res.status(400).send({ message: 'Invalid login credentials' })
      }
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
})

// get user info for forgot email flow
router.get('/forgot_email', async (req, res) => {
  try {
    const queryRes = await db.query(`select * from users where first_name='${req.query.firstName}' and last_name='${req.query.lastName}' and security_key='${req.query.securityKey}'`)
  //  console.log(queryRes[0]);
    if (queryRes[0].length) {
      res.status(200).send(queryRes[0])
    }
    else {
      res.status(400).send({ message: 'User data not found' })
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
})

// update user password
router.put('/update_password', async (req, res) => {
  try {
    const queryRes = await db.query(`select * from users where email='${req.query.email}' and security_key='${req.query.security_key}'`)
    if (queryRes[0].length) {
      let hashedPassword = await hashPassword(req.body.password)
      await db.query(`update users set password='${hashedPassword}' where email='${req.query.email}' and security_key='${req.query.security_key}'`)
      res.send({ message: 'Password successfully updated' })
    }
    else {
      res.status(400).send({ message: 'User not found' })
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
})

// delete user
router.delete('/delete', async (req, res) => {
  try {
    const queryRes = await db.query(`select * from users where id='${req.query.id}'`)
    if (queryRes[0].length) {
      await db.query(`delete from users where id='${req.query.id}'`)
      res.send({ message: 'User successfully deleted' })
    }
    else {
      res.status(400).send({ message: 'User not found' })
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
})

module.exports = router;