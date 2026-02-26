import React from "react";
import { Link } from "react-router-dom";

const SubcategoryCard = ({ categorySlug, subcategory }) => {

  // Automatically map slug to image
  const imagePath = `/images/subcategories/${subcategory.slug}.jpg`;

  return (
    <Link
      to={`/category/${categorySlug}/${subcategory.slug}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
    >
      
      {/* Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={imagePath}
          alt={subcategory.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/images/subcategories/default.jpg";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {subcategory.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Browse products
        </p>
      </div>

    </Link>
  );
};

export default SubcategoryCard;