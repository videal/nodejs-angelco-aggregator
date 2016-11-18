const emailGenerator = require('nodejs-email-address-generator');
module.exports = (company) => {
    return new Promise((resolve, reject) => {
        if (company.site != undefined) {
        var founders = company.founders;
        if (founders != undefined) {
            for (var j = 0; j < founders.length; j++) {
                var founder = founders[j];
                founder.emails = [];
                var name = founder.name.split(' ');
                var site = company.site.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)[2];
                var generated = emailGenerator.build(name[0], name[1], '', site);
                if (generated != undefined) {
                    for (var e = 0; e < generated.length; e++) {
                        founder.emails.push(generated[e]);
                    }
                }
            }
        }
            resolve(company);
        }
        reject(new Error('Site is undefined'));
    });
};