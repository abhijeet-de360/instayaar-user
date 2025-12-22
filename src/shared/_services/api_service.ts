import axios from "axios";
import { authHeader } from "../_helper/auth-header";




 export const rootUrl = 'https://server.instayaar.com/api/v1/';
// export const rootUrl = 'http://192.168.1.2:3230/api/v1/';
// export const rootUrl = 'http://localhost:3230/api/v1/';


export const socketUrl = 'https://server.instayaar.com';
// export const socketUrl = 'http://192.168.1.19:3130';
// export const socketUrl = 'http://localhost:3130';



const userAuthUrl = rootUrl + 'user'
const freelancerUrl = rootUrl + 'freelancer'
const jobUrl = rootUrl + 'jobs'
const categoryUrl = rootUrl + 'category'
const serviceUrl = rootUrl + 'service'
const portfolioUrl = rootUrl + 'portfolio'
const bookingUrl = rootUrl + 'serviceBooking'
const jobApplicationUrl  = rootUrl + 'jobApplication'
const chatUrl  = rootUrl + 'chat'
const transactionURL  = rootUrl + 'transactions'
const widthrawalUrl = rootUrl + 'freelancer'
const dashboardUrl = rootUrl + 'dashboard'
const serviceReview = rootUrl + 'serviceReview'
const jobReview = rootUrl + 'jobReview'


// ===================== User Auth ===========================
async function userSentOtp(phoneNumber) {
  return await axios.post(userAuthUrl + '/sendOtp', phoneNumber);

}

async function userVerifyOtp({ phoneNumber, otp, lat, lon, fcm }) {
  return await axios.post(userAuthUrl + '/verifyOtp', { phoneNumber, otp, lat, lon, fcm });

}


async function getUserProfile() {
  return await axios.get(userAuthUrl + '/profile', {
    headers: await authHeader('')
  });
}

async function updateUser(payload) {
  return await axios.patch(userAuthUrl + '/profile', payload, {
    headers: await authHeader('')
  });

}


async function updateUserProfile(image) {
  return await axios.put(userAuthUrl + '/image', {image}, {
    headers: await authHeader('FormData')
  });
}

async function userEmailSendOtp(email){
  return await axios.post(userAuthUrl + '/sendEmail', {email}, {
    headers: await authHeader('')
  });
} 

async function userEmailOtpVerify(data){
  return await axios.post(userAuthUrl + '/emailVerify', data, {
    headers: await authHeader('')
  });
}

async function userAadharVerify(data:any) {
  return await axios.post(userAuthUrl + '/aadharVerify', data, {
    headers: await authHeader('')
  })
}


// =========================== Freelancer =========================================


async function freelancerSendOtp(phoneNumber) {
  return await axios.post(freelancerUrl + '/sendOtp', phoneNumber);

}


async function freelancerVerifyOtp({ phoneNumber, otp, lat, lon, fcm }) {
  return await axios.post(freelancerUrl + '/verifyOtp', { phoneNumber, otp, lat, lon, fcm });

}

async function getFreelancerProfile() {
  return await axios.get(freelancerUrl + '/profile', {
    headers: await authHeader('')
  });

}

async function updateFreelancerdata(payload) {
  return await axios.patch(freelancerUrl + '/profile', payload, {
    headers: await authHeader('')
  });
}


async function updateFreelancerProfile(image) {
  return await axios.put(freelancerUrl + '/image', {image}, {
    headers: await authHeader('FormData')
  });
}

async function uploadPanCard(image){
  return await axios.put(freelancerUrl + '/pancard', {image}, {
    headers: await authHeader('FormData')
  });
}

async function uploadAadharFrontImage(image){
  return await axios.put(freelancerUrl + '/aadhar/front', {image}, {
    headers: await authHeader('FormData')
  });
}

async function uploadAadharBackImage(image){
  return await axios.put(freelancerUrl + '/aadhar/back', {image}, {
    headers: await authHeader('FormData')
  });
}

async function aadharVerify(data) {
  return await axios.post(freelancerUrl + '/aadharVerify', data, {
    headers: await authHeader('')
  })
}



async function emailSendOtp(email){
  return await axios.post(freelancerUrl + '/sendEmail', {email}, {
    headers: await authHeader('')
  });
}

