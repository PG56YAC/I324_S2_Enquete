// Supprime une tâche par son identifiant
const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeItem(req.params.id);
    res.sendStatus(200);
};
