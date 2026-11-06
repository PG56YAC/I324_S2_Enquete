const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const nouvelleTache = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(nouvelleTache);
    res.send(nouvelleTache);
};
