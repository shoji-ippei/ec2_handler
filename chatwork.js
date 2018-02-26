const request = require('request');

module.exports = function(msg) {
  var room_id = process.env.CHATWORK_ROOM_ID;
  var options = {
    url: 'https://api.chatwork.com/v2/rooms/' + room_id +'/messages',
    headers: {
      'X-ChatWorkToken': process.env.CHATWORK_TOKEN
    },
    form : {body : msg},
    useQuerystring: true
  };

  request.post(options, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      //console.log(null, body, err, res);
    }else{
      console.log('error', err);
    }
  });
};
