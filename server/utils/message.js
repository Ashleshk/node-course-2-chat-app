var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

let generateGif = (from, url) => {
	return {
		from,
		url,
		createdAt: moment().valueOf()
	}
};

// var generateLocationMessage = (from, latitude, longitude) => {
//   return {
//     from,
//     url: `https://www.google.com/maps?q=${latitude},${longitude}`,
//     createdAt: moment().valueOf()
//   };
// };


module.exports = {generateMessage, generateGif};
