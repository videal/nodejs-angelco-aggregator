const proxyModel = require('nodejs-proxy-model');
const proxyFilter = require('nodejs-proxy-filter');
const proxyChecker = require('nodejs-proxy-checker');
const proxyChanger = require('nodejs-proxy-changer');
const proxyList = require('nodejs-proxy-list');
var Checker = new proxyChecker();
var checkedProxies = [];
var changer;
module.exports.Changer = () => {
    return new Promise((resolve, reject) => {
        if (checkedProxies.length != 0) {
            resolve(changer);
        } else {
            proxyList.start(__dirname+'/proxies.bson').then(result => {
                var proxies;
                proxies = proxyModel.fromStringArray(result);
                Checker.check(proxies,
                    'https://plus.google.com/',
                    (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            data = proxyFilter.alive(data);
                            var aliveAddresses = [];
                            for (var i = 0; i < data.length; i++) {
                                aliveAddresses.push(data[i].address);
                            }
                            checkedProxies = proxyModel.fromStringArray(aliveAddresses);
                            changer = proxyChanger(checkedProxies);
                            resolve(changer);
                        }
                    });

            });
        }
    });
};