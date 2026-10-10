'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // For specific operations like delete
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null); // For success/error messages

  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&search=${search}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsLoading(true); // Show loading state
      
      const res = await fetch(`/api/admin/products/${productToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Success - remove product from list
        setProducts(products.filter(p => p._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
        setAlertMessage({ type: 'success', text: 'Product deleted successfully' });
      } else {
        // Handle error response
        let errorMessage = 'Failed to delete product';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use status text
          errorMessage = `Failed to delete product: ${res.statusText}`;
        }
        
        setAlertMessage({ type: 'error', text: errorMessage });
        console.error(errorMessage);
      }
    } catch (error) {
      // Handle network/unexpected errors
      const errorMessage = `Error deleting product: ${error.message || 'Unknown error'}`;
      setAlertMessage({ type: 'error', text: errorMessage });
      console.error(errorMessage);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const stockBadge = (stock) => {
    if (stock === 0) return 'bg-red-50 text-red-700';
    if (stock <= 10) return 'bg-amber-wash text-amber-dark';
    return 'bg-ink/5 text-ink';
  };

  return (
    <div>
      {/* Alert Message */}
      {alertMessage && (
        <div className={`mb-6 p-4 rounded-editorial text-sm ${
          alertMessage.type === 'success'
            ? 'bg-ink text-bone-light'
            : 'bg-amber-wash border border-amber/30 text-amber-dark'
        }`}>
          {alertMessage.text}
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Catalog</p>
          <h1 className="text-3xl font-serif font-medium text-ink">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary"
        >
          <FaPlus className="mr-2" /> Add Product
        </Link>
      </header>

      {/* Search and Filters */}
      <div className="bg-bone-light border border-ink/10 rounded-editorial p-4 mb-6">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-bone border border-ink/15 text-ink px-4 py-2.5 pl-10 rounded-editorial focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-muted" />
          </div>
          <button
            type="submit"
            className="ml-2 bg-ink text-bone-light px-5 py-2.5 rounded-editorial hover:bg-ink-soft transition-colors text-sm font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-2 border-amber border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {products && products.length > 0 ? (
            <div className="bg-bone-light border border-ink/10 rounded-editorial overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink-muted border-b border-ink/10 bg-bone/50">
                      <th className="p-4 font-normal">Image</th>
                      <th className="p-4 font-normal">Name</th>
                      <th className="p-4 font-normal">Category</th>
                      <th className="p-4 font-normal">Price</th>
                      <th className="p-4 font-normal">Stock</th>
                      <th className="p-4 font-normal">Featured</th>
                      <th className="p-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-ink/5 last:border-0 hover:bg-bone/50 transition-colors">
                        <td className="p-4">
                          <div className="relative h-12 w-12 rounded-editorial overflow-hidden bg-bone-deep">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-ink-faint">
                                <span className="text-[10px]">No image</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-ink-soft">{product.name}</td>
                        <td className="p-4 text-ink-muted capitalize">{product.category}</td>
                        <td className="p-4 text-ink-soft font-medium">€{product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${stockBadge(product.countInStock)}`}>
                            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          {product.featured ? (
                            <span className="bg-amber-wash text-amber-dark px-2.5 py-1 rounded-full text-xs">
                              Featured
                            </span>
                          ) : (
                            <span className="bg-ink/5 text-ink-faint px-2.5 py-1 rounded-full text-xs">
                              Not Featured
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/admin/products/edit/${product._id}`}
                              className="text-ink-muted hover:text-ink transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-ink-muted hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center border-t border-ink/10">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-editorial bg-bone border border-ink/10 text-ink-soft hover:bg-bone-deep disabled:opacity-40 text-sm transition-colors"
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1.5 rounded-editorial text-sm ${
                          currentPage === i + 1
                            ? 'bg-ink text-bone-light'
                            : 'bg-bone border border-ink/10 text-ink-soft hover:bg-bone-deep'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-editorial bg-bone border border-ink/10 text-ink-soft hover:bg-bone-deep disabled:opacity-40 text-sm transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-bone-light border border-ink/10 p-8 rounded-editorial text-center">
              <p className="text-ink-muted mb-4">No products found.</p>
              <Link
                href="/admin/products/new"
                className="btn-primary"
              >
                <FaPlus className="mr-2" /> Add Your First Product
              </Link>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bone-light border border-ink/10 rounded-editorial max-w-md w-full p-6 shadow-editorial-lg">
            <h3 className="text-xl font-serif font-medium text-ink mb-4">Confirm Delete</h3>
            <p className="text-ink-muted mb-8">
              Are you sure you want to delete <span className="font-medium text-ink-soft">{productToDelete?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-bone border border-ink/15 text-ink-soft rounded-editorial hover:border-ink/30 hover:text-ink transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-700 text-bone-light rounded-editorial hover:bg-red-800 transition-colors text-sm disabled:opacity-60"
              >
                {isLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
