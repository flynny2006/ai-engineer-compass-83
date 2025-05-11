import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-700 mb-6">
          Oops! Page not found
        </p>
        <p className="text-md text-gray-500 mb-6">
          The page <span className="font-semibold text-gray-800">{location.pathname}</span> doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
