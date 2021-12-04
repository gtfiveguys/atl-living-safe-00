# atl-living-safe

## Problem Definition

College students nowadays are facing increasing exposure to urban crimes. Various measures have been instituted by both campus and governmental authorities in recent years to enforce students’ safety. Our team believes that amidst general success, however, there remains a blind spot. The safety measure for students living off-campus largely depends on their living situation and its surroundings, but none of the existing apartment listing sites such as Apartments.com offer truly robust functionalities in this regard.  We attempt to take into account the fact that people’s safety is affected by their daily activities in the city as they travel to campuses, workplaces, local groceries, pharmacies, gyms and other entities. 


## Solution

The goal of our project is to create a more dynamically safety-oriented apartment listing site that considers each property listing not as a fixed location, but as a web of routes centered at the apartment building and expanding into the wider neighborhood. Put formally, for each apartment building within a user-defined radius, our application will compute a safety score by combining the safety score of its location and of all the routes between this building and user’s most frequented locations.

## Table of Content

* Description
* Getting Started
    * Prerequisites
    * Installation
* Usage

## Description

???

## Getting Started

### Prerequisites

Please make sure you have the following prerequisites set up on your computer:
`npm 6.14.14`
`node 14.17.5`

### Installation

1. Clone the depository by running the following line in terminal:
    ```
    git clone https://github.com/gtfiveguys/atl-living-safe.git
    ```

2. Run the following line to go to the project folder:
    ```
    cd atl-living-safe
    ```

3. Install npm packages in the frontend:
    ```
    cd atl-living-safe/client
    npm install
    ```

4. Install npm packages in the backend:
    ```
    cd atl-living-safe/server
    npm install
    ```

## Usage

1. Get Google API key
    ```
    export GOOGLE_API_KEY = __
    ```

2. To start the frontend server, run the following lines:
    ```
    cd atl-living-safe/client
    npm start
    ```
3. To start the backend server, **open a new terminal window** and run the following lines:
    ```
    cd atl-living-safe/server
    npm run dev
    ```
4. If `react-script` hasn't already opened a new page in your browser window, go to http://localhost:3000.

5. ???
