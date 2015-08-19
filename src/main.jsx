import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const MARKER_ICON = "https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/images/markers-matte.png";

const position = [0, 0];
const map = (<Map center={position} zoom={5}>
  <TileLayer
    url="http://api.tiles.mapbox.com/v4/totalverb.30d348ce/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG90YWx2ZXJiIiwiYSI6ImE0NmY3YTE4MzhkZmM2MGU0MzY1MDgzZDE0ZGUyYzA4In0._CGLK1EG456RVASfRKtInQ"
    attribution='<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>'
  />
</Map>);

class FindrClient extends React.Component {
  render() {
    return map;
  }
}

React.render(<FindrClient />, document.body);

function createMarkerForEvent(event) {
  map.appendChild(<Marker icon={MARKER_ICON}>
    <span><b>{event.name}</b> by <b>{event['host-name']}</b></span>
  </Marker>);
}

// Fetch events and create markers for them.
fetch('http://eventfindr.herokuapp.com/events')
  .then(response => response.json())
  .then(events => events.forEach(createMarkerForEvent));
