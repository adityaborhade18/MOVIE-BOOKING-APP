import React from 'react'
import {dummyTrailers} from '../assets/assets.js'
const Movies = () => {
  return (
    <div>
      <h1>hello from movie</h1>
      {dummyTrailers.map((movie)=>(
          <img src={movie.image} alt="" />
      ))}
    </div>
  )
}

export default Movies;
