## 部署特约全节点

1、建立运行环境
在安装了 node 8.0 及以上版本的基础上，运行如下指令：
```bash
git clone https://github.com/bookmansoft/gamegoldnode
npm i
```
2、开启一个控制台窗口A，通过下述指令启动全节点，等待其同步数据完成
```bash
npm start
```

3、新开一个控制台窗口B，运行如下命令查询CP列表，记录自己名下CP（owned字段为true）的CPID字段：
```bash
    npm run cli rpc cp.list 
```

4、在窗口A键入 Ctrl-c 关闭全节点

5、配置 gamegold.conf 文件
- 采用包含全部CPID的逗分字符串，配置 hmac-connection 字段
- 配置 api-key 字段

@note gamegold.conf 位于 .gamegold\$networktype\ 目录下，对测试网而言 $networktype = testnet ， 对主网而言 $networktype = main

6、在A窗口通过如下指令再次启动全节点
```bash
npm start 
```

7、在B窗口运行 token.auth [CPID逗分列表]，A窗口会屏显授权令牌，记录并离线分发给各CP

## 游戏和特约全节点的交互

注：详情请参考 GIP0005 - 认证和授权，以及 GIP0006 - 支付协议

1、CP通过远程连接器，和特约全节点开展RPC通讯。CP需要将获取的授权令牌配置于它的远程连接器中，以控制台连接器为例：
```js
    let remote = new accessWallet({
        rpcHost:    '127.0.0.1',                           //远程全节点地址
        apiKey:     'bookmansoft',                         //远程访问基本校验密码，对应 gamegold.conf 中的 api-key
        network:    'testnet',                             //对等网络类型
        cid:        '2c9af1d0-7aa3-11e8-8095-3d21d8a3bdc9',//CP编码
        token:      '03f6682764acd7e015fe4e8083bdb2b969eae0d6243f810a370b23ad3863c2efcd',   //CP被分配的授权令牌
    });
```
@note 当前版本下，所有授权节点都将共享整个钱包系统。未来版本中，将为不同CP划分独立钱包，以实现安全隔离

2、特约全节点在特定事件（如支付确认等）发生时，会通过CP注册信息中的URL地址，向CP提交事件通知, 如下所示：
```js
    //全节点向CP发起通告：
    //  cp.url取自cp注册信息，端口号根据网络类型而定，main为7330，testnet为17330
    //  路由根据事件类型选取，本例为订单确认，取值 order/confirm
    (new Remote(`http://${cp.url}:7330`)).Post(`order/confirm`, {data: data, sig: sig}, (err, params) => {});
```

## RPC通讯指令列表

### 客户端认证登录流程

主要涉及指令： token.user

1、页游

泛指运行于浏览器内的页面游戏，包括Flash游戏、HTML5游戏，运行环境包括PC、手机等

- 页游客户端将随机用户码和CP编码，打包并生成二维码并显示在屏幕上
```json
{
    "cid": "game001",
    "uid": "user001"
}
```
- 钱包APP扫码后，在本地执行 token.user 指令，将生成的令牌以GET方式送入游戏服务器
- 微信小程序扫码后，将信息送至小程序服务端，在服务端执行 token.user 指令，再将生成的令牌以GET方式送入游戏服务器
    两者的区别是：
        钱包APP用HD钱包技术，本地生成并管理所有的地址。
        微信小程序则在服务端采用HD钱包技术，远程管理所有的地址，用户相关地址记录于他的openid名下。
    两者的共性是：
        都使用 cid+uid，通过HD钱包技术推导出专用地址，cid和uid含义、推导出的地址都是一样的
- 游戏服务端接收 token ：
```js
app.get('/auth/:token', async (req, res) => { 
    if(!!req.params.token) {
        try {
            let tokenObj = JSON.parse(decodeURIComponent(req.params.token));
            //verifyData是验签令牌函数，见gamegoldnode/lib/verifyData.js
            let ret = verifyData(tokenObj); 
            if(!!ret){
                console.log(`user token verified: `, tokenObj);
            }
            else{
                console.log(`user token verify failed: `, tokenObj);
            }
        }
        catch(e) {
            console.log(`user token verify failed: `, e.message);
        }
    }
});
```

2、手游APP

运行于IOS、Android系统上的游戏类独立APP

- 手游APP通过 URL Schema 技术，向钱包APP或者微信小程序送入cid+uid
- 钱包APP生成token，同样以 URL Schema 将 token 送入手游APP，也可以先送入游戏服务端再下发给手游APP
- 微信小程序通知小程序服务端，生成token送入游戏服务端
- 游戏服务端接收 token 的流程同上
- 游戏服务端将token下发给手游APP，手游APP允许用户登录

3、微信小游戏/内嵌式微信小游戏

运行于微信小程序环境内的游戏类小程序。内嵌式指使用WebViewer模式嵌入微信小程序中运行的游戏

- 微信小游戏通过小程序跳转相关技术，向微信小程序钱包送入cid+uid
- 微信小程序钱包通知小程序服务端，生成token送入游戏服务端再下发给微信小游戏
- 游戏服务端接收 token 的流程同上
- 游戏服务端将token下发给微信小游戏，允许用户登录

4、从钱包发起的登录认证流程
    a、在钱包界面，点击游戏列表
    b、点击具体游戏后面的"登录"按钮，此时钱包为该游戏生成登录token，并试图跳转到游戏客户端（APP或微信小程序）
    c、游戏客户端向服务端请求登录：GET /auth/:tokan
    d、游戏服务端捕获该路由，核实该token的有效性，执行道具确权，接着设置登录状态并通知游戏客户端
    e、游戏客户端允许用户登录，使用经确权后的道具

### 确权流程

主要涉及指令： queryProps
game_id：CP编码
user_addr：游戏用户对应该游戏的钱包地址

该指令由游戏服务端向全节点发起，用于道具确权
模拟输入：
```js
    let props = await connector.execute('queryProps', [$game_id, $user_addr]);
