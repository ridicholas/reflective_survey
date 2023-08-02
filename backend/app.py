from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import boto3
import pandas as pd
import numpy as np
import pickle
import json
from agr import agr
from reflective_exps import train_feature_RE, train_concept_RE
import io
import matplotlib
import copy
matplotlib.use('Agg')

app = Flask(__name__)
CORS(app)  # Initialize CORS

@app.route('/end_task_push/<id>/<condition>', methods=['POST'])
def end_task_push(id, condition):

    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    

    evalTaskResponses = request.get_json()  # assuming the data is sent via a POST request
    # Convert the dictionary to a JSON string and then encode it to bytes
    evalTaskResponses_json = json.dumps(evalTaskResponses).encode('utf-8')
    # Initialize S3 client
    s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='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')
    # Upload the data to the S3 bucket
    
    s3.put_object(Bucket='reflectivesurvey', Key=f'eval_responses/condition{condition}/evalTaskResponses_{id}.json', Body=json.dumps(evalTaskResponses).encode('utf-8'))


    
    return 'Data uploaded successfully'

@app.route('/post_survey_push/<id>/<condition>', methods=['POST'])
def post_survey_push(id, condition):

    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    

    postSurveyResponses = request.get_json()  # assuming the data is sent via a POST request
    # Convert the dictionary to a JSON string and then encode it to bytes
    postSurveyResponses_json = json.dumps(postSurveyResponses).encode('utf-8')
    # Initialize S3 client
    s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='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')
    # Upload the data to the S3 bucket
    
    s3.put_object(Bucket='reflectivesurvey', Key=f'post_survey_responses/condition{condition}/postSurveyResponses_{id}.json', Body=json.dumps(postSurveyResponses).encode('utf-8'))


    
    return 'Data uploaded successfully'

@app.route('/midpoint_push/<id>/<condition>', methods=['POST'])
def midpoint_push(id, condition):

    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    

    trainingTaskResponses = request.get_json()  # assuming the data is sent via a POST request
    # Convert the dictionary to a JSON string and then encode it to bytes
    trainingTaskResponses_json = json.dumps(trainingTaskResponses).encode('utf-8')
    # Initialize S3 client
    s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='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')
    # Upload the data to the S3 bucket
    
    s3.put_object(Bucket='reflectivesurvey', Key=f'training_responses/condition{condition}/trainingTaskResponses_{id}.json', Body=json.dumps(trainingTaskResponses).encode('utf-8'))
    
    
    try:
        if int(condition) in [1, 3, 4, 6]:
            if int(condition) in [1, 3]:
                top_n = None
            else: 
                top_n = 2
            x_train = pd.read_csv(s3.get_object(Bucket='reflectivesurvey', Key='airline_data/X_example_1_train_ready.csv')['Body'])
            #x_train.index = x_train['Unnamed: 0']
            #x_train = x_train.drop(columns=['Unnamed: 0'])
            y_true = pd.read_csv(s3.get_object(Bucket='reflectivesurvey', Key='airline_data/Y_example_1.csv')['Body'])['Y']
            model, optimal_feat_model, optimal_feature_names = train_feature_RE(x_train, trainingTaskResponses, y_true, top_n=top_n)
            s3.put_object(Bucket='reflectivesurvey', Key=f'models/condition{condition}/feat_RE_{id}.pkl', Body=pickle.dumps(model))
            agr_image, _, guidance_text = agr(model, optimal_feat_model, 'Your Improvement plan')
            s3.put_object(Bucket='reflectivesurvey', Body=agr_image, ContentType='image/png', 
                          Key=f'improvement_plans/condition{condition}/improvement_plan_{id}.png')
            s3.put_object(Bucket='reflectivesurvey', Body=guidance_text, ContentType='text/plain', 
                Key=f'improvement_plans/condition{condition}/improvement_plan_guidance_text{id}.txt')
            
        elif int(condition) in [2,5]: 
            if int(condition) == 2:
                top_n = None
            else: 
                top_n = 2
            y_true = pd.read_csv(s3.get_object(Bucket='reflectivesurvey', Key='airline_data/Y_example_1.csv')['Body'])['Y']
            model, optimal_concept_model, optimal_feature_names = train_concept_RE(trainingTaskResponses, y_true, top_n=top_n)
            s3.put_object(Bucket='reflectivesurvey', Key=f'models/condition{condition}/concept_RE_{id}.pkl', Body=pickle.dumps(model))
            s3.put_object(Bucket='reflectivesurvey', Key=f'models/condition{condition}/concept_RE_optimal_{id}.pkl', Body=pickle.dumps(optimal_concept_model))
            agr_image, _, guidance_text = agr(model, optimal_concept_model, 'Your Improvement plan')
            s3.put_object(Bucket='reflectivesurvey', Body=agr_image, ContentType='image/png', 
                          Key=f'improvement_plans/condition{condition}/improvement_plan_{id}.png')
            s3.put_object(Bucket='reflectivesurvey', Body=guidance_text, ContentType='text/plain', 
                    Key=f'improvement_plans/condition{condition}/improvement_plan_guidance_text{id}.txt')
        



    except Exception as e:
        # Log the exception or print the error message for debugging purposes
        print(f"An error occurred: {str(e)}")
        return 'Data transform failed' 
    
    return 'Data uploaded successfully'

