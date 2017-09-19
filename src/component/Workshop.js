import React from 'react';
import Shop from './Shop';

class Workshop extends React.Component {
  render() {
    const {base} = this.props;
    return (
      <div>
        <h3>Workshop</h3>
        <p>
          It's time to go Pokémon™ shopping!
          We have created a simple cart application to which you will be able
          to add analytics events for your users. Your tasks are as follows:
        </p>
        <ul>
          <li>
            Create mappings for{' '}
            <code>checkout</code> and <code>addToCart</code>{' '}
            events and setup those mappings in your index. These work the
            same way a <code>pageview</code> mapping does that we setup
            earlier in the tutorial. It's up to you what info you want to
            include in your mappings.
          </li>
          <li>
            Fire events with data when "Add to Cart" and "Checkout"
            buttons care clicked. There are <code>TODO</code> markers in the
            code where you should be doing this. You can look at the{' '}
            <code>Tutorial</code> component for code on how to do this.
          </li>
        </ul>
        <hr/>
        <Shop base={base}/>
      </div>
    );
  }
}

export default Workshop;
