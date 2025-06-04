const jwt = require('jsonwebtoken');
exports.login = async function (req,res) {
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
    if(email == "test" && password == "test"){
        const payload = {email, password}
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1Y' });
        return res.json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
}
module.exports = exports;