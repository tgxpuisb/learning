const express = require('express')
const app = express()

app.use(express.static('demo'))

app.listen(4000, () => {
	console.log('demo server start at localhost:4000//')
})