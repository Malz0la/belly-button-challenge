// Function to create the charts
function createCharts(samplesData, metadata) {
    // Select an individual (you can change this to select different individuals)
    let individualIndex = 0;
    let sampleValues = samplesData[individualIndex].sample_values.slice(0, 10).reverse();
    let otuIds = samplesData[individualIndex].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let otuLabels = samplesData[individualIndex].otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart trace
    let barTrace = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    let barData = [barTrace];

    let barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Create the bubble chart trace
    let bubbleTrace = {
        x: samplesData[individualIndex].otu_ids,
        y: samplesData[individualIndex].sample_values,
        text: samplesData[individualIndex].otu_labels,
        mode: 'markers',
        marker: {
            size: samplesData[individualIndex].sample_values,
            color: samplesData[individualIndex].otu_ids,
            colorscale: 'Earth',
            showscale: true
        }
    };

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
        title: 'OTU ID Bubble Chart',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Display sample metadata
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    Object.entries(metadata[individualIndex]).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to update charts based on the selected individual
function optionChanged(selectedIndex) {
    // Use selectedIndex to update the charts
    createCharts(samplesData, metadata);
}

// Use D3 to read the JSON file
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    // Extract necessary data
    let samplesData = data.samples;
    let metadata = data.metadata;

    // Create the dropdown menu
    let dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
        .data(samplesData.map((d, i) => `Individual ${i}`))
        .enter()
        .append("option")
        .attr("value", (d, i) => i)
        .text(d => d);

    // Initial call to create charts with the first individual
    createCharts(samplesData, metadata);
});