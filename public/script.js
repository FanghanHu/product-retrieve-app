//DOM elements:
const $productName = $("#product-name");
const $productPrice = $("#product-price")
const $productImage = $("#product-image");
const $retrieveBtn = $("#retrieve-btn");
const $productUrl = $("#product-url");

//platforms:
const SHOPIFY = "SHOPIFY";
const SNIPCART = "SNIPCART";
const WIX = "WIX";

const PROXY = "http://localhost:3001/";

/**
 * show retrieved information in DOM.
 */
function displayProduct(name, price, image) {
    console.log("displaying: ", name, price, image);
    $productName.text(name?name:"");
    $productPrice.text(price?price:"");
    $productImage.attr("src", image?image:"");
}

function retrieve(link) {
    //get page html through the proxy
    $.get(PROXY + link).then(html => {
        const platform = findPlatform(html);
        console.log("platform: ", platform);

        switch(platform) {
            case SHOPIFY: retriveShopify(link, html);
                break;
            case SNIPCART: retriveSnipcart(html);
                break;
            case WIX: retirveWix(html);
                break;
            default: 
                displayProduct("Unsupported platform");
        }
    }).catch(err => {
        displayProduct("Error getting to the page, please check your url.");
        console.error(err);
    });
}

function retriveShopify(link, html) {
    const url = new URL(link);
    //find currency used in store init script
    const currency = html.match(/Shopify.currency.*"active".*?"(.*?)"/)[1];
    //find variantId in link
    const variantId = url.searchParams.get("variant");
    $.get(url.origin + url.pathname + ".json").then(({ product }) => {
        //use first variant by default
        let variant = product.variants[0];
        //change to correct variant
        if(variantId !== undefined) {
            for(const temp of product.variants) {
                if(variant.id == variantId) {
                    variant = temp;
                }
            }
        }
        displayProduct(product.title, `${variant.price} ${currency}`, product.image.src);
    })
}

function retriveSnipcart(html) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    const addCartBtn = dom.querySelector(".snipcart-add-item");
    const name = addCartBtn.getAttribute("data-item-name");
    let price = addCartBtn.getAttribute("data-item-price");
    const image = addCartBtn.getAttribute("data-item-image");

    //support multi currency 
    //see https://docs.snipcart.com/v2/configuration/multi-currency
    if(typeof price !== "string") {
        let multiCurrency = "";
        for(const currency in price) {
            if(multiCurrency.length) multiCurrency += ' or ';
            multiCurrency += `${price[currency]} ${currency}`;
        }
        price = multiCurrency;
    }

    displayProduct(name, price, image);
}

function retirveWix(html) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    const title = dom.querySelector("meta[property='og:title']").getAttribute("content");
    const price = dom.querySelector("meta[property='product:price:amount']").getAttribute("content");
    const currency = dom.querySelector("meta[property='product:price:currency']").getAttribute("content");
    const image = dom.querySelector("meta[property='og:image']").getAttribute("content");

    displayProduct(title, `${price} ${currency}`, image);
}

/**
 * look for signature text in the plain html text, 
 * and figure out which ecommerce service provider this website is using.
 */
function findPlatform(html) {
    if(html.includes("wix-warmup-data")) {
        return WIX;
    } else if(html.includes("shopify.shop")) {
        return SHOPIFY;
    } else if(html.includes("snipcart-add-item")) {
        return SNIPCART;
    } else {
        return "UNSUPPORTED";
    }
}

$retrieveBtn.on("click", () => {
    retrieve($productUrl.val());
})