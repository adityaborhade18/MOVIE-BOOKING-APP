const timeFormat=(minutes)=>{
   const hours=Math.floor(minutes/60);
   const remainderTime=minutes%60;
   return `${hours}h ${remainderTime}m`;
}

export default timeFormat;