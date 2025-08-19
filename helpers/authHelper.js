const bcrypt = require("bcryptjs")

// hashed the password using bcrypt.hash
const hashPassword = async (password) =>{
    try {
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password,saltRound);
        return hashedPassword;
    } catch (error) {
        console.log("error")
    }
};
// compare the user password and hashedPassword using bcrypt.compare
const comparePassword = async(password,hashedPassword) =>{
    return bcrypt.compare(password,hashedPassword);
} 
module.exports = {
    hashPassword,
    comparePassword
  };