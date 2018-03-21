import React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div>
    <h2>Home</h2>
    Welcome to Invoice!
  </div>
);

export default connect()(Home);
