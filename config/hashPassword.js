const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error",message:error.message});
    }
}

module.exports = hashPassword;
