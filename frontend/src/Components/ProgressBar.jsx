import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ProgressBar = () => {
  const mode = useSelector((state) => state.app.mode);
  const location = useLocation();
  const {id} = useParams()
  const navigate = useNavigate();

 const currentPath = location.pathname

  const showbutton = id && currentPath.includes(`/teacher/course-publish/${id}`)

  return (
    <div
      className={`flex w-full items-center justify-between p-3 px-6 ${
        mode ? "bg-black" : "bg-white"
      } top-0 z-10`}
    >
      {/* status */}
      <div className="flex items-center gap-x-8 flex-wrap">
        {[
          "Course Information & FAQ",
          "Upload Course Material",
          "Pricing",
          "Publish",
        ].map((elem, index) => {
          return (
            <div key={index} className="flex items-center gap-x-2">
              <div className="flex items-center justify-center py-1 px-3 rounded-full bg-gray-300 text-gray-700 font-medium shadow-sm">
                {index + 1}
              </div>
              <h2
                className={`text-sm font-medium ${
                  mode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {elem}
              </h2>
            </div>
          );
        })}
      </div>

      {/* publish button */}
      {showbutton && (
        <button
        onClick={()=>navigate(`/course-detail/${id}`)}
      className="bg-[#2A27F3] font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 p-2 rounded-md px-5 font-Nunito"> Preview
      </button>
    )}
    </div>
  );
};

export default ProgressBar;
