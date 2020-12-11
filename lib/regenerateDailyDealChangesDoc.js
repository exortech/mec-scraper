const dailyDealChanges = require('./dailyDealChanges')

const changeset = dailyDealChanges.readChangeset()
dailyDealChanges.writeChangesDoc(changeset)
