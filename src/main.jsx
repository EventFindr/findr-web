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

class EventCreation extends React.Component {
  constructor() {
    super();
  }

  render() {
    var parent = this.props.parent;
    return <fieldset>
      <legend>Create an event</legend>
      <p><label>Organizer: <input value={parent.state.organizer}
        onChange={parent.handleOrganizerChange.bind(parent)} /></label></p>
      <p><label>Event name: <input value={parent.state.eventName}
        onChange={parent.handleEventNameChange.bind(parent)} /></label></p>
      <p><label>Email address: <input type="email"
        value={parent.state.emailAddress}
        onChange={parent.handleEmailAddressChange.bind(parent)} /></label></p>
      <p><button onClick={parent.submitEvent.bind(parent)}
        disabled={!parent.isFormComplete()} type="button">Submit</button></p>
    </fieldset>;
  }
}

class FindrMap extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      latlng: null,
      organizer: "",
      eventName: "",
      emailAddress: ""
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
            if (ev.coordinates.length) {  // old-style array coordinates
              ev.coordinates = ev.coordinates.map(Number);
            }
            return ev;
          })});
        }
      });
  }

  handleOrganizerChange(e) {
    this.setState({ organizer: e.target.value });
  }

  handleEventNameChange(e) {
    this.setState({ eventName: e.target.value });
  }

  handleEmailAddressChange(e) {
    this.setState({ emailAddress: e.target.value });
  }

  isFormComplete() {
    return !!(this.state.organizer &&
      this.state.eventName && this.state.emailAddress);
  }

  submitEvent() {
    var newEvent = {
      "host-name": this.state.organizer,
      times: [Date.now() / 1000, Date.now() / 1000 + 1000],
      qualifications: "none",
      name: this.state.eventName,
      contact: this.state.emailAddress,
      location: "see coords",
      coordinates: this.state.latlng,
      policy: "arrive-at-start",
      tags: "findr-web",
      description: "event"
    };
    var data = new URLSearchParams();
    data.append('event', JSON.stringify(newEvent));
    fetch('https://eventfindr.herokuapp.com/events', {
      method: 'post',
      body: data
    });
  }

  render() {
    let popup = undefined;
    let eventCreation = undefined;
    if (this.state.latlng !== null) {
      const coordinates = this.state.latlng;
      popup = <Popup position={coordinates} key="event-preview">
        <p>Here is a preview of your new event.</p>
      </Popup>;
      eventCreation = <div className="event-sidebar">
        <EventCreation parent={this} />
      </div>;
    }
    return (<main><Map center={position}
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
                <p>From {secondsToTimeString((event.times || event.time)[0])}
                  to {secondsToTimeString((event.times || event.time)[1])}.</p>
                <p>You must be {event.qualifications}.</p>
              </article>
            </Popup>
          </Marker>))
        }
        {popup}
      </Map>
      {eventCreation}
    </main>);
  }

  handleLeafletContextmenu(event) {
    const coordinates = event.latlng;
    this.setState({
      latlng: coordinates
    });
  }
}

React.render(<FindrClient />, document.body);
