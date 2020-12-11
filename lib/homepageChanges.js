const fs = require('fs')
const git = require('simple-git')()
const diff = require('changeset')

const source = 'homepage'
const revision = 'HEAD'
const dataFilename = `./data/${source}.json`
const changesFilename = `./data/${source}.changes.json`

const generateChangesDoc = (changeset) => {
  const header = '# Homepage changes\n'
  const tableHeader = '| Date | Changes |\n| --- | --- |'
  const tableContents = Object.entries(changeset.changes).map(([ts, change]) => {
    console.log(ts, change)
    const timeString = new Date(change.ts).toLocaleString('en-CA')
    const changes = []
    if (change.hero) {
      changes.push(`| ${timeString} | **New Hero:** ${change.hero.headline} - ${change.hero.tagline} <br /><img src='${change.hero.img}' width='200' /> |`)
    }
    if (change.promos) {
      if (change.promos.length === 0 && !change.hero) {
        changes.push(`| ${timeString} | **No promos shown!** |`)
      } else {
        changes.push(...change.promos.map(promo => {
          return `| ${timeString} | **New Promo #${promo.idx + 1}:** ${promo.cta} - ${promo.text} <br /><img src='${promo.img}' width='200' /> |`
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
        promos: current.promos.filter((promo, i) => changes.find(c => c.key[0] === 'promos' && c.key[1] === i.toString()))
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
