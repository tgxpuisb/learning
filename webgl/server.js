const express = require('express')
const app = express()

app.use('/demo',express.static('demo'))
app.use(express.static('demo'))

app.listen(4000, () => {
	console.log('demo server start at http://localhost:4000/')
})