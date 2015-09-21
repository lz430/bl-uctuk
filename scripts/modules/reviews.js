define(["modules/jquery-mozu",], function($) {

  var reviewDataCollection = require.mozuData('reviews').config
      , propName
      , propIndex
      , rndReviewIndex
      , myArray = [];

  //iterate through the JSON and extract the reviews     
  for (var prop in reviewDataCollection){
    //look only at custom property and make sure is a review related one
    if (reviewDataCollection.hasOwnProperty(prop) && prop.indexOf("review") === 0) {
      
      // extract the property name, we gone use it as property name in a new object
      propName = prop.replace(/[0-9]/g,'');
      // extract the number, we gone use it to insert as index
      propIndex = prop.replace( /\D+/g, ''); 

      // process only our reviews (residuals are without)
      if (propIndex){
        switch (propName) {
          case "reviewerName":
            //console.log ("prop " + prop + " = " + reviewDataCollection[prop]);            
            if (!myArray[propIndex]) {myArray[propIndex] = {};}
            myArray[propIndex].reviewerName = reviewDataCollection[prop];
            //console.log(propIndex);                        
            break;

          case "reviewerLocation":                        
            if (!myArray[propIndex]) {myArray[propIndex] = {};}
            myArray[propIndex].reviewerLocation = reviewDataCollection[prop];
            break;

          case "reviewContent":                        
            if (!myArray[propIndex]) {myArray[propIndex] = {};}
            myArray[propIndex].reviewContent = reviewDataCollection[prop];
            break;
          
          case "reviewImgURL":                        
            if (!myArray[propIndex]) {myArray[propIndex] = {};}
            myArray[propIndex].reviewImgURL = reviewDataCollection[prop];
            break;
                                    
          case "reviewImageAlt":                        
            if (!myArray[propIndex]) {myArray[propIndex] = {};}
            myArray[propIndex].reviewImageAlt = reviewDataCollection[prop];
            break;

          default:
            break;
        }
      }
    }
  }

  // remove undefined objects and reviews without content
  for (var i=myArray.length - 1; i >=0; i--) {
      if (typeof myArray[i] == 'undefined' || myArray[i].reviewContent.length === 0 ) {
          myArray.splice(i,1);
      }
  }

  // select randomly one of the reviews
  rndReviewIndex = Math.floor((Math.random() * myArray.length) + 1);

  $(".mz-home-review__author-name").text("By " + myArray[rndReviewIndex-1].reviewerName);                
  $(".mz-home-review__author-location").text("from " + myArray[rndReviewIndex-1].reviewerLocation);
  $(".mz-home-review__content").html(myArray[rndReviewIndex-1].reviewContent);
  //TODO: how to deal with the CDN portion
  $("img.mz-home-promo__reviews-image").attr('src', myArray[rndReviewIndex-1].reviewImgURL).attr('alt', myArray[rndReviewIndex-1].reviewImageAlt);
});
