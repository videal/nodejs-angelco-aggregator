const main = require('../');
var start = () => {
    main()
        .then(start)
        .catch(error => {
            setTimeout(start, 5000);
        });
};
start();