---
description: This will guide you how to get A Joke
---

# Get Jokes

{% api-method method="get" host="https://api.pgamerx.com" path="/v3/joke/:type" %}
{% api-method-summary %}
This will help you get a Joke
{% endapi-method-summary %}

{% api-method-description %}
Get a joke using this
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="type" type="string" required=true %}
All Types are available at u.pgamerx.com/types                         
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-headers %}
{% api-method-parameter name="x-api-key" type="string" required=true %}
 Get an api key for free at api.pgamerx.com/register 
{% endapi-method-parameter %}
{% endapi-method-headers %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
{
  "error": false,
  "category": "Christmas",
  "type": "twopart",
  "setup": "What kind of motorbike does Santa ride?",
  "delivery": "A Holly Davidson!",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "id": 244,
  "safe": true,
  "lang": "en"
}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=401 %}
{% api-method-response-example-description %}
Bad endpoint/api-key
{% endapi-method-response-example-description %}

```
[
{
"error": "401",
"message": "Unauthorized",
"solution": "Kindly make sure to make request using x-api-key as a header. Get one Authentication Key at https://api.pgamerx.com/register"
}
]
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}



