import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Health Coach',
      content: 'The quality of organic produce from OrganicStore is exceptional. Fresh, flavorful, and delivered right to my door. Highly recommend!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Chef',
      content: 'As a professional chef, I only use the best ingredients. OrganicStore never disappoints. Their vegetables are always fresh and full of flavor.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Mother of 3',
      content: 'I love knowing I\'m feeding my family organic, pesticide-free food. The subscription service makes healthy eating so convenient!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Calculate slides based on screen size
  const getSlidesPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // Desktop: 3 cards
      if (window.innerWidth >= 768) return 2; // Tablet: 2 cards
      return 1; // Mobile: 1 card
    }
    return 1;
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  React.useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
      setCurrentIndex(0); // Reset to first slide on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / slidesPerView);
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getVisibleTestimonials = () => {
    const start = currentIndex * slidesPerView;
    const end = start + slidesPerView;
    return testimonials.slice(start, end);
  };
  
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have made the switch to organic living
          </p>
        </motion.div>
        
        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalSlides <= 1}
                aria-label="Previous testimonials"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalSlides <= 1}
                aria-label="Next testimonials"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Slider Track */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 sm:gap-8"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Render all testimonials for smooth sliding */}
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="w-full flex-shrink-0"
                  style={{ 
                    width: slidesPerView === 1 ? '100%' : 
                           slidesPerView === 2 ? '50%' : '33.333%' 
                  }}
                >
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-700 mb-6 italic text-sm sm:text-base flex-grow">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-dark-text text-sm sm:text-base">{testimonial.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-olive-green w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Stats */}
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { number: '10,000+', label: 'Happy Customers' },
            { number: '50+', label: 'Organic Products' },
            { number: '100%', label: 'Satisfaction' },
            { number: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-olive-green mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
