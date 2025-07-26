https://code.earthengine.google.com/9409e594eff01a2d1ceba85fb22eefce




/** For Potato
Planting: 2023/02/14 to 2023/04/04
Sprout Development Stage: 2023/03/28
Vegetative Growth Stage: 2023/04/28
Tuber Formation or Flowering: 2023/05/19
Tuber Bulking: 2023/06/07
Harvesting: 2023/06/27 for one month
**/

/** For Sugarbeet
Planting: 2023/03/08 to 2023/03/30
4 to 8 Leaf Stage: 2023/03/30 to 2023/04/30 (Plant age: 30 days)
8 to 12 Leaf Stage: 2023/04/30 to 2023/05/30 (Plant age: 60 days)
12 to 16 Leaf Stage: 2023/05/30 to 2023/06/30 (Field completely covered with leaves)
Tuber Formation Start: 2023/06/30 to 2023/07/31 (Plant age: 120 days)
Tuber Maturation: 2023/07/31 to 2023/08/31 (Plant age: 150 days)
Sugar Content Adjustment Start: 2023/09/01 to 30 days before harvest
Harvesting: 2023/09/30 for 45 days
**/



//--------------------------------Part-1 -----------------------------------------------

// Center the map on the given region (table) and add it as a layer
Map.centerObject(table, 15);
Map.addLayer(table, {}, 'Region of Interest', 0);

// Define the time range for filtering the images
var startDate = '2023-10-05';  // Equivalent to 17-12-1401 in Persian calendar
var endDate = '2023-11-05';    // Equivalent to 10-10-1402 in Persian calendar

// Load the Sentinel-2 surface reflectance image collection (Harmonized)
var sentinelCollection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(table)       // Filter by the specified region
    .filterDate(startDate, endDate)  // Filter by the specified date range
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) // Filter by cloud percentage
    .select(['B2', 'B3', 'B4', 'B8']) // Select the required bands
    .mean()
    .clip(table);

// Apply scale (0.0001) to the image bands
var scaledImage = sentinelCollection.multiply(0.0001);

// Calculate NDVI = (NIR - Red) / (NIR + Red)
var ndvi = scaledImage.normalizedDifference(['B8', 'B4']).rename('NDVI');

// Calculate EVI = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)
var evi = scaledImage.expression(
  '2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))', {
    'NIR': scaledImage.select('B8'),
    'Red': scaledImage.select('B4'),
    'Blue': scaledImage.select('B2')
}).rename('EVI');

// Add the NDVI and EVI layers to the map for visualization
Map.addLayer(ndvi, {min: 0.028, max: 0.825, palette: ['blue', 'white', 'green']}, 'NDVI');
Map.addLayer(evi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'EVI', 0);
// Stack all the bands and indices into one image
var Dataset = scaledImage
    .addBands(ndvi)
    .addBands(evi);

// Print the combined dataset to the console
print(Dataset);
Map.addLayer(Dataset, {
  bands: ['B8', 'B4', 'B3'],
  min: 0,
  max: 0.39,
}, 'Composite Image', 0);

//--------------------------------Part-2 -----------------------------------------------

var allSamples = Sugerbeet.merge(Uncultivated);
var sampledData = Dataset.sampleRegions({
  collection: allSamples,
  scale: 10  // Adjust scale according to your data
});

// Print the sampled data to the console for review
print('Sampled Data', sampledData);


// ------------------------------Part-3 ------------------------------------------------
// Split the data into training and testing sets
var trainingData = sampledData.filter(ee.Filter.eq('Landuse', 1))
                              .merge(sampledData.filter(ee.Filter.eq('Landuse', 2)))

var training = trainingData.randomColumn('random')
                            .filter(ee.Filter.lt('random', 0.7));

var testing = trainingData.randomColumn('random')
                           .filter(ee.Filter.gte('random', 0.7));

// Train a Random Forest classifier
var classifier = ee.Classifier.smileRandomForest(10)
                       .train({
                         features: training,
                         classProperty: 'Landuse',
                         inputProperties: Dataset.bandNames()
                       });

// Classify the dataset
var classified = Dataset.classify(classifier);

// Add the classified layer to the map
Map.addLayer(classified, {min: 1, max: 2, palette: ['red', 'yellow']}, 'Classified Image');



// Evaluate the classification accuracy
var testAccuracy = classifier.confusionMatrix();
print('Confusion Matrix', testAccuracy);
print('Classification Accuracy', testAccuracy.accuracy());


// ---------------------------------------Part-4 -------------------------------
// ----------------------------------- Calculate Kappa -----------------------------------
// Compute the confusion matrix for the testing data
var confusionMatrix = ee.ConfusionMatrix(testing.classify(classifier)
    .errorMatrix({
      actual: 'Landuse',
      predicted: 'classification'
    }));

// Print the confusion matrix
print('Confusion Matrix (Testing Data):', confusionMatrix);

// Compute the accuracy
var accuracy = confusionMatrix.accuracy();
print('Accuracy:', accuracy);

// Compute the Kappa coefficient
var kappa = confusionMatrix.kappa();
print('Kappa Coefficient:', kappa);

//------------------------------------------ Part -5 -------------------------------------------
// Export the classified image to your Google Drive
Export.image.toDrive({
  image: classified,
  description: 'Time-11',
  folder: 'Crop_Saman', // Name of the folder in Google Drive where the image will be saved
  fileNamePrefix: 'Time-11', // Name of the output file
  region: table, // The region of interest where the image will be saved
  scale: 10, // Pixel scale (in meters)
  crs: 'EPSG:4326', // Coordinate reference system (WGS84)
  maxPixels: 1e13, // Maximum number of pixels
  fileFormat: 'GeoTIFF' // Format of the output file
});

