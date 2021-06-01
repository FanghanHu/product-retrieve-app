# Product Retrieve App

This web application can retrieve product name, price, and an image of a product from websites that uses Snipshop, Wix, or Shopify.

![demo](https://i.imgur.com/WDu6vq2.gif)

## Install
1. clone this project to you local machine
2. run ```npm i``` to install dependencies.

## Usage
1. run ```npm start``` to host the webserver
2. use your browser to visit localhost:3000
3. copy and paste the url of the product you want to retrieve data from into the input field and hit the retrieve button.

## How it works
This program uses a puppeteer server in the backend to gather the html document, I use puppeteer to get around SOP limitation and the redirect problem, the document text is sent to the front-end, the front end script will then try to identify which ecommerce platform the website is using by looking for signature text within the document. once we know what platform the website is using we can use different strategyies to gather the required information.