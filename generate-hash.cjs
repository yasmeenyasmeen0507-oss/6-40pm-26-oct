const bcrypt = require('bcryptjs');

const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Password Hash:', hash);
    console.log('\nUse this in your SQL:');
    console.log("'" + hash + "'");  // Fixed: concatenation instead of template literal
  }
});