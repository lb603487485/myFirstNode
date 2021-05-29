/** Exercise 2.3 */

var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const dataDir = path.join(__dirname, '../data');


function checkIfFile(filename) {
    var filepath = path.join(dataDir, filename);
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
            // file doesn't exist
            if (err) { reject(err); }
            // exist, but not a file
            else if (!stats.isFile()) { reject("Given name is not a file."); }
            // exist and is file
            else { resolve(filepath); }
        });
    });
}

/* GET list all data from files under /data 
folder in a JSON array, error handler for 
no data found
*/
router.get('/', function(req, res, next) {
    var result = {};
    // read all files under the folder
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            // error handler
            console.log(`Error Catched. ${err}`);
            res.status(500);
            res.send('Unexpected Error. Please Try again later.');
        } else {
            for (const fileName of files) {
                var filePath = path.join(dataDir, fileName);
                var content = fs.readFileSync(filePath, "utf-8");
                result[fileName] = content;
            }
            res.status(200);
            res.send(result);
        }
    });
  
});

/** POST  create a file under /data with a unique number (id)
 * as file name and add content to thefile
 * { content: string }
*/
router.post('/', function(req, res, next) {
    const content = req.body.content;
    // unique id
    const id = Date.now();
    const newDataPath = path.join(dataDir, String(id));
    fs.writeFile(newDataPath, content, "utf-8", (err) => {
        if (err) {
            // error handler
            console.log(`Error Catched. ${err}`);
            res.status(500);
            res.send('Unexpected Error. Please Try again later.');
        } else {
            res.status(200);
            res.send(`Success. Content saved. "${content}"`);
        }
    });
});

/** PUT update the content for the fiven file,
 * error handler for file not found
 * { content: string }
 */

router.put('/:filename', function(req, res, next) {
    // check if given filename is exist
    const filename = req.params.filename;
    checkIfFile(filename)
        .then((filePath) => {
            // write new content
            const content = req.body.content;
            fs.writeFile(filePath, content, "utf-8", (err) => {
                if (err) {
                    // error handler
                    console.log(`Error Catched. ${err}`);
                    res.status(500);
                    res.send('Unexpected Error. Please Try again later.');
                } else {
                    res.status(200);
                    res.send(`Succeed. Content updated. "${content}"`);
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(403);
            res.send(`Failed. File "${filename}" is not found.`);
        });
});

/** DELETE delete a file with given file name, error
 * handler for file not found
 */
router.delete('/:filename', function(req, res, next) {
        // check if given filename is exist
        const filename = req.params.filename;
        var filepath = path.join(dataDir, filename);
        checkIfFile(filename)
            .then((filePath) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        // error handler
                        console.log(`Error Catched. ${err}`);
                        res.status(500);
                        res.send('Unexpected Error. Please Try again later.');
                    } else {
                        res.status(200);
                        res.send(`Succeed. File "${filename}" is deleted.`);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(403);
                res.send(`Failed. File "${filename}" is not found.`);
            });
});

module.exports = router;
