const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var start = function(port,host) {
	app.listen(port, () => {
	  console.log(`HTTP server listening on ${port}`)
	})
}

module.exports = {start};