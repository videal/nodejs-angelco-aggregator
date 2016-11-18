const emailGenerator = require('nodejs-email-address-generator');
module.exports = (models) => {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < models.length; i++) {
            if (models[i].site != "" && models[i].site != undefined) {
                console.log(models[i].site);
                if (models[i].founders != undefined) {
                    for (var j = 0; j < models[i].founders.length; j++) {
                        models[i].founders[j].emails = [];
                        var name = models[i].founders[j].fullName.split(' ');
                        var site = models[i].site.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)[2];
                        var generated = emailGenerator.build(name[0], name[1], site);
                        if (generated != undefined) {
                            for (var e = 0; e < generated.length; e++) {
                                models[i].founders[j].emails.push(generated[e]);
                            }
                        }
                    }
                }
            }
        }
        resolve(models);
    });
};