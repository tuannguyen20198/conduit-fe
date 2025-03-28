import { Link } from "react-router-dom";
import logo from "../assets/image1.avif";

const NotFound = () => {
  return (
    <div className="bg-white dark:bg-gray-900 flex min-h-screen items-center justify-center p-6">
      <div className="container mx-auto flex flex-col items-center gap-8 text-center lg:flex-row lg:gap-12 lg:text-left animate-fadeIn">
        {/* Nội dung chính */}
        <div className="w-full lg:w-1/2 space-y-6">
          <p className="text-lg font-semibold text-blue-500 dark:text-blue-400">404 Error</p>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sorry, the page you are looking for doesn't exist. Here are some helpful links:
          </p>

          {/* Nút điều hướng */}
          <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              to={-1 as any}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
              <span>Go Back</span>
            </Link>

            <Link
              to="/"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-800 dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900"
            >
              Take Me Home
            </Link>
          </div>
        </div>

        {/* Hình ảnh minh họa */}
        <div className="w-full max-w-lg lg:w-1/2">
          <img src={logo} alt="Not Found" className="w-full drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
