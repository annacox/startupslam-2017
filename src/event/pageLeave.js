import {sendEvent} from '../analytics';

const start = Date.now();

const pageLeave = () => {
  const duration = Date.now() - start;
  sendEvent('pageleave', {
    duration,
  });
};

export default pageLeave;
