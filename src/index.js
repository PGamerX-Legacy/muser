const giveMeAJoke = require("discord-jokes");
const fetch = require("node-fetch");
const devbreh = require('awesome-dev-jokes')
const artificialIntelligence = require('./ai.js');
const translate = require('@iamtraction/google-translate');

const randomPuppy = require('random-puppy');
const insulter = require('insult');
const fs = require('fs')
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
  process.on('error', (err) => {
    console.error('whoops! there was an error');
  });
module.exports = {
    random:{
    cnjoke: function cnjoke() {
        try {
            return new Promise(async resolve => {
                giveMeAJoke.getRandomCNJoke(function (jokee) {
                    return resolve(jokee)
                })
            })
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    joke: function joke() {
        try {
            return new Promise(async resolve => {
                giveMeAJoke.getRandomDadJoke(function (jokee) {
                    resolve(jokee)
                })
            })
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    devjoke: function devjoke() {
        try {
            return new Promise(async resolve => {

                let jokesboi = devbreh.getRandomJoke()
                resolve(jokesboi)
            })
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    insult: async () => {
        try {
            return new Promise(async resolve => {
                let joke = await insulter.Insult();
                return resolve(joke);
            });
        } catch (err) {
            throw new Error("An error occurred, error: " + err);
        }
    },
},
image: {
    vase: function vase() {
        try {
            const num = Math.floor(Math.random() * 20000) + 1;
            const padded = num.toString().padStart(7, "0");
            const vase = `http://thisvesseldoesnotexist.s3-website-us-west-2.amazonaws.com/public/v2/fakes/${padded}.jpg`
            return vase;
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    cat: async () => {
        try {
            const subReddits = ["cat"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    dog: async () => {
        try {
            const subReddits = ["dog", "puppy"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    duck: async () => {
        try {
            const subReddits = ["duck"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    aww: async () => {
        try {
            const subReddits = ["aww"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    meme: async () => {
        try {
            const subReddits = ["memes"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    dankmeme: async () => {
        try {
            const subReddits = ["dankmemes"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    facepalm: async () => {
        try {
            const subReddits = ["facepalm"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    hpmeme: async () => {
        try {
            const subReddits = ["harrypottermemes"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    wholesome: async () => {
        try {
            const subReddits = ["wholesomememes"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    art: async () => {
        try {
            const subReddits = ["art"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
    deadinside: async () => {
        try {
            const subReddits = ["WatchPeopleDieInside"]
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            const img = await randomPuppy(random)
            return img
        } catch (err) {
            throw new Error("An error occurred , error: " + err);
        }
    },
},
ai: {
   getReply: async (message, language) => {
    if(!message) {
        throw new TypeError('Message Cannot be empty in getReply()')
      }
      if(!language) {
        console.log("No language has been provided defaulting to english as destination language")
        try{
          const text = await artificialIntelligence(message)
          const trans = await translate(text, { to: 'en' })
          return trans.text
        }catch(err){
          console.error(err)
        }
      }
      try{
        const text = await artificialIntelligence(message)
        const trans = await translate(text, { to: language })
        return trans.text
      }catch(err){
        console.error(err)
      }

   }
}
}

