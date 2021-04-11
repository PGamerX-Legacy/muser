let res = await fetch("https://api.pgamerx.com/joke/any?api_key=something")
// Fetch The APi 

let json = await res.json
// Convert res into JSON

let joke = json[0]
// Get the response as a variable

console.log(joke)
// Log The Joke
