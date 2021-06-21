const {Schema, model, set} = require('mongoose')
set('useCreateIndex', true);
const Role = new Schema({
    value: {type: String, unique: true, default: 'USER'},
})

module.exports = model('Role',Role)