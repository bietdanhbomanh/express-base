const paginate = (currentPage = 1, perPage = 10, totalItems, items) => {
    const pages = Math.ceil(totalItems / perPage);

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;

    const result = items.slice(startIndex, endIndex);

    return {
        currentPage,
        perPage,
        totalItems,
        pages,
        hasNextPage: currentPage < pages,
        hasPreviousPage: currentPage > 1,
        result,
    };
};

module.exports = paginate;
