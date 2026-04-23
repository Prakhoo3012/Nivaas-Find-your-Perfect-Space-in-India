let requestCount = 0;

function reqCount(req, res, next) {
    requestCount++;
    console.log(requestCount);
    next();
}

export {reqCount}