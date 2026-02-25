const Loader = ({ message }) => {
  /**
   * A simple loader spinner using the existing `.loader` CSS class.
   *
   * Props:
   * - `message` (optional): text to display under the spinner. Useful for
   *   explaining what is being processed (e.g. "Saving your course details...").
   *
   * The wrapper div uses flex centering and can be made full‑screen by the
   * caller if desired. If you'd like an overlay, you can wrap <Loader /> in a
   * fixed-position container with a semi-transparent background (see examples
   * in CreateCourse/PricingPage etc.).
   */
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