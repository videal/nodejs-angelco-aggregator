const lookup = require('nodejs-google-api-socialgraph-hovercard-lookup');
const configurations = require('./configurations');
const request = require('request');
var interval;
module.exports = (company) => {
    return new Promise((resolve, reject) => {
        var promises = [];
        var founders = company.founders;
        if (founders != undefined) {
            for (var i = 0; i < founders.length; i++) {
                var founderEmails = founders[i].emails;
                founders[i].emails = [];
                if (founderEmails != undefined) {
                    for (var j = 0; j < founderEmails.length; j++) {
                        ((i, j, founderEmails) => {
                            promises.push((proxyAddress) => {
                                var email = founderEmails[j];
                                return new Promise((resolve, reject) => {
                                    lookup.process(request, email, proxyAddress, (error, googlePlusUri) => {
                                        if (error) {
                                            resolve();
                                        }
                                        if (googlePlusUri) {
                                            company.founders[i].emails.push(email);
                                        }
                                        resolve();
                                    });
                                });
                            });
                        })(i, j, founderEmails);
                    }
                }
            }
        }
        promises.push(() => {
            clearInterval(interval);
            console.log('resolve');
            resolve(company);
        });
        var p = -1;
        var promisesCount = promises.length;
        var run = (proxyAddress) => {
            if (p < promisesCount) {
                p++;
                if (promises[p] != undefined) {
                    promises[p](proxyAddress);
                }
            }
        };
        interval = setInterval(() => {
            run();
        }, 3000);
    });
};