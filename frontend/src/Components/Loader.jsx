const Loader = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="loader" />
      {message && (
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;