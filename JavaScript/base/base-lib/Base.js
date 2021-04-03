const http2 = require('http2'),
      { URL } = require('url');

const { parse_rels, dis_rel, get } = require('./Utils');

const aReg = (/\/assets\/([a-zA-z0-9]+).js/g);
const bReg = (/Build Number: [0-9]+, Version Hash: [A-Za-z0-9]+/);

/**
 * Base Class that is its own library
 */
class Base {
    constructor(options) {
        this.options = options ?? {};
    }

    /** Makes a direct request to https://discord.com/app
     * Limitations: Only gets the latest version data
     * @param rc (release channel)
     * @returns {Promise<{build_id: string, build_num: number, release_channel: (string|string), build_hash: string}>}
     */
    async fetch(rc) {
        const url = new URL(parse_rels(rc));
        const release_channel = dis_rel(rc);

        let options = {
            hostname: url.hostname,
            path: '/app',
            method: http2.constants.HTTP2_METHOD_GET,
            headers: { [http2.constants.HTTP2_HEADER_USER_AGENT]: '*' }
        };

        const fReq = await get(options);
        options.path = fReq.toString().match(aReg).slice(-1)[0];

        const sReq = await get(options);
        const search = bReg.exec(sReq.toString())[0] ? bReg.exec(sReq.toString())[0].replace(" ", "").split(",") : [];

        const build_num = parseInt(search[0].split(":")[1].replace(" ", ""), 10);
        const build_hash = search[1].split(":")[1].replace(" ", "");
        const build_id = search[1].split(":")[1].replace(" ", "").substring(0, 7);

        /* Return schema
        * {
        *   build_num: <number>,
        *   build_hash: <hash>,
        *   build_id: <id>,
        *   release_channel: <type>
        * }
        */

        return {
            build_num,
            build_hash,
            build_id,
            release_channel
        };
    }
}

module.exports = Base;
