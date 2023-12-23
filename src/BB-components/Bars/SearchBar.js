import React, { useState, useEffect } from 'react';
import "../Bars/SearchBar.css";
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSort, setSelectedSort] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setWarning('');

      const response = await axios.get(`http://localhost:8000/api/queries/Items/${searchQuery}`);

      if (response.status === 200) {
        // Assuming API returns data in the response.data property
        const retrievedResults = response.data.products;
        setSearchResults(retrievedResults);
      } else {
        setWarning('Error fetching data');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setWarning('Error fetching data');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
          className="sort-select"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="">Select Sort</option>
          <option value="Relevance">Relevance</option>
          <option value="Price Low to High">Price Low to High</option>
          <option value="Price High to Low">Price High to Low</option>
          <option value="Newest Arrivals">Newest Arrivals</option>
        </select>
          {/* <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
          </select> */}

          <button className="search-button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Display warning if any */}
        {warning && <div className="warning">{warning}</div>}
      </div>
    </>
  );
};

export default SearchBar;
