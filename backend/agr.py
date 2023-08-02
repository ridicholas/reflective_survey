import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
import pandas as pd
import numpy as np
import io

def agr(model, optimal, title=""):
    plt.style.use("seaborn-darkgrid")
    df = pd.DataFrame({'Features' : model.feature_names_in_, 'model_coefficient': model.coef_[0]}).sort_values(by='model_coefficient')
    fig, ax = plt.subplots(figsize=(14, 5))
    
    cmap = plt.get_cmap("coolwarm")
    rescale = lambda y: (-y - np.min(-y)) / (np.max(-y) - np.min(-y))
    ax.barh(width=df['model_coefficient'], y=df['Features'], color=cmap(rescale(df['model_coefficient'])), align='center')


    df['optimal_coefficient'] = pd.DataFrame({'Features' : optimal.feature_names_in_, 'Coefficient': optimal.coef_[0]}).loc[df.index, 'Coefficient']
    df['difference'] = df['optimal_coefficient'] - df['model_coefficient']
    
    guidance_text = ""
    
    #add difference arrows to plot
    for i in range(len(df['Features'])):
        if np.abs(df['model_coefficient'].iloc[i] - df['optimal_coefficient'].iloc[i]) > 0.001:
            plt.annotate("", xy=(df['model_coefficient'].iloc[i], i), xytext=(df['optimal_coefficient'].iloc[i], i),
                    arrowprops=dict(arrowstyle="<-"))
            
            if np.sign(df['model_coefficient'].iloc[i]) != np.sign(df['optimal_coefficient'].iloc[i]):
                if np.sign(df['model_coefficient'].iloc[i]) == 1:
                    guidance_text += f"You're prior decisions demonstrate that you assumed {df['Features'].iloc[i]} has a positive relationship with the passenger's overall flight satisfaction. " + \
                                        f"However, {df['Features'].iloc[i]} has a negative relationship with the passenger's overall flight satisfaction.\n"
                else:
                    guidance_text += f"You're prior decisions demonstrate that you assumed {df['Features'].iloc[i]} has a negative relationship with the passenger's overall flight satisfaction. " + \
                                        f"However, {df['Features'].iloc[i]} has a positive relationship with the passenger's overall flight satisfaction.\n"
            else:
                if np.sign(df['model_coefficient'].iloc[i]) == 1:
                    if np.sign(df['difference'].iloc[i]) == 1:
                        guidance_text += f"You're prior decisions demonstrate that you correctly assumed {df['Features'].iloc[i]} has a positive relationship with the passenger's overall flight satisfaction. " + \
                                            f"However, {df['Features'].iloc[i]} has an even stronger positive relationship with the passenger's overall flight satisfaction than you assumed.\n"
                    else:
                        guidance_text += f"You're prior decisions demonstrate that you correctly assumed {df['Features'].iloc[i]} has a positive relationship with the passenger's overall flight satisfaction. " + \
                                            f"However, {df['Features'].iloc[i]} has an even weaker positive relationship with the passenger's overall flight satisfaction than you assumed.\n"
                else:
                    if np.sign(df['difference'].iloc[i]) == 1:
                        guidance_text += f"You're prior decisions demonstrate that you correctly assumed {df['Features'].iloc[i]} has a negative relationship with the passenger's overall flight satisfaction. " + \
                                            f"However, {df['Features'].iloc[i]} has an even weaker negative relationship with the passenger's overall flight satisfaction than you assumed.\n"
                    else:
                        guidance_text += f"You're prior decisions demonstrate that you correctly assumed {df['Features'].iloc[i]} has a negative relationship with the passenger's overall flight satisfaction. " + \
                                            f"However, {df['Features'].iloc[i]} has an even stronger negative relationship with the passenger's overall flight satisfaction than you assumed.\n"  



    plt.title(title)
    plt.xlim(min(df['model_coefficient'].min(), df['optimal_coefficient'].min())-0.2, max(df['model_coefficient'].max(), df['optimal_coefficient'].max())+0.2)
    plt.yticks(rotation=30, fontsize=10)
    img_data = io.BytesIO()
    plt.savefig(img_data, format='png')
    #plt.show()
    plt.close()
    img_data.seek(0)
    return img_data, df, guidance_text