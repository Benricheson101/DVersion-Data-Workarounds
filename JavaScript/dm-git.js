const https = require('https'),
      http2 = require('http2'),
      { URL } = require('url'),
      dmu = new URL("https://api.github.com/repos/DJScias/Discord-Datamining/commits");

/**
 * Workaround that uses latest commits from https://github.com/DJScias/Discord-Datamining with GitHub's API
 * (https://api.github.com/repos/DJScias/Discord-Datamining/commits)
 * Limitations: Exclusive to canary, gets latest data only
 * @returns {Promise<Object>}
 */
const buildDM = async function() {
    let options = {
        hostname: dmu.hostname,
        path: dmu.pathname,
        method: http2.constants.HTTP2_METHOD_GET,
        headers: {
            [http2.constants.HTTP2_HEADER_USER_AGENT]: '*'
        }
    };

    return new Promise(res => {
        https.request(options, resp => {
            let buffer = [];
            resp.on('data', d => buffer.push(d));
            resp.on('end', () => {
                let data;

                try { data = JSON.parse(Buffer.concat(buffer).toString())[0]; }
                catch (e) { res(e); }

                let search = (/[A-Za-z0-9]+ \(Canary build: [0-9]+\)/).exec(data.commit.message)[0];
                const buildNumber = (/Canary build: [0-9]+/).exec(search)[0].split(":").slice(-1)[0].trim();
                const buildHash = (/[A-Za-z0-9]+/).exec(search)[0];
                const buildID = buildHash.substring(0, 7);

                /* Return scheme
                * {
                *   buildNumber: <number>,
                *   buildHash: <hash>,
                *   buildID: <id>
                * }
                */

                res({
                    buildNumber,
                    buildHash,
                    buildID
                });
            });
        }).end();
    });
};

module.exports = { buildDM };
