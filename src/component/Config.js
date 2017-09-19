import React from 'react';
import {getIndex} from '../util';

const DOCS_URL = 'https://github.com/metalabdesign/startupslam-2017';

class Config extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {base, kibanaUrl} = this.props;
    const {onUpdateBase, onUpdateKibanaUrl} = this.props;
    const index = getIndex(base);
    return (
      <div>
        <h3>Configuration</h3>
        <form>
          <div className='form-group'>
            <label htmlFor='es-index'>ElasticSearch URL</label>
            <input
              id='es-index'
              className='form-control'
              type='text'
              value={base}
              onChange={(ev) => {
                onUpdateBase(ev.target.value);
              }}
            />
            <small className='form-text text-muted'>
              This is the URL to the index all operations will
              use. e.g.{' '}
              <code>http://localhost:9200/my-index</code>. If
              you want to setup a server yourself please see the
              documentation <a href={DOCS_URL}>here</a>.
              Your index is <code>{index}</code>.
            </small>
          </div>
          <div className='form-group'>
            <label htmlFor='kibana-url'>Kibana URL</label>
            <input
              id='kibana-url'
              className='form-control'
              type='text'
              value={kibanaUrl}
              onChange={(ev) => {
                onUpdateKibanaUrl(ev.target.value);
              }}
            />
            <small className='form-text text-muted'>
              This is the URL to Kibana. e.g.{' '}
              <code>http://localhost:5601</code>. If
              you want to setup a server yourself please see the
              documentation <a href={DOCS_URL}>here</a>.
            </small>
          </div>
        </form>
      </div>
    );
  }
}

export default Config;
