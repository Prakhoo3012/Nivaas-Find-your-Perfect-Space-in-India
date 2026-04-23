let numberOfRequestsForUser = {};
setInterval(() => {
    numberOfRequestsForUser = {};
}, 1000)

function requestLimiter(req, res, next) {
    console.log("RATE LIMIT");
    
   const userId = req.headers["user-id"];
   console.log(`UserId: ${userId}`)
   
   numberOfRequestsForUser.userId = userId;

  if (numberOfRequestsForUser[userId]) {
    numberOfRequestsForUser[userId] = numberOfRequestsForUser[userId] + 1;
    console.log(numberOfRequestsForUser);
    if (numberOfRequestsForUser[userId] > 5) {
      res.status(404).send("no entry");
    } else {
      next();
    }
  } else {
    numberOfRequestsForUser[userId] = 1;
    next();
  }
}

export {requestLimiter}