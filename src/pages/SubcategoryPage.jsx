import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories } from '../services/api';
import SubcategoryCard from '../components/SubcategoryCard';

const SubcategoryPage = () => {

  const { categorySlug } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCategory = async () => {

      try {

        const response = await getCategories();

        const foundCategory = response.data.find(
          (cat) => cat.slug === categorySlug
        );

        setCategory(foundCategory);

      } catch (error) {

        console.error('Error fetching category:', error);

      } finally {

        setLoading(false);

      }

    };

    fetchCategory();

  }, [categorySlug]);



  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading subcategories...
      </div>
    );
  }


  if (!category) {
    return (
      <div className="p-10 text-center">
        Category not found
      </div>
    );
  }


  return (

    <div className="container mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-6">
        {category.name}
      </h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {category.subcategories.map((subcategory, index) => (

          <SubcategoryCard
            key={subcategory.id}
            subcategory={subcategory}
            categorySlug={categorySlug}
            index={index}
          />

        ))}

      </div>

    </div>

  );

};

export default SubcategoryPage;