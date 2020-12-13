const homepageChanges = require('../lib/homepageChanges')

homepageChanges.detectChange().then(newChange => {
  if (!newChange) return

  const changeset = homepageChanges.updateChangeset(newChange)

  homepageChanges.writeChangesDoc(changeset)
})
