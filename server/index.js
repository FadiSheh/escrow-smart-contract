const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3001 // Make sure this port is different from your frontend port

// Enable CORS and BodyParser
app.use(cors())
app.use(bodyParser.json())

// Mock database (replace with real database in production)
let contracts = []

app.get('/contracts', (req, res) => {
  console.log('Getting contracts')
  res.json(contracts)
})

app.post('/add-contract', (req, res) => {
  const newContract = req.body
  console.log('Adding new contract')

  // Add basic validation or generate an ID for the contract here if necessary
  contracts.push(newContract)

  res.status(201).send('Contract added')
})

// Endpoint to update a contract
app.post('/update-contract', (req, res) => {
  const { address, status } = req.body
  console.log('Updating contract')

  // Find and update the contract in the database
  let contract = contracts.find(contract => contract.address === address)
  if (contract) {
    contract.status = status
    res.status(200).send('Contract updated')
  } else {
    res.status(404).send('Contract not found')
  }
})

app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
