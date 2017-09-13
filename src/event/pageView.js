import browser from 'bowser';
import {sendEvent} from '../analytics';

const pageView = () => {
  sendEvent('pageview', {
    screenWidth: screen.width,
    screenHeight: screen.height,
    browser: [
      browser.name,
      `${browser.name}@${browser.version}`,
    ],
  });
};

export default pageView;
