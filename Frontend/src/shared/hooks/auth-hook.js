import  { useCallback, useState ,useEffect} from "react";
let logoutTimer;
export const useAuth =() =>{
    
  
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);// to compute time of token 1 hour
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(//to store data with key 'userData' to could when refresh page can get data
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');// to remove data from local storage
  }, []);

  useEffect(() => { // this will render after app render and toke and logout ,tokenExpiration change
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();// to compute remain time of token
      logoutTimer = setTimeout(logout, remainingTime);  // setTimeout this is function perform logout function after remainingtime
    } else {
      clearTimeout(logoutTimer); // when user logout or token or tokenExpirationDate in null i will stop setTimeout by using clearTimeout
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => { // when refresh page i will get data from local Storage and then send data from localstorage to login function
    const storedData = JSON.parse(localStorage.getItem('userData'));// get data from localstorage
    if ( // to check all data not equal null or to sure the user not logout
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);
  return {token ,userId,login,logout};

}