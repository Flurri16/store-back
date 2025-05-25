import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from '../models/User.js'
export const register = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        if (!email || !password) {
            return res.status(400).json({ message: "Email i hasło są wymagane." })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Hasło musi mieć co najmniej 6 znaków." })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Nieprawidłowy format email." })
        }
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email już jest używany." })

        const salt = bcryptjs.genSaltSync(8)
        const hash = bcryptjs.hashSync(password, salt)

        const newUser = new User({
            email,
            password: hash
        })

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "30d" })
        await newUser.save()

        return res.status(200).json({ message: "Rejestracja powiodła się.", newUser, token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error back register" })
    }
}
export const login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Użytkownik nie istnieje." })

        const passwordCorrect = bcryptjs.compareSync(password, user.password)
        if (!passwordCorrect) return res.status(400).json({ message: "Hasło lub email są nie poprawne." })

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })

        return res.status(200).json({ message: "Zostałeś zalogowany.", user, token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error back login" })
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) res.status(500).json({ message: "eror getme user" })
        return res.status(200).json({ message: "Tutaj", user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Getme user err" })
    }
}