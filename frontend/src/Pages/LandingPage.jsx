import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'

const LandingPage = () => {
  const mode = useSelector((state)=>state.app.mode)
  const userData = useSelector((state)=>state.user.userData)
  const navigate = useNavigate()

    const matricData = [
        {
            matric:"100k",
            state:"Students Enrolled"
        },
        {
            matric:"20+",
            state:"Courses Available" 
        },
        {
            matric:"95%",
            state:"Expert Teachers" 
        }
    ]

  return (
    <div className={`${mode?"bg-black overflow-x-hidden text-white":"bg-[#F6F5F8] text-black"} transition-all duration-200 min-h-screen w-full flex flex-col lg:flex-row items-center justify-between overflow-hidden`}>
      {/* Content Section */}
      <div className="w-full lg:w-[50%] mt-20 lg:mt-0 max-w-2xl lg:max-w-none mx-auto lg:mx-0 px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-0 lg:min-h-screen lg:flex lg:items-center lg:justify-center">
        <div className="flex flex-col items-center lg:items-start gap-6 md:gap-8">
          {/* Heading */}
          <h1 className="text-5xl sm:text-4xl md:text-6xl lg:text-5xl text-center lg:text-left font-Nunito font-bold leading-tight max-w-3xl">
            From Basics to Brilliance – Learn with Ease.
          </h1>

          {/* Description */}
          <p className="text-md sm:text-base md:text-xl text-center lg:text-left font-Nunito max-w-2xl">
            Discover a world of knowledge designed just for you. With interactive
            lessons, expert guidance, and easy-to-follow modules.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={()=>navigate("/courses")}
              className="bg-[#2A27F3] font-semibold text-white hover:scale-105 hover:shadow-lg transition-all duration-300 py-2 px-6 sm:py-3 sm:px-8 rounded-md font-Nunito w-full sm:w-auto"
            >
              Browse Courses
            </button>
            <button 
              className={`${userData?"hidden":"block"} bg-[#2A27F3] font-semibold text-white hover:scale-105 hover:shadow-lg transition-all duration-300 py-2 px-6 sm:py-3 sm:px-8 rounded-md font-Nunito w-full sm:w-auto`}
            >
              Get started
            </button>
          </div>

          {/* Metrics Section */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mt-8 md:mt-12 w-full sm:w-auto">
            {matricData.map((elem, index) => {
              return (
                <div key={index} className="flex flex-col font-Nunito items-center justify-center">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl font-bold">{elem.matric}</h1>
                  <p className="text-xs sm:text-sm text-center mt-1">{elem.state}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image - Visible only on large screens */}
      <div className="hidden lg:flex lg:w-[50%] h-screen items-center justify-end pr-8">
        <img
          src="/land.png"
          alt="Landing"
          className="h-full w-[85%] drop-shadow-2xl object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default LandingPage;
