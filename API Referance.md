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

## Feedback
Get feedback for timetable
[GET] /api/feedback?u_id=(number)&tt_id=(number)
returns json list of comments


Post feedback for timetable
[POST] /api/feedback?u_id=(number)&tt_id=(number)
returns json success/failure message

Delete a feedback comment
[DELETE] /api/feedback?u_id=(number)&tt_id=(number)&c_id=(number)
returns json success/failure message