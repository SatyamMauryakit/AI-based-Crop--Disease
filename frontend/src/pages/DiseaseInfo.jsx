import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaChevronLeft, FaChevronRight, FaLeaf } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "https://ai-based-crop-disease.onrender.com";


const SEARCH_IMAGES = {
  default: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  rice: "https://images.unsplash.com/photo-1601342630318-5f4a6f4b6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  wheat: "https://images.unsplash.com/photo-1558211246-bb8a7dfb2f9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  corn: "https://images.unsplash.com/photo-1601593768793-1e0d2290a1d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  tomato: "https://images.unsplash.com/photo-1594282418426-62d45b5e50c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  blight: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  rust: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
};

const DiseaseInfo = () => {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchImage, setSearchImage] = useState(SEARCH_IMAGES.default);
  const diseasesPerPage = 9;

  useEffect(() => {
    fetchAllDiseases();
  }, []);

 
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    let newImage = SEARCH_IMAGES.default;
    
    if (query.includes("rice")) newImage = SEARCH_IMAGES.rice;
    else if (query.includes("wheat")) newImage = SEARCH_IMAGES.wheat;
    else if (query.includes("corn")) newImage = SEARCH_IMAGES.corn;
    else if (query.includes("tomato")) newImage = SEARCH_IMAGES.tomato;
    else if (query.includes("potato")) newImage = SEARCH_IMAGES.potato;
    else if (query.includes("blight")) newImage = SEARCH_IMAGES.blight;
    else if (query.includes("rust")) newImage = SEARCH_IMAGES.rust;
    
    setSearchImage(newImage);
  }, [searchQuery]);

  const fetchAllDiseases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/diseases`);
      if (Array.isArray(res.data)) {
        setDiseases(res.data);
        setFilteredDiseases(res.data);
        setCurrentPage(1);
      } else {
        setError("Unexpected API response. Check the backend.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load disease information.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAllDiseases();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/diseases/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (Array.isArray(res.data)) {
        setFilteredDiseases(res.data);
        setCurrentPage(1);
      } else {
        setError("No diseases found for this search.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search diseases.");
    } finally {
      setLoading(false);
    }
  };

 
  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;
  const currentDiseases = filteredDiseases.slice(indexOfFirstDisease, indexOfLastDisease);
  const totalPages = Math.ceil(filteredDiseases.length / diseasesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen  from-green-50 to-green-100 bg-gradient-to-b">
     
      <div 
        className="h-64 w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${searchImage})` }}
      >
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Crop Disease Encyclopedia</h1>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search diseases, crops, symptoms..."
              className="w-full bg-gray-300  rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 px-6 py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
            >
              <FaSearch className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
       
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDiseases.map((disease) => (
            <motion.div
              key={disease.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={disease.imageUrl || "https://placehold.co/600x400?text=Plant+Disease"}
                  alt={disease.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=Plant+Disease";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-0 left-0 right-0 text-white font-bold text-xl p-4">
                  {disease.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                    Affected Crops
                  </h4>
                  <p className="mt-1 text-gray-600">
                    {disease.affectedCrops?.join(", ") || "Various crops"}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                    Symptoms
                  </h4>
                  <p className="mt-1 text-gray-600 line-clamp-3">
                    {disease.symptoms}
                  </p>
                </div>
                
                <button className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center">
                  View full details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      
        {!loading && currentDiseases.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <FaLeaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              No diseases found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery 
                ? "Try adjusting your search query"
                : "There are currently no diseases in our database"}
            </p>
          </div>
        )}

      
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstDisease + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastDisease, filteredDiseases.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredDiseases.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseInfo;
