const _ = require('lodash');
const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();
const moment = require('moment');
moment.locale('ja')

function startInstances(ids){
  return new Promise(function(resolve, reject) {
    _.isEmpty(ids)
      ? resolve(null)
      : ec2.startInstances({
                InstanceIds: ids
              }, function(err, data){
                if (err) resolve(err.code+':'+"\t"+ err.message);
                else     resolve(null);
            });
  })

};

function stopInstances(ids){
  return new Promise(function(resolve, reject){
    _.isEmpty(ids)
      ? resolve(null)
      : ec2.stopInstances({
            InstanceIds: ids
          }, function(err, data) {
            if (err) resolve(err.code+':'+"\t"+ err.message);
            else     resolve(null);
          })
  })
};

exports.handler = function ec2Handler(event, context) {
  ec2.describeInstances({
      Filters: [{ Name: "tag:Uptime", Values: ["WEEKDAY"]}]
  }).promise().then((data) => {
    // Tagのついた対象のEC2インスタンスを取得
    const all = _.flatten(_.map(data.Reservations, (reservation) => reservation.Instances));
    // 対象となるインスタンスに絞り込む
    const stopping_instances = _.filter(all, (instance) => {return instance.State.Name === 'running' && defaultScheduleFilter(instance);});
    const starting_instances = _.filter(all, (instance) => {return instance.State.Name === 'stopped' && ! defaultScheduleFilter(instance);});
    //追加の絞り込みをするときはここで行い、**_instances配列に追加する

    // インスタンスIDのリストに変換
    const stopping_ids = _.map(stopping_instances, (instance) => {return instance.InstanceId;});
    const starting_ids = _.map(starting_instances, (instance) => {return instance.InstanceId;});

    if (_.isEmpty(starting_ids) && _.isEmpty(stopping_ids)) {
      context.succeed('empty');
      return;
    }

    Promise.all([startInstances(starting_ids), stopInstances(stopping_ids)]).then((results) => {
      results.map((result)=>{
        if (result) {
          console.log(result);
        }
      })
      context.succeed('finished');
    }).catch((err) => {
      context.fail();
    });

  }).catch((err) => {
    console.log('Error in Lambda function,', err);
    context.fail(err)
  });
};


function defaultScheduleFilter(instance){
  const START = moment().startOf('day');
  const END = moment().endOf('day');
  // 現在日時を取得
  const now = moment();

  // 指定された曜日でない場合は false
  if (!_.includes(process.env.DEFAULT_RUNNING_DAY.split(','), now.format('ddd'))) {
    return false;
  }

  // 稼働時間帯でない場合は false
  if (START.isAfter(now) || END.isBefore(now)) {
    return false;
  }

  return true;
};
