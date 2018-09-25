## 钱包相关的API

### address.create
Alias: address.receive.create

创建一个收款地址

#### Example Request

```bash
npm run cli rpc address.create
```

```js
let ret = await connect.execute({method:'address.create', params:[]});
```

#### Example Response

Property | Description
---|---
network     |   网络类型
id          |   钱包ID
type        |   支持隔离见证
address     |   新生成的 Bech32 格式的地址

```json
{
  "network": "testnet",
  "wid": 1,
  "id": "primary",
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 2,
  "witness": true,
  "nested": false,
  "publicKey": "02c4af60a945212735abd7627c6fd96768c15389b82594447ae239f170afd38c0a",
  "script": null,
  "program": "0014ad6bdd1dd64aa3d8d8a90575518df742b06168c6",
  "type": "witness",
  "address": "tb1q444a68wkf23a3k9fq464rr0hg2cxz6xx3xxs4n"
}
```

### tx.send

根据输入的金额和地址，创建、签署、发送一笔P2PKH类转账交易

#### Example Request

```bash
npm run cli rpc tx.send $addr $value
```

入口参数

Property | Description
---|---
addr             |  转账的目标地址
value            |  转账的金额，单位尘

```js
let ret = await connect.execute({method:'tx.send', params:[$addr, $value]});
```

#### Example Response

```json
{
  "wid": 1,
  "id": "primary",
  "hash": "589e81ebd2cde651f5d562363f5c414acc0527ea48a28a1735aa26d919304a64",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1537668448,
  "date": "2018-09-23T02:07:28Z",
  "size": 222,
  "virtualSize": 141,
  "fee": 2800,
  "rate": 19858,
  "confirmations": 0,
  "inputs": [
    {
      "value": 5000000000,
      "address": "tb1qdrdct4dlhh6wdulddy96h9lxgs9fekaffhyxz5",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/0"
      }
    }
  ],
  "outputs": [
    {
      "value": 10000,
      "address": "tb1q9msqyf7nee72gk4qw2elawa5m7kgj6u8squmjw",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/13"
      }
    },
    {
      "value": 4999987200,
      "address": "tb1q5ggklpp0d89mtgtk9ddn27c02wd3dxha3a37ae",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/1"
      }
    }
  ],
  "tx": "0100000000010160f0055f9ad850ce85956ba8755d2e7a8f918207b62e2135fd3074bc6d46c3c00000000000ffffffff0210270000000000001600142ee00227d3ce7ca45aa072b3febbb4dfac896b8700c0052a01000000160014a2116f842f69cbb5a1762b5b357b0f539b169afd02473044022075e9d8f6bacbac95ab2aabe4d0f4c9db298fe4b0e9d6427f8d25fc06b2bd8b3f02205f57035af471d8b63e5cd3cf15987f56ed43b01fe64fbeb08a0c0ce176bd3a57012102091058a8f75f971f6dbc158b4bf08027bbc6825ceeaa82800e3af66ad417be0f00000000"
}
```

### prop.donate

生成一笔捐赠交易，并返回该交易的原始数据(HEX格式)

#### Example Request

```bash
npm run cli rpc prop.donate $txid $index
```

入口参数

Property | Description
---|---
txid   |  准备消耗的UTXO的交易哈希，小端格式
index  |  准备消耗的UTXO的索引，默认为0

```js
let ret = await connect.execute({method:'prop.donate', params:[$txid, $index]});
```

#### Example Response

```json
{
  "hash": "78d06fa7cd44fe8f5bb811e268ff1ea594356d2700e9bbbbed6dc01cd3c2e054",
  "txid": "54e0c2d31cc06dedbbbbe900276d3594a51eff68e211b85b8ffe44cda76fd078",
  "cid": "73fd9030-bf01-11e8-9777-7fc8c74b6df3",
  "pid": "8ef12140-bf01-11e8-9777-7fc8c74b6df3",
  "oid": "sword",
  "raw": "010000000001017bdd6e315d4214c8ecb5a22522ccf266e7f2b883fea2a5ffa3039f8f9188efb50000000000ffffffff0002483045022100aa860e3b22029574dde1b2513ac53048465c1b229ae0ec84f6c9533ad26b7f320220683ce1df4791d0d0f3ca6a19cc852af020da024ed617a9ffe8856c900c9cf24e02210317f79b1b9a0190475bbb208017524fea99f307ac4adf5ed459c86b8e7c2e88e300000000"
```

### prop.receive

根据输入的捐赠交易的原始数据，补充、签署、发送该交易，以获得其中包含的道具

#### Example Request

```bash
npm run cli rpc prop.receive $raw
```

入口参数

Property | Description
---|---
raw   |  捐赠交易的原始数据(HEX格式的字符串)

```js
let ret = await connect.execute({method:'prop.receive', params:[$raw]});
```

#### Example Response

```json
{
  "hash": "7cc47718a2a3da398ddc015d1bbbffeddcb4e0c95c4cc1d4fc4dc1d2a50e30c8",
  "txid": "c8300ea5d2c14dfcd4c14c5cc9e0b4dcedffbb1b5d01dc8d39daa3a21877c47c",
  "cid": "73fd9030-bf01-11e8-9777-7fc8c74b6df3",
  "pid": "8ef12140-bf01-11e8-9777-7fc8c74b6df3",
  "oid": "sword",
  "addr": "tb1qp702eg67av8ty6jl87hyfas8v6h9rzxugvz7su"
}
```
