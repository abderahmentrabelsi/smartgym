import { getClientIp } from 'request-ip';

const geoLocateRequest = async (req) => {
  const ip = getClientIp(req);
  const response = await fetch(`https://antibot.pw/api/ip?ip=${ip}`);
  return response.json();
};

export default {
  geoLocateRequest,
};
