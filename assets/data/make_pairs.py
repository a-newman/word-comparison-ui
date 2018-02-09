import json
import math
import random

TASK_SIZE = 26; 

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

with open('pairs.json', 'w') as outfile: 
    json.dump(pairs, outfile)

random.shuffle(pairs)

# divide the pairs into the right groups.
num_groups = math.ceil(len(pairs)/TASK_SIZE)
print("num groups", num_groups)

num_repeats = num_groups*TASK_SIZE - len(pairs)
print("num repeats", num_repeats)

repeats = random.sample(pairs, num_repeats)

pairs.extend(repeats)

assert len(pairs) == num_groups*TASK_SIZE

# now we can divide up these things 

for i in range(0, len(pairs) - TASK_SIZE, TASK_SIZE): 
    group_num = i/TASK_SIZE + 1
    group = pairs[i:i+TASK_SIZE]
    assert len(group) == TASK_SIZE
    with open(str(int(group_num)) + '.json', 'w') as outfile: 
        json.dump(group, outfile)
