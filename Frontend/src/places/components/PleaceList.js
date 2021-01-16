import React from "react";
import './PleaceList.css';
import Card from "../../shared/components/UIElements/Card";
import PleaceItem from "./PleaceItem";
import Button from "../../shared/components/FormElement/Button";
const PleaceList = (props) => {
  if (props.items.length === 0) { 
    return (
      <div className="place-list center">
      <Card>
        <h2>No places found. Maybe create one?</h2>
        <Button to="/places/new">Share Place</Button>
      </Card>
    </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PleaceItem
        
          key={place._id}
          id={place._id}
          image={place.image}
          title={place.title}
          descreption={place.descreption}
          address={place.address}
          creatorId={place.creator}
          coordinates ={place.location}
          onDelete ={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PleaceList;
