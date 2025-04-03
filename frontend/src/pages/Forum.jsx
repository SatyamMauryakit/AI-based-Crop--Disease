import { useEffect, useState } from "react";
import { Heart, MessageSquare, Image as ImageIcon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Forum() {
  
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://ai-based-crop-disease.onrender.com/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create post");

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setTitle("");
      setDescription("");
      setFile(null);
      setError(null);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      setError("Failed to delete post");
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Failed to like post");

      const updatedPost = await response.json();
      setPosts(posts.map((post) => 
        post._id === postId ? updatedPost : post
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Farmer Community Forum
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with fellow farmers, share knowledge and get advice
          </p>
        </div>

        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MessageSquare className="mr-2 text-green-600" />
                Create a Post
              </h3>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your question?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share details about your farming issue..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Image (Optional)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-500">
                        {file ? file.name : "Click to upload image"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors"
                >
                  Share Post
                </button>
              </form>
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full lg:w-2/3">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <motion.div 
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.description}</p>
                      
                      {post.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={`http://localhost:5000${post.imageUrl}`}
                            alt="Post"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleLike(post._id)} 
                          className={`flex items-center space-x-1 ${post.likes > 0 ? 'text-red-500' : 'text-gray-500'} hover:text-red-600 transition-colors`}
                        >
                          <Heart className="w-5 h-5" fill={post.likes > 0 ? "currentColor" : "none"} />
                          <span>{post.likes} Likes</span>
                        </button>

                        <button 
                          onClick={() => handleDeletePost(post._id)} 
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <Trash2 className="w-5 h-5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  No posts yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Be the first to share your farming questions or experiences!
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Forum;
