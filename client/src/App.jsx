import React from 'react'
import { Route, BrowserRouter, Routes} from 'react-router-dom'
import Movies from './pages/Movies'
const App=()=>{
  return(
    <BrowserRouter>
      <Routes>
         <Route path='/movie' element={<Movies/>}/>
      </Routes>
    </BrowserRouter>

    
  )
}

export default App;
