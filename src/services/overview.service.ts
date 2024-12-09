import { axios } from '@/utils/axios';

const activeClaims = () => {
    return axios.get('/admin/active-claims')
  };
  const submittedClaims = () => {
    return axios.get('/admin/submitted-claims')
  };
  const approvedIndividualClaims = () => {
    return axios.get('/admin/approved-claims-count')
  };
  const approvedBatchClaims = () => {
    return axios.get('/admin//approved-batch-count')
  };
  
  const overviewService = {
    activeClaims,
    submittedClaims,
    approvedIndividualClaims,
    approvedBatchClaims

  };
  
  export default overviewService;