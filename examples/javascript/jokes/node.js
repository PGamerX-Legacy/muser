const fetch = require('node-fetch');
// Use node-fetch as the package

let res = await fetch("https://api.pgamerx.com/joke/any?api_key=something")
// Fetch The API
           
let json = await res.json()
// Convert it into JSON

let joke = json[0]
// Get joke as variable

console.log(joke)
// Log The joke
