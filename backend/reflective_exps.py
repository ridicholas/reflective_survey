from sklearn.linear_model import LogisticRegression
import itertools
import pandas as pd
import numpy as np
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import accuracy_score
from logisticTorch import FrozenLogReg
import torch
from progressbar import progressbar
import copy

def convert_response_json(json_data):
   data = pd.DataFrame(json_data).transpose()
   try:
       data.columns = ['Expectations', 'BookingExperience', 'AirportExperience', 'FlightExperience', 'Delays', 'Y']
       data['Y'] = data['Y'].replace({'not_satisfied': 0, 'satisfied': 1})
   except:
       data.columns = ['Y']
       data['Y'] = data['Y'].replace({'not_satisfied': 0, 'satisfied': 1})
       
   return data

def find_optimal_n_model(x_train, y_true, top_n, re_model, cv_folds=5):
    #iterate through all combinations of top_n features
    optimal_model = None
    optimal_model_score = 0


    
    for combo in progressbar(itertools.combinations(range(len(x_train.columns)), top_n)):
        used_feature_names = [x_train.columns[x] for x in combo]
        unused_features = [x for x in range(len(x_train.columns)) if x not in combo]
        
        #get coefficients for unused features from model
        unused_features_coef = re_model.coef_[0][unused_features]
        
        scores = []
        for fold in range(cv_folds):
            x, x_test, y, y_test = train_test_split(x_train, y_true, test_size=(1/cv_folds), stratify=y_true)
        
        
            new_model = FrozenLogReg(input_dim=len(x.columns), 
                                    output_dim=1, 
                                    freeze_which=unused_features, 
                                    start_values = re_model.coef_[0], 
                                    start_bias = re_model.intercept_[0])

            new_model.setup(lr=0.05)
            new_model.train(epochs=100, x_train=torch.tensor(x.values, dtype=torch.float32), y_train=torch.tensor(np.array(y), dtype=torch.float32))
            new_model.setup(lr=0.01)
            new_model.train(epochs=100, x_train=torch.tensor(x.values, dtype=torch.float32), y_train=torch.tensor(np.array(y), dtype=torch.float32))


            with torch.no_grad():
                test_accuracy = accuracy_score(np.array(new_model(torch.tensor(x_test.values, dtype=torch.float32)).round()).astype(int), 
                                               y_test)
                scores.append(test_accuracy)
        
        new_model_score = np.mean(scores)

        
        

        
        #if the new model is better than the current optimal model, set it as the optimal model
        if optimal_model is None or new_model_score >= optimal_model_score:
            optimal_model_score = new_model_score
            optimal_features = used_feature_names
            optimal_unused_features = unused_features

    optimal_model = FrozenLogReg(input_dim=len(x_train.columns), 
                            output_dim=1, 
                            freeze_which=optimal_unused_features, 
                            start_values = re_model.coef_[0], 
                            start_bias = re_model.intercept_[0])
    optimal_model.setup(lr=0.05)
    optimal_model.train(epochs=100, x_train=torch.tensor(x_train.values, dtype=torch.float32), y_train=torch.tensor(np.array(y_true), dtype=torch.float32))
    optimal_model.setup(lr=0.01)
    optimal_model.train(epochs=100, x_train=torch.tensor(x_train.values, dtype=torch.float32), y_train=torch.tensor(np.array(y_true), dtype=torch.float32))

    
    return optimal_model, optimal_features
    
def train_feature_RE(x_train, json_data, y_true, top_n=None):
    Y = convert_response_json(json_data)['Y'].astype(int)
    model = LogisticRegression().fit(x_train, Y)
    
    if top_n is None:
        optimal_model = LogisticRegression().fit(x_train, y_true)
        optimal_features = x_train.columns
    else:
        optimal_model, optimal_features = find_optimal_n_model(x_train, y_true, top_n, model)
        temp_model = copy.deepcopy(model)
        temp_model.coef_ = np.array(optimal_model.linear.weight.detach().numpy())
        optimal_model = temp_model

    return model, optimal_model, optimal_features

def train_concept_RE(json_data, y_true, top_n=None):
    train_data = convert_response_json(json_data)
    Y = train_data['Y'].astype(int)
    X = train_data.drop(columns=['Y']).replace({"": 1}).astype(int)
    model = LogisticRegression().fit(X, Y)
    
    if top_n is None:
        optimal_model = LogisticRegression().fit(X, y_true)
    else:
        optimal_model, optimal_features = find_optimal_n_model(X, y_true, top_n, model)
        temp_model = copy.deepcopy(model)
        temp_model.coef_ = np.array(optimal_model.linear.weight.detach().numpy())
        temp_model.intercept_ = np.array(optimal_model.linear.bias.detach().numpy())
        optimal_model = temp_model

    print(model.score(X, y_true))
    print(optimal_model.score(X, y_true))

    return model, optimal_model, optimal_features