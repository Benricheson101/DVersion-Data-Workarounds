import urllib.request
import re

rChannels = ['canary', 'ptb', 'stable']


def fetch(r_input):
    if r_input == 'stable':
        url = 'https://discord.com'
    elif r_input == 'canary' or r_input == 'ptb':
        url = f'https://{r_input}.discord.com'

    headers = {'User-Agent': '*'}
    req = (urllib.request.urlopen(urllib.request.Request(f'{url}/app', headers=headers)).read()).decode('utf-8')

    reg = re.compile(r'([a-zA-z0-9]+)\.js', re.I)

    target = reg.findall(req)[-1]

    target_req = (
        urllib.request.urlopen(
            urllib.request.Request(f'{url}/assets/{target}.js', headers=headers))
            .read()) \
        .decode('utf-8')

    try:
        version_data = re.compile('Build Number: [0-9]+, Version Hash: [A-Za-z0-9]+') \
            .findall(target_req)[0].replace(' ', '').split(',')
    except ():
        pass

    build_num = version_data[0].split(":")[-1]

    build_hash = version_data[1].split(":")[-1]

    build_id = build_hash[0:7:1]

    # Return scheme (array)
    # (<build_number>, <build_hash>, <build_id>)
    return build_num, build_hash, build_id

