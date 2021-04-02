const https = require('https'),
      http2 = require('http2'),
      { URL } = require('url'),
      qs = require('querystring'),
      bsu = new URL("https://builds.discord.sale/builds/raw?page=1&size=1");

/**
 * Workaround that uses data from https://builds.discord.sale/builds/raw?page=1&size=1
 * Data is return inside the sale object
 * Limitations: Exclusive to canary, gets latest data
 * @returns {Promise<Object>}
 */
const buildSale = async function() {
    const params = {
        page: bsu.searchParams.get('page'),
        size: bsu.searchParams.get('size')
    };
    let options = {
        hostname: bsu.hostname,
        path: `${bsu.pathname}?${qs.stringify(params)}`,
        method: http2.constants.HTTP2_METHOD_GET
    };

    return new Promise(res => {
        https.request(options, resp => {
            let buffer = [];
            resp.on('data', d => buffer.push(d));
            resp.on('end', () => {
                let data;

                try { data = JSON.parse(Buffer.concat(buffer).toString()).data[0]; }
                catch (e) { res(e); }

                const keys = Object.keys(data);

                let sale = {};
                for (let i in keys) {
                    sale[keys[i]] = data[keys[i]];
                }

                /* Return scheme
                * {
                *   buildNumber: <number>,
                *   buildHash: <hash>,
                *   buildID: <id>
                * }
                */

                res(sale);
            });
        }).end();
    });
};

module.exports = { buildSale };

