let stuff =  require("random-stuff-api")
let rsa = new stuff({
    key: "api_key" // Optional 
})

let response = await rsa.joke(type)
// Refer to https://api.pgamerx.com/endpoints for types
