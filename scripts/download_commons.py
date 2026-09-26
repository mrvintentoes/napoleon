#!/usr/bin/env python3
"""Download the chosen Wikimedia Commons works (public domain / CC0 only) into assets_src/commons/
and write assets_src/commons/manifest.json (title, artist, license, source page) for ASSETS.md."""
import json, os, sys, time, urllib.parse, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets_src', 'commons')
UA = {'User-Agent': 'napoleon-edit/1.0 (educational video project)'}
API = 'https://commons.wikimedia.org/w/api.php'
PICKS = {
  'napoleon_toulon': 'File:Napoleon à Toulon par Edouard Detaille.jpg',
  'toulon_assault': "File:Assaut de Toulon par les troupes républicaines, 19 décembre 1793 (29 frimaire an II).",
  'napoleon_arcole': "File:Antoine-Jean Gros - Bonaparte au pont d'Arcole.jpg",
  'napoleon_alps_david': 'File:Jacques Louis David - Bonaparte franchissant le Grand Saint-Bernard, 20 mai 1800 - Go',
  'marengo_lejeune': 'File:Lejeune - Bataille de Marengo.jpg',
  'brumaire_bouchot': 'File:Bouchot - Le general Bonaparte au Conseil des Cinq-Cents.jpg',
  'nile_orient': "File:The Destruction of 'L'Orient' at the Battle of the Nile, 1 August 1798 RMG BHC0509.ti",
  'nelson_abbott': 'File:Rear-Admiral Sir Horatio Nelson, 1758–1805.jpg',
  'trafalgar_turner': 'File:Turner, The Battle of Trafalgar (1822).jpg',
  'coronation_david': 'File:Jacques-Louis David - The Coronation of Napoleon (1805-1807).jpg',
  'napoleon_throne_ingres': 'File:Ingres, Napoleon on his Imperial throne.jpg',
  'napoleon_austerlitz': "File:La bataille d'Austerlitz. 2 decembre 1805 (François Gérard).jpg",
  'jena_vernet': 'File:E.Jean.Horace.Vernet.Battleof.Jena1836.jpg',
  'eylau_gros': 'File:Napoleon on the Battlefield of Eylau (Antoine-Jean Gros).jpg',
  'friedland_vernet': 'File:Napoleon friedland.jpg',
  'third_of_may_goya': 'File:El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg',
  'wellington_lawrence': 'File:Sir Thomas Lawrence - Arthur Wellesley, 1st Duke of Wellington - WM.1567-1948 - Apsle',
  'wagram_vernet': 'File:Napoleon Wagram.jpg',
  'marie_louise': 'File:Portrait of Marie Louise of Austria by Gérard (14778087241).jpg',
  'murat_gros': 'File:Equestrian portrait of Joachim Murat.jpg',
  'napoleon_study_david': 'File:Jacques-Louis David - The Emperor Napoleon in His Study at the Tuileries - Google Art Project.jpg',
  'moscow_fire': 'File:Napoleon in burning Moscow - Adam Albrecht (1841).jpg',
  'borodino_lejeune': 'File:Charpentier-Bataille de la Moskowa.jpg',
  'retreat_russia': 'File:Napoleons retreat from Moscow by Adolph Northen.jpg',
  'berezina': 'File:Berezyna.jpg',
  'leipzig_sauerweid': 'File:Battle of Leipzig by Zauerweid.jpg',
  'fontainebleau_delaroche': 'File:Napoleon at Fontainebleau, 31 March 1814 (by Hippolyte Paul Delaroche).jpg',
  'fontainebleau_adieux': 'File:Napoleon bids farewell to his Guard at Fontainebleau on 20 April 1814 (1825), by Hora',
  'napoleon_elba': "File:Retour de l'Ile d'Elbe (7 Mars 1815) - (estampe) (État avec la lettre) - Gravé par Ja",
  'napoleon_waterloo': 'File:Andrieux - La bataille de Waterloo.jpg',
  'scotland_forever': 'File:Scotland Forever!.jpg',
  'napoleon_st_helena': 'File:Napoléon A Sainte-Hélène - estampe - btv1b6954912s.jpg',
  'death_napoleon': 'File:Carl von Steuben - Mort de Napoléon - Arenenberg.jpg',
}
# candidates from scripts/fetch_commons.py (full titles / urls); prefix-match picks against them
cands = [json.loads(l) for l in open(os.path.join(ROOT, 'out', 'commons_candidates.jsonl'))]
extra = {}
def get(url, tries=8):
    for a in range(tries):
        try:
            time.sleep(1.5)
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            time.sleep(15 * (a + 1))
    raise RuntimeError(url)
def info(title):
    r = json.loads(get(API + '?' + urllib.parse.urlencode({'action': 'query', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 2400, 'format': 'json', 'redirects': 1})))
    p = next(iter(r['query']['pages'].values()))
    return p
os.makedirs(OUT, exist_ok=True)
manifest = {}
mp = os.path.join(OUT, 'manifest.json')
if os.path.exists(mp): manifest = json.load(open(mp))
for slot, pick in PICKS.items():
    dst = os.path.join(OUT, slot + '.jpg')
    if os.path.exists(dst) and slot in manifest: continue
    title = next((c['t'] for c in cands if c['t'].startswith(pick)), pick)
    p = info(title)
    if 'imageinfo' not in p: print('MISSING', slot, title); continue
    ii = p['imageinfo'][0]; md = ii.get('extmetadata', {})
    lic = md.get('LicenseShortName', {}).get('value', '?')
    if not any(k in lic.lower() for k in ('public domain', 'cc0', 'no restriction', 'pd')):
        print('SKIP (license)', slot, lic); continue
    data = get(ii.get('thumburl') or ii['url'])
    open(dst, 'wb').write(data)
    import re
    strip = lambda s: re.sub('<[^>]+>', '', s or '').strip()
    manifest[slot] = {'title': title[5:], 'artist': strip(md.get('Artist', {}).get('value'))[:160], 'date': strip(md.get('DateTimeOriginal', {}).get('value'))[:60],
                      'license': lic, 'page': ii.get('descriptionurl'), 'orig_size': [ii['width'], ii['height']]}
    json.dump(manifest, open(mp, 'w'), indent=1, ensure_ascii=False)
    print('ok', slot, len(data) // 1024, 'KB', lic, flush=True)
