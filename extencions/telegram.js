import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const TOKEN_TG = process.env.TOKEN_TG
const CHAT_ID = process.env.CHAT_ID
export const tgsent = async (req, res) => {
    try {
        const {message} = req.body
        await axios.post(`https://api.telegram.org/bot${TOKEN_TG}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML',
        })
        return res.status(200).json({ success: true})
    } catch(err) {
        console.log(err)
        return res.status(500).json({ success: false})
    }
}