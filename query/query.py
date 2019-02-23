from keys import ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET

import tweepy
import jsonpickle

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)

# Create the api to connect to twitter with your creadentials
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, compression=True)

#Error handling
if (not api):
    print ("Problem connecting to API")

#Getting Geo ID for USA
places = api.geo_search(query="USA", granularity="country")

#Copy USA id
place_id = places[0].id

# s_vals = [
#     "Adidas Yeezy Boost 350 Low V2 Beluga",
#     "Adidas Yeezy Boost 350 V2 Core Black Copper",
#     "Adidas Yeezy Boost 350 V2 Core Black Green",
#     "Adidas Yeezy Boost 350 V2 Core Black Red",
#     "Adidas Yeezy Boost 350 V2 Core Black Red 2017",
#     "Adidas Yeezy Boost 350 V2 Core Black White",
#     "Adidas Yeezy Boost 350 V2 Cream White",
#     "Adidas Yeezy Boost 350 V2 Zebra",
#     "Adidas Yeezy Boost 350 Low Moonrock",
#     "Nike Air Max 90 Off White",
#     "Nike Air Presto Off White",
#     "Nike Air VaporMax Off White",
#     "Air Jordan 1 Retro High Off White Chicago",
#     "Nike Blazer Mid Off White",
#     "Adidas Yeezy Boost 350 Low Pirate Black 2016",
#     "Adidas Yeezy Boost 350 Low Oxford Tan",
#     "Adidas Yeezy Boost 350 Low Turtledove",
#     "Adidas Yeezy Boost 350 Low Pirate Black 2015",
#     "Adidas Yeezy Boost 350 V2 Semi Frozen Yellow",
#     "Nike Air Force 1 Low Off White",
#     "Nike Air Max 97 Off White",
#     "Nike Air Force 1 Low Virgil Abloh Off White AF100",
#     "Nike React Hyperdunk 2017 Flyknit Off White",
#     "Nike Zoom Fly Off White",
#     "Adidas Yeezy Boost 350 V2 Beluga 2pt0",
#     "Adidas Yeezy Boost 350 V2 Blue Tint",
#     "Nike Air VaporMax Off White 2018",
#     "Air Jordan 1 Retro High Off White White",
#     "Nike Air VaporMax Off White Black",
#     "Air Jordan 1 Retro High Off White University Blue",
#     "Nike Air Presto Off White Black 2018",
#     "Nike Air Presto Off White White 2018",
#     "Nike Zoom Fly Mercurial Off White Black",
#     "Nike Zoom Fly Mercurial Off White Total Orange",
#     "adidas Yeezy Boost 350 V2 Butter",
#     "Nike Air Max 97 Off White Elemental Rose Queen",
#     "Nike Blazer Mid Off White All Hallows Eve",
#     "Nike Blazer Mid Off White Grim Reaper",
#     "Adidas Yeezy Boost 350 V2 Sesame",
#     "Nike Blazer Mid Off White Wolf Grey",
#     "Nike Air Max 97 Off White Menta",
#     "Nike Air Max 97 Off White Black",
#     "Nike Zoom Fly Off White Black Silver",
#     "Nike Zoom Fly Off White Pink",
#     "Nike Air Force 1 Low Off White Volt",
#     "Nike Air Force 1 Low Off White Black White",
#     "adidas Yeezy Boost 350 V2 Static",
#     "adidas Yeezy Boost 350 V2 Static Reflective",
#     "Nike Air Max 90 Off White Black",
#     "Nike Air Max 90 Off White Desert Ore"]

s_vals = [
    "Adidas Yeezy Boost 350 Low V2",
    "Adidas Yeezy Boost 350",
    "Adidas Yeezy Boost 350 V2",
    "Adidas Yeezy Boost 350 Low",
    "Nike Air Max 90 Off White",
    "Nike Air Presto Off White",
    "Nike Air VaporMax Off White",
    "Air Jordan 1 Retro High Off White",
    "Nike Blazer Mid Off White",
    "Adidas Yeezy Boost 350 Low",
    "Adidas Yeezy Boost 350 Low",
    "Adidas Yeezy Boost 350 Low",
    "Adidas Yeezy Boost 350 Low",
    "Nike Air Force 1 Low Off White",
    "Nike Air Max 97 Off White",
    "Nike Air Force 1 Low Virgil Abloh Off White",
    "Nike React Hyperdunk Flyknit Off White",
    "Nike Zoom Fly Off White",
    "Nike Zoom Fly Mercurial Off White",
    "Nike Air Max 97 Off White",
    "adidas Yeezy Boost 350 V2 Static",
    "adidas Yeezy Boost 350 V2 Static Reflective"]

# Searching for tweets in the US using our query
for i in range(len(s_vals)):
    searchQuery = 'place:96683cc9126741d1 "{}"'.format(s_vals[i])

    #Maximum number of tweets we want to collect
    maxTweets = 1000000

    #The twitter Search API allows up to 100 tweets per query
    tweetsPerQry = 100

    tweetCount = 0

    #Open a text file to save the tweets to
    with open('tweets.json', 'a') as f:

        #Tell the Cursor method that we want to use the Search API (api.search)
        #Also tell Cursor our query, and the maximum number of tweets to return
        for tweet in tweepy.Cursor(api.search,q=searchQuery).items(maxTweets) :

            #Verify the tweet has place info before writing (It should, if it got past our place filter)
            if tweet.place is not None:

                #Write the JSON format to the text file, and add one to the number of tweets we've collected
                f.write(jsonpickle.encode(tweet._json, unpicklable=False) + '\n')
                tweetCount += 1

        #Display how many tweets we have collected
        print("Downloaded {0} tweets".format(tweetCount))