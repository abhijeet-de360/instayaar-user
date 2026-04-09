import { useEffect } from "react";
import MobileMyPosts from "@/components/mobile/MobileMyPosts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getMyJobs } from "@/store/jobSlice";


const MyPosts = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getMyJobs(50, 0));
  }, [])



    return <MobileMyPosts />;
  


};

export default MyPosts;