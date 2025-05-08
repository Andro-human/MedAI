import React, { useState } from 'react';

const ImageUploadPage = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG)');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)');
      return;
    }

    setError(null);
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreviewURL(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Sending request to server...');
      const response = await fetch('https://medai-ai-kqw8.onrender.com/api/predict', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - the browser will do it automatically with FormData
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResponseData(data.prediction || "No prediction available");
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-blue-600">
          <div className="p-8">
            <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
              Wound Image Analysis
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <label className="block w-full">
                  <span className="sr-only">Choose image</span>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-3 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full max-w-xs bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition duration-200 ease-in-out"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Analyze Image'
                  )}
                </button>
              </div>
            </form>

            {previewURL && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Image Preview:</h2>
                <div className="flex justify-center">
                  <img 
                    src={previewURL} 
                    alt="Preview" 
                    className="max-h-80 max-w-full rounded-lg object-contain border border-gray-200" 
                  />
                </div>
              </div>
            )}

            {responseData && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Analysis Results:</h2>
                <div className="prose prose-blue max-w-none">
                  {responseData.split('\n').map((line, i) => {
                    // Format bold text
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p 
                        key={i} 
                        className="text-gray-600 mb-2"
                        dangerouslySetInnerHTML={{ __html: formattedLine }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;