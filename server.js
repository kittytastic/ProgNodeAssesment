const express = require('express')
const app = express()
const port = 8080

const db = require('./Server/mock_db');


db.start();


//var bodyParser = require('body-parser')
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 // extended: true
//})); 

app.use(express.json())
app.use(express.urlencoded())

app.use('/test_stat', express.static('Client'))


app.use('/', express.static('./Client/User'));
app.use('/Common', express.static('./Client/Common'));
app.use('/Admin', express.static('./Client/Admin'));
app.use('/External', express.static('./Client/ExternalDependencies'));

  /* ************************************
   *           Feedback Comments        *
   ************************************** */

  /* ----------- GET ------------- */
  app.get('/api/tt', function (req, res) {
    let tt_id = req.query.tt_id
    let u_id = req.query.u_id

    // No user id, list all timetables
    if(!u_id){
      
      res.send(db.list_timetable_names());
      return
  }

    // user id but no timetable id, list all timetables for that user
    if(!tt_id){
        let result = db.list_timetable_names(u_id);
        if(!result){
          res.status(400);
          res.send({err: 'no tt_id argument given'})
          return
        }

        res.send(result);

    }

    // Send tt_data
    let results = db.load_tt(tt_id, u_id);
    if(results){
      res.send(results)
    }else{
        res.status(400);
        res.send({err: 'arguments given are out of range'})
        return
    }
    console.log('GET request for tt_id: ' + tt_id + " u_id: "+u_id)
  })

  app.post('/api/tt', function (req, res) {
    res.send('POST request to timetable API')
    console.log('POST request to timetable API')
  })


  /* ************************************
   *           Feedback Comments        *
   ************************************** */
  /* ----------- GET ------------- */
 
  app.get('/api/feedback', function (req, res) {

    let tt_id = req.query.tt_id
    let u_id = req.query.u_id
    let c_id = req.query.c_id

    // Check if the correct arguments have been supplied
    if(!tt_id){
        res.status(400);
        res.send({err: 'no tt_id argument given'})
        return
    }

    if(!u_id){
        res.status(400);
        res.send({err: 'no u_id argument given'})
        return
    }

    if(!c_id){
      res.status(400);
      res.send({err: 'no c_id argument given'})
      return
  }

  if(c_id=="all"){
    let results = db.load_all_comments(tt_id, u_id)
    if(!results){
      res.status(400);
      res.send({err: 'Arguments out of range'})
      return
    }
    res.send(results);
    return
  } else {
    let results = db.load_comment(tt_id, u_id, c_id)
    if(!results){
      res.status(400);
      res.send({err: 'Arguments out of range'})
      return
    }
    res.send(results);
  }

  


    console.log('GET request to comment API')
  })

  /* ----------- POST ------------ */
  app.post('/api/feedback', function (req, res) {
    let tt_id = req.query.tt_id
    let u_id = req.query.u_id

    // Check if the correct arguments have been supplied
    if(!tt_id){
        res.status(400);
        res.send({err: 'no tt_id argument given'})
        return
    }

    if(!u_id){
        res.status(400);
        res.send({err: 'no u_id argument given'})
        return
    }

    console.log(req.body);
    db.add_comment(tt_id, u_id, req.body.title, req.body.comment, req.body.timestamp)
    res.send({success:''})
    console.log('POST request to comment API')
  })

/* ---------- DELETE ----------- */
app.delete('/api/feedback', function (req, res) {
  console.log("Got a delete request");

  
  let tt_id = req.query.tt_id
  let u_id = req.query.u_id
  let c_id = req.query.c_id

  // Check if the correct arguments have been supplied
  if(!tt_id){
      res.status(400);
      res.send({err: 'no tt_id argument given'})
      return
  }

  if(!u_id){
      res.status(400);
      res.send({err: 'no u_id argument given'})
      return
  }

  if(!c_id){
    res.status(400);
    res.send({err: 'no c_id argument given'})
    return
}

  if(db.delete_comment(tt_id, u_id, c_id)){
    res.send({success: ''});  
  }else{
    res.status(400);
    res.send({err: 'couldnt find comment to delete'})
  }

})


/* ************************
   *         404          *
   ************************ */
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })



app.listen(port, () => console.log(`TT server listening on port ${port}!\nStatic access at: \\test_stat\\filename.js`))
