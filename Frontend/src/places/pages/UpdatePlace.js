import React, { useState ,useEffect,useContext} from "react";
import { useParams ,useHistory} from "react-router-dom";
import Button from "../../shared/components/FormElement/Button";
import Input from "../../shared/components/UIElements/Input";
import Card from './../../shared/components/UIElements/Card';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from "../../shared/context/auth-context";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import "./PaceForm.css";
import { useForm } from "./../../shared/hooks/form-hook";
 

const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const placeId = useParams().placeId;
  const [loadedPlace, setLoadedPlace] = useState()
  
    const [formState, inputHandler, setFormData] = useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        }
      },
      false
    );
  
   
  
    useEffect(() => {
      try {
        const fetchPlace =async ()=>{
         const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}places/${placeId}`);
         console.log(responseData);
         setLoadedPlace(responseData.place);
         setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
        }
        fetchPlace();
        
      } catch (error) {
        console.log(error);
      }
    }, [ setFormData, sendRequest,placeId]);
  
    const placeUpdateSubmitHandler =async event => {
      event.preventDefault();
      console.log(formState.inputs);
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}places/${placeId}`,
          'PATCH',
          JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
          }),
          {
            'Content-Type': 'application/json',
             Authorization:'Bearer ' + auth.token
          }
        );
        history.push('/' + auth.userId + '/places');
      } catch (err) {}
    };
  
   
  
    if (isLoading  ) {
      return (
        <div className="center">
          <LoadingSpinner asOverlay/>
        </div>
      );
    }
    if (!loadedPlace && !error) {
      return (
        <div className="center">
          <Card>
            <h2>Could not find place!</h2>
          </Card>
        </div>
      );
    }  
  
    return <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {!isLoading&&loadedPlace&&!error&&<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>}

      </React.Fragment>
    
  };

export default UpdatePlace;
