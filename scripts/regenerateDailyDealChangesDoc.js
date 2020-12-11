const dailyDealChanges = require('../lib/dailyDealChanges')

const changeset = dailyDealChanges.readChangeset()
dailyDealChanges.writeChangesDoc(changeset)
