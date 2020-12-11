const homepageChanges = require('homepageChanges')

homepageChanges.detectChange().then(newChange => {
  if (!newChange) return

  const changeset = homepageChanges.updateChangeset(newChange)

  homepageChanges.generateChangesDoc(changeset)
})
