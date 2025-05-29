import mongoose from "mongoose"
const ItemSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    cost: {type: Number, required: true},
    imagesPaths: [{type: String}]
}, {timestamps: true})
export default mongoose.model('Item', ItemSchema)