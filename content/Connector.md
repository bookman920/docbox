## 连接器列表

连接器是指协助业务点执行连接公链、发起业务请求并获取应答的流程的辅助类，目前有如下不同类型的连接器
- 开放式连接器
- 授权式连接器
- 控制台连接器

### 开放式连接器

用于基于浏览器的应用，在未经全节点授权的情况下，访问部分脱敏API
开放式连接器采用 Restful 语法，通过 GET 或 POST 访问API并获得JSON格式的应答
开放式连接器受流量控制影响，每分钟最多100次访问

#### Example request

可以使用 curl 或者 Postman 等工具进行API调用测试。GET API可直接用浏览器调用， POST API可以通过浏览器插件调用

```endpoint
GET http://localhost:17332/public/block/height/:height
```

```curl
curl http://localhost:17332/public/block/height/:height
```

```endpoint
POST http://localhost:17332/public/block/height/:height
```

```curl
curl -X POST http://localhost:17332/public/block/height/{height}
```

#### Example response

```json
{
  "hash": "14f73dfc67b3dc7939de6514b6ce230934a5b42cbeadf44038ed276c6390cdab",
  "confirmations": 3213,
  "strippedsize": 651,
  "size": 687,
  "weight": 2640,
  "height": 100,
  "version": 536870912,
  "versionHex": "20000000",
  "merkleroot": "059729c129799cf09ec07f2cf596149d59a5986251cb1143768f54de5ee30579",
  "coinbase": "0164116d696e65642062792067616d65676f6c6404c2a3b0f5080000000000000000",
  "tx": [
    "059729c129799cf09ec07f2cf596149d59a5986251cb1143768f54de5ee30579"
  ],
  "time": 1532999312,
  "mediantime": 1532996312,
  "bits": 545259519,
  "difficulty": 4.6565423739069247e-10,
  "chainwork": "00000000000000000000000000000000000000000000000000000000000000ca",
  "previousblockhash": "35f512ff035b788976714b2cbc925d990968fe1621fb40c917544dfd1b9bf33c",
  "nextblockhash": "47b85cea3ba29563171cb3d6a0e4f5c24d4e76d84e8fb2d9b4417258ffbb9744"
}
```

### 授权式连接器

用于基于浏览器的游戏客户端，或没有集成核心库的游戏服务端，向SPV节点/全节点发起API调用
授权式连接器受流量控制影响，每分钟最多1000次访问
详细案例请查阅 gamegoldmanager 项目中的 remoting 对象封装

#### Example request

```javascript
//连接器
const remote = require('/lib/authConn')
remote.setup({
    type:   'testnet',            //远程全节点类型
    ip:     '127.0.0.1',          //远程全节点地址
    apiKey: 'bookmansoft',        //远程全节点基本校验密码
    id:     'primary',            //默认访问的钱包编号
    cid:    'terminal001',        //终端编码，作为访问远程全节点时的终端标识
    token:  '0340129aaa7a69ac10bfbf314b9b1ca8bdda5faecce1b6dab3e7c4178b99513392', //访问钱包时的令牌固定量，通过HMAC算法，将令牌随机量和令牌固定量合成为最终的访问令牌
});

//发起远程API调用，获取游戏列表，外围用异步函数进行了包装以使用 await 关键字
(async ()=>{
  let params = []; //params为参数数组
  let rt = await remote.execute('cp.list', params); 
})();
```

### 控制台连接器

用于集成了核心库（GameGold Core）的控制台或游戏服务端，向SPV节点/全节点发起API调用
本连接器使用了核心库提供的 accessWallet 类

#### Example request

```javascript
//创建连接器
let connector = new accessWallet({
    rpcHost: '127.0.0.1',                       //远程节点地址
    apiKey: 'hello',                            //简单校验密码
    network: 'testnet',                         //对等网络类型
    id: 'primary',                              //对接的钱包名称
    cid: '2c9af1d0-7aa3-11e8-8095-3d21d8a3bdc9',//特约生产者编码，用于全节点计算令牌固定量
    //特约生产者令牌固定量，由全节点统一制备后，离线分发给各个终端
    token: '03f6682764acd7e015fe4e8083bdb2b969eae0d6243f810a370b23ad3863c2efcd', 
});

//发起远程API调用，获取指定玩家在指定游戏内的道具列表
let props = await connector.execute('queryProps', [
  cid,  //游戏识别码
  addr  //玩家地址，钱包APP通过 URL Schema 送入游戏客户端，并经过了游戏客户端的独立验证
]);
```
