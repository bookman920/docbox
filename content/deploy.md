## 游戏厂商特约全节点的部署

1、通过 npm start 启动全节点，等待其同步完成

2、在控制台运行如下命令查询CP列表，记录自己名下CP（owned字段为true）的CPID字段：
```bash
    npm run cli rpc cp.list 
```

3、Ctrl-c 暂时关闭全节点

4、配置 gamegold.conf 文件
- 采用包含全部CPID的逗分字符串，配置 hmac-connection 字段
- 配置 api-key 字段

5、通过 npm start 再次启动全节点

6、运行 token.auth [CPID逗分列表] 屏显授权令牌，记录并离线分发给各CP，由CP配置于它的远程连接器中，以控制台连接器为例：
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

7、CP通过远程访问组件，和特约全节点开展RPC通讯

8、全节点在特定事件（如支付确认等）发生时，会通过CP注册信息中的URL地址，向CP提交事件通知, 如下所示：
```js
    //全节点向CP发起通告：
    //  cp.url取自cp注册信息，端口号根据网络类型而定，main为7330，testnet为17330
    //  路由根据事件类型选取，本例为订单确认，取值 order/confirm
    (new Remote(`http://${cp.url}:7330`)).Post(`order/confirm`, {data: data, sig: sig}, (err, params) => {});
```
