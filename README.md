---
description: Welcome to home page of Random Stuff api
---

# Random stuff api

## OwO what's this?

Random Stuff api is an api developed by [PGamerX](https://pgamerx.com). This api can do various things including but not limited to AI, Jokes, memes, dog/cat images and etc

## UwU is it free?

Yes, This api is free as long as you don't cross the limits. You can find paid pricing at            [Rate-limits Page](rate-limits.md)

{% hint style="info" %}
If you have a famous project, then you can contact [PGamerX](https://u.pgamerx.com/discord) and ask to partner with the api
{% endhint %}

## How can I use this?

You can use this easily just by making a HTTP request. Here is an example of how to do this in Javascript 

```text
const fetch = require("node-fetch")
fetch('https://api.pgamerx.com/v3/ai/response?message=encodeURIComponent("Hello")&type=stable', {
        method: 'get',
        headers: { 'x-api-key': 'your-api-key' },
    })
    .then(res => res.json())
    .then(json => console.log(json));
```

{% hint style="info" %}
Get an API by registering at [Here](https://api.pgamerx.com/register)
{% endhint %}





