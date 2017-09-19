import React from 'react';
import JSONView from 'react-json-view';

import {setupIndex, removeIndex, bulk} from '../admin';
import {sendEvent} from '../analytics';
import {indexSettings} from '../config';
import {fetchSampleData, sampleIndex} from '../tutorial';

const MAPPINGS_URL = [
  'https://www.elastic.co/guide/en/elasticsearch',
  '/reference/current/mapping-types.html',
].join('');

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      result: null,
      sampleEvent: this.generateSampleEvent(),
    };
  }

  handleResponse(res) {
    this.setState({loading: true});
    res.then(
      (out) => this.setState({
        loading: false,
        result: out,
        error: false,
      }),
      (err) => this.setState({
        loading: false,
        result: err,
        error: true,
      })
    );
  }

  generateSampleEvent() {
    const os = ['android', 'ios', 'mac', 'windows', 'linux'];
    const browser = ['chrome', 'firefox', 'safari', 'ie', 'other'];
    const gender = ['male', 'female', 'other'];
    const pick = (x) => x[Math.floor(Math.random() * x.length)];
    return {
      os: pick(os),
      browser: pick(browser),
      gender: pick(gender),
      age: Math.floor(Math.random() * 20 + 20),
    };
  }

  renderSetupIndex() {
    const {base} = this.props;
    const {loading} = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-2'>
            Step 1:
          </div>
          <div className='col'>
            <p>
              First you need to{' '}
              <button
                className='btn btn-outline-primary btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    setupIndex(base, indexSettings)
                  );
                }}
                disabled={loading}
              >
                setup your index
              </button>. This tells ElasticSearch what
              kinds of data you're going to be sending it.
              We can start with a simple mapping that defines what a
              <code>pageview</code> event might look like.
            </p>

            <figure className='figure'>
              <JSONView src={indexSettings}/>
            </figure>

            <p>
              If you screw up or what to change your
              mappings you have you can always{' '}
              <button
                className='btn btn-outline-danger btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    removeIndex(base)
                  );
                }}
                disabled={loading}
              >
                delete your index
              </button>{' '}
              and try again. You can see the list of data types available{' '}
              <a href={MAPPINGS_URL}>here</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderSendTestEvent() {
    const {base, kibanaUrl} = this.props;
    const {loading, sampleEvent} = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-2'>
            Step 2:
          </div>
          <div className='col'>
            <p>
              Once your index is ready you can test it out and{' '}
              <button
                className='btn btn-outline-secondary btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    sendEvent(base, 'pageview', sampleEvent)
                  );
                  this.setState({
                    sampleEvent: this.generateSampleEvent(),
                  });
                }}
                disabled={loading}
              >
                send an event
              </button> to it. Try sending multiple events.
              The events you send will appear in{' '}
              <a href={kibanaUrl}>Kibana</a>{' '}
              once you configure your index in{' '}
              <a href={`${kibanaUrl}/app/kibana#/management/kibana/index`}>
                Kibana's settings
              </a>.
            </p>
            <figure className='figure'>
              <JSONView src={sampleEvent}/>
            </figure>
          </div>
        </div>
      </div>
    );
  }

  renderLoadSampleData() {
    const {base} = this.props;
    const {loading} = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-2'>
            Step 3:
          </div>
          <div className='col'>
            Once you're satisfied with being able to put data into
            ElasticSearch it's time to{' '}
            <button
              className='btn btn-outline-secondary btn-sm'
              onClick={(ev) => {
                ev.preventDefault();
                this.handleResponse(
                  Promise.resolve()
                    .then(() => removeIndex(base)
                      .catch(() => Promise.resolve())
                    )
                    .then(() => setupIndex(base, sampleIndex))
                    .then(() => fetchSampleData()
                      .then((sampleData) => bulk(base, sampleData))
                    )
                    .then(() => Promise.resolve({status: 'ok'}))
                );
              }}
              disabled={loading}
            >
              load the sample data set
            </button> and explore it with Kibana. Note that this will delete
            all existing data in your index and replace it with the sample
            data. You may need to reload your index in Kibana if your mappings
            have changed.
          </div>
        </div>
      </div>
    );
  }

  renderConfig() {
    const {base} = this.props;
    return (
      <form>
        <h3>Configuration</h3>
        <div className='form-group'>
          <label htmlFor='es-index'>ElasticSearch URL</label>
          <input
            id='es-index'
            className='form-control'
            type='text'
            value={base}
            onChange={(ev) => {
              this.setState({base: ev.target.value});
            }}
          />
          <small className='form-text text-muted'>
            This is the URL to the index all operations will
            use. e.g.{' '}
            <code>http://localhost:9200/my-index</code>. If
            you want to setup a server yourself please see the
            docs here.
          </small>
        </div>
      </form>
    );
  }

  renderAlerts() {
    const {result, error} = this.state;
    return result && (
      <div>
        <div
          className={`alert alert-${error ? 'danger' : 'primary'}`}
          role='alert'
        >
          {error ? 'Error' : 'Success'}
        </div>
        <figure className='figure'>
          <JSONView src={result}/>
        </figure>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>Tutorial</h3>
        {this.renderAlerts()}
        {this.renderSetupIndex()}
        {this.renderSendTestEvent()}
        {this.renderLoadSampleData()}
      </div>
    );
  }
}

export default Tutorial;
