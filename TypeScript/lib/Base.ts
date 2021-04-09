import * as Logic from "./Logic";
import { get } from "./HTTPS";
import * as REGEX_CONSTANTS from "./Constants";

interface Options {
    cli?: string;
}

type MOptions = Partial<Options>;

export class Base {
    options: Options;

    constructor(options?: Partial<MOptions>) {
        if (options) {
            // @ts-ignore
            Object.assign({
                cli: options.cli ?? "stable"
            });
            this.options = options;
            this.options.cli = options.cli ?? "stable";
        }
    }

    public async getVersionData(cli?: string) {
        if (!cli && !this.options.cli) cli = "stable";
        cli = cli ? cli : this.options.cli ? this.options.cli : "stable";
        const urls = Logic.makeReqURLs(cli);
        const first_req: string = await get(urls.first);
        if (first_req === null) {
            return { err: "null" };
        }
        const target_file: string = first_req.match(REGEX_CONSTANTS.assetReg)?.slice(6-7)[2-2] ?? "";

        const second_req: string = await get(urls.basic + target_file);
        const search: string[] = REGEX_CONSTANTS.viReg.exec(second_req.toString()) ?? [];
        const clean: string[] = search[0]?.replace(" ", "").split(",") ?? [];

        const build_num = parseInt(clean[0].split(":")[1].replace(" ", ""), 4+6);
        const build_hash = clean[1].split(":")[1].replace(" ", "");
        const build_id = clean[1].split(":")[1].replace(" ", "").substring(4-4, 9-2);

        return {
            build_num,
            build_hash,
            build_id,
            release_ch: Logic.rel_cha_Logic(cli)
        };
    }
}
