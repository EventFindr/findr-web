import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [0, 0];

function secondsToTimeString(seconds) {
  return new Date(seconds * 1000).toISOString();
}

class FindrClient extends React.Component {
  render() {
    return <FindrMap />;
  }
}

class FindrMap extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      latlng: null
    };
    this._findrMounted = true;

    // React does not bind these methods automatically.
    this.handleLeafletContextmenu = this.handleLeafletContextmenu.bind(this);
  }

  componentWillUnmount() {
    this._findrMounted = false;
  }

  componentDidMount() {
    // Fetch events and create markers for them.
    fetch('https://eventfindr.herokuapp.com/events')
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
    let popup = undefined;
    if (this.state.latlng !== null) {
      const coordinates = this.state.latlng;
      popup = <Popup position={coordinates}>
        <fieldset>
          <legend>Create an event</legend>
          <p><label>Organizer: <input /></label></p>
          <p><label>Event name: <input /></label></p>
          <p><label>Email address: <input type="email" /></label></p>
          <p><button>Submit</button></p>
        </fieldset>
      </Popup>;
    }
    return <Map center={position}
                zoom={5}
                onLeafletContextmenu={this.handleLeafletContextmenu}>
      <TileLayer
        url="https://api.tiles.mapbox.com/v4/totalverb.30d348ce/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG90YWx2ZXJiIiwiYSI6ImE0NmY3YTE4MzhkZmM2MGU0MzY1MDgzZDE0ZGUyYzA4In0._CGLK1EG456RVASfRKtInQ"
        attribution='<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>'
      />
      {
        this.state.events.map(event => (<Marker position={event.coordinates} key={event.name}>
          <Popup>
            <article>
              <header>
                <h1>{event.name}</h1>
                <span> by </span><b>{event['host-name']}</b>
              </header>
              <p>{event.description}</p>
              <p>From {secondsToTimeString(event.time[0])} to {secondsToTimeString(event.time[1])}.</p>
              <p>You must be {event.qualifications}.</p>
            </article>
          </Popup>
        </Marker>))
      }
      {popup}
    </Map>;
  }

  handleLeafletContextmenu(event) {
    const coordinates = event.latlng;
    this.setState({
      latlng: coordinates
    });
  }
}

React.render(<FindrClient />, document.body);
