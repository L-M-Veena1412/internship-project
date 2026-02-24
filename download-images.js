const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const productsDir = path.join(__dirname, 'public', 'images', 'products');
const subcategoriesDir = path.join(__dirname, 'public', 'images', 'subcategories');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}
if (!fs.existsSync(subcategoriesDir)) {
  fs.mkdirSync(subcategoriesDir, { recursive: true });
}

// Product images with their URLs
const productImages = {
  'beetroot.jpg': 'https://images.unsplash.com/photo-1518977686604-6c9e9c0d6b1?w=400&h=400&fit=crop',
  'carrot.jpg': 'https://images.unsplash.com/photo-1445282768811-6a790c3c3529?w=400&h=400&fit=crop',
  'coriander.jpg': 'https://images.unsplash.com/photo-1576091160569-2c6c8b6b5c1?w=400&h=400&fit=crop',
  'garlic.jpg': 'https://images.unsplash.com/photo-1610832948806-8e1f1f9d5b1?w=400&h=400&fit=crop',
  'tomato.jpg': 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400&h=400&fit=crop',
  'potato.jpg': 'https://images.unsplash.com/photo-1518977686604-6c9e9c0d6b1?w=400&h=400&fit=crop',
  'onion.jpg': 'https://images.unsplash.com/photo-1518977686604-6c9e9c0d6b1?w=400&h=400&fit=crop',
  'spinach.jpg': 'https://images.unsplash.com/photo-1576091160569-2c6c8b6b5c1?w=400&h=400&fit=crop',
  'broccoli.jpg': 'https://images.unsplash.com/photo-1530587142479-6d9a8b0f4c?w=400&h=400&fit=crop',
  'cabbage.jpg': 'https://images.unsplash.com/photo-1574233326934-6d9a8b0f4c?w=400&h=400&fit=crop',
  'zucchini.jpg': 'https://images.unsplash.com/photo-1581375386699-c70f1f9d5b1?w=400&h=400&fit=crop',
  'green-beans.jpg': 'https://images.unsplash.com/photo-1581375386699-c70f1f9d5b1?w=400&h=400&fit=crop',
  'lettuce.jpg': 'https://images.unsplash.com/photo-1530587142479-6d9a8b0f4c?w=400&h=400&fit=crop',
  'brinjal.jpg': 'https://images.unsplash.com/photo-1610832948806-8e1f1f9d5b1?w=400&h=400&fit=crop',
  'bell-peppers.jpg': 'https://images.unsplash.com/photo-1581375386699-c70f1f9d5b1?w=400&h=400&fit=crop',
  'mango.jpg': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop',
  'banana.jpg': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
  'strawberry.jpg': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
  'blueberry.jpg': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop',
  'dragon-fruit.jpg': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop',
  'kiwi.jpg': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=400&fit=crop',
  'avocado.jpg': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
  'orange.jpg': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop',
  'lemon.jpg': 'https://images.unsplash.com/photo-1590502593747-42b992133372?w=400&h=400&fit=crop',
  'milk.jpg': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
  'cheese.jpg': 'https://images.unsplash.com/photo-1486476250581-4a1e356f8d2d?w=400&h=400&fit=crop',
  'butter.jpg': 'https://images.unsplash.com/photo-1486476250581-4a1e356f8d2d?w=400&h=400&fit=crop',
  'yogurt.jpg': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
  'bread.jpg': 'https://images.unsplash.com/photo-1509440917394-78a2b2c4c4e4?w=400&h=400&fit=crop',
  'cake.jpg': 'https://images.unsplash.com/photo-1486476250581-4a1e356f8d2d?w=400&h=400&fit=crop',
  'cookies.jpg': 'https://images.unsplash.com/photo-1499636138219-4a6b5f4a6f2f?w=400&h=400&fit=crop',
  'croissant.jpg': 'https://images.unsplash.com/photo-1559329007-406870828b39?w=400&h=400&fit=crop'
};

// Subcategory images
const subcategoryImages = {
  'leafy-vegetables.jpg': 'https://images.unsplash.com/photo-1576091160569-2c6c8b6b5c1?w=400&h=300&fit=crop',
  'root-vegetables.jpg': 'https://images.unsplash.com/photo-1518977686604-6c9e9c0d6b1?w=400&h=300&fit=crop',
  'exotic-vegetables.jpg': 'https://images.unsplash.com/photo-1581375386699-c70f1f9d5b1?w=400&h=300&fit=crop',
  'bulb-vegetables.jpg': 'https://images.unsplash.com/photo-1610832948806-8e1f1f9d5b1?w=400&h=300&fit=crop',
  'fruiting-vegetables.jpg': 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400&h=300&fit=crop',
  'citrus-fruits.jpg': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
  'tropical-fruits.jpg': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
  'berries.jpg': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop',
  'exotic-fruits.jpg': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop'
};

// Function to download an image
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
        fs.unlink(filepath, () => {}); // Delete the file if download failed
        reject(new Error(`Failed to download ${url}. Status: ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete the file if download failed
      reject(err);
    });
  });
}

// Download all product images
async function downloadAllImages() {
  console.log('Starting download of product images...');
  
  for (const [filename, url] of Object.entries(productImages)) {
    try {
      const filepath = path.join(productsDir, filename);
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error.message);
    }
  }

  console.log('Starting download of subcategory images...');
  
  for (const [filename, url] of Object.entries(subcategoryImages)) {
    try {
      const filepath = path.join(subcategoriesDir, filename);
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error.message);
    }
  }

  console.log('Download process completed!');
}

downloadAllImages().catch(console.error);
