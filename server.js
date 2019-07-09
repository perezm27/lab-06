'use strict';

// first run npm init from the terminal to create "package.json"
// `npm install dotenv` installs the dotenv module into the node module folder
// loads our environment from a secret .env file

// APP dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Global vars
const PORT = process.env.PORT;

// Make my server
const app = express();
app.use(cors());

/*
$.ajax({
    url: `localhost:3000/location`,
    method: 'GET',
    data: { data: searchQuery }
  })
*/

// app.get('/location') is a route
app.get('/location', (request, response) => {
  // response.send('hello world you are on the location path');
  // console.log(request.query.data);
  try {
    const locationData = searchToLatLng(request.query.data);
    response.send(locationData);
  } catch(e){
    response.status(500).send('Status 500: So sorry i broke')
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = searchWeather(request.query.data);
    response.send(weatherData);
  } catch(e){
    response.status(500).send('Status 500: So sorry I broke')
  }
});


app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})


function searchToLatLng (locationName){
  const geoData = require('./data/geo.json');

  function Location (search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  var location = new Location (locationName, geoData.results[0].formatted_address, geoData.results[0].geometry.location.lat, geoData.results[0].geometry.location.lng);

  return location;
}



function searchWeather(locationWeather){
  const darkSkyData = require('./data/darksky.json');

  function Weather(search_query, forecast, time){
    this.search_query = search_query;
    this.forecast = forecast;
    this.time = time;

    // days.push(this);
  }
  let days = [];

  for (let i=0; i<8; i++) {
    let time = new Date (darkSkyData.daily.data[i].time).toDateString();
    let weather = new Weather (locationWeather, darkSkyData.daily.data[i].summary, time);
    //console.log(weather);
    days.push(weather);
  }

  return days;
}

// Start the server
app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`)
})