async function emailVerifyOtp(otp){
  return await axios.post(freelancerUrl + '/emailVerify', {otp}, {
    headers: await authHeader('')
  });
}

async function setOffDays(dates){
  return await axios.post(freelancerUrl + `/addBlackOut`, {dates}, {
    headers: await authHeader('')
  })
}




// ======================== Category ================================================

async function getCategories() {
    return await axios.get(categoryUrl, {
        headers: await authHeader('')
    });
}
async function getHomePageCategoryServices(){
    return await axios.get(categoryUrl + '/popularServices');
}

// ===================== Service =====================================================
async function createService(payload) {
    return await axios.post(serviceUrl, payload, {
        headers: await authHeader('')
    });
}

async function getAllServices() {
    return await axios.get(serviceUrl, {
        headers: await authHeader('')
    });
}

async function updateService(payload, id, ) {
    return await axios.patch(serviceUrl + '/' + id, payload,  {
        headers: await authHeader('')
    });
}

async function getServiceById(id) {
    return await axios.get(serviceUrl + '/' + id, {
        headers: await authHeader('')
    });
}

async function uploadImages(image, id) {
  return await axios.put(serviceUrl + `/images/${id}`, {image}, {
    headers: await authHeader('FormData')
  });
}

async function deletedService(id){
    return await axios.delete(serviceUrl + `/${id}`, {
        headers: await authHeader('')
    });
}

async function getServiceByCategoryId(id, lat, lng) {
    return await axios.get(serviceUrl + `/user/byCategory?categoryId=${id}&lat=${lat}&lng=${lng}`, {
        headers: await authHeader('')
    });
}

async function getServicesByFreelancer(id) {
    return await axios.get(serviceUrl + `/freelance/byId/${id}`, {
        headers: await authHeader('')
    });
}

//========================================= Freelancer ===============================================

async function getAllFreelancer( limit, offset, keyword) {
    return await axios.get(freelancerUrl +`/all?limit=${limit}&offset=${offset}&keyword=${keyword}`, {
        headers: await authHeader('')
    });
}

async function getFreelancerById(id) {
    return await axios.get(freelancerUrl + `/freelancerDetails/${id}`, {
        headers: await authHeader('')
    });
}


// ======================== Jobs ========================================================

async function createJob(payload) {
    return await axios.post(jobUrl , payload, {
        headers: await authHeader('')
    });
}

async function getMyJobs(limit: number, offset: number) {
    return await axios.get(jobUrl + `?limit=${limit}&offset=${offset}`, {
        headers: await authHeader('')
    });
}

async function updateJobStatus(status: string, id: string) {
    return await axios.put(jobUrl + `/status/${id}`, {status}, {
        headers: await authHeader('')
    });
}

async function getJobById(id) {
    return await axios.get(jobUrl + `/myJob/${id}`, {
        headers: await authHeader('')
    });
}

async function updateJob(id, data) {
    return await axios.patch(jobUrl + `/myJob/${id}`, data, {
        headers: await authHeader('')
    });
}

async function getAllJobs(limit, offset) {
    return await axios.get(jobUrl + `/all?limit=${limit}&offset=${offset}`, {
        headers: await authHeader('')
    });
}
async function getRecentJobs() {
    return await axios.get(jobUrl + `/recentJobs`);
}

async function getAllFreelancerJobs(limit, offset, categoryId, lat, lng) {
    return await axios.get(jobUrl + `/all/freelancer?limit=${limit}&offset=${offset}&categoryId=${categoryId}&lat=${lat}&lng=${lng}`, {
        headers: await authHeader('')
    });
}

// ======================== Portfolio ========================================================

async function createPortfolio(payload) {
    return await axios.post(portfolioUrl, payload, {
        headers: await authHeader('')
    });
}

async function uploadPortfolioImage(id, image) {
    return await axios.put(portfolioUrl + `/${id}`, { image }, {
        headers: await authHeader('FormData')
    });
}

async function getAllPortfolio() {
    return await axios.get(portfolioUrl, {
        headers: await authHeader('')
    });
}

async function deletePortfolio(id) {
    return await axios.delete(portfolioUrl + `/${id}`, {
        headers: await authHeader('')
    });
}

