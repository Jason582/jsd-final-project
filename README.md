# Final-Project

I wanted to create a weather app that would instantly show 'your current weather outlook and suburb - as a quick lookup to plan out a 7 day schedule.

I wanted to display this on Desktop and Mobile so it is responsive - however, this could be expanded down the track to include tablet sizes and slightly larger displays... also, at the moment this is optimised for a 16inch desktop screen, and iphone.

The app uses geolocation to return a users latitude and longitude to be used to send to 2 different api's that return a json data pack back and get interpreted onto the page.

But instead of just returning the data weather and your suburb location, I wanted to include some background images that reflect weather themes - these are random web images that loop thru and have slight animations applied to them in CSS animations and using set-interval in javascript to determine the time changes for each image.

The timings were a little tricky to get right, as there is a slight zoom effect that needs to be synchromized with the set interval - this took a bit of tweaking to get right.

I am more of a visual-graphic person so visuals are important to me in terms of how it looks on screen - hence I do like using CSS when I can - this project will no doubt change down the road so that it 'looks' more refined.

I have used localStorage to store key data from the users location (which is called upon when returning the weather patterns and 'suburb' location)

I do enjoy the localStorage feature and can see so many things that you could use this for.