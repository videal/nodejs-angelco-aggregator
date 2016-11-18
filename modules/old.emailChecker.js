const request = require('request');
const HttpsProxyAgent = require('https-proxy-agent');
const lookup = require('nodejs-google-api-socialgraph-hovercard-lookup');
module.exports = (models) => {
    return new Promise((resolve, reject) => {
        var self = this;
        self.emails = [];
        self.promises = [];
        self.models = models;
        if (self.models != undefined) {
            for (var i = 0; i < self.models.length; i++) {
                if (self.models[i].founders != undefined) {
                    for (var j = 0; j < self.models[i].founders.length; j++) {
                        self.emails = self.models[i].founders[j].emails;
                        if (self.emails != undefined) {
                            for (var e = 0; e < self.emails.length; e++) {
                                self.models[i].founders[j].emails = [];
                                var promise = () => {
                                var email = self.models[i].emails[e];
                                var modelIndex = i;
                                var founderIndex = j;
                                    return new Promise((resolve, reject) => {
                                        lookup.process(request, email, function(error, googlePlusUri) {
                                            if (googlePlusUri) {
                                                self.models[modelIndex].founders[founderIndex].emails.push(email);
                                                self.models[modelIndex].hasEmail = true;
                                            }
                                            resolve();
                                        });
                                    });
                                };
                                self.promises.push(promise);
                            }
                        }
                    }
                }
            }
            self.promises.push(() => {
                return new Promise((res, reject) => {
                    resolve(models);
                });
            });
            var p = 0;
            var promisesCount = self.promises.length;
            var callback = () => {
                if (p < promisesCount) {
                    p++;
                    self.promises[p]()
                        .then(() => {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                }, 30000);
                            });
                        })
                        .then(callback);
                }
            };
            self.promises[p]().then(callback);
        } else {
            reject(new Error('Models is null'));
        }
    });
};