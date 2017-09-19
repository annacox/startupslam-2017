import React from 'react';
import Tutorial from './Tutorial';
import Config from './Config';
import Workshop from './Workshop';

import {base, kibanaUrl} from '../config';

const SLIDES_LINK = [
  'https://docs.google.com',
  '/presentation/d/1ubyoRG08TdUyf_rN_evLnFJ3iWkl1NDT4QzpegS0xqs',
].join('');

const GH_LINK = 'https://github.com/metalabdesign/startupslam-2017.git';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base,
      kibanaUrl,
    };
  }

  renderHeader() {
    return (
      <header>
        <h1>Startup Slam 2017</h1>
        Welcome to analytics with ElasticSearch.
        View the slide deck <a href={SLIDES_LINK}>here</a>.
        View the GitHub repo <a href={GH_LINK}>here</a>.
      </header>
    );
  }

  renderFooter() {
    return (
      <footer>
        Made with <span role='img' aria-label='love'>❤️</span> by MetaLab.
      </footer>
    );
  }

  render() {
    const {base, kibanaUrl} = this.state;
    return (
      <div className='container mt-3 mb-3'>
        {this.renderHeader()}
        <hr/>
        <Config
          base={base}
          kibanaUrl={kibanaUrl}
          onUpdateBase={(base) => this.setState({base})}
          onUpdateKibanaUrl={(kibanaUrl) => this.setState({kibanaUrl})}
        />
        <hr/>
        <Tutorial base={base} kibanaUrl={kibanaUrl}/>
        <hr/>
        <Workshop base={base}/>
        <hr/>
        {this.renderFooter()}
      </div>
    );
  }
}

export default App;
