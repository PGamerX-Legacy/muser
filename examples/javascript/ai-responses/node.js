const fetch = require('node-fetch');
// Use node-fetch as the package

let res = await fetch("https://api.pgamerx.com/ai/response?api_key=something&message=Hey&language=en")
// Fetch The API
           
let json = await res.json()
// Convert it into JSON

let response = json[0]
// Get joke as variable

console.log(response)
// Log The response
