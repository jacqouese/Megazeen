# Megazeen &nbsp; <img src="https://img.shields.io/badge/status-inprogress-yellow" alt="status">

### web applicatication for managing online store sales

## Features include:

- Keep track of your store's stock
- See statistics
- Generate monthly PDF statements

## Tech

- React front-end
- Laravel + SQL back-end
- Laravel Sanctum user authentication

## Styling approach

> Components are styled using scss, each component has a style.scss file in its folder which contain styles used only by the component, app.scss file in sass folder is the parent scss file, it contains light and dark mode setup, variables, every other scss file imports this file.

## Description of the folder structure in the front-end

> contains axios functions to get or send data to the back-end

##### api/

> contains all the components, each component is in its designated folder, \_shared folder contains compontents that are used in multiple places <br />

##### components/

> contains arrays of data used by the application <br />

##### data/

> contains functions that handle alerts and prompts used by the application <br />

##### functions/

> contains custom helper functions used in multiple places <br />

##### helpers/

> contains custom hooks <br />

##### hooks/
