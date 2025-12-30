const asyncHandler = (fn) => {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next); // error direct error middleware ma jase
    };
};

module.exports = asyncHandler;