// =========================== Booking ============================================
async function createBooking(data: any) {
  return await axios.post(bookingUrl + `/bookService`, data, {
    headers: await authHeader('')
  });
}

async function getAllBooking(){
  return await axios.get(bookingUrl + `/user`, {
    headers: await authHeader('')
  });
}

async function getAllActiveBooking(){
  return await axios.get(bookingUrl + `/user/active`, {
    headers: await authHeader('')
  });
}



async function getAllFreelancerBookings(limit, offset, allLimit, allOffset){
  return await axios.get(bookingUrl + `/freelancer?limit=${limit}&offset=${offset}?allLimit=${allLimit}&allOffset=${allOffset}`, {
    headers: await authHeader('')
  });
}

async function confirmBooking(id: string) {
  return await axios.get(bookingUrl + `/freelancer/confirm/${id}`, {
    headers: await authHeader('')
  });
}

async function startBooking(id: string, otp: string) {
  console.log(id)
  return await axios.post(bookingUrl + `/freelancer/verifyStartOtp/${id}`,{otp}, {
    headers: await authHeader('')
  });
}
async function completeBooking(id: string, otp: string) {
  return await axios.post(bookingUrl + `/freelancer/completeOtp/${id}`,{otp}, {
    headers: await authHeader('')
  });
}

async function cancelBooking(id){
  return await axios.get(bookingUrl + `/freelancer/cancel/${id}`, {
    headers: await authHeader('')
  })
}

async function confirmJobApplication(id){
  return await axios.get(jobApplicationUrl + `/freelancer/confirm/${id}`, {
    headers: await authHeader('')
  });
}

async function rejectJobApplication(id){
  return await axios.get(jobApplicationUrl + `/freelancer/reject/${id}`, {
    headers: await authHeader('')
  });
}

async function startJobApplication(id, otp){
  return await axios.post(jobApplicationUrl + `/freelancer/verifyStartOtp/${id}`, {otp}, {
    headers: await authHeader('')
  });
}

async function completeJobApplication(id, otp){
  return await axios.post(jobApplicationUrl + `/freelancer/completeOtp/${id}`, {otp}, {
    headers: await authHeader('')
  });
}


// ====================== Job APllication =================================
async function createJobApplicatiion(id, data) {
  return await axios.post(jobApplicationUrl + `/apply/${id}`, data, {
    headers: await authHeader('')
  });
}

async function getJobApplicationByID(id){
  return await axios.get(jobApplicationUrl + `/applicants/${id}`, {
    headers: await authHeader('')
  });
}

async function getAllAppliedJob(){
  return await axios.get(jobApplicationUrl + `/freelancer`, {
    headers: await authHeader('')
  });
}

async function cancelJobApplication(id){
  return await axios.delete(jobApplicationUrl + `/withdraw/${id}`, {
    headers: await authHeader('')
  });
}


// ========================== Shortlist ================================
async function shortListFreelancer(data){
  console.log(data, "datatrta")
  return await axios.post(jobApplicationUrl + `/shortlist`, data, {
    headers: await authHeader('')
  });
}

// ====================user Chat ============================

async function getUserConversationId(id){
  return await axios.get(chatUrl + `/createUserConversation/${id}`, {
    headers: await authHeader('')
  });
}


async function getFreelancerConversationId(id){
  return await axios.get(chatUrl + `/createFreelancerConversation/${id}`, {
    headers: await authHeader('')
  });
}


async function getCoversationDetailsForUser(conversationId){
  return await axios.get(chatUrl + `/getUserConversations/${conversationId}`, {
    headers: await authHeader('')
  });
}

async function getCoversationDetailsForFreelancer(conversationId){
  return await axios.get(chatUrl + `/getFreelancerConversations/${conversationId}`, {
    headers: await authHeader('')
  });
}

async function getCoversationListForUser(){
  return await axios.get(chatUrl + `/getUserConversations`, {
    headers: await authHeader('')
  });
}

async function getCoversationListForFreelancer(){
  return await axios.get(chatUrl + `/getFreelancerConversations`, {
    headers: await authHeader('')
  });
}



/********** Transaction ************/

async function getFreelancerTransactions(){
  return await axios.get(transactionURL + `/freelancer`, {
    headers: await authHeader('')
  });
}

