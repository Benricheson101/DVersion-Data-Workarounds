const { Base } = require('../base-lib');

(async function() {
    console.log(await new Base().fetch('canary'));
})();