```

入口参数

Property | Description
---|---
game_id    |  CP编码
user_addr  |  钱包地址

模拟输出：
```json
[
  {
    "pid": "{道具编号}",
    "cid": "{游戏编号}",
    "oid": "{道具原始编号}",
    "oper": "exchange",
    "prev": {
      "hash": "{转入交易的哈希}",
      "index": "{关联的输出索引}"
    },
    "current": {
      "hash": "{道具所在交易的哈希}",
      "index": "{关联的输出索引}"
    },
    "gold": "{含金量}",
    "confirm": "{确认数}",
    "root": {
      "hash": "{道具首发交易的哈希}",
      "index": "{关联的输出索引}"
    }
  }
]
```
游戏服务端收到应答后，需要做双向确权：
1、玩家背包中没有、应答中有的道具，需要发放给玩家
2、玩家背包中有、应答中没有到道具，需要从背包中扣除
@note 
    文中提及到道具，都是指上链道具。游戏内普通道具不受该规则影响。
    目前不支持堆叠式道具，简单说每条记录不携带数量字段，都被看作是一件独立的道具

### 订单支付

主要涉及指令：order.pay

1、用户在游戏客户端上点击"商品列表"
2、点选商品后，游戏客户端向游戏服务端发送一个请求，服务端为用户生成一笔订单，缓存在服务端
3、游戏客户端使用跳转指令，将订单送入钱包，每笔订单包括字段：游戏编号、玩家编号、原始订单号、金额
4、钱包APP执行订单支付指令：
```
connector.execute({method:'order.pay', params:[cid, uid, sn, price]}).then(tx => {
    console.log('order.pay: ', tx);
});
```
5、钱包成功支付后，向全网广播交易；当游戏特约全节点收到该交易，将调用游戏服务端的订单确认回调接口
6、游戏服务端收到回调请求，将订单设置为"已确认"，处理道具发放流程，并推送给游戏客户端
7、游戏客户端将订单订单状态改为已支付，延后更新用户背包信息

### 订单查询

主要涉及指令：order.query

订单查询指令一般从服务端发起，用于查询一段时间后未收到回调确认的订单的真实状态

模拟输入：
```javascript
connector.execute({method:'order.query', params:[
  '{game_id}',
  '{order_group}'
]}).then(ret => {
  console.log(ret);
});
```

入口参数

Property | Description
---|---
game_id     |  CP编码
order_group |  订单编号数组，可一次性查询多条订单的状态

模拟输出：
```json
[
  {
    "oper"    : "pay",
    "cid"     : "{游戏编号}",
    "uid"     : "{玩家编号}",
    "sn"      : "{订单号}",
    "confirm" : "{确认数}"
  }
]
```
confirm为0表示尚未确认，大于0表示已确认，达到商家设定的最小确认数时，即可向玩家制备并发放道具

### 制备并发放道具

主要涉及指令： prop.order
等同于 prop.create 和 prop.send 命令的组合，用于订单确认后，向用户快速制备发放指定的道具

```js
await connector.execute('prop.order', [cid, oid, gold, addr]);
```

入口参数

Property | Description
---|---
cid     |  CP编码
oid     |  道具原始编号
gold    |  道具含金量
addr    |  玩家接收道具的地址
