import XCTest
@testable import VI_Base
import VI_Base

final class VI_BaseTests: XCTestCase {
    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct
        // results.
        XCTAssertEqual(VI_Base().text, "VI-Base");
        
        // Real testing here
        let vi = VI_Base();
        vi.getVersionData(cli: "canary") { (res) in
            print(res);
        };
        
    
    }

    static var allTests = [
        ("testExample", testExample),
    ]
}
