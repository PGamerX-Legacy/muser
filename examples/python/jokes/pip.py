# import the module
from prsaw import RandomStuff

# initiate the object
api_key = "Your API Key"
rs = RandomStuff(api_key = api_key) # You can avoid this step if you don't have an api key

# get a response from an endpoint
response = await get_joke(_type = "any") # Refer to https://api.pgamerx.com/endpoints
print(response)


# close the object once done (recommended)
rs.close()
