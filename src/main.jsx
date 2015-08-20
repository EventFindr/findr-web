import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [0, 0];

class FindrClient extends React.Component {
  render() {
    return <FindrMap />;
  }
}

class FindrMap extends React.Component {
  constructor() {
    super();
    this.state = {
      events: []
    };
    this._findrMounted = true;
  }

  componentWillUnmount() {
    this._findrMounted = false;
  }

  componentDidMount() {
    // Fetch events and create markers for them.
    fetch('http://eventfindr.herokuapp.com/events')
      .then(response => response.json())
      .then(events => {
        if (this._findrMounted) {
          this.setState({events: events.map(ev => {
            ev = JSON.parse(ev);
            ev.coordinates = ev.coordinates.map(Number);
            return ev;
          })});
        }
      });
  }

  render() {
    return (<Map center={position} zoom={5}>
      <TileLayer
        url="http://api.tiles.mapbox.com/v4/totalverb.30d348ce/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG90YWx2ZXJiIiwiYSI6ImE0NmY3YTE4MzhkZmM2MGU0MzY1MDgzZDE0ZGUyYzA4In0._CGLK1EG456RVASfRKtInQ"
        attribution='<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>'
      />
      {
        this.state.events.map(event => (<Marker position={event.coordinates} key={event.name}>
          <Popup>
            <span><b>{event.name}</b> by <b>{event['host-name']}</b></span>
          </Popup>
        </Marker>))
      }
    </Map>);
  }
}

React.render(<FindrClient />, document.body);
