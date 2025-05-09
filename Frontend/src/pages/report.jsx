import React, { useState } from 'react';

const ReportPage = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:8000/api/summeriseReport', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResponseData(data.summary || "No summary available");
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.message || 'Failed to process document');
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
              Medical Report Summarizer
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <label className="block w-full">
                  <span className="sr-only">Choose document</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
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
                    'Summarize Document'
                  )}
                </button>
              </div>
            </form>

            {responseData && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Summary:</h2>
                <div className="prose prose-blue max-w-none">
                  {responseData.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-600 mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
