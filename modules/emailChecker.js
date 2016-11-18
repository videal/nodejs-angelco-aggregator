const lookup = require('nodejs-google-api-socialgraph-hovercard-lookup');
const request = require('request');
const proxy = require('./proxy');
var proxyChanger;
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
                                        ((proxy) => {
                                            console.log(proxy);
                                            proxyChanger.freeProxy(proxy);
                                        })(proxyAddress);
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
                //var proxyAddress = proxyChanger.takeProxy();
                p++;
                if (typeof(promises[p]) == 'function') {
                    promises[p](proxyAddress);
                }
            }
        };
        proxy.Changer().then(result => {
            proxyChanger = result;
            interval = setInterval(() => {
                var proxyAddress = proxyChanger.takeProxy();
                 if (proxyAddress != null) {
                     run(proxyAddress);
                }
            }, 100);
        });
    });
};