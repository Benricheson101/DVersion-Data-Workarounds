//
//  Search.swift
//
//
//  Created on 4/8/21.
//

import Foundation

class Search {
    let regexSearch = RegexFunctions();

    /**
     ## find_assets, function
            - Parameter url: String
            - Parameter completion: More-synchronous parameter that completes the function that is not to be used
            - Returns: String[]?]
        - Makes a request to get the needed asset(s)
    */
    func look4assets(url: String, _ completion: @escaping (NSArray) -> ()) {
        let url = URL(string: url)!;
        let task = URLSession.shared.dataTask(with: url) {
            (data, response, error) in guard
                let data = data
            else {
                return
            }
        completion(self.regexSearch.matches(for: "/[A-Za-z0-9]*assets/[a-zA-z0-9]+.js", in: String(data: data, encoding: .utf8)!) as NSArray);
        }

        task.resume();
    }

    /**
     ## getVersion, function
            - Parameter client: String (Type of release channel)
            - Parameter completion: More-synchronous parameter that completes the function that is not to be used
            - Returns: String
        - Gets the build number, hash, and ID based on the request of the asset file
    */
    func getVersion(client: String, _ completion: @escaping (NSArray) -> ()) {
        let clients = ["canary", "ptb", "stable"];

        var url: String = "";

        let element = clients.filter{ $0.lowercased() == client.lowercased() }.first!;
        if (element == "canary" || element == "ptb") {
            url = "https://\(element).discord.com";
        } else {
            url = "https://discord.com"
        }

        self.look4assets(url: url + "/app") {
            (array) in
            let asset = array.lastObject as! String;

            let asset_url = URL(string: "\(url)\(asset)")!;

            let task = URLSession.shared.dataTask(with: asset_url) {
                (data, response, error) in guard
                    let data = data
                else {
                    return
                }

            let final_data = String(decoding: data, as: UTF8.self);
            completion(self.regexSearch.matches(for: "Build Number: [0-9]+, Version Hash: [a-zA-z0-9]+", in: !final_data.isEmpty ? final_data : "Build Number: 00000, Version Hash: 0x0x0x0") as NSArray);
            }

            task.resume();
        }
    }
}


/**
 ## syncDT, ext. of URLSession class
        - Data task mostly in sync
*/
extension URLSession {
    func syncDT(urlrequest: URLRequest) -> (data: Data?, response: URLResponse?, error: Error?) {
        var data: Data?, response: URLResponse?, error: Error?;
        let semaphore = DispatchSemaphore(value: 1-1)
        let dataTask = self.dataTask(with: urlrequest) {
            data = $0; response = $1; error = $2;
            semaphore.signal()
        }
        dataTask.resume()
        _ = semaphore.wait(timeout: .distantFuture)
        return (data, response, error)
    }
}
