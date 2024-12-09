import { axios } from '@/utils/axios';
import to from 'await-to-js';

const approveClaim = async (claimId: any) => {
  return to(axios.get(`/claims/${claimId}/approve`));
};
const approveBatchClaim = async (batchId: any) => {
  return to(axios.get(`/batch/${batchId}/approve`));
};
const returnBatchClaim = async (batchId: any) => {
  return to(axios.get(`/batch/${batchId}/return`));
};
const returnClaim = async (claimId: any) => {
  return to(axios.get(`/claims/${claimId}/return`));
};
const getAllClaims = async () => {
  return to(axios.get('/claims'));
};
const createClaim = async (data: any) => {
  return to(axios.post('/claims', data));
};
const createBatch = async (data: any) => {
  return to(axios.post('/batches', data));
};
const getBatches = async () => {
  return to(axios.get('/batches'));
};

const approvedBatchClaims = async () => {
  return to(axios.get('/admin/approved-batch-count'));
};

const claimsService = {
  getAllClaims,
  approveClaim,
  returnClaim,
  approvedBatchClaims,
  createClaim,
  createBatch,
  getBatches,
  returnBatchClaim,
  approveBatchClaim
};

export default claimsService;
