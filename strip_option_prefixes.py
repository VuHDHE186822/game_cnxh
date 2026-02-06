import json, re
p = re.compile(r'^[A-D]\.?\s*', re.UNICODE)

with open('data/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for cat in ['career','study','social','policy']:
    for q in data.get(cat, []):
        new_opts = []
        for opt in q.get('options', []):
            if isinstance(opt, str):
                new = p.sub('', opt).strip()
                new_opts.append(new)
            else:
                new_opts.append(opt)
        q['options'] = new_opts

with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print('Stripped prefixes from options.')
