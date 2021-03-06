const { JSDOM } = require('jsdom')

const download = true

const loadHomepage = () => {
  return download ? JSDOM.fromURL('https://mec.ca/en/') : JSDOM.fromFile('home.html')
}

const parseHomepage = (dom) => {
  const doc = dom.window.document
  return {
    hero: {
      img: doc.querySelector('.hero__image img').getAttribute('src'),
      headline: doc.querySelector('.hero__headline').textContent,
      tagline: doc.querySelector('.hero__tagline').textContent
    },
    promos: Array.from(doc.querySelectorAll('.promo')).map((promo, idx) => {
      return {
        idx,
        img: promo.querySelector('.promo__media').getAttribute('data-high-res-src'),
        text: promo.querySelector('.promo__caption').textContent,
        cta: promo.querySelector('.promo__actions__link').textContent
      }
    })
  }
}

loadHomepage().then(parseHomepage).then(data => console.log(JSON.stringify(data, null, '\t')))
