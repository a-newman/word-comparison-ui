from boto3 import client
import json
import copy

with open('../config.json', 'r') as f:
    config = json.loads(f.read())['hitCreation']

if config['production']:
    endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'
else:
    endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'

cl = client('mturk', region_name='us-east-1', endpoint_url=endpoint_url)


def create_hit(task):
    quals = [
       {
           'QualificationTypeId': '00000000000000000071',
           'Comparator': 'EqualTo',
           'LocaleValues': [{
               'Country': 'US',
           }],
       },
       {
           'QualificationTypeId': '000000000000000000L0',
           'Comparator': 'GreaterThanOrEqualTo',
           'IntegerValues': [
               95
           ],
       },
    ]

    questionText = "<ExternalQuestion xmlns=\"http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/"
    questionText += "2006-07-14/ExternalQuestion.xsd\">\n<ExternalURL>" + task['taskUrl']
    questionText += "</ExternalURL>\n  <FrameHeight>700</FrameHeight>\n</ExternalQuestion>"

    cl.create_hit(
        MaxAssignments=task['numAssignments'],
        AutoApprovalDelayInSeconds=604800,
        LifetimeInSeconds=task['lifetime'],
        AssignmentDurationInSeconds=task['duration'],
        Reward=task['rewardAmount'],
        Title=task['title'],
        Keywords=task['keywords'],
        Description=task['description'],
        Question=questionText,
        QualificationRequirements=quals,
    )


if config['variants']: 
    for var in variants: 
        task = copy.deepcopy(config)
        task.update(var)
        make_hit(task)
else: 
  for i in range(config['numTasks']):
      create_hit(config)
