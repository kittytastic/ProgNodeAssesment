# Basic Info
## Remote deploy link
https://timetable-node-assesment.herokuapp.com/

## Authentication service used
Google sign-in is used (live version only)

## External API used
Google sign-in offers 2 versions of its sign-in API one that uses node packages and another that uses its more "debug" oriented version where you make a get request to their rest API. I choice the latter to kill 2 birds with one stone!
This code can be found in dev_only_auth.js

## What is it?
A site that lets companies/venues (e.g. swimming pools) design timetables and publish them online with a unique url for all their customers/users to see.


## What is the quickest way for me to see all the features? (peer review before exam vibes)
* Open site
* Navigate to admin page
* Add a new timetable
* Play around and make a timetable
* Play with the width of the page (watch page react)
* Save it
* Navigate to a clients view by either going to the share link or going to homepage and searching for your timetable
* Play around with the screen width
* Send feedback
* Go back onto the admin page and view your timetable
* Now there will be a feedback comment at the bottom
* Delete that comment.

Done!

# FAQ
## How would it be used?
### Company/Venue
* Go onto admin page
* Add/Edit timetable
* View feedback they have received
* Get the share link and give it to their customers/users

### Customer/User
**With share link**
* Open link and look at timetable
* Send feedback if they feel it's necessary  

**Without a share link (they have stumbled across the page)**
* Search for a timetable that they are interested in
* View it and possibly send feedback

## What entities are used
1. Timetables - these are complex js objects
2. Feedback comments - Theres can be posted by anyone viewing the timetable 

## What libraries have been used?
* Semantic UI
* Farbastic - colour selector

## What are all the $ in the client side JS?
They are the JQuery select symbol. Semantic UI requires JQuery to manipulate all of its entities so I end up using it a lot. 
``` $("#item_id").html("blar") ```
does the same thing as 
```document.getElementByID("item_id").innerHTML = "blar"``` 



# API documentation
## Standard API responses
### Error Message
The standard response given when there is an error
```javascript
{
    "err":"Message explaining error"
} 
```
### Success Message
This mostly given to acknowledge POST/DELETE requests
```javascript
{
    "success":""
}
```
## Timetables
---
## Timetable object
This is the way a timetable is stored as a javascript object. A timetable has the 3 child objects:

### Session:
```javascript 
{
    "col":"#E4572E",
    "title":"Name of session",
    "status":(unused)
}
```
col - hexadecimal colour of session  
title - The name of a session  
status - currently unused   

### Timeslot:
```javascript
{
    "start":(float 0-24),
    "end":(float 0-24),
    "session":(session id)
}
```
start - the start time of a timeslot (12.5 means 12:30)  
end - end time of a timeslot (12.5 means 12:30)  
session - the ID of the session that is taking place in that time slot.


### Meta Data:
```javascript 
{
    "start_day":(integer 0-6),
    "name":"Name of timetable"
}
```
start_day - indicates what day of the week a timetable should start (0=monday)  
name - the name of a timetable

### Full timetable object

```javascript
{
    "days":[
            [(Timeslot objects for the first day)],
            [(Time slot objects for the second day)],
            [(e.t.c.)]
           ],
    "session_type":[(Session objects)],
    "meta":(Meta Data object)
}
```


## Basic timetable info object
This is an object used to supply basic timetable information
```javascript
{
    "title":"Name of TT",
    "tt_id":(integer),
    "u_id":(integer),
}
```

## List timetables
```[GET] /api/tt```   
Requires authentication: NO 
### Returns
JSON List of timetable basic info objects

## List timetables for a specific user
```[GET] /api/tt?u_id=(number)```  
Requires authentication: NO
### Returns
JSON List of timetable basic info objects



## Get timetable data
```[GET] /api/tt?u_id=(number)&tt_id=(number)```  
Requires authentication: NO
### Returns
#### Success
JSON timetable object
#### Error
Standard JSON error message

## Update timetable data
```[POST] /api/tt?u_id=(number)&tt_id=(number)&auth=(auth token)```  
Requires authentication: YES
### Body should contain:
Timetable object
### Returns
Standard JSON success/error message

## Add new timetable
```[POST] /api/tt?u_id=(number)&new=yes&auth=(auth token)```  
Requires authentication: YES
### Body should contain:
```javascript
{
    "name": "name of new timetable",
    "start_day": (number 0-6),
    "dur": (number 1-14)
}
```
"start_day" - The day you want the timetable to start on (0=monday)  
"dur" - The duration of the timetable in days   

### Returns:

#### Success:
```javascript 
{
    "success":""
    "tt_id":(number)
}
```
Where "tt_id" is the timetable ID for this new timetable

#### Error
Standard JSON error message

## Feedback
---

## Get single feedback comment
```[GET] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)```  
Requires authentication - NO
### Returns
#### Success
JSON comment object
```javascript
{
    "title":"Title of comment",
    "content":"Content of comment",
    "timestamp":(JSON formatted time)
    "c_id": (number)
}
``` 
#### Error
Standard JSON error message

## Get feedback for timetable
```[GET] /api/feedback?u_id=(number)&tt_id=(number)&c_id=all```  
Requires authentication: NO
### Returns
#### Success
JSON comment object array (see get single feedback comment for comment object)
#### Error
Standard JSON error message

## Post feedback for timetable
```[POST] /api/feedback?u_id=(number)&tt_id=(number)```  
Requires authentication: NO
### body should contain:
```javascript 
{
    "title": "Title of feedback",
    "comment": "Comment of feedback"
} 
```
### Returns
Standard JSON success/error message


## Delete a feedback comment
```[DELETE] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)&auth=(auth token)```  
Requires authentication: YES
### Returns
Standard JSON success/error message