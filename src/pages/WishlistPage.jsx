import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-8 border-l-4 border-purple-600 pl-4">
          My Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold uppercase tracking-widest mb-6">Your wishlist is empty</p>
            <Link to="/" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-black uppercase text-xs">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;