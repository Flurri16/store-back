import jwt from 'jsonwebtoken'
export const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token)return res.status(401).json({message: "Zaloguj się."})
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        if(decoded) {
            req.userId = decoded._id
            req.isAdmin = decoded._email
            // if(decoded._email !== 'admin@gmail.com') {
            //     console.log("Nie admin")
            //     return res.status(401).json({message: "Dostęp tylko dla admina."})
            // }
        } else {
        }
        next()
    } catch(err) {
        console.log(err)
        return res.status(401).json({message: "TINC"})
    }
}