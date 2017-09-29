import React from 'react';
import {propEq, find, pathOr} from 'ramda';
import cuid from 'cuid';
import UAParser from 'ua-parser-js';
import Fuse from 'fuse.js';

import {sendEvent} from '../analytics';

const PRODUCTS_URL = 'https://metalabdesign.github.io/' +
  'startupslam-2017/src/products.json';

const PAGE_SIZE = 6;

const formatPrice = (v) => {
  return v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const getTotal = (cart) => {
  return cart.reduce(
    (t, {quantity, price}) => t + (quantity * price),
    0
  );
};

class Shop extends React.Component {
  constructor(props) {
    super(props);
    const ua = new UAParser(navigator.userAgent);
    this.state = {
      loading: false,
      shopping: false,
      user: {
        gender: 'male',
        age: 22,
        location: {lat: 49.2827, lon: -123.1207},
      },
      os: ua.getOS().name,
      browser: ua.getBrowser().name,
      cartId: cuid(),
      cart: [],
      products: [],
      pageOffset: 0,
      query: '',
      searchQuery: '',
    };
  }

  saveProfile() {
    localStorage.setItem('slam-profile', JSON.stringify(this.state.user));
  }

  loadProfile() {
    try {
      const user = JSON.parse(localStorage.getItem('slam-profile'));
      if (user) {
        this.setState({user});
        return true;
      }
    } catch (_err) {
      // Do nothing.
    }
    return false;
  }

  updateUser(data) {
    this.setState({
      user: {
        ...this.state.user,
        ...data,
      },
    }, () => this.saveProfile());
  }

  loadProducts() {
    this.setState({loading: true});

    fetch(PRODUCTS_URL)
      .then((response) => response.json())
      .then((products) => {
        this.products = products;
        this.fuse = new Fuse(products, {
          shouldSort: true,
          threshold: 0.3,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ['name'],
        });
        this.search();
      });
  }

  search(text) {
    const products = text && this.fuse
      ? this.fuse.search(text)
      : this.products;

    this.setState({products, searchQuery: text || '', pageOffset: 0});
  }

  getMaxPageOffset() {
    return Math.floor(this.state.products.length / PAGE_SIZE);
  }

  next() {
    this.setState({
      pageOffset: Math.min(this.state.pageOffset + 1, this.getMaxPageOffset()),
    });
  }

  previous() {
    this.setState({
      pageOffset: Math.max(this.state.pageOffset - 1, 0),
    });
  }

  componentWillMount() {
    if (this.loadProfile()) {
      return;
    }
    navigator.geolocation.getCurrentPosition(({coords}) => {
      this.updateUser({
        location: {lat: coords.latitude, lon: coords.longitude},
      });
    });
  }

  addToCart(id) {
    const {products, cart} = this.state;
    const matchesId = propEq('id', id);
    const product = find(matchesId, products);
    if (product) {
      const newCart = cart.slice();
      let found = false;
      newCart.forEach((item) => {
        if (matchesId(item)) {
          ++item.quantity;
          found = true;
        }
      });
      if (!found) {
        newCart.push({
          ...product,
          quantity: 1,
        });
      }
      this.setState({
        cart: newCart,
      });
      // TODO: Fire analytics event here!
      this.sendEvent('addToCart', {
        ...product,
      });
    }
  }

  clearCart() {
    this.setState({
      cart: [],
      cartId: cuid(),
    });
  }

  checkout() {
    const items = this.state.cart.map(({id}) => id);
    this.setState({
      cart: [],
      cartId: cuid(),
    });
    // TODO: Fire analytics event here!
    this.sendEvent('checkout', {
      items,
    });
  }

  sendEvent(event, data) {
    const {base} = this.props;
    return sendEvent(base, event, {
      ...data,
      // TODO: Add data common to all events here!
      os: this.state.os,
      browser: this.state.browser,
      userAge: this.state.user.age,
      userGender: this.state.user.gender,
      userLocation: this.state.user.location,
      cartId: this.state.cartId,
      cartTotal: getTotal(this.state.cart),
    });
  }

  renderSearch() {
    const {query} = this.state;
    return (
      <div className='input-group'>
        <input
          className='form-control'
          type='search'
          placeholder='Search'
          value={query}
          onChange={(ev) => {
            this.setState({query: ev.target.value});
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              this.search(this.state.query);
              ev.preventDefault();
            }

            if (ev.key === 'Escape') {
              this.setState({query: ''});
              this.search();
              ev.preventDefault();
            }
          }}
        />
        {this.state.query && this.state.searchQuery === this.state.query &&
          <span className='input-group-btn'>
            <button
              className='btn btn-danger'
              onClick={() => {
                this.setState({query: ''});
                this.search();
              }}
            >
              Clear
            </button>
          </span>
        }
        {this.state.searchQuery !== this.state.query &&
          <span className='input-group-btn'>
            <button
              className='btn btn-secondary'
              onClick={() => {
                this.search(this.state.query);
              }}
            >
              Search
            </button>
          </span>
        }
      </div>
    );
  }

  renderProducts() {
    const {products, pageOffset} = this.state;

    const start = pageOffset * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return (
      <div className='row'>
        {products.slice(start, end).map((product) => (
          <div key={product.id} className='col-12 col-lg-6 col-xl-4 mt-3'>
            <div className='card text-center'>
              <p className='badge badge-dark'>
                {formatPrice(product.price)}
              </p>
              <div className='p-3'>
                <img
                  className='card-img-top'
                  src={product.img}
                  alt={product.name}
                />
              </div>
              <div className='card-body'>
                <h4 className='card-title'>{product.name}</h4>
                <button
                  className='btn btn-outline-primary'
                  onClick={(ev) => {
                    ev.preventDefault();
                    this.addToCart(product.id);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderPagination() {
    return (
      <div className='d-flex justify-content-between mt-3'>
        <button
          className='btn btn-outline-secondary'
          onClick={() => this.previous()}
          disabled={this.state.pageOffset === 0}
        >
          Previous
        </button>
        <button
          className='btn btn-outline-secondary'
          onClick={() => this.next()}
          disabled={this.state.pageOffset === this.getMaxPageOffset()}
        >
          Next
        </button>
      </div>
    );
  }

  renderCart() {
    const {cart} = this.state;
    const total = getTotal(cart);
    return (
      <div className='mt-3'>
        {cart.length <= 0 && (
          <div className='alert alert-warning'>
            Your cart is empty.
          </div>
        )}
        {cart.length > 0 && (
          <table className='table table-striped'>
            <thead className='thead-inverse'>
              <tr>
                <th>Qty</th>
                <th>Item</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td>{item.quantity}</td>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2}>Total</th>
                <th>{formatPrice(total)}</th>
              </tr>
            </tfoot>
          </table>
        )}
        <div className='row no-gutters'>
          <div className='col-6 pr-1'>
            <button
              className='btn btn-block btn-outline-danger'
              onClick={(ev) => {
                ev.preventDefault();
                this.clearCart();
              }}
            >
              Clear
            </button>
          </div>
          <div className='col-6 pl-1'>
            <button
              disabled={cart.length <= 0}
              className='btn btn-block btn-success'
              onClick={(ev) => {
                ev.preventDefault();
                this.checkout();
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderForm() {
    return (
      <form>
        <div className='row'>
          <div className='col-6 col-md-2'>
            <div className='form-group'>
              <label>Age</label>
              <input
                className='form-control'
                type='number'
                min='13'
                max='100'
                value={pathOr('', ['user', 'age'], this.state)}
                onChange={(ev) => {
                  this.updateUser({
                    age: parseInt(ev.target.value, 10),
                  });
                }}
              />
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <div className='form-group'>
              <label>Gender</label>
              <select
                className='form-control'
                type='text'
                value={pathOr('', ['user', 'gender'], this.state)}
                onChange={(ev) => {
                  this.updateUser({
                    gender: ev.target.value,
                  });
                }}
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>
          <div className='col-6 col-md-4'>
            <label>Location</label>
            <div className='pt-2 bt-2'>
              {pathOr(0, ['user', 'location', 'lat'], this.state).toFixed(3)}°,
              {' '}
              {pathOr(0, ['user', 'location', 'lon'], this.state).toFixed(3)}°
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <label/>
            <button
              className='btn btn-block btn-primary'
              onClick={(ev) => {
                ev.preventDefault();
                this.loadProducts();
                this.setState({shopping: true});
              }}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </form>
    );
  }

  render() {
    const {shopping} = this.state;
    if (!shopping) {
      return (
        <div>
          {this.renderForm()}
        </div>
      );
    }
    return (
      <div>
        <div className='row'>
          <div className='col-12'>
            {this.renderSearch()}
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-6 col-lg-8'>
            {this.renderProducts()}
            {this.renderPagination()}
          </div>
          <div className='col-12 col-md-6 col-lg-4'>
            {this.renderCart()}
          </div>
        </div>
      </div>
    );
  }
}

export default Shop;
