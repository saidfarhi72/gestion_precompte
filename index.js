'use strict';
const express = require('express');
const path = require('path');
var session = require("express-session")
const confirmationRoute = require('./routes/confirmation');
const reservationRoute = require('./routes/reservation');
const editRoute = require('./routes/edit');

const routerAuth= require('./routes/auth')
const reponse = require('./routes/reponse')
const creditroute = require('./routes/credit')
const suiviroute = require('./routes/suivi')
const etatroute = require('./routes/etat')
const annulationroute = require('./routes/annulation')
const annulation_instanceroute= require('./routes/annulation_instance')
const historyroute= require('./routes/history')

const { isAuth } = require('./controllers/guardAuth.controller');
const { port } = require('./config');
const flash=require('connect-flash');
const { getAgentByMatricule } = require('./data/query');


const app = express()









app.use(flash())
  

app.use(
  session({
    secret: "keyboard cat",

    resave: false, // we suport the touch method so per the express-session docs this should be set to false
    saveUninitialized: true,// if you do SSL utside of node.
  })
);
// continue as n

app.use(express.static(path.join(__dirname,'assets')))



app.set('view engine','ejs')
app.set('views','views')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/",isAuth,function(req,res){
    res.render('home',{verifUser:req.session.userId,verifAdmin:req.session.admin});
})




app.use('/',routerAuth)
app.use("/confirmation",confirmationRoute)
app.use("/reponse",reponse)
app.use("/reservation",reservationRoute)
app.use("/annulation",annulationroute)
app.use("/annulationInstance",annulation_instanceroute)
app.use("/history",historyroute)


app.use("/suivi",suiviroute)
app.use("/etat",etatroute)

app.use("/edit",editRoute)



app.use("/",creditroute)

app.listen(port,()=>console.log(`serve at http://localhost:${port}`))