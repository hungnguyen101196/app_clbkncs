const {
    responseError,
} = require('./../../libs/shared');
const { TITLE_ADMIN } = require('../../configs/constants');

module.exports = {
    index: async (req, res) => { // eslint-disable-line
        try {
            // const Info = getInfoUserSession(req);
            res.render('admin/user/index', {
                layout: 'user',
                title: TITLE_ADMIN,
                activity: 'User',
                // Info,
            });
        } catch (err) {
            res.status(500).json(responseError(1001, err));
        }
    },
};
