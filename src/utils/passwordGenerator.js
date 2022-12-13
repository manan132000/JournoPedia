const generatePassword = (length) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = length;
    let password = "";

    for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }

    return password;
}

module.exports = {generatePassword};