const path = require('path');
const authConfig = require('../config/auth');

class PageController {
    show(req, res, next) {
        let filteredId = path.parse(req.params.pageId).base;
        if (filteredId === 'register') {
            authConfig.auth.status = false;
        }

        let pageName = filteredId + '.ejs'
        if(req.list.indexOf(pageName) !== -1) {
            console.log(req.session)
            res.render(pageName, {title:filteredId, req: req});
        } else {
            let err = new Error('Something Broke!');
            err.status = 500;
            next(err);
        }
    };
};

module.exports = new PageController();