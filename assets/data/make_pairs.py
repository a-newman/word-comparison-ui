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

wordsset = set(words)
assert len(wordsset) == len(words)

pairs = []
for i in range(len(words)): 
    for j in range(i+1, len(words)): 
        pair = [words[i], words[j]]
        pairs.append(pair)

print(len(pairs))


def generate(): 

    with open('pairs.json', 'w') as outfile: 
        json.dump(pairs, outfile)

    random.shuffle(pairs)

    # divide the pairs into the right groups.
    num_groups = math.ceil(len(pairs)/TASK_SIZE)
    print("num groups", num_groups)

    num_repeats = num_groups*TASK_SIZE - len(pairs)
    print("num repeats", num_repeats)

    repeats = random.sample(pairs, num_repeats)
    with open('repeats.json', 'w') as outfile: 
        json.dump(repeats, outfile)

    pairs.extend(repeats)

    assert len(pairs) == num_groups*TASK_SIZE

    # now we can divide up these things 

    for i in range(0, len(pairs), TASK_SIZE): 
        group_num = i/TASK_SIZE + 1
        group = pairs[i:i+TASK_SIZE]
        assert len(group) == TASK_SIZE
        with open(str(int(group_num)) + '.json', 'w') as outfile: 
            json.dump(group, outfile)

def check(): 
    def myhash(a): 
        h = str(sorted(a))
        #print(h)
        return h

    file_pairs = set()
    calculated_pairs = set()

    for elt in pairs: 
        calculated_pairs.add(myhash(elt))

    for i in range(1, 10): 
        print(i)
        with open(str(int(i)) + '.json', 'r') as infile: 
            this_file_pairs = json.load(infile)
            print(len(this_file_pairs))
            for elt in this_file_pairs: 
                if myhash(elt) in file_pairs: 
                    print("REPEAT ELEMENT:", elt)
                file_pairs.add(myhash(elt))

    print("len file_pairs: ", len(file_pairs))
    print("len calculated_pairs: ", len(calculated_pairs))


if __name__ == '__main__': 
    generate()