@app.route('/pull_improvement_plan_image/<id>/<condition>', methods=['GET'])
def pull_improvement_plan_image(id, condition):
    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    try:
        s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='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')
        image_data = s3.get_object(Bucket='reflectivesurvey', Key=f'improvement_plans/condition{condition}/improvement_plan_{id}.png')['Body'].read()
        return Response(image_data, content_type='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/pull_improvement_plan_text/<id>/<condition>', methods=['GET'])
def pull_improvement_plan_text(id, condition):
    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id='AKIAQH4M5TI2PWCXAAGY',
            aws_secret_access_key='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'
        )
        text_data = s3.get_object(
            Bucket='reflectivesurvey',
            Key=f'improvement_plans/condition{condition}/improvement_plan_guidance_text{id}.txt'
        )['Body'].read().decode('utf-8')
        return Response(text_data, content_type='text/plain')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/pull_tasks/<id>/<condition>', methods=['GET'])
def pull_tasks(id, condition):
    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    try:
        s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='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')
        taskDataJSON= s3.get_object(Bucket='reflectivesurvey', Key=f'airline_data/tasks.json')['Body'].read()
        return Response(taskDataJSON, content_type='application/json')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/pull_resp/<id>/<condition>', methods=['GET'])
def pull_resp(id, condition):
    if request.method == 'OPTIONS':
        # Handle CORS pre-flight request
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    try:
        s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='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')
        taskDataJSON= s3.get_object(Bucket='reflectivesurvey', Key=f'airline_data/ans.json')['Body'].read()
        return Response(taskDataJSON, content_type='application/json')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        



    
if __name__ == '__main__':
    app.run()
    '''
    trainingTaskResponses = json.load(open('/Users/nicholaswolczynski/downloads/trainingTaskResponses_aa9f6a0da1.json'))
    s3 = boto3.client('s3', aws_access_key_id='AKIAQH4M5TI2PWCXAAGY', aws_secret_access_key='y3h85PeugBBQUlatiti9XcS4Y4PLoyfe0u39DVJL')
    y_true = pd.read_csv(s3.get_object(Bucket='reflectivesurvey', Key='airline_data/Y_example_1.csv')['Body'])['Y']
    x_train = pd.read_csv(s3.get_object(Bucket='reflectivesurvey', Key='airline_data/X_example_1_train_ready.csv')['Body'])
    model, optimal_feat_model, optimal_feature_names = train_feature_RE(x_train, trainingTaskResponses, y_true, top_n=2)
    agr_image, _, guidance_text = agr(model, optimal_feat_model, 'Your Improvement plan')
    print('pause')
    '''
    
    







