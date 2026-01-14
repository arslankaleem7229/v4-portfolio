let sr;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  const ScrollReveal = require('scrollreveal').default;
  sr = ScrollReveal();
} else {
  sr = null;
}

export default sr;
