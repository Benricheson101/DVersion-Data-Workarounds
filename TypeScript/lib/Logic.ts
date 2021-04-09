export const rel_cha_Logic = function(rc: string): string {
    return rc.toLowerCase() === 'canary' || rc.toLowerCase() === 'ptb' ? rc.toLowerCase() : 'stable';
}

export const makeReqURLs = function(rc: string) {
    if (rel_cha_Logic(rc) === 'canary' || rel_cha_Logic(rc) === 'ptb') {
        return {
            basic: "https://" + rel_cha_Logic(rc) + ".discord.com",
            first: `https://${rel_cha_Logic(rc)}.discord.com/app`
        }
    } else {
        return {
            basic: "https://discord.com",
            first: "https://discord.com/app"
        }
    }
}
