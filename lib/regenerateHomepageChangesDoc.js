const homepageChanges = require('./homepageChanges')

const changeset = homepageChanges.readChangeset()
homepageChanges.writeChangesDoc(changeset)
