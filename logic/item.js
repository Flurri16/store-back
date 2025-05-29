export const addItem = async (req, res) => {
    try {
        const {title, description, cost} = req.body
        let imgPaths = []
        if(req.files && req.files.length > 0) {
            imgPaths = req.files.map(file => "/uploads/" + file.filename)
        }
        const newItem = new Item({
            title,
            description,
            cost,
            imagesPaths: imgPaths
        })
        await newItem.save()
        return res.status(200).json({message: "Przedmiot dodany", newItem})
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Error to create item.' });
    }
}