const { JSDOM } = require('jsdom')

const download = true

const fromUri = (uri, options = {}) => {
  return JSDOM.fromURL(uri, options)
}

const fromFile = (file, options = {}) => {
  return JSDOM.fromFile(file, options)
}

const loadDailyDeals = () => {
  return download ? fromUri('https://www.mec.ca/en/products/c/100?f=CFSeasonalCollections%3Adaily+deals%3AfeatureCollection%3Aonsale') : fromFile('dailydeals.html')
}

const parsePLP = (dom) => {
  const doc = dom.window.document
  return {
    hero: {
      img: doc.querySelector('.hero__image img').getAttribute('src'),
      headline: doc.querySelector('.hero__headline').textContent,
      tagline: doc.querySelector('.hero__tagline').textContent
    },
    products: Array.from(doc.querySelectorAll('.flexigrid__tile')).map((product, idx) => {
      return {
        idx,
        code: product.getAttribute('data-griditem'),
        name: product.querySelector('.product__name__link').textContent,
        href: product.querySelector('.product__name__link').getAttribute('href'),
        price: product.querySelector('.price').lastChild.textContent.replace(/\s+/g, '')
      }
    })
  }
}

loadDailyDeals().then(parsePLP).then(data => console.log(JSON.stringify(data, null, '\t')))
