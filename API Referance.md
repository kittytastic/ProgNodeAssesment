# Api endpoints

## Timetables
List timetables
[GET] /api/tt
retuns json List

List timetables for  user
[GET] /api/tt?u_id = (number)
returns json List

Get timetable data
[GET] /api/tt?u_id=(number)&tt_id=(number)
returns json timetable

Updatade timetable data
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
success message in json feild "success":""
new timetables timetable ID: "tt_id":(number)


## Feedback
Get feedback for timetable
[GET] /api/feedback?u_id=(number)&tt_id=(number)&c_id=all
returns json list of comments / error

Get feedback for timetable
[GET] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)
returns json comment / error


Post feedback for timetable
[POST] /api/feedback?u_id=(number)&tt_id=(number)
body should contain:
TODO
returns json success/failure message

Delete a feedback comment
[DELETE] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)
returns json success/failure message