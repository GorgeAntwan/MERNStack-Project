import React, { useState ,useContext} from "react";
import "./Auth.css";
import Card from "./../../shared/components/UIElements/Card";
import Input from "./../../shared/components/UIElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import Button from "./../../shared/components/FormElement/Button";
import { useForm } from "./../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from"../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from '../../shared/hooks/http-hook';
import ImageUpload from "../../shared/components/FormElement/ImageUpload";
const Auth = () => {

    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    //const [isLoading, setIsLoading] = useState(false);
    //const [error, setErorr] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
      {
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      },
      false
    );
  
    const switchModeHandler = () => {
      if (!isLoginMode) {
        setFormData(
          {
            ...formState.inputs,
            name: undefined,
            image: undefined
          },
          formState.inputs.email.isValid && formState.inputs.password.isValid
        );
      } else {
        setFormData(
          {
            ...formState.inputs,
            name: {
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
      }
      setIsLoginMode(prevMode => !prevMode);
    };
  
    const authSubmitHandler = async event => {
      event.preventDefault();
    //  console.log(formState.inputs);
      if(isLoginMode){
        try {
          
          let responseDate = await sendRequest(process.env.REACT_APP_BACKEND_URL+'users/login',
            'POST',JSON.stringify({
             
              email:formState.inputs.email.value,
              password:formState.inputs.password.value
            }),
           {
              'Content-Type':'application/json',
            },
            
          );
          
          console.log(responseDate.userId);
          auth.login(responseDate.userId,responseDate.token);
          
       } catch (error) {
          
         console.log(error);
       }

      }else{
        try {
          const formData = new FormData();
          formData.append('email', formState.inputs.email.value);
          formData.append('name', formState.inputs.name.value);
          formData.append('password', formState.inputs.password.value);
          formData.append('image', formState.inputs.image.value);
         

         let responseDate=  await sendRequest(process.env.REACT_APP_BACKEND_URL+'users/signup',
            'POST',
            formData
            );
          
           console.log(responseDate.userId)
          auth.login(responseDate.userId,responseDate.token);
           
       } catch (error) {
          
         console.log(error);
       }
      }
     
    };
   
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear ={clearError}/>
      <Card className="authentication">
        {isLoading&&<div className="center"><LoadingSpinner asOverLay/></div>}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode &&<ImageUpload center id="image" onInput={inputHandler} errorText={'please upload your image'}/>}
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
      </React.Fragment>
    );
  };
  
export default Auth;
