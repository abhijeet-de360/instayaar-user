import MobileMyBookings from "@/components/mobile/MobileMyBookings";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

const MyBookings = () => {
  const dispatch = useDispatch<AppDispatch>();


  return <MobileMyBookings />;

};

export default MyBookings;