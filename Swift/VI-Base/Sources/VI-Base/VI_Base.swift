import Foundation

class VI_Base {
    var search = Search();
    var text: String = "VI-Base";
    
    public func getVersionData(cli: String, _ completion: @escaping (NSArray) -> ()) {
        search.getVersion(client: cli) {
            (data) in
            completion(data as NSArray);
        }
    }
}
