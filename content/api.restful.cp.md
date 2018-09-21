## 域名查询类接口

### 域名列表

```endpoint
GET http://localhost:17332/public/cps
```

#### Example Request

```bash
  curl http://localhost:17332/public/cps?page=1
```

入口参数

Property | Description
---|---
page   |  页数，默认1

#### Example Response

```json
{
  "list": [
    {
      "cid": "b77a9b90-bbc4-11e8-9203-1ff8357db148",                                //CP编码
      "name": "hello",                                                              //CP名称
      "url": "http://127.0.0.1",                                                    //CP域名
      "ip": "",                                                                     //CP的IP地址
      "current": {
        "hash": "00465324a3a7487ebcf7fccf0ddcd72d7142b35669c2cb3e15bfc39dbef7e96a", //记录所在哈希
        "index": 0,                                                                 //对应的输出索引
        "address": "tb1qr790zz32jyyje8letxkavdv93qf7dmp0wjx3s0"                     //记录归属地址
      }
    }
  ],
  "page": 1,  //当前页码
  "total": 1  //总的页数
}
```
### 域名查询 - 根据ID

```endpoint
GET http://localhost:17332/public/cp/:id
```

入口参数

Property | Description
---|---
id   |  CP编码

#### Example Request

```bash
  curl http://localhost:17332/public/cp/b77a9b90-bbc4-11e8-9203-1ff8357db148
```

#### Example Response

查询成功的结果：
```json
{
  "cid": "b77a9b90-bbc4-11e8-9203-1ff8357db148",
  "name": "hello",
  "url": "http://127.0.0.1",
  "ip": "",
  "current": {
    "hash": "00465324a3a7487ebcf7fccf0ddcd72d7142b35669c2cb3e15bfc39dbef7e96a",
    "index": 0,
    "address": "tb1qr790zz32jyyje8letxkavdv93qf7dmp0wjx3s0"
  }
}
```

查询失败的结果：
```json
{
  "error": {
    "type": "Error",
    "message": "No message."
  }
}
```

### 域名查询 - 根据名称

```endpoint
GET http://localhost:17332/public/cp/name/:name
```

#### Example Request

```bash
  curl http://localhost:17332/public/cp/name/hello
```

入口参数

Property | Description
---|---
name   |  CP名称，非英文字符需要通过 encodeURIComponent 进行编码

#### Example Response

查询成功的结果
```json
{
  "cid": "b77a9b90-bbc4-11e8-9203-1ff8357db148",
  "name": "hello",
  "url": "http://127.0.0.1",
  "ip": "",
  "current": {
    "hash": "00465324a3a7487ebcf7fccf0ddcd72d7142b35669c2cb3e15bfc39dbef7e96a",
    "index": 0,
    "address": "tb1qr790zz32jyyje8letxkavdv93qf7dmp0wjx3s0"
  }
}
```

查询失败的结果：
```json
{
  "error": {
    "type": "Error",
    "message": "No message."
  }
}
```
