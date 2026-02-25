import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios'
import { useContext } from "react";
import { appDataContext } from "../Context/AppContext.jsx";
import { useEffect } from "react";
import { getCurrrentCourse } from "../redux/actions/userCoursesAction.js";
import Loader from "../Components/Loader.jsx";

const PricingPage = () => {
  const mode = useSelector((state)=>state.app.mode)
  const [loading, setloading] = useState(false)
  const course = useSelector((state) => state.course.getCurrentCourse);
    const isEdit = useSelector((state) => state.userCourseData.edit);
  const {serverURL} = useContext(appDataContext)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [isFree, setIsFree] = useState(false);
  const {id} = useParams()

  useEffect(() => {
    dispatch(getCurrrentCourse(id))
  }, [dispatch,id])

  useEffect(() => {
    if (course && isEdit) {
      setIsFree(course.isFree || false);
      setPrice(course.price || "");
      setDiscount(course.discount || "");
    }
  }, [isEdit,course])
  
  

// function to add prizing for the course:
const addPrize = async()=>{
  setloading(true)
  try {
    const result = await axios.post(serverURL+'/api/course/course-price',{id,price,discount,isFree},{withCredentials:true})
    console.log(result)
    if(result){
      setloading(false)
      navigate(`/teacher/course-publish/${id}`)
    }
  } catch (error) {
      setloading(false)
    console.log("addPrize error:",error )
  }
}

// function to update the price:
const editPrice = async()=>{
  setloading(true)
  try {
    const result = await axios.post(serverURL+'/api/course/update-price',{id,discount,price,isFree},{withCredentials:true});
    if(result){
      setloading(false)
      navigate(`/teacher/course-publish/${id}`)
    }
  } catch (error) {
    setloading(false)
    console.log("edit price error: ",error);
  }
}

  // calculate final price after discount
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const finalPrice =
    numericPrice && numericDiscount
      ? (numericPrice - (numericPrice * numericDiscount) / 100).toFixed(2)
      : numericPrice.toFixed(2);

  return (
    loading?
    <div className={`h-screen w-full flex flex-col gap-y-4 items-center justify-center ${mode?"bg-black":"bg-[#F6F5F8]"}`}> <Loader message="Saving your course pricing details..." /> </div>: <div className={`h-screen ${mode?"bg-black text-white":"bg-gradient-to-br from-gray-50 to-indigo-100 text-black"}`}>

      <div className={`w-full p-4 ${mode?"bg-black":"bg-[#F6F5F8]"}`}>
        <h1 className={`text-2xl mb-3`}>Course Pricing</h1>

        {/* Free course toggle */}
        <div className={`flex items-center justify-between p-5 border rounded-xl ${mode?"bg-[#1F2024]":"bg-white"}`}>
          <div>
            <h2 className={`font-semibold ${mode?"text-gray-200":"text-gray-700"}`}>
              Offer this course for free
            </h2>
            <p className={`text-xs ${mode?"text-gray-300":"text-gray-500"}`}>
              Learners can enroll without paying anything
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full`}></div>
          </label>
        </div>

        {/* add price input */}
        {!isFree ? (
          <div>
            <label className={`block text-sm font-semibold ${mode?"text-gray-200":"text-gray-600"} mb-2`}>
              Base Price (₹)
            </label>
            <div className={` relative ${mode?"bg-[#1F2024]":"bg-white"}`}>
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg`}>
                ₹
              </span>
              <input
                type="number"
                placeholder="Enter course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full pl-8 ${mode?"bg-[#1F2024] text-gray-300":"text-gray-700"} shadow border rounded-lg p-3 text-base font-medium -sm focus:ring-2 focus:ring-indigo-400 focus:outline-none`}
              />
            </div>
          </div>
        ) : null}

        {/* discount input */}
        {!isFree ? (
          <div>
            <label className={`block text-sm font-semibold ${mode?"text-gray-200":"text-gray-600"} mb-2`}>
              Discount (%)
            </label>
            <div className={` relative ${mode?"bg-[#1F2024]":"bg-white"}`}>
              <input
                type="number"
                placeholder="e.g. 20"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className={`w-full ${mode?"bg-[#1F2024] text-gray-300":"text-gray-700"} border rounded-lg p-3 text-base font-medium shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none pr-12`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <p className={`text-xs ${mode?"text-gray-200":"text-gray-500"} mt-1`}>
              Leave empty if you don’t want a discount
            </p>
          </div>
        ) : null}

        {/* preview section */}

        <div className={`p-5 border rounded-xl mt-3 ${mode?"bg-[#1F2024]":"bg-white"}`}>
          <h2 className={`text-sm font-semibold ${mode?"text-gray-200":"text-gray-700"} mb-2`}>Preview</h2>
          {isFree ? (
            <p className="text-green-600 font-medium">
              ✅ This course will be offered for FREE
            </p>
          ) : (
            <div className={`text-lg font-semibold ${mode?"text-white":"text-gray-800"}`}>
              ₹ {finalPrice}{" "}
              {discount && (
                <span className="ml-2 text-sm text-red-500 font-normal">
                  ({discount}% OFF)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end fixed bottom-2 right-5 gap-3 pt-4">
          <button 
          disabled={!isFree && !price}
          onClick={(e)=>{
            e.preventDefault()
            isEdit?editPrice():addPrize()
            }} className="bg-[#2A27F3] font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 p-2 rounded-md px-5 font-Nunito">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
