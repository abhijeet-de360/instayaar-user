import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Heart,
  Calendar,
  CreditCard,
  Star,
  TrendingUp,
  ChevronRight,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllActiveBooking } from "@/store/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { getUserDashboardData } from "@/store/dashboardSlice";

export const EmployerDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const bookingVar = useSelector((state: RootState) => state.booking);
  const dashboardVar = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(getAllActiveBooking());
    dispatch(getUserDashboardData())
  }, [dispatch]);


  const handlePostJob = () => {
    navigate("/post-job");
  };

  const handleMyShortlist = () => {
    navigate("/shortlist-freelancers");
  };

  const handleBrowseFreelancers = () => {
    navigate("/discover");
  };

  const handleScheduleService = () => {
    navigate("/platform-booking");
  };

  return (
    <div
      className={`${
        isMobile ? "p-4" : "container mx-auto p-6"
      } space-y-4 md:space-y-6`}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>
            {isMobile ? 'Dashboard' : 'Employer Dashboard'}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {isMobile ? 'Manage your services' : 'Manage your service requests and bookings'}
          </p>
        </div> */}

        {/* <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
          <Button onClick={handlePostJob} className={`${isMobile ? 'w-full' : ''}`}>
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
          <Button variant="outline" onClick={handleMyShortlist} className={`${isMobile ? 'w-full' : ''}`}>
            <Heart className="w-4 h-4 mr-2" />
            My Shortlist
          </Button>
        </div> */}
      </div>

      {/* Quick Stats - Mobile optimized grid */}
      <div
        className={`grid ${
          isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-4"
        } gap-3 md:gap-4`}
      >
        <Card className={`${isMobile ? "p-3" : ""}`}>
          <CardHeader
            className={`flex flex-row items-center justify-between space-y-0 ${
              isMobile ? "p-0" : "pb-2"
            }`}
          >
            <CardTitle
              className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}
            >
              Active
            </CardTitle>
            <Calendar
              className={`${
                isMobile ? "h-3 w-3" : "h-4 w-4"
              } text-muted-foreground`}
            />
          </CardHeader>
          <CardContent className={`${isMobile ? "p-0 pt-2" : ""}`}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
              {dashboardVar?.userDashboardData?.totalActive || 0}
            </div>
            {/* <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>+1 from last month</p> */}
          </CardContent>
        </Card>

        {/* <Card className={`${isMobile ? "p-3" : ""}`}>
          <CardHeader
            className={`flex flex-row items-center justify-between space-y-0 ${
              isMobile ? "p-0" : "pb-2"
            }`}
          >
            <CardTitle
              className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}
            >
              Total Spent
            </CardTitle>
            <CreditCard
              className={`${
                isMobile ? "h-3 w-3" : "h-4 w-4"
              } text-muted-foreground`}
            />
          </CardHeader>
          <CardContent className={`${isMobile ? "p-0 pt-2" : ""}`}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
              ₹{dashboardVar?.userDashboardData?.totalSpent || 0}
            </div>
          </CardContent>
        </Card> */}

        <Card className={`${isMobile ? "p-3" : ""}`}>
          <CardHeader
            className={`flex flex-row items-center justify-between space-y-0 ${
              isMobile ? "p-0" : "pb-2"
            }`}
          >
            <CardTitle
              className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}
            >
              Completed
            </CardTitle>
            <Star
              className={`${
                isMobile ? "h-3 w-3" : "h-4 w-4"
              } text-muted-foreground`}
            />
          </CardHeader>
          <CardContent className={`${isMobile ? "p-0 pt-2" : ""}`}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
              {dashboardVar?.userDashboardData?.totalCompleted || 0}
            </div>
            {/* <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>0.0 avg rating</p> */}
          </CardContent>
        </Card>

        {/* <Card className={`${isMobile ? "p-3" : ""}`}>
          <CardHeader
            className={`flex flex-row items-center justify-between space-y-0 ${
              isMobile ? "p-0" : "pb-2"
            }`}
          >
            <CardTitle
              className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}
            >
              On Going
            </CardTitle>
            <TrendingUp
              className={`${
                isMobile ? "h-3 w-3" : "h-4 w-4"
              } text-muted-foreground`}
            />
          </CardHeader>
          <CardContent className={`${isMobile ? "p-0 pt-2" : ""}`}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
              {dashboardVar?.userDashboardData?.totalOngoing || 0}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="flex items-center gap-4">
            <Button
              className="flex-1"
              onClick={handlePostJob}
            >
              Add Post
            </Button>
            <Button
              className="flex-1"
              onClick={handleBrowseFreelancers}
            >
              Freelancers
            </Button>
          </div>

      {/* Main Content - Stack on mobile */}
      <div
        className={`grid ${
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
        } gap-4 md:gap-6`}
      >
        <div
          className={`${
            isMobile ? "" : "lg:col-span-2"
          } space-y-4 md:space-y-6`}
        >
          {/* Active Bookings */}
          <Card className="border-none shadow-none border p-0">
            <CardHeader className={`${isMobile ? "pb-3 px-0 p-0" : ""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`${isMobile ? "text-lg" : ""}`}>
                    { " "}
                  </CardTitle>
                </div>
                {/* {isMobile && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )} */}
              </div>
            </CardHeader>
            <CardContent className={`${isMobile ? "pt-0 px-0" : ""}`}>
              <div className="space-y-3 md:space-y-4">
                {bookingVar.activeBookingData.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.type === "service" && (
                      <div
                        className={`flex items-center justify-between ${
                          isMobile ? "p-3" : "p-4"
                        } border rounded-lg`}
                      >
                        <div className="flex-1">
                          <h4
                            className={`${
                              isMobile ? "text-sm" : ""
                            } font-medium`}
                          >
                            {item?.serviceId?.title}
                          </h4>
                          <p
                            className={`${
                              isMobile ? "text-xs" : "text-sm"
                            } text-muted-foreground`}
                          >{`with ${item.freelancerId.firstName} ${item.freelancerId.lastName}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.bookingDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            • {item.bookingTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`${
                              isMobile ? "text-sm" : ""
                            } font-medium`}
                          >
                            {" "}
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(item?.totalPrice || 0)}
                          </p>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {" "}
                            {item?.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}
                    {item.type === "job" && (
                      <div
                        className={`flex items-center justify-between ${
                          isMobile ? "p-3" : "p-4"
                        } border rounded-lg`}
                      >
                        <div className="flex-1">
                          <h4
                            className={`${
                              isMobile ? "text-sm" : ""
                            } font-medium`}
                          >
                            {item?.jobData?.title}
                          </h4>
                          <p
                            className={`${
                              isMobile ? "text-xs" : "text-sm"
                            } text-muted-foreground`}
                          >{`with ${item.freelancerId.firstName} ${item.freelancerId.lastName}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              item?.jobData?.prefferedDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            •{" "}
                            {`${item.jobData?.timeFrom} - ${item.jobData?.timeTo}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`${
                              isMobile ? "text-sm" : ""
                            } font-medium`}
                          >
                            {" "}
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(item?.bidAmount || 0)}
                          </p>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {" "}
                            {item?.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* {isMobile && (
                  <Button variant="outline" className="w-full mt-3" onClick={() => navigate('/my-bookings')}>
                    View All Bookings
                  </Button>
                )} */}
                {bookingVar.activeBookingData.length === 0 && (
                  <Card className="p-0">
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto mb-4 opacity-30" />
                      <p className="text-lg text-muted-foreground mb-2 font-semibold">
                        No applications found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bookings will appear here
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Show as bottom section on mobile */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Actions */}
          {/* <Card className="border-none shadow-none">
            <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
              <CardTitle className={`${isMobile ? 'text-lg' : ''}`}> </CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'flex items-center gap-4 border-none p-0' : ''} space-y-2`}>
              
            </CardContent>
          </Card> */}
          
        </div>
      </div>
    </div>
  );
};
