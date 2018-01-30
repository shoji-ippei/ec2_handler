'use strict';
const demoAttributeResponse = require('./fixture/demo-ec2-attribute.json')
  , chai        = require('chai')
  , sinon       = require('sinon')
  , proxyquire  = require('proxyquire')
  , chaiAsPromised = require("chai-as-promised")
  , MockContext = require('../mock-lambda-context')
  , expect      = chai.expect
  ;

const proxyEC2 = class {
  describeInstances (params) {
    return {
      promise: () => {}
    }
  };
  startInstances (params, callback) {};
  stopInstances (params, callback) {};
};

const lambda = proxyquire('../index', {
  'aws-sdk': {
    EC2: proxyEC2
}});

chai.use(chaiAsPromised);

describe('EC2 Handler', function(){
  let ctx;

  beforeEach(function() {
    ctx = new MockContext();
    const ec2StopInstancesStub = sinon.stub(proxyEC2.prototype, 'stopInstances').returns();
    const ec2StartInstancesStub = sinon.stub(proxyEC2.prototype, 'startInstances').returns();
    console.log('bfr');
  });

  afterEach(function() {
    ec2StartInstancesStub.restore();
    ec2StopInstancesStub.restore();
    ctx.reset();
    console.log('aft');
  });

  context('[正常系]正しいインスタンスデータを取得するとき', function() {

    lambda.handler({}, ctx)

    it('インスタンスの一覧取得、起動、停止が行われ、context.succeed()が返る', () => {
      /*
      const ec2DescribeInstancesStub = sinon.stub(proxyEC2.prototype, 'describeInstances')
      .returns({promise: () => {
        return Promise.resolve(demoAttributeResponse.success)
      }});
      expect(ec2DescribeInstancesStub.calledOnce).to.be.equal(true);
      //expect(ec2StartInstancesStub.called).to.be.equal(true);
      //expect(ec2StopInstancesStub.calledOnce).to.be.equal(true);
      expect(ctx.succeed.calledOnce).to.equal(true);

      ec2DescribeInstancesStub.restore();
      */
    });
  });

  context('[正常系]起動停止するインスタンスデータがないとき', function() {

    it('context.succeed()をemptyと共に返す', function(){
      /*
      const emptyDescribeInstancesStub = sinon.stub(proxyEC2.prototype, 'describeInstances')
      .returns({promise: () => {
        return Promise.resolve(demoAttributeResponse.empty)
      }});
      lambda.handler({}, ctx)

      expect(ctx.succeed.calledWith('empty')).to.equal(true)
      emptyDescribeInstancesStub.restore();
    });
    */
  });

  context('[正常系]異常なインスタンスデータを取得するとき', function() {
    var spy = sinon.spy(console, 'log')
    lambda.handler({}, ctx)

    it('succeedを返し、ログにエラー内容を書き出す', function(){
      /*
      const invalidDescribeInstancesStub = sinon.stub(proxyEC2.prototype, 'describeInstances')
      .returns({promise: () => {
        return Promise.resolve(demoAttributeResponse.fail)
      }});

      expect(ctx.succeed.calledOnce).to.equal(true)
      //expect(spy.calledOnce).to.equal(true)
      invalidDescribeInstancesStub.restore();
      */
    });
  });
})
