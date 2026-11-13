const db = require('../persistence');
const {v4 : uuid} = require('uuid');
const defaults = require('../defaults');

module.exports = async (req, res) => {
    const nouvelleTache = {
        id: uuid(),
        name: req.body.name,
        completed: defaults.completed,
    };

    await db.storeItem(nouvelleTache);
    res.send(nouvelleTache);
};
