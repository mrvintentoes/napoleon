#!/usr/bin/env python3
"""Search Wikimedia Commons (paced; public-domain only) and print candidates as JSON lines."""
import json, sys, time, urllib.parse, urllib.request, urllib.error
UA = {'User-Agent': 'napoleon-edit/1.0 (educational video project)'}
API = 'https://commons.wikimedia.org/w/api.php'
def q(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    for a in range(8):
        try:
            time.sleep(4)
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60))
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            time.sleep(20 * (a + 1))
    raise RuntimeError('rate limited')
for term in sys.argv[1:]:
    r = q({'action': 'query', 'generator': 'search', 'gsrsearch': f'filetype:bitmap {term}', 'gsrnamespace': 6, 'gsrlimit': 5,
           'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 2400})
    for p in (r.get('query', {}).get('pages', {}) or {}).values():
        ii = p['imageinfo'][0]; md = ii.get('extmetadata', {})
        lic = md.get('LicenseShortName', {}).get('value', '?')
        print(json.dumps({'q': term, 't': p['title'], 'w': ii['width'], 'h': ii['height'], 'lic': lic, 'artist': md.get('Artist', {}).get('value', '')[:80], 'url': ii.get('thumburl') or ii['url']}, ensure_ascii=False), flush=True)
