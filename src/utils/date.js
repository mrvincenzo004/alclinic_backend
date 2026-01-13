import {adToBs} from "@sbmdkl/nepali-date-converter";


function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNepaliDate(date){
try{
const formattedAd=formatDateYYYYMMDD(date);
const bsDate= adToBs(formattedAd);
console.log("inside try and bsDate is: ",bsDate);
return bsDate;
}catch(e){
    console.log(e.message);
}
    
}

export {
getNepaliDate
}