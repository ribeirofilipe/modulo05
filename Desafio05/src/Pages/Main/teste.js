import React, { Component } from 'react';

export default class Teste extends Component {
  state = {
    initial: 0,
  };

  render() {
    const { initial } = this.state;

    return (
      <div>
        <h1>Hello</h1>
        <h1>Hello World</h1>

        <button onClick={() => this.setState({ initial: initial + 1 })}>
          CLIQUE
        </button>

        {initial}
      </div>
    );
  }
}
