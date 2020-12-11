const fs = require('fs')
const git = require('simple-git')()
const diff = require('changeset')

const source = 'homepage'
const revision = 'HEAD~1'

const dataFilename = `./data/${source}.json`
const changesFilename = `./data/${source}.changes.json`
git.diff([revision, dataFilename]).then(homePageChanges => {
  if (!homePageChanges) return

  console.log('%s has changed. Retrieving prior version', dataFilename)
  return git.show(`${revision}:${dataFilename}`).then(s => {
    const prior = JSON.parse(s)
    const current = require(dataFilename)

    const changes = diff(prior, current)
    if (changes) {
      const changeset = require(changesFilename)
      const now = new Date()
      changeset.changes[now.valueOf()] = {
        ts: now.valueOf(),
        hero: changes.find(c => c.key[0] === 'hero') ? current.hero : null,
        promos: changes.find(c => c.key[0] === 'promos') ? current.promos : null
      }

      console.log('writing changes to %s', changesFilename)
      fs.writeFileSync(changesFilename, JSON.stringify(changeset, null, '\t'))
    }
  })
})
