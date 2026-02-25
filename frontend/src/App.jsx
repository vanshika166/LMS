import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home.jsx";
import AuthPage from "./Pages/AuthPage.jsx";
import AllCourses from "./Pages/AllCourses.jsx";
import Blog from "./Pages/Blog.jsx";
import BlogRead from "./Pages/BlogRead.jsx";
import Student_Home from "./Student_DashBoard/Student_Home.jsx";
import TeacherHome from "./TeacherDashBoard/TeacherHome.jsx";
import TeacherDashboard from "./TeacherDashBoard/TeacherDashboard.jsx";
import TeacherCourses from "./TeacherDashBoard/TeacherCourses.jsx";
import AnalyticsPage from "./TeacherDashBoard/AnalyticsPage.jsx";
import ProfileSettingsPage from "./TeacherDashBoard/ProfileSettingsPage.jsx";
import BlogPage from "./TeacherDashBoard/BlogPage.jsx";
import CreateCourse from "./CreateCourse/CreateCourse.jsx";
import UploadCourseMaterial from "./CreateCourse/UploadCourseMaterial.jsx";
import PricingPage from "./CreateCourse/PricingPage.jsx";
import PublishPage from "./CreateCourse/PublishPage.jsx";
import CourseDetailPage from "./Pages/CourseDetailPage.jsx";
import StudentDashboard from "./Student_DashBoard/StudentDashboard .jsx";
import StudentProfile from "./Student_DashBoard/StudentProfile.jsx";
import Student_Courses from "./Student_DashBoard/Student_Courses.jsx";
import ForgetPassword from "./Pages/ForgetPassword.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/actions/userActions.js";
import Classes from "./Student_DashBoard/Classes.jsx";
import Wishlist from "./Student_DashBoard/Wishlist.jsx";
import CertificatesPage from "./Student_DashBoard/CertificatesPage.jsx";
import PaymentsPage from "./Student_DashBoard/PaymentsPage.jsx";
import TeacherEarnings from "./TeacherDashBoard/TeacherEarnings.jsx";
import InstructorReviews from "./TeacherDashBoard/InstructorReviews.jsx";
import EducatorProfile from "./Pages/EducatorProfile.jsx";
import MainLayout from "./Components/layouts/MainLayout.jsx";
import About from "./Pages/About.jsx";
import CategoryCoursePage from "./Pages/CategoryCoursePage.jsx";
import TeacherNotificationsPage from "./TeacherDashBoard/TeacherNotificationsPage.jsx";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const isEdit = useSelector((state) => state.userCourseData.edit);
  const mode = useSelector((state) => state.app.mode);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      const currentPath = window.location.pathname;

      // redirect only if user is on public pages
      const isPublicPage = ["/login", "/signup"].includes(currentPath);

      if (isPublicPage) {
        if (user.role === "educator") navigate("/teacher/dashboard");
        else if (user.role === "student") navigate("/student/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className={`${mode ? "bg-[#121212]" : "bg-[#F6F5F8]"}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/course-detail/:id" element={<CourseDetailPage />} />
          <Route path="/class/:id" element={<Classes />} />
          <Route path="/educator/:id" element={<EducatorProfile />} />
          <Route path="/blogread/:id" element={<BlogRead />} />
          <Route path="/courses/:categorySlug" element={<CategoryCoursePage/>}/>
        </Route>

{/* login/ signup/ forget password */}
        <Route
          path="/login"
          element={
            !user || Object.keys(user).length === 0 ? <AuthPage /> : <Home />
          }
        />
        <Route
          path="/signup"
          element={
            !user || Object.keys(user).length === 0 ? <AuthPage /> : <Home />
          }
        />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* teacher dashboard Routes */}
        <Route path="/teacher" element={<TeacherHome />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="blogs" element={<BlogPage />} />
          <Route path="earning" element={<TeacherEarnings />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="reviews" element={<InstructorReviews />} />
          <Route path="educator-notification" element={<TeacherNotificationsPage />} />

          {/* create course routes */}
          <Route
            path={isEdit ? "create-course/:id" : "create-course"}
            element={<CreateCourse />}
          />
          <Route
            path="upload-material/:id"
            element={<UploadCourseMaterial />}
          />
          <Route path="course-pricing/:id" element={<PricingPage />} />
          <Route path="course-publish/:id" element={<PublishPage />} />
        </Route>

        {/* student dashboard */}
        <Route path="/student" element={<Student_Home />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="courses" element={<Student_Courses />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="certificate" element={<CertificatesPage />} />
          <Route path="payment" element={<PaymentsPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
