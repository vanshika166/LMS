import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { useState,useContext,useEffect } from "react";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { serverURL } = useContext(appDataContext);
  const mode = useSelector((state) => state.app.mode);
  const [wishlistData, setWishlistData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userWishlist();
  }, []);

  useEffect(() => {
    if (wishlistData) {
      console.log(wishlistData);
    }
  }, [wishlistData]);

  // function to get the user's wishlist courses: 
  const userWishlist = async () => {
    try {
      const result = await axios.post(
        serverURL + "/api/wishlist/wishlist",
        {},
        { withCredentials: true }
      );
      if (result) {
        setWishlistData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to remove the course from wishlist:
  const removeWishlist = async(id)=>{
      try {
        const result = await axios.post(serverURL+'/api/wishlist/remove-wishlist',{id},{withCredentials:true})
        if(result){
          console.log(result.data)
          toast.success("removed from wishlist !")
          userWishlist()
        }
      } catch (error) {
        console.log("remove wishlist error: ",error);
        toast.error(error.response.data)
      }
    }

  return (
    <div
      className={`h-screen overflow-auto py-10 px-6 ${
        mode ? "bg-black text-gray-100" : "bg-[#F7F8FA] text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold font-Nunito flex items-center gap-2">
          My Wishlist <span className="text-red-500">❤️</span>
        </h1>
        <p className={` ${mode ? "text-gray-400" : "text-gray-500"} text-sm`}>
          View and manage all the courses you’ve saved.
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistData?.length > 0 ? (
          wishlistData?.map((course) => (
            <div
              key={course._id}
              className={`flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                mode ? "bg-[#1F2024]" : "bg-white"
              }`}
            >
              {/* Thumbnail */}
              <div className="w-full h-40">
                <img
                  src={course.coverImage.url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="flex flex-col gap-1">
                  <h3
                  onClick={()=>navigate(`/course-detail/${course._id}`)}
                    className={`text-lg hover:cursor-pointer font-semibold hover:text-blue-500 transition-all duration-200`}
                  >
                    {course.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      mode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    by {course.educator.username}
                  </p>
                </div>

                {/* Meta info & price */}
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div
                    className={`flex items-center gap-1 ${
                      mode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <FiUsers className="text-base" />
                    <span>{course.students}</span>
                  </div>
                  <p className="font-semibold text-base">
                    {course.isFree ? (
                      <span className="text-[#2A27F3]">Free</span>
                    ) : (
                      `₹${course.price}`
                    )}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeWishlist(course._id)}
                  className="mt-5 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-all duration-300"
                >
                  <MdDeleteOutline className="text-lg" />
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center mt-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
              alt="Empty wishlist"
              className="w-32 mb-4 opacity-80"
            />
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p
              className={`${
                mode ? "text-gray-400" : "text-gray-500"
              } text-sm mb-6`}
            >
              Browse courses and save the ones you like!
            </p>
            <button
            onClick={()=>navigate("/courses")}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
