import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElement/Button";
import "./PleacItem.css";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
 

const PleaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
   
  const auth = useContext(AuthContext);
   
  const openMapHandler = () => setShowMap(true);
  const classMapHandler = () => setShowMap(false);
  const showDelteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDelteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async() => {
    setShowConfirmModal(false);
    console.log("Deleteing.....");
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}places/${props.id}`,'DELETE',null,
        {
        Authorization:'Bearer ' + auth.token
       }
      );
      props.onDelete(props.id)
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onCancel={classMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={classMapHandler}> CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinate} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDelteHandler}
        header="Are you sure ?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Button inverse onClick={cancelDelteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading&&<div className="center"><LoadingSpinner asOverLay/></div>}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.descreption}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            {auth.userId === props.creatorId&& (
              <Button to={`/places/${props.id}`}>EDITE</Button>
            )}
            {auth.userId === props.creatorId&& (
              <Button danger onClick={showDelteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PleaceItem;
