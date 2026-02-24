const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, 'public', 'images', 'products');
const subcategoriesDir = path.join(__dirname, 'public', 'images', 'subcategories');

// Working URLs for remaining images
const remainingProductImages = {
  'beetroot.jpg': 'https://images.pexels.com/photos/699783/pexels-photo-699783.jpeg?auto=compress&cs=tinysrgb&w=400',
  'carrot.jpg': 'https://images.pexels.com/photos/710744/pexels-photo-710744.jpeg?auto=compress&cs=tinysrgb&w=400',
  'coriander.jpg': 'https://images.pexels.com/photos/2252749/pexels-photo-2252749.jpeg?auto=compress&cs=tinysrgb&w=400',
  'garlic.jpg': 'https://images.pexels.com/photos/1792266/pexels-photo-1792266.jpeg?auto=compress&cs=tinysrgb&w=400',
  'tomato.jpg': 'https://images.pexels.com/photos/1327835/pexels-photo-1327835.jpeg?auto=compress&cs=tinysrgb&w=400',
  'potato.jpg': 'https://images.pexels.com/photos/594610/pexels-photo-594610.jpeg?auto=compress&cs=tinysrgb&w=400',
  'onion.jpg': 'https://images.pexels.com/photos/616404/pexels-photo-616404.jpeg?auto=compress&cs=tinysrgb&w=400',
  'spinach.jpg': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
  'broccoli.jpg': 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
  'cabbage.jpg': 'https://images.pexels.com/photos/1359390/pexels-photo-1359390.jpeg?auto=compress&cs=tinysrgb&w=400',
  'zucchini.jpg': 'https://images.pexels.com/photos/5698155/pexels-photo-5698155.jpeg?auto=compress&cs=tinysrgb&w=400',
  'green-beans.jpg': 'https://images.pexels.com/photos/1359391/pexels-photo-1359391.jpeg?auto=compress&cs=tinysrgb&w=400',
  'lettuce.jpg': 'https://images.pexels.com/photos/690867/pexels-photo-690867.jpeg?auto=compress&cs=tinysrgb&w=400',
  'brinjal.jpg': 'https://images.pexels.com/photos/1060828/pexels-photo-1060828.jpeg?auto=compress&cs=tinysrgb&w=400',
  'bell-peppers.jpg': 'https://images.pexels.com/photos/699783/pexels-photo-699783.jpeg?auto=compress&cs=tinysrgb&w=400',
  'lemon.jpg': 'https://images.pexels.com/photos/56826/pexels-photo-56826.jpeg?auto=compress&cs=tinysrgb&w=400',
  'cheese.jpg': 'https://images.pexels.com/photos/887467/pexels-photo-887467.jpeg?auto=compress&cs=tinysrgb&w=400',
  'butter.jpg': 'https://images.pexels.com/photos/666851/pexels-photo-666851.jpeg?auto=compress&cs=tinysrgb&w=400',
  'bread.jpg': 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
  'cake.jpg': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
  'cookies.jpg': 'https://images.pexels.com/photos/278893/pexels-photo-278893.jpeg?auto=compress&cs=tinysrgb&w=400',
  'croissant.jpg': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
};

const remainingSubcategoryImages = {
  'leafy-vegetables.jpg': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
  'root-vegetables.jpg': 'https://images.pexels.com/photos/594610/pexels-photo-594610.jpeg?auto=compress&cs=tinysrgb&w=400',
  'exotic-vegetables.jpg': 'https://images.pexels.com/photos/1060828/pexels-photo-1060828.jpeg?auto=compress&cs=tinysrgb&w=400',
  'bulb-vegetables.jpg': 'https://images.pexels.com/photos/1792266/pexels-photo-1792266.jpeg?auto=compress&cs=tinysrgb&w=400',
  'fruiting-vegetables.jpg': 'https://images.pexels.com/photos/1327835/pexels-photo-1327835.jpeg?auto=compress&cs=tinysrgb&w=400'
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download ${url}. Status: ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadRemainingImages() {
  console.log('Downloading remaining product images...');
  
  for (const [filename, url] of Object.entries(remainingProductImages)) {
    try {
      const filepath = path.join(productsDir, filename);
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error.message);
    }
  }

  console.log('Downloading remaining subcategory images...');
  
  for (const [filename, url] of Object.entries(remainingSubcategoryImages)) {
    try {
      const filepath = path.join(subcategoriesDir, filename);
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error.message);
    }
  }

  console.log('Remaining images download completed!');
}

downloadRemainingImages().catch(console.error);
