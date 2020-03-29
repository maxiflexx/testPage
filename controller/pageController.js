const path = require('path');

class PageController {
    show(req, res, next) {
        let filteredId = path.parse(req.params.pageId).base;
        let pageName = filteredId + '.ejs'
        if(req.list.indexOf(pageName) !== -1) {
            res.render(pageName, {title:filteredId});
        } else {
            next();
        }
    };
};

module.exports = new PageController();