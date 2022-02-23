import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar  } from "react-icons/fa";

const Rating = ({text, value, color}) => {
    return (
        <div className="rating" style={{color}}>
          <span>
          {
              value >= 1
              ? <FaStar />
              : value >= 0.5 
              ? <FaStarHalfAlt />
              : <FaRegStar />
          }

          {
              value >= 2
              ? <FaStar />
              : value >= 1.5 
              ? <FaStarHalfAlt />
              : <FaRegStar />
          }

          {
              value >= 3
              ? <FaStar />
              : value >= 2.5 
              ? <FaStarHalfAlt />
              : <FaRegStar />
          }

          {
              value >= 4
              ? <FaStar />
              : value >= 4.5 
              ? <FaStarHalfAlt />
              : <FaRegStar />
          }

          {
              value >= 5
              ? <FaStar />
              : value >= 4.5 
              ? <FaStarHalfAlt />
              : <FaRegStar />
          }
          </span>
          <span style={{ color:'black'}}>{ text && text }</span>
            
        </div>
    )
}

export default Rating
