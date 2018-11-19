## 连接到游戏金公链

1. 通过浏览器，采用标准 Restful 语法访问游戏金公链，限定于访问开放式RPC接口
2. 通过接器依赖包连接游戏金公链，访问所有RPC接口

### Restful 模式

用于基于浏览器的应用（例如区块链浏览器），在未经全节点授权的情况下，访问部分脱敏API
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

### 使用连接器依赖包

连接器是指协助业务点执行连接公链、发起业务请求并获取应答的流程的辅助类，
用于基于浏览器的游戏客户端/SPV钱包，或游戏服务端/全节点管理后台，向SPV节点/全节点发起RPC调用
连接器受流量控制影响，每分钟最多1000次访问

执行如下语句引入连接器依赖包：
```bash
npm i gamegoldtoolkit
```

获取连接器git库：
```bash
git clone https://github.com/bookmansoft/gamegoldtoolkit
```

#### Example request

```javascript
//引入授权式连接器
const conn = require('gamegoldtoolkit')
let remote = new conn();

remote.setFetch(require('node-fetch')) //设置node环境下兼容的fetch函数
.setup({//设置授权式连接器的网络类型和对应参数，网络类型分为 testnet 和 main
        type:   'testnet',            //远程全节点类型
        ip:     '127.0.0.1',          //远程全节点地址
        apiKey: 'bookmansoft',        //远程全节点基本校验密码
        id:     'primary',            //默认访问的钱包编号
        cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
        token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
    }
);

//用异步函数进行了包装以使用 await 关键字
(async () => {
  //获取游戏列表
  let params = []; //params为参数数组
  let rt = await remote.execute('cp.list', params); 
  console.log(rt);

  //查询区块信息
  rt = await remote.get('block/4d80d69a80967c6609fa2606e07fb7e3ad51f8338ce2f31651cb0acdd9250000');
  console.log(rt);
})();
```
