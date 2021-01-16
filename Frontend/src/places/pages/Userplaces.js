import React ,{useEffect,useState}from 'react';
import { useParams } from 'react-router-dom';
import PleaceList from '../components/PleaceList';
import './PaceForm.css';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const Userplaces =  ()=>{
  const userId =useParams().userId;
  
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUserPlaces, setLoadedUserPlaces] = useState([])
  

  useEffect(() => {
       
    const getPlacesUser= async () => {
      try {
     
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}places/user/${userId}`);
        console.log(responseData.places);
        setLoadedUserPlaces(responseData.places);
        
      } catch (error) {
        console.log(error);
      }
    };
    getPlacesUser();
  }, [sendRequest,userId]);
  const deleteUserPlaceHandler = deletePlaceId =>{
    setLoadedUserPlaces(prevPlaces => prevPlaces.filter(place=>place.id !==deletePlaceId));
  };
  return <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading &&<div className="center"><LoadingSpinner asOverLay/></div>}
   {!isLoading && loadedUserPlaces&&<PleaceList items={loadedUserPlaces} onDeletePlace={deleteUserPlaceHandler}/>}
  </React.Fragment>
  ;
};

export default Userplaces;