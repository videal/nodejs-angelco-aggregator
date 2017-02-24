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
                                    lookup.process(proxyAddress, request, email, (error, googlePlusUri) => {
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
                if (typeof (promises[p]) == 'function') {
                    promises[p](proxyAddress);
                }
            }
        };
        interval = setInterval(() => {
            var username = configurations.proxy.username;
            var password = configurations.proxy.password;
            var port = 22225;
            var session_id = (1000000 * Math.random()) | 0;
            var proxyAddress = 'http://' + username + '-session-' + session_id + ':' + password + '@zproxy.luminati.io:' + port;
            run(proxyAddress);
        }, 3000);
    });
};