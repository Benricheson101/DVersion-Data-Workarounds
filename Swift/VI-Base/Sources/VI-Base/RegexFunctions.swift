//
//  File.swift
//
//
//  Created on 4/8/21.
//

import Foundation

class RegexFunctions {
    /**
      ## matches, function
            - Parameter regex: String
            - Parameter text: String
            - Returns String[]?
    */
    func matches(for regex: String, in text: String) -> [String] {

        do {
            let regex = try NSRegularExpression(pattern: regex)
            let results = regex.matches(in: text,
                                    range: NSRange(text.startIndex..., in: text))
            return results.map {
                String(text[Range($0.range, in: text)!])
            }
        } catch let error {
            // Returns empty array and displays an error
            print("Invalid Regex: \(error.localizedDescription)")
            return []
        }
    }
}
