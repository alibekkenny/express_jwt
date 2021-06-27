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
    return jwt.sign(payload, secret, { expiresIn: "1h" })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ message: "validation error", errors },)
            }
            const { username, password } = req.body
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).send({ message: "Not unique username" })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            await user.save();
            res.send({ message: "User was saved" });
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: 'registration error' })
        }
    }

    async registrationAdmin(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ message: "validation error", errors },)
            }
            const { username, password } = req.body
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).send({ message: "Not unique username" })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "ADMIN" });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            await user.save();
            res.send({ message: "User was saved" });
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: 'registration error' })
        }
    }

    async createRole(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ message: "validation error", errors },)
            }
            const { value: newValue } = req.body
            const candidate = await Role.findOne({ value: newValue });
            if (candidate) {
                return res.status(400).send({ message: "Not unique role" })
            }
            const role = new Role({ value: newValue });
            await role.save();
            res.send({ message: "Role was saved" });
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: 'role error' })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).send({ message: `username with name ${username} not found` })
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).send({ message: "wrong password" });
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.send({ "token": token })

        } catch (e) {
            console.log(e);
            res.status(400).send({ message: 'login error' })
        }
    }

    async getSecret(req, res) {
        try {
            res.send({ msg: "secret 42" })
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: 'some error' })
        }
    }
}

module.exports = new authController();