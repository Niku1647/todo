const express = require('express')
const router  = express.Router();
const jwt = require ('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { check, validationResult} = require('express-validator')
const UserSchema = require ('../schemas/User')
const config = require('config')





router.post(
    '/register',
    [

        check('email', 'E-mail is required').isEmail(),
        check('password','Password is required').not().isEmpty()

    ],

    async (req,res) =>{
        try {
            let {email , password} = req.body
            let user = await UserSchema.findOne({ email })
            const errors= validationResult(req)
            if(!errors.isEmpty()){
                res.status(401).json({ errors : errors.array()})
            }
            if(user){
                res.status(401).json({ msg:"The E-mail id is already there ..."})
            }

            const salt = await bcryptjs.genSalt(10)
            password = await bcryptjs.hash(password,salt)

            user = new UserSchema({
                email,
                password
            })

            await user.save()

            const payload ={
                user :{
                    id:user.id
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                (err,token)=>{
                    if(err) throw err;
                    res.json({ token })
                }
            )

            
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({msg :"Server Error....."})
            
        }
    }
)
router.post(
    '/login',
    [
        check('email','Valid Email').isEmail(),
        check('password','enter password').not().isEmpty()
    ],
    async (req,res)=>{
        try {
            let {email , password} = req.body
            const errors = validationResult(req);
            let user = await UserSchema.findOne({ email })

            if(!errors.isEmpty()){
                return res.status(401).json({ error: error.array() })
            }

            if(!user){
                return res.status(401).json({ msg:"Please register"})
            }
            let isPasswordMatch = await bcryptjs.compare( password, user.password)

            if(isPasswordMatch){

                const payload ={
                    user :{
                        id:user.id
                    }
                }
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    (err,token)=>{
                        if(err) throw err;
                        res.json({ token })
                    }
                )


            }else res.status(401).json({ msg :"password not match"})
            
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({msg :"Server Error....."})
            
        }
    }
)

module.exports = router;