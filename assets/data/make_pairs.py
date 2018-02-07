import json
import random

words = [
    'rapid',
    'slow',
    'sudden',
    'sharp',
    'steady',
    'gradual',
    'noticeable',
    'substantial',
    'considerable',
    'slight',
    'significant',
    'dramatic',
    'negligible',
    'gentle',
    'steep',
    'large',
    'small',
    'consistent',
    'marginal',
    'modest',
    'huge',
    'marked'
]

pairs = []

wordsset = set(words)
assert len(wordsset) == len(words)

for i in range(len(words)): 
    for j in range(i+1, len(words)): 
        pair = [words[i], words[j]]
        pairs.append(pair)

print(len(pairs))

random.shuffle(pairs)

with open('pairs.json', 'w') as outfile: 
    json.dump(pairs, outfile)
