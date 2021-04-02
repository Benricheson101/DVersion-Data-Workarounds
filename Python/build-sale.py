import urllib.request
from json import loads


def build_sale():
    """
    Workaround that uses data from https://builds.discord.sale/builds/raw?page=1&size=1
    Data is return inside the sale object
    Limitations: Exclusive to canary, gets latest data only
    :return:
    """

    the_url = "https://builds.discord.sale/builds/raw?page=1&size=1"

    headers = {
        "User-Agent": "*"
    }

    requ = (urllib.request.urlopen(urllib.request.Request(the_url, headers=headers)).read()).decode('utf-8')

    try:
        data = loads(requ)["data"][0]
    except():
        pass

    # Return scheme (array)
    # (<build_number>, <build_hash>, <build_id>, <date_created>)
    return data["buildNumber"], data["buildHash"], data["buildId"], data["dateCreated"]
