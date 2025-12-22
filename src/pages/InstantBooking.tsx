import { localService } from "@/shared/_session/local";
import FreelancerInstantBooking from "./FreelancerInstantBooking";
import UserInstantBooking from "./UserInstantBooking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { getFreelancerProfile } from "@/store/authSlice";


const InstantBooking = () => {
    const type = localService.get('role')

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if(localService.get('role') === 'freelancer'){
            dispatch(getFreelancerProfile())
        }
    }, [])



    return (
        <>
            {type === 'user' ?
                (<UserInstantBooking />) :
                (<FreelancerInstantBooking />)
            }
        </>

    );
};

export default InstantBooking;
