---
description: This will guide you how to get AI response
---

# Get AI response

{% api-method method="get" host="https://api.pgamerx.com" path="/v3/ai/response" %}
{% api-method-summary %}
Get AI response
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to get ai based response.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="x-api-key" type="string" required=true %}
Get an api key for free at api.pgamerx.com/register
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-query-parameters %}
{% api-method-parameter name="language" type="string" required=false %}
Language \(optional but recommended\)
{% endapi-method-parameter %}

{% api-method-parameter name="type" type="string" required=true %}
Type can be "stable" or "unstable"
{% endapi-method-parameter %}

{% api-method-parameter name="message" type="string" required=true %}
The message you want to provide
{% endapi-method-parameter %}
{% endapi-method-query-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
successfully retrieved.
{% endapi-method-response-example-description %}

```
[
  {
    "success": true,
    "message": "message",
    "api_key": "your_key"
  }
]   
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=401 %}
{% api-method-response-example-description %}
Bad Endpoint aka missing parameter 
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



