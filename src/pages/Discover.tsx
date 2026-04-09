import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";

import MobileDiscover from "@/components/mobile/MobileDiscover";
import { useDispatch, useSelector } from "react-redux";
import { getAllFreelancer } from "@/store/freelancerSlice";
import { AppDispatch, RootState } from "@/store/store";

const Discover = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllFreelancer(100, 0, ''));
  }, [dispatch]);

    return <MobileDiscover />;

};

export default Discover;
