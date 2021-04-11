let res = await fetch("https://api.pgamerx.com/ai/response?api_key=something&message=Hey&language=en")
// Fetch The APi 

let json = await res.json()
// Convert res into JSON

let response = json[0]
// Get the response as a variable

console.log(response)
// Log The response
