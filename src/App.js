import React, { Component } from 'react';
import { nw } from 'nodewire'   // nodewire library

const conf = {  // nodewire account details 
  username: "test@microscale.net",
  password: "aB01@",
  instance: "1jex2k7cbedg",
  server: "dashboard.nodewire.org",
}

var thenode; // the biometric device

class App extends Component {
  constructor() {
    super();
    this.state = { waiting: true, name: "", id: 0 }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoadUser = this.handleLoadUser.bind(this);
  }
  
  componentDidMount() {
    nw.once('gack', async () => { //after we connect to nodewire
      console.log('connected');
      thenode = await nw.getnode('Attendance');  // get the device
      this.setState({ waiting: false }); // display form
    })
    nw.connect(conf);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleIDChange(event) {
    this.setState({ id: event.target.value });
  }

  handleSubmit(event) {
    thenode.add = {
      userid: this.state.id,
      name: this.state.name,
      card: -1,
      finger: -1
    };
    event.preventDefault();
  }

  handleLoadUser(){
    this.setState({name:'', id:''});
    thenode.rec_no = Number(this.state.rec);
    nw.once('Attendance.record', (user)=>{
      this.setState({name: user.name, id: user.userid})
    })
  }

  render() {
    if (this.state.waiting)
      return (
        <div>
          Wait ...
          </div>
      )
    else
      return (
        <div>
          Rec no: <input type="number" value={this.state.rec} onChange={(event)=>{this.setState({ rec: event.target.value });}} />
          <button onClick={this.handleLoadUser}>Load Record</button>
          <form onSubmit={this.handleSubmit}>
            <label>
              ID:
                <input type="number" value={this.state.id} onChange={this.handleIDChange} />
            </label>
            <label>
              Name:
                <input type="text" value={this.state.name} onChange={this.handleNameChange} />
            </label>
            <input type="submit" value="Save" />
          </form>
          <button onClick={() => {
            thenode.enroll = Number(this.state.id); //emroll fingerprint
          }}>Enroll</button>

          <button onClick={() => {
            thenode.delete = Number(this.state.id); // delete user record from device
          }}>Delete</button>

          <button onClick={() => {
            thenode.delete = "truncate"; // empty device database
          }}>Empty</button>
          
        </div>
      );
  }
}

export default App;