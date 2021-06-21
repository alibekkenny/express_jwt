const Router = require('express');
const controller = require('./authController');
const {check} = require('express-validator');
const roleMiddleware = require('./middleware/roleMiddleware')
const router = new Router();

router.post('/registration', [
    check("username","error: empty username").notEmpty(),
    check('password',"error: password must be between 6-12").isLength({min:6, max: 12})
], controller.registration);
router.post('/login', controller.login);
router.get('/secret', roleMiddleware(["ADMIN"]), controller.getSecret)

module.exports = router