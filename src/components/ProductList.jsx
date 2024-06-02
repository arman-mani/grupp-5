import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faLaptop, faCouch, faGem, faReplyAll } from '@fortawesome/free-solid-svg-icons';
import { getProducts, getProductsCategory } from '../api/dataFetching';

const categoryIcons = {
  "men's clothing": faTshirt,
  "electronics": faLaptop,
  "jewelery": faGem,
  "women's clothing": faTshirt,
  "furniture": faCouch,
  "All": faReplyAll,
};

const ITEMS_PER_PAGE = 10;

function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products, isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getProductsCategory
  });

  if (productsLoading || categoriesLoading) return <div>Loading...</div>;
  if (productsError || categoriesError) return <div>Failed to load data. Please try again later.</div>;

  // Filtra os produtos de acordo com a categoria selecionada
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Calcula o total de páginas
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Calcula o índice inicial e final dos itens da página atual
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);


  const nextPage = () => {
    setCurrentPage(currentPage => Math.min(currentPage + 1, totalPages));
  };

 
  const prevPage = () => {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  };

  return (
    <div>
      <h1 className="mb-10 text-xl font-bold">Product List</h1>

      <div className="mb-5 flex space-x-4 overflow-x-auto py-4">
        <div
          className={`flex flex-col items-center cursor-pointer ${selectedCategory === 'All' ? 'text-blue-500' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          <FontAwesomeIcon icon={faReplyAll} size="2x" />
          <span>All</span>
        </div>
        {categories.map(category => (
          <div
            key={category}
            className={`flex flex-col items-center cursor-pointer ${selectedCategory === category ? 'text-blue-500' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            <FontAwesomeIcon icon={categoryIcons[category] || faTshirt} size="2x" />
            <span>{category}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap -mx-4">
        {filteredProducts.slice(startIndex, endIndex).map(({ id, image, title, category, rating, price }) => (
          <div key={id} className="w-1/5 px-4 mb-8">
            <Link to={`/product/${id}`} className="block bg-gray-100 mb-5 rounded-md p-5 h-full">
              <img className="h-40 w-full object-contain mb-4" src={image} alt={title} />
              <h2 className="font-bold mb-2">{title}</h2>
              <p>Category: {category}</p>
              <p>Rating: {rating.rate} ({rating.count} reviews)</p>
              <p>Price: ${price}</p>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default ProductList;
