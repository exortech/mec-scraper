const dailyDealChanges = require('./dailyDealChanges')

dailyDealChanges.detectChange().then(newChange => {
  if (!newChange) return

  const changeset = dailyDealChanges.updateChangeset(newChange)

  dailyDealChanges.generateChangesDoc(changeset)
})
