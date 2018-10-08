import express from 'express';
import data from '../data/getDataObj.js';

const router = express.Router();

router.get(
    '/getDoodle',
    (req, res) => {
        console.log(req.query);
        let r = getDoodle(req.query.word);
        res.send(r);
    console.log(JSON.stringify(r));
    }
);


router.get(
    '/getAll',
    (req, res) => {
        console.log(req.query);
        let r = data;
        res.send(r);
    console.log(JSON.stringify(r));
    }
);

var getDoodle = (word) => {
    let r = {};
		r.doodle = {};
    if (data[word]) {
        r.doodle = data[word][Math.floor(Math.random() * 10)];
        r.error = false;
    } else {
        r.error = true;
    }
    return r;
    console.log(JSON.stringify(r.doodle));
}


export default router;
