---
description: This allows you to get images
---

# Get Images

{% api-method method="get" host="https://api.pgamerx.com" path="/v3/image/:type" %}
{% api-method-summary %}
Get Images
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to get images.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="type" type="string" required=true %}
All the types available at u.pgamerx.com/types
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-headers %}
{% api-method-parameter name="x-api-key" type="string" required=true %}
Get an API key for free at api.pgamerx.com/types
{% endapi-method-parameter %}
{% endapi-method-headers %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
successfully retrieved.
{% endapi-method-response-example-description %}

```
[
  "http://imgur.com/XSl0TH6.jpg"
]
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=401 %}
{% api-method-response-example-description %}
Bad endpoint or header missing
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