async function getUserTransactions(){
  return await axios.get(transactionURL + `/user`, {
    headers: await authHeader('')
  });
}

async function getAllWalletWidthrawal(){
  return await axios.get(transactionURL + `/wallet`, {
    headers: await authHeader('')
  });
}



// ============================ Widthrawal ============================
async function widthrawalRequest(amount){
  return await axios.put(freelancerUrl + `/withdrawRequest`, {amount}, {
    headers: await authHeader('')
  });
}

async function getAllWidthrawal(){
  return await axios.get(widthrawalUrl, {
    headers: await authHeader('')
  });
}

async function addPaymentMethod(data){
  return await axios.patch(freelancerUrl + `/bankAccount`, data, {
    headers: await authHeader('')
  });
}


// ================= Dashboard =======================
async function getUserDashboardData(){
  return await axios.get(dashboardUrl + `/user`, {
    headers: await authHeader('')
  });
}

async function getFreelancerDashboardData(){
  return await axios.get(dashboardUrl + `/freelancer`, {
    headers: await authHeader('')
  });
}

// ================= review =====================
async function createReview(data){
  return await axios.post(serviceReview, data, {
    headers: await authHeader('')
  });
}

async function createJobReview(data){
  return await axios.post(jobReview, data, {
    headers: await authHeader('')
  });
}


// ============= Search =====================
async function searchService(keyword){
  return await axios.get(serviceUrl + `/user/search?keyword=${keyword}`, {
    headers: await authHeader('')
  });
}


// =================== Insatnt Booking =================================
async function setInstantBooking(instantBooking){
  return await axios.post(freelancerUrl + `/change/instantBookingStatus`, {instantBooking}, {
    headers: await authHeader('')
  })
}

async function getInstantBookingData() {
  return await axios.get(jobUrl + `/myInstantJobs`, {
    headers: await authHeader('')
  })
}

async function postInstantBooking(data) {
  return await axios.post(jobUrl + `/create/instant`, data, {
    headers: await authHeader('')
  })
}

async function getBookingsForFreelancerInstant(limit, offset, lat, lng){
  return await axios.get(jobUrl + `/freelancer/instant?limit=${limit}&offset=${offset}&lat=${lat}&lng=${lng}`, {
    headers: await authHeader('')
  });
}






export const service = {
  userSentOtp, userVerifyOtp, getUserProfile, updateUser, updateUserProfile, userEmailSendOtp, userEmailOtpVerify, userAadharVerify, 

  freelancerSendOtp, freelancerVerifyOtp, getFreelancerProfile, updateFreelancerdata, updateFreelancerProfile, uploadPanCard, uploadAadharFrontImage, uploadAadharBackImage, aadharVerify, emailSendOtp, emailVerifyOtp, 

  getCategories,

  getHomePageCategoryServices,

  createService, getAllServices, updateService, getServiceById, uploadImages, deletedService, getServiceByCategoryId, getServicesByFreelancer, 

  getAllFreelancer, getFreelancerById,

  createJob, getMyJobs, updateJobStatus, getJobById, updateJob, getAllJobs, getRecentJobs, getAllFreelancerJobs, 

  createPortfolio, uploadPortfolioImage, getAllPortfolio, deletePortfolio, 

  createBooking, getAllBooking, getAllActiveBooking,  getAllFreelancerBookings, confirmBooking, startBooking, completeBooking, cancelBooking, confirmJobApplication, rejectJobApplication, startJobApplication, completeJobApplication,

  createJobApplicatiion, getJobApplicationByID, shortListFreelancer, getAllAppliedJob, cancelJobApplication, 

  getUserConversationId, getCoversationDetailsForUser, getCoversationDetailsForFreelancer, getCoversationListForUser, getCoversationListForFreelancer, getFreelancerConversationId, 

  getFreelancerTransactions, getUserTransactions,

  widthrawalRequest, getAllWidthrawal, addPaymentMethod,  getAllWalletWidthrawal,

  getUserDashboardData, getFreelancerDashboardData, 

  createReview, createJobReview,

  searchService, 

  setOffDays, 
  
  setInstantBooking, getInstantBookingData, postInstantBooking, getBookingsForFreelancerInstant, 
}