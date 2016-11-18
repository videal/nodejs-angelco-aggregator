const model = require('nodejs-angelco-database');
const emailChecker = require('./modules/emailChecker');
const emailGenerator = require('./modules/emailGenerator');
module.exports = () => {
    return new Promise((resolve, reject) => {
        return model.company.GetWithUpdate()
            .then(result => {
                if (result != undefined) {
                    console.log(result.name);
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
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
};