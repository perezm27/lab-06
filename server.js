'use strict';

// APP dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Global vars
const PORT = process.env.PORT || 3009;

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
  try {
    const locationData = searchToLatLng(request.query.data);
    response.send(locationData);
  } catch(e){
    response.status(500).send('Status 500: Sorry went wrong')
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = searchWeather(request.query.data);
    response.send(weatherData);
  } catch(e){
    response.status(500).send('Status 500: Something went wrong')
    // errorMsg(500, 'Sorry something went wrong');
  }
});

// function errorMsg (status, msg){
//   console.log(errorMsg);
//   return (status(status).send(msg));
// }

//Default error handling
app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})

//Latitude & Longitude function/Location Constructor
function searchToLatLng (locationName){
  const geoData = require('./data/geo.json');

  function Location (search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  //Creates new Instance of Location & passes location data to location
  var location = new Location (locationName, geoData.results[0].formatted_address, geoData.results[0].geometry.location.lat, geoData.results[0].geometry.location.lng);

  return location;
}

//Search Weather function / Weather Constructor
function searchWeather(locationWeather){
  const darkSkyData = require('./data/darksky.json');

  function Weather(search_query, forecast, time){
    this.search_query = search_query;
    this.forecast = forecast;
    this.time = time;
  }

  //Iterates through weather properties and stores the weather and time to days array
  let days = [];

  for (let i=0; i<8; i++) {
    let time = new Date (darkSkyData.daily.data[i].time * 1000).toDateString();
    let weather = new Weather (locationWeather, darkSkyData.daily.data[i].summary, time);

    days.push(weather);
  }
  return days;
}

// Start the server
app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`)
})

