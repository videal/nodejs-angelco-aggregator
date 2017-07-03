const model = require('nodejs-angelco-database');
const emailChecker = require('./modules/emailChecker');
const emailGenerator = require('./modules/emailGenerator');
module.exports = () => {
    return model.company.GetWithUpdate()
        .then(result => {
            if (result != undefined) {
                console.log(result.founders);
                return emailGenerator(result);
            } else {
                throw new Error();
            }
        })
        .then(result => {
            return emailChecker(result);
        })
        .then(result => {
            return model.company.UpdateCompany(result);
        });
};