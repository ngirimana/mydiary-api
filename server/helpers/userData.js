import jwt from 'jsonwebtoken';


const getUserId = (res, token) => {
  //  verifyToken(token) {
  const mytoken = jwt.verify(token, process.env.teamwork_scretkey);

  return mytoken.id;
};


export default getUserId;
