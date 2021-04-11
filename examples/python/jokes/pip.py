# import the module
from prsaw import RandomStuff

# initiate the object
api_key = "Your API Key"
rs = RandomStuff(api_key = api_key) # You can avoid this step if you don't have an api key

# get a response from an endpoint
response =  rs.get_ai_response("How are you?")
print(response)

# close the object once done (recommended)
rs.close()
