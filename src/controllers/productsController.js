const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");



const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products",{
			products
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const id = req.params.id
		const productDetail = products.find((product) => product.id === +id)
		return res.render("detail",{
			productDetail
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name, price, discount,description, category} = req.body
		const productoNuevo = {
			id : products[products.length - 1].id + 1,
			name : name,
			description : description,
			price : price,
			discount : discount,
			image : req.file ? req.file.filename : null,
			category : category
		}
	    /* return res.send(productoNuevo) */
		products.push(productoNuevo)

		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,3),"utf-8");

		return res.redirect(`/products/detail/${productoNuevo.id}`)

	},

	// Update - Form to edit
	edit: (req, res) => {
		const id = req.params.id
		const productToEdit = products.find((product) => product.id === +id)
		return res.render("product-edit-form",{
			productToEdit
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const id = req.params.id
		const product = products.find((product) => product.id === +id)
		const {name, price, discount,description, category} = req.body
		
		const productModified = {
			id : product.id,
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image : req.file ? req.file.filename : product.image,
			category
		}

		const productsModified = products.map(product => {
			if(product.id === +id){
				return productModified
			}
			return product
		})


		fs.writeFileSync(productsFilePath, JSON.stringify(productsModified, null, 3),"utf-8");

		res.redirect(`/products/detail/${productModified.id}`)


	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const id = req.params.id
		const productsToKeep = products.filter(product => product.id !== +id);


		fs.writeFileSync(productsFilePath,JSON.stringify(productsToKeep, null, 3),"utf-8");

		return res.redirect("/products")
	}
};

module.exports = controller;