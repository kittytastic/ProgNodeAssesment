# Api endpoints

## Timetables
List timetables
[GET] /api/tt
returns json List

List timetables for  user
[GET] /api/tt?u_id = (number)
returns json List

Get timetable data
[GET] /api/tt?u_id=(number)&tt_id=(number)
returns json timetable

Update timetable data
[POST] /api/tt?u_id=(number)&tt_id=(number)
body should contain:
tt object
returns json success/error message

Add new timetable
[POST] /api/tt?u_id=(number)&new=yes
body should contain:
{
"name": "name of new timetable",
"start_day": (number 0-6),
"dur": (number 1-14)
}
tt object
returns:
on error
error message
on success:
success message in json field "success":""
new timetables timetable ID: "tt_id":(number)


## Feedback
Get feedback for timetable
[GET] /api/feedback?u_id=(number)&tt_id=(number)&c_id=all
on success
returns json list of comment array
on failure
returns json error message

Get single feedback comment
[GET] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)
on success
returns json comment 
on failure
returns json error message


Post feedback for timetable
[POST] /api/feedback?u_id=(number)&tt_id=(number)
body should contain:
{
    title: "Title of feedback",
    comment: "Comment of feedback"
}
returns json success/failure message

Delete a feedback comment
[DELETE] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)
returns json success/failure message