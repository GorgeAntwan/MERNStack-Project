import React ,{useEffect,useState}from 'react';
import UserList from '../components/UserList';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from"../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from '../../shared/hooks/http-hook';

const Users =()=>{
      
  const [loadedUsers, setLoadedUsers] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
       const sendRequestData =async ()=>{
        
        try {
         
         let responseData=   await sendRequest(process.env.REACT_APP_BACKEND_URL+'users' );
           
          console.log(responseData);
          setLoadedUsers(responseData.users);
       
        } catch (error) {
            
        }
       
         
       }
       sendRequestData();
  }, [sendRequest])
    
    return(
         <React.Fragment>
            {isLoading &&
              <div className="center">
                  <LoadingSpinner/>
              </div>
            }
            <ErrorModal error={error} onClear={clearError}/>
        {!isLoading&&loadedUsers&&<UserList items={loadedUsers}/>}
        </React.Fragment>
    );
};
export default Users;