import Item from '../models/Item.js'
import fs from 'fs/promises';
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
export const getAll = async (req, res) => {
    try {
        const items = await Item.find()
        if(!items) {
            return res.status(403).json({message: "Przedmioty nie istnieją."})
        } else {
            return res.json(items)
        }
    }catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'Error to get all item.' });
    }
}
export const getOne = async (req, res) => {
    try {
        const {id} = req.params
        const item = await Item.findById(id)
        if(!item ) return res.status(403).json({message: "Przedmiot nie istnieje."})
        return res.status(200).json(item)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'Error to get item.' });
    }
}
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(403).json({ message: "Przedmiot nie istnieje." });
    }

    // Удалить папку, если путь есть
    if (item.folderPath) {
      try {
        await fs.rm(item.folderPath, { recursive: true, force: true });
        console.log("Folder usunięty:", item.folderPath);
      } catch (err) {
        console.error("Błąd przy usuwaniu folderu:", err);
        // Не прерываем выполнение — это не критическая ошибка
      }
    }

    return res.status(200).json({ message: "Przedmiot był usunięty." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error to delete item.' });
  }
};