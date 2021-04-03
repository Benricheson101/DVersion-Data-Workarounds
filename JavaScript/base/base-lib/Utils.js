const https = require('https');
const rels = require('./Constants').rels,
    base_hostname = require('./Constants').base_hostname;

/**
 *
 * @param input
 * @returns {string}
 */
const parse_rels = function(input) {
    let rel_c = rels.filter(f => f === input.toLowerCase())[0];
    if (rel_c === 'canary' || rel_c === 'ptb') return `https://${rel_c}.${base_hostname}`;
    else return `https://${base_hostname}`;
};

/**
 *
 * @param input
 * @returns {string|string}
 */
const dis_rel = function(input) {
    let rel_c = rels.filter(f => f === input.toLowerCase())[0];
    if (rel_c === 'canary' || rel_c === 'ptb') return rel_c;
    else return 'stable';
}

/** Simplified GET request
 *
 * @param args
 * @returns {Promise<String>}
 */
const get = async function(...args) {
    return new Promise((res, rej) => {
        https.get(args[0], resp => {
            let buffer = [];
            resp.on('data', d => buffer.push(d));
            resp.on('end', () => {
                try {
                    res(Buffer.concat(buffer).toString());
                } catch (e) {
                    rej(e);
                }
            });
        })
            .on('error', err => rej(err));
    });
};

module.exports = {
    parse_rels,
    dis_rel,
    get
}
