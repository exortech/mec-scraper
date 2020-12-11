const fs = require('fs')
const git = require('simple-git')()
const diff = require('changeset')

const source = 'dailydeals'
const revision = 'HEAD'
const dataFilename = `./data/${source}.json`
const changesFilename = `./data/${source}.changes.json`

const generateChangesDoc = (changeset) => {
  const header = '# Daily Deal changes\n'
  const tableHeader = '| Date | Changes |\n| --- | --- |'
  const tableContents = Object.entries(changeset.changes).map(([ts, change]) => {
    console.log(ts, change)
    const timeString = new Date(change.ts).toLocaleString('en-CA')
    const changes = []
    if (change.hero) {
      changes.push(`| ${timeString} | **New Hero:** ${change.hero.headline} - ${change.hero.tagline} <br /><img src='${change.hero.img}' width='200' /> |`)
    }
    if (change.products) {
      if (change.products.length === 0 && !change.hero) {
        changes.push(`| ${timeString} | **No products shown!** |`)
      } else {
        changes.push(...change.products.map(product => {
          return `| ${timeString} | **New Product #${product.idx + 1}:** [${product.code} ${product.name}](${product.href}) - ${product.price} |`
        }))
      }
    }
    return changes.join('\n')
  }).join('\n')
  const footer = '\n[Back to main page](index.md)'
  return [header, tableHeader, tableContents, footer].join('\n')
}

const writeChangesDoc = (changeset) => {
  const doc = generateChangesDoc(changeset)
  fs.writeFileSync(`./docs/${source}.md`, doc)
}

const readChangeset = () => {
  return require('.' + changesFilename)
}

const updateChangeset = (newChange) => {
  const changeset = readChangeset()
  changeset.changes[newChange.ts] = newChange
  console.log('writing changes to %s', changesFilename)
  fs.writeFileSync(changesFilename, JSON.stringify(changeset, null, '\t'))
  return changeset
}

const detectChange = () => {
  return git.diff([revision, '--', dataFilename]).then(diffOutput => {
    if (!diffOutput) return

    console.log('%s has changed. Retrieving prior version', dataFilename)
    return git.show(`${revision}:${dataFilename}`).then(s => {
      const prior = JSON.parse(s)
      const current = require('.' + dataFilename)

      const changes = diff(prior, current)
      if (!changes) return

      const now = new Date()
      console.log('Changes: %o', changes)
      return {
        ts: now.valueOf(),
        hero: changes.find(c => c.key[0] === 'hero') ? current.hero : null,
        products: current.products.filter((product, i) => changes.find(c => c.key[0] === 'products' && c.key[1] === i.toString()))
      }
    })
  })
}

module.exports = {
  detectChange,
  generateChangesDoc,
  writeChangesDoc,
  readChangeset,
  updateChangeset
}
