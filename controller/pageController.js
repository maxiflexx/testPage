const path = require('path');

class PageController {
    show(req, res) {
        let filteredId = path.parse(req.params.pageId).base;
        res.render(filteredId + '.ejs', {title:filteredId})
    }
}

module.exports = new PageController();