/** Exercise 2.2 */

var express = require('express');
var router = express.Router();

/* GET tweets listing. */
router.get('/', function(req, res, next) {
  // get listing
  var allTweets;
  res.status(200);
  res.send('respond with a resource');
});

/* post */
// { tweetContent: "" }
router.post('/', function(req, res, next) {
  console.log(req.body);
  var content = req.body.tweetContent
  if (!content) {
    res.status(400);
    res.send(`respond with a post resource with content: ${content}`);
    return;
  }
  // save content
  res.status(200); 
  res.send(`respond with a post resource with content: ${content}`);
});

router.delete("/:id/", (req, res) => {
  console.log(req.params);
  var userId = req.params.id;
  if (!userId) {
    res.status(400);
    res.send(`respond with a delete resource for ${userId}`);
    return;
  }
  // delete id
  res.status(200);
  res.send(`respond with a delete resource for ${userId}`);
});

module.exports = router;
