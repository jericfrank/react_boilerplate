import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

export default class Layout extends React.Component {
  constructor() {
      super();

      this.state = {
        auth: this.isAuth()
      }
  }
  
  componentDidMount() {
    const token = localStorage.getItem('token');
    axios.defaults.baseURL = 'http://127.0.0.1:8000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    axios.get('http://localhost:8000/api/user/' )
      .then( (response)=> {
        console.log(response );
      })
      .catch( (error)=> {
          console.log(error );
      });


  }

  isAuth(){
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');

    if(!token || !expiry)
      return false;

    if(Date.now() < parseInt(expiry)){

      localStorage.removeItem('token');
      localStorage.removeItem('expiry');

      return false;
    }else{
      return token;
    }
  }

  handleSubmit(e){
    e.preventDefault();
    const { email , password } = this.refs;

    const data = {
      client_id: 2,
      client_secret: 'M0PvpxFw7Upx8nIkTnrJJrXe0um8I7kxOQ84H7zM',
      grant_type: 'password',
        username: email.value,
        password: password.value
    }

    axios.post('/oauth/token/', data )
      .then( (response)=> {
          const { data } = response;
          localStorage.setItem('token',  data.access_token);
          localStorage.setItem('expiry',  data.expires_in);

          this.setState({ auth: this.isAuth() })
      })
      .catch( (error)=> {
          console.log( error );
      });

  }

  handleLogout(e){
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');

    this.setState({ auth: this.isAuth() });
  }

    render () {

      if(this.state.auth){
        return <button onClick={this.handleLogout.bind(this)}>logout</button>
      }

      return <form onSubmit={this.handleSubmit.bind(this)}>
        <input ref="email" placeholder="email"/>
        <input ref="password" type="password" placeholder="password"/>
        <input type="submit"/>
      </form>
    }
}