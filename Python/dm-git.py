import urllib.request
from re import compile
from json import loads


def build_dm():
    """
    Workaround that uses latest commits from https://github.com/DJScias/Discord-Datamining with GitHub's API
    (https://api.github.com/repos/DJScias/Discord-Datamining/commits)
    Limitations: Exclusive to canary, gets latest data only
    :return:
    """

    the_url = "https://api.github.com/repos/DJScias/Discord-Datamining/commits"

    headers = {
        "User-Agent": "*"
    }
    requ = (urllib.request.urlopen(urllib.request.Request(the_url, headers=headers)).read()).decode('utf-8')

    data = ''

    try:
        data = loads(requ)[0]["commit"]["message"]
    except():
        pass

    canary_reg = compile("[A-Za-z0-9]+ \(Canary build: [0-9]+\)")
    canary_bn_reg = compile('Canary build: [0-9]+')
    canary_h_reg = compile("[A-Za-z0-9]+")

    canary_data = str(canary_reg.findall(data))
    canary_bn = str(canary_bn_reg.findall(canary_data)[0]).split(":")[-1].replace(" ", "")
    canary_h = str(canary_h_reg.findall(canary_data)[0])
    canary_id = canary_h[0:7:1]

    return canary_bn, canary_h, canary_id
