import React ,{useContext}from 'react';

import Input from '../../shared/components/UIElements/Input';
import Button from '../../shared/components/FormElement/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PaceForm.css';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {useHistory} from  'react-router-dom';
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';

const NewPlace = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '', 
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }

    },
    false
  );

  const placeSubmitHandler =async event => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
    console.log(auth.userId);
    try {
       const formData =new FormData();
       formData.append('title',formState.inputs.title.value);
       formData.append('description',formState.inputs.description.value);
       formData.append('address',formState.inputs.address.value);
       formData.append('image',formState.inputs.image.value);
       
       await sendRequest(process.env.REACT_APP_BACKEND_URL+'places','POST',formData,
       {
         Authorization:'Bearer ' + auth.token
       })
       history.push('/')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading &&<div className="center"><LoadingSpinner asOverLay/></div>}
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
    <ImageUpload center id="image" onInput={inputHandler} errorText={'please upload your image'}/>
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlace;
