const bcrypt = require('bcrypt');

const decryptPassword = async (password,hashedPasswordFromDatabase) => {
    try {
        const decryptedPassword = await bcrypt.compare(password, hashedPasswordFromDatabase);

        return decryptedPassword;
        
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error",message:error.message});
    }
}

module.exports = decryptPassword;