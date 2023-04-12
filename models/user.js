const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

<<<<<<< HEAD
module.exports = mongoose.model('User', userSchema);
=======
module.exports = mongoose.model('User', userSchema);
>>>>>>> d7941dba4f2dc3da5458baf063c5b279f37889f0
