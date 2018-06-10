function init()  {

    getOptions();

}



//Build and Populate the Data Panel

function updateMetaDataPanel(data) {

    //Populate the Meta Data Panel.  Locate element id first.
    var METADATAPANEL = document.getElementById("display_meta_data");
    //Clear out the panel 
    METADATAPANEL.innerHTML = '';
    //Put the data in the h6 headers within the panel
    for(var key in data) {
        h5tag = document.createElement("h5");
        h5Text = document.createTextNode(`${key}: ${data[key]}`);
        h5tag.append(h5Text);
        METADATAPANEL.appendChild(h5tag);
    }
}
//////////////////////////////////////////////////////////////////////////////

function createpieplot(sampleData, otuData) {
    console.log("createpieplot");
    var hoverlabels = sampleData[0]['otu_ids'].map(function(item) {
        return otuData[item]
    });
    

   var pieinputdata = [{
    values: sampleData[0]['sample_values'].slice(0,10),
    labels: sampleData[0]['otu_ids'].slice(0,10),
    hovertext: hoverlabels.slice(0,10),
    hoverinfo: 'hovertext',
    type: 'pie'
    }]

    var layout = {
        height: 400,
        width: 425,
        margin: {t:0, l:0}
      };

    var PIE = document.getElementById('pie');
    Plotly.plot(PIE, pieinputdata, layout);
}

function updatepieplot(sampleData, otuData) {
    console.log("updatepieplot");
    var hoverlabels = sampleData[0]['otu_ids'].map(function(item) {
        return otuData[item]
    });
 
   var pieupdatedata = [{
    values: sampleData[0]['sample_values'].slice(0,10),
    labels: sampleData[0]['otu_ids'].slice(0,10),
    hovertext: hoverlabels.slice(0,10),
    hoverinfo: 'hovertext',
    type: 'pie'
    }]

    var layout = {
        height: 400,
        width: 425,
        margin: {t:0, l:0}
      };

    var PIE = document.getElementById('pie');
    //Plotly.restyle(PIE, pieupdatedata);
    Plotly.newPlot(PIE, pieupdatedata,layout);
}


function updatebubbleplot(sampleData, otuData) {
    console.log("Update bubbleplot");

    var bubblelabels = sampleData[0]['otu_ids'].map(function(item) {
        return otuData[item]
    });
   

   var bubbleupdatedata = [{
    y: sampleData[0]['sample_values'],
    x: sampleData[0]['otu_ids'],
    text: bubblelabels,
    mode: 'markers',
    marker: {
        size : sampleData[0]['sample_values'],
        color: sampleData[0]['otu_ids'],
        colorscale: "Earth"
    }
    }]

    var bubbleupdatelayout = {
        height: 600,
        width: 1000,
        margin: {t: 0},
        hovermode: 'closest',
        xaxis: {title: 'OTU ID Number'},
        yaxis: {title: 'Quantity'}
      };

    var BUBBLE = document.getElementById('bubblechart');
    Plotly.newPlot(BUBBLE, bubbleupdatedata, bubbleupdatelayout);
}



function updateplots(sample) {

    console.log(sample)
     Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
        if (error) return console.warn(error);
         console.log("The sampleData is");
         console.log(sampleData);
        Plotly.d3.json('/otu', function(error, otuData) {
            if (error) return console.warn(error);
            console.log("The otu data is");
            console.log(otuData);
            updatepieplot(sampleData, otuData);
            updatebubbleplot(sampleData, otuData)
        })

     });
        
 }

 function createbubbleplot(sampleData, otuData) {
    console.log("createbubbleplot");

    var bubblelabels = sampleData[0]['otu_ids'].map(function(item) {
        return otuData[item]
    });
    

   var bubbleinputdata = [{
    y: sampleData[0]['sample_values'],
    x: sampleData[0]['otu_ids'],
    text: bubblelabels,
    mode: 'markers',
    marker: {
        size : sampleData[0]['sample_values'],
        color: sampleData[0]['otu_ids'],
        colorscale: "Earth"
    }
    }]

    var bubblelayout = {
        height: 600,
        width: 1000,
        margin: {t: 0},
        hovermode: 'closest',
        xaxis: {title: 'OTU ID Number'},
        yaxis: {title: 'Quantity'}
      };

    var BUBBLE = document.getElementById('bubblechart');
    Plotly.plot(BUBBLE, bubbleinputdata, bubblelayout);
}


 function createplots(sample) {

    console.log(sample)
     Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
        if (error) return console.warn(error);
         console.log("The sampleData is");
         console.log(sampleData);
        Plotly.d3.json('/otu', function(error, otuData) {
            if (error) return console.warn(error);
            console.log("The otu data is");
            console.log(otuData);
            createpieplot(sampleData, otuData);
            createbubbleplot(sampleData, otuData)
        })

     });
        
 }
//Retrieves the metadata for a sample. Calls the function to update the display 
function getData(sample) {

    Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
        if (error) return console.warn(error);
        console.log("The metadata is");
        console.log(metaData);
        updateMetaDataPanel(metaData);
    })

}

//This function responds to the selection from the selection in the HTML drop-down menu 
//Calls the function to update the data in the metadata frame on the display
//Calls the function to upoate the pie plot.

function optionChanged(new_sample) {
    // Collect new samples when a sample is selected on the drop down menu
    console.log("The new sample is");
    console.log(new_sample)
    getData(new_sample);
    updateplots(new_sample);

}

//Build the Drop Down List.  Use the list of samples from /names

function getOptions() {

    var selDataset = document.getElementById('selDataset');

    Plotly.d3.json('/names', function(error, sampleNames) {
        for (var i = 0; i < sampleNames.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = sampleNames[i];
            currentOption.value = sampleNames[i]
            selDataset.appendChild(currentOption);
        }
        //Populate the meta data frame after the page is first loaded
      getData(sampleNames[0]);

      createplots(sampleNames[0])  
    })
}


init();