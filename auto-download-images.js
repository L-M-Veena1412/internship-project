const fs = require("fs");
const path = require("path");
const https = require("https");

const productsDir = path.join(__dirname, "public", "images", "products");
const subcategoriesDir = path.join(__dirname, "public", "images", "subcategories");

if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
if (!fs.existsSync(subcategoriesDir)) fs.mkdirSync(subcategoriesDir, { recursive: true });

const products = [
  "beetroot","carrot","coriander","garlic","tomato",
  "potato","onion","spinach","broccoli","cabbage",
  "zucchini","green-beans","lettuce","brinjal","bell-peppers",
  "mango","banana","strawberry","blueberry","dragon-fruit",
  "kiwi","avocado","orange","lemon","milk","cheese",
  "butter","yogurt","bread","cake","cookies","croissant"
];

const subcategories = [
  "leafy-vegetables","root-vegetables","exotic-vegetables",
  "bulb-vegetables","fruiting-vegetables","citrus-fruits",
  "tropical-fruits","berries","exotic-fruits"
];

function download(name, folder) {
  return new Promise((resolve) => {

    const filePath = path.join(folder, name + ".jpg");

    if (fs.existsSync(filePath)) {
      console.log("Already exists:", name);
      return resolve();
    }

    const url = `https://source.unsplash.com/600x600/?${name},food`;

    const file = fs.createWriteStream(filePath);

    https.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("Downloaded:", name);
        resolve();
      });
    });
  });
}

async function run() {

  console.log("Downloading product images...");

  for (let p of products)
    await download(p, productsDir);

  console.log("Downloading subcategory images...");

  for (let s of subcategories)
    await download(s, subcategoriesDir);

  console.log("DONE");
}

run();