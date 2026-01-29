const db = require('./../models');
const Categories = db.categories

/**
 * Récupère toutes les catégories
 */
exports.findAll = async (req, res) => {
	try {
		const categories = await Categories.findAll();
		return res.status(200).json(categories);
	} catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') })
	}
}

/**
 * Crée une nouvelle catégorie
 */
exports.create = async (req, res) => {
	try {
		const category = await Categories.create({
			name: req.body.name
		})
		return res.status(201).json(category)
	} catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') })
	}
}

/**
 * Met à jour une catégorie existante
 */
exports.update = async (req, res) => {
	try {
		await Categories.update({ name: req.body.name }, {
			where: { id: req.params.id }
		});
		const updatedCategory = await Categories.findByPk(req.params.id);
		return res.status(200).json(updatedCategory);
	} catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') });
	}
};

/**
 * Supprime une catégorie
 */
exports.delete = async (req, res) => {
	try {
		await Categories.destroy({
			where: { id: req.params.id }
		});
		return res.status(204).json();
	} catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') });
	}
};
