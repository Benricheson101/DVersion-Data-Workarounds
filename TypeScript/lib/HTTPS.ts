import * as https from "https";
import * as http from "http";

export const get = async function(...args: (string | object)[]): Promise<string> {
    return new Promise<string>((res, rej) => {
        const req: http.ClientRequest = https.get(args[0], resp => {
            let body: String[] = [];
            resp.on('data', (d: Buffer) => body.push(d.toString()));
            resp.on('end', () => {
                res(body.toString());
            });
            resp.on('error', (err: Error) => {
                rej({ err: err });
            });

            if (!body) rej({ none: "No data" });
        });
        req.end();
    });
};
