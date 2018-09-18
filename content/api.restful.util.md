## 系统状态查询类接口

### 系统状态

```endpoint
GET http://localhost:17332/public/status
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/status
```

#### Example Response

```json
{
    "info": {
        "version": "bitcore-1.1.2",
        "blocks": 544981,
        "proxy": "",
        "difficulty": 559149630057,
        "testnet": false,
        "relayfee": 0,
        "errors": "",
        "network": "livenet"
    }
}
```

### 同步状态

```endpoint
GET http://localhost:17332/public/sync
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/sync
```

#### Example Response

```json
{
    "status": "finished",
    "blockChainHeight": 544981,
    "syncPercentage": 100,
    "height": 544981,
    "error": null,
    "type": "bitcore node"
}
```

### API版本信息

```endpoint
GET http://localhost:17332/public/version
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/version
```

#### Example Response

```json
{
    "version":"5.0.0-beta.44"
}
```

### 连接节点信息

```endpoint
GET http://localhost:17332/public/peer
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/peer
```

#### Example Response

```json
{
    "connected": true,
    "host": "127.0.0.1",
    "port": null
}
```

### 手续费估算

```endpoint
GET http://localhost:17332/public/utils/estimatefee
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/utils/estimatefee
```

#### Example Response

```json
{
    "2":0.00001
}
```

### 汇率

```endpoint
GET http://localhost:17332/currency
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/currency
```

#### Example Response

```json
{
    "status": 200,
    "data": {
        "kraken": 531.4
    }
}
```

### 支持币种

```endpoint
GET http://localhost:17332/explorers
```

#### Example Request

```bash
  curl https://bch-insight.bitpay.com/api/explorers
```

#### Example Response

```json
[
  {
    "name": "Bitcoin Cash",
    "ticker": "BCH",
    "url": "https://bch-insight.bitpay.com"
  },
  {
    "name": "Bitcoin",
    "ticker": "BTC",
    "url": "https://insight.bitpay.com"
  }
]
```
