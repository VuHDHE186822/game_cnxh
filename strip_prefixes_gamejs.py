import re
p = re.compile(r'"[A-D]\.\s*')
path = 'js/game.js'
with open(path, 'r', encoding='utf-8') as f:
    s = f.read()
new = p.sub('"', s)
with open(path, 'w', encoding='utf-8') as f:
    f.write(new)
print('Stripped A./B./C./D. prefixes in', path)
