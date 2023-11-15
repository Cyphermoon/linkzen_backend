const applySort = (sort) => {
  let sortCriteria = {};

  if (sort) {
    switch (sort) {
      case "createdAtAsc":
        sortCriteria = { createdAt: 1 };
        break;

      case "createdAtDesc":
        sortCriteria = { createdAt: -1 };
        break;

      case "updatedAtAsc":
        sortCriteria = { updatedAt: 1 };
        break;

      case "updatedAtDesc":
        sortCriteria = { updatedAt: -1 };
        break;

      case "titleAsc":
        sortCriteria = { title: 1 };
        break;

      case "titleDesc":
        sortCriteria = { title: -1 };
        break;

      default:
        // default to descending order
        sortCriteria = { createdAt: -1 };
        break;
    }
  } else {
    sortCriteria = { createdAt: -1 };
  }

  return sortCriteria;
};

module.exports = applySort;
