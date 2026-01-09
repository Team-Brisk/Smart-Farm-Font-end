import React from "react";
import "./PlantBed.css";
import PlantMetricCard from "./PlantMetricCard";

const PlantMetric = () => {
  return (
 <div className="plant-metric-grid">
  <PlantMetricCard
    position="A"
    imageUrl="http://localhost:5000/api/image/topview/A"
     imageUrlx="http://localhost:5000/api/image/sideview/A"
    
  />
  <PlantMetricCard
    position="B"
      imageUrl="http://localhost:5000/api/image/topview/B"
          imageUrlx="http://localhost:5000/api/image/sideview/B"
  />
   <PlantMetricCard
    position="C"
     imageUrl="http://localhost:5000/api/image/topview/C"
         imageUrlx="http://localhost:5000/api/image/sideview/C"
  />
   <PlantMetricCard
    position="D"
       imageUrl="http://localhost:5000/api/image/topview/D"
           imageUrlx="http://localhost:5000/api/image/sideview/D"
  />
   <PlantMetricCard
    position="E"
       imageUrl="http://localhost:5000/api/image/topview/E"
           imageUrlx="http://localhost:5000/api/image/sideview/E"
  />
   <PlantMetricCard
    position="F"
       imageUrl="http://localhost:5000/api/image/topview/F"
           imageUrlx="http://localhost:5000/api/image/sideview/F"
  />
  
</div>

  );
};

export default PlantMetric;
