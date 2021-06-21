const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload,secret,{expiresIn:24})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({message: "validation error",errors},)
            }
            const { username, password } = req.body
            const candidate = await User.findOne({username});
            if (candidate) {
                return res.status(400).send({message: "Not unique username"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({username,password: hashPassword, roles: [userRole.value]});
            await user.save();
            res.send({message: "User was saved"});
        } catch (e) {
            console.log(e);
            res.status(400).send({message: 'registration error'})
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({username});
            if (!user) {
                return res.status(400).send({message: `username with name ${username} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).send({message: "wrong password"});
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.send({"token":token})

        } catch (e) {
            console.log(e);
            res.status(400).send({message: 'login error'})
        }
    }

    async getUsers(req, res) {
        try {
            // const userRole = new Role();
            // const adminRole = new Role({ value: 'ADMIN' });
            // await userRole.save();
            // await adminRole.save();
            res.send({ message: 'ok' })
        } catch (e) {
            console.log(e);
            res.status(400).send({message: 'some error'})
        }
    }
}

module.exports = new authController();