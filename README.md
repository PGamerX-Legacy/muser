# Random-stuff-api
<a href="https://discord.gg/y94PA8d">
<img src="https://img.shields.io/discord/690557545965813770?color=7289DA&label=Support&logo=discord&style=for-the-badge" alt="Discord">
</a>

<a href="https://www.npmjs.com/package/random-stuff-api">
<img src="https://img.shields.io/npm/dt/random-stuff-api?color=CC3534&logo=npm&style=for-the-badge" alt="Downloads">
</a>

<a href="https://www.npmjs.com/package/random-stuff-api">
<img src="https://img.shields.io/npm/v/random-stuff-api?color=red&label=Version&logo=npm&style=for-the-badge" alt="Npm version">
</a>
<a href="https://github.com/pgamerxstudio/projects">
<img src="https://img.shields.io/github/stars/pgamerxstudio/projects?color=333&logo=github&style=for-the-badge" alt="Github stars">
</a>

<a href="https://github.com/pgamerxstudio/projects/blob/master/LICENSE">
<img src="https://img.shields.io/github/license/pgamerxstudio/projects?color=6e5494&logo=github&style=for-the-badge" alt="License">
</a>

## Requirments
* Nodejs Version 12.0.0 or above
* developer/build tools

## Installation
```
npm install random-stuff-api
```

## Recent Changes
### Version 9.5.x
* Image manipulation removed
## Declaration
```javascript
const api = require('random-stuff-api')
```

## Classes
Currently there are currently 3 classes - 
* random // used for functions which has a random response as output (for eg - joke , insult)
* image // Used for functions which has image as an output (for eg - dog , cat)     
**(Scroll down for all functions and example)**

## Usage Example

```javascript
const api = require('random-stuff-api')
api.random.insult()
  .then(insult => {
    console.log(insult)
  })
  //Output => What's the difference between you and eggs? Eggs get laid and you don't.

```

## Functions
### Class random
* `api.random.joke() // Returns a dad joke`
* `api.random.cnjoke() // Returns a cn joke`
* `api.random.devjoke() // Returns a dev joke`
* `api.random.insult() // returns a random insult`
### Class Image
* `api.image.vase() // returns a vase image` 
* `api.image.cat() // returns a cat image `
* `api.image.dog() // returns a dog image `
* `api.image.duck() // returns a duck image` 
* `api.image.aww() // returns a cute moment`
* `api.image.meme() // returns a cool meme :)`
* `api.image.dankmeme() // returns a dank meme :o`
* `api.image.facepalm() // returns a facepalm moment`
* `api.image.hpmeme() // returns a harry potter meme`
* `api.image.wholesome() // returns a wholesome meme `
* `api.image.art() // returns cool art pic`
* `api.image.deadinside() // returns a "Watch people die inside" moment`

## Support
For support [Discord server](https://pgamerx.com/discord)
