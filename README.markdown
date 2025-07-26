# CropLandClassifier

![Crop Phenology](https://cdn.imgurl.ir/uploads/e382307_Phenologhy.jpg)

A Google Earth Engine (GEE) script for classifying agricultural land use (sugar beet and uncultivated land) using Sentinel-2 satellite imagery. This project calculates vegetation indices (NDVI and EVI) and applies a Random Forest classifier to map land use, supporting applications in precision agriculture and land monitoring.

## Overview
The CropLandClassifier project leverages Google Earth Engine to process Sentinel-2 imagery for land use classification. It focuses on analyzing sugar beet crops and uncultivated areas within a specified region, using vegetation indices (NDVI and EVI) and a Random Forest model. The script is designed for researchers, geospatial analysts, and agricultural professionals aiming to monitor crop health and land use patterns.

## Table of Contents
- [Purpose](#purpose)
- [Functionality](#functionality)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Input and Output](#input-and-output)
- [Contributing](#contributing)
- [License](#license)

## Purpose
This project automates the classification of agricultural land use using Sentinel-2 imagery. By calculating NDVI and EVI and applying machine learning, it identifies sugar beet fields versus uncultivated land, providing insights into crop phenology and land management. The results are useful for agricultural planning, yield estimation, and environmental monitoring.

## Functionality
The script (`crop_land_classifier.js`) performs the following tasks:
- Loads Sentinel-2 surface reflectance imagery (filtered by date and cloud cover) for a specified region.
- Computes vegetation indices: NDVI (Normalized Difference Vegetation Index) and EVI (Enhanced Vegetation Index).
- Combines imagery bands with indices for classification.
- Samples training and testing data from labeled sugar beet and uncultivated land datasets.
- Trains a Random Forest classifier to categorize land use.
- Evaluates classification accuracy using a confusion matrix and Kappa coefficient.
- Exports the classified image as a GeoTIFF to Google Drive.

## Prerequisites
- **Google Earth Engine Account**: Sign up at [code.earthengine.google.com](https://code.earthengine.google.com).
- **Input Data**:
  - A region of interest (e.g., a geometry or feature collection like `table`).
  - Labeled datasets for sugar beet (`Sugerbeet`) and uncultivated land (`Uncultivated`) with a `Landuse` property.
- Access to Sentinel-2 imagery (`COPERNICUS/S2_SR_HARMONIZED`) in GEE.
- Google Drive for exporting output files.

## Installation
1. **Access Google Earth Engine**:
   - Log in to [code.earthengine.google.com](https://code.earthengine.google.com).
   - Ensure you have access to the Sentinel-2 dataset and your region of interest.

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/CropLandClassifier.git
   ```

3. **Prepare Input Data**:
   - Upload or define your region of interest (`table`) in GEE.
   - Ensure labeled datasets (`Sugerbeet` and `Uncultivated`) are available in GEE with a `Landuse` property (e.g., 1 for sugar beet, 2 for uncultivated).

## Usage
1. Open the GEE script (`crop_land_classifier.js`) in the GEE Code Editor.
2. Update the following parameters if necessary:
   - `table`: Your region of interest (geometry or feature collection).
   - `startDate` and `endDate`: Set to your desired time range (e.g., '2023-10-05' to '2023-11-05').
   - `Sugerbeet` and `Uncultivated`: Reference your labeled datasets.
3. Run the script in the GEE Code Editor.
4. Review the map layers for NDVI, EVI, and classified output.
5. Check the console for sampled data, confusion matrix, accuracy, and Kappa coefficient.
6. Export the classified image to Google Drive (saved in the `Crop_Saman` folder as `Time-11.tif`).

## Input and Output
- **Input**:
  - Sentinel-2 imagery (`COPERNICUS/S2_SR_HARMONIZED`) filtered by date (2023-10-05 to 2023-11-05) and region.
  - Labeled datasets: `Sugerbeet` and `Uncultivated` with `Landuse` property.
- **Output**:
  - Map layers: NDVI, EVI, and classified image (sugar beet vs. uncultivated).
  - Console outputs: Sampled data, confusion matrix, accuracy, and Kappa coefficient.
  - Exported GeoTIFF: `Time-11.tif` in the `Crop_Saman` folder on Google Drive.

## Notes
- Ensure the input datasets (`Sugerbeet` and `Uncultivated`) have consistent `Landuse` values for classification.
- Adjust the Random Forest parameters (e.g., number of trees) or scale (e.g., 10 meters) for better performance.
- Verify the Coordinate Reference System (CRS) of the exported image (`EPSG:4326`).
- For large regions, increase the `maxPixels` parameter in the export function if needed.

## Contributing
Contributions are welcome to improve the script or add new features. To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Add enhancements with clear documentation and comments.
4. Submit a pull request with a description of changes.

## License
MIT License