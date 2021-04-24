let stuff =  require("random-stuff-api")
let rsa = new stuff({
    key: "api_key" // Optional 
})

let response = await rsa.ai(message, language)
