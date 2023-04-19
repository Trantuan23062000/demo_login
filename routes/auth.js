const router = require("express").Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../utils/jwt.js')
const validinfo = require('../middleware/validinfo.js')
const auth = require('../middleware/auth.js')
const sendmail = require('../sendmail/email.js')
const { query } = require("express")





router.post("/register",validinfo,async(req,res)=>{
    try {
        const {name,email,password,password_confirm} = req.body

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[
            email
        ])
        if(user.rows.length !==0){
         res.status(401).send("Email da ton tai !")
        }else if(password !==password_confirm)
        {
            return res.status(401).send("Xac nhan mat khau khong dung !")
        }else{
            password === password_confirm
        }

      
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password,salt)

        const newUser = await pool.query("INSERT INTO users(user_name,user_email,user_password,status)VALUES($1,$2,$3,1)RETURNING *",[
            name,email,bcryptPassword
        ])

        const token  = jwtGenerator(newUser.rows[0].user_id)
        res.json(newUser.rows[0])

    } catch (err) {

        console.error(err.message)
        res.status(500).send("Server error!")
        
    }
})

    router.post("/login",validinfo,async(req, res)=>{
        try {
            const {email,password} = req.body
            

            const user = await pool.query("SELECT*FROM users WHERE user_email = $1",[
                email
            ])
            if(user.rows.length === 0){
                return res.status(401).json("Email khong hop le !")
            }
            const validPassword = await bcrypt.compare(password,user.rows[0].user_password)

            if(!validPassword){
                return res.status(401).json("Password khong dung !")
            }
            const token = jwtGenerator(user.rows[0].user_id)
            return res.json({token})


            
        } catch (err) {
            console.error(err.message)
        }
    })

    router.get("/check-token",auth,async(req,res)=>{
        try {
          res.json(true)
        } catch (err) {
            console.error(err.message)
            res.status(500).send("Sever Error")
        }
    })

    router.post("/sent_mail",async(req,res)=>{
        const {email} = req.body
       
        try {
            
            const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[
                email
            ])
            if(user.rows.length !== 0){
                res.status(200).send("Email da ton tai tren he thong ban cos the check email de doi mat khau !")    
            }else{
                res.status(400).send("Email khong ton tai !")
            }
            const token_reset = jwtGenerator((user.rows[0].user_email),{expiresIn:'3m'})

            pool.query("update users set token = ($1) where user_email=($2)",[
                token_reset,email
            ])
            

            console.log(token_reset.rows[0]);

            sendmail(email,'<form method = "POST" action="http://localhost:3456/auth/reset-password"> <label for="fname">Password:</label><br> <input type="text" id="newPassword" name="newPassword"><br><label for="lname">Password_confirm:</label><br> <input type="text" id="passwordnew_confirm" name="passwordnew_confirm"><br><br> <input type="submit" value="Submit"> <input type="hidden" name="token" value="'+token_reset+'"></form> ')
            
        } catch (err) {
            console.error(err.message)
        }
    }) 

    router.post("/reset-password", async(req,res)=>{
        const {token,newPassword,passwordnew_confirm} = req.body

        
            const check_token = await pool.query("SELECT user_id FROM users WHERE token = $1 and status = 1",[
                token
            ])

            if(check_token.rows[0].user_id !== null){
                console.log(check_token.rows[0].user_id);
                if(newPassword !== passwordnew_confirm){
                    res.status(400).send("Xac nhan mat khau khong dung !")
                }else{
                    newPassword === passwordnew_confirm
                }
                const saltRound1 = 10
                const salt = await bcrypt.genSalt(saltRound1)
                const new_Password = await bcrypt.hash(newPassword,salt)
                 pool.query("UPDATE users set user_password = $1 , token = NULL where user_id = $2 ",[
                    new_Password,check_token.rows[0].user_id
                ],(error,result)=>{
                    if (error) {
                        console.log(error);
                    }
                    console.log(result.rows[0]);
                    res.status(200).send("Thanh cong !")

                })
                
            }
       

    })

 
module.exports = router