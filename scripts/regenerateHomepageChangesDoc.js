const homepageChanges = require('../lib/homepageChanges')

const changeset = homepageChanges.readChangeset()
homepageChanges.writeChangesDoc(changeset)
