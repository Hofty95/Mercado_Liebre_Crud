const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		return res.render("index",{
			products
		})
	},
	search: (req, res) => {
		const {keywords} = req.query
		console.log(keywords)
		const productsFound = products.filter(product => product.name.includes(keywords) || product.description.includes(keywords))

		return res.render("results",{
			productsFound,
			keywords
		})

	},
};

module.exports = controller;
