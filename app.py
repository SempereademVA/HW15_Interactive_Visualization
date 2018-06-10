import pandas as pd
import os
import numpy as np

from flask import Flask, jsonify, render_template

cwd = os.getcwd()
data_dir = cwd + '\\DataSets\\belly_button_biodiversity_samples.csv'
bbsampledata_df = pd.read_csv(data_dir)

data_dir = cwd + '\\DataSets\\belly_button_biodiversity_otu_id.csv'
bbotudata_df = pd.read_csv(data_dir)

clean_df = bbsampledata_df.drop(columns=['otu_id'])

data_dir_1 = cwd + '\\DataSets\\Belly_Button_Biodiversity_Metadata.csv'
bbmetadate_df = pd.read_csv(data_dir_1)

# create instance of Flask app
app = Flask(__name__)



@app.route("/")
def index():
    return render_template('index.html')



@app.route("/names")
def sample_names():


    return jsonify(list(clean_df))


@app.route("/otu")
def otu_descriptions():


    return jsonify(list(bbotudata_df['lowest_taxonomic_unit_found']))


@app.route('/metadata/<sample>')
def sample_meta_data_f(sample):
    print ('In metadata. The sample requested is:')
    print(sample)
    sample_df= bbmetadate_df.drop(columns=['EVENT', 'WFREQ', 'COUNTRY012', 'ZIP012','DOG', 'CAT', 'IMPSURFACE013',
                                       'NPP013', 'MMAXTEMP013','PFC013', 'IMPSURFACE1319','NPP1319', 'MMAXTEMP1319', 'PFC1319',
                                      'COUNTRY1319', 'ZIP1319'])


    sample_id = int(sample[3:])

    x = sample_df.loc[sample_df['SAMPLEID'] == sample_id]

    print('The sample returned is:')
    print(x)

    sample_dic = {}

    sample_dic['SAMPLEID'] = str(x.iloc[0]['SAMPLEID'])
    sample_dic['ETHNICITY'] = x.iloc[0]['ETHNICITY']
    sample_dic['GENDER'] = x.iloc[0]['GENDER']
    sample_dic['AGE'] = str(x.iloc[0]['AGE'])
    sample_dic['BBTYPE'] = x.iloc[0]['BBTYPE']
    sample_dic['LOCATION'] = x.iloc[0]['LOCATION']

    print('This will be jsonified')
    print(sample_dic)
    print('############################')

    return jsonify(sample_dic)

@app.route("/wfreq/<sample>")
def wfreq_data_f(sample):

    sample_df= bbmetadate_df.drop(columns=['EVENT', 'WFREQ', 'COUNTRY012', 'ZIP012','DOG', 'CAT', 'IMPSURFACE013',
                                       'NPP013', 'MMAXTEMP013','PFC013', 'IMPSURFACE1319','NPP1319', 'MMAXTEMP1319', 'PFC1319',
                                      'COUNTRY1319', 'ZIP1319'])

    sample_id = int(sample[3:])
    sample_df.loc[sample_df['SAMPLEID'] == sample_id]
    wash_freq =  int(sample_df.iloc[0]['WFREQ'])

    return jsonify(wash_freq)

@app.route("/samples/<sample>")
def sample_data_f(sample):

    clean_sample_df = pd.DataFrame()
    clean_sample_df = bbsampledata_df[bbsampledata_df[sample] > 1]

    clean_sample_df = clean_sample_df.sort_values(by=sample, ascending=0)
    sampledata = [{"otu_ids": clean_sample_df[sample].index.values.tolist(), 
               "sample_values": clean_sample_df[sample].values.tolist()}]

    print("Sample Data is: ")
    print(sampledata)
    
    return jsonify(sampledata)



if __name__ == "__main__":
    app.run(debug=True)