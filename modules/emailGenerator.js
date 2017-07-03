const emailGenerator = require('nodejs-email-address-generator');
module.exports = (company) => {
    return new Promise((resolve, reject) => {
        if (company.site != undefined) {
            var founders = company.founders;
            if (founders != undefined) {
                for (var j = 0; j < founders.length; j++) {
                    var founder = founders[j];
                    founder.emails = [];
                    if (founder.name || founder.name != '') {
                        var name = founder.name.split(' ');
                        var site = company.site;;
                        var generated = emailGenerator.build(name[0], name[1], '', site);
                        if (generated != undefined) {
                            for (var e = 0; e < generated.length; e++) {
                                founder.emails.push(generated[e]);
                            }
                        }
                    } else {
                        reject(new Error('Founder name is undefined'));
                    }
                }
            }
            resolve(company);
        }
        reject(new Error('Site is undefined'));
    });
};