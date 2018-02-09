# EC2 Handler
## Getting Started
### Docker on Mac(local)
 * [公式](https://www.docker.com/community-edition#/mac)から取得したDockerインストーラを利用してインストール

### NPM install
Node.jsをインストールすると同時にインストールされます。

### AWS SAM LOCAL install
```
$ npm install -g aws-sam-local
```

## Usage

ローカルで実行
```
echo '{}' | sam local invoke Ec2Handler -n env.json
```

テスト実行
```
$ docker-compose build
$ docker-compose run ec2 npm test
```
