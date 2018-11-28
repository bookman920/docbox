# Gamegold 多账户体系

## 设计意图
为了向用户屏蔽不必要的技术细节，以降低使用门槛，微信小程序并不在本地管理钱包，而是将关键操作全部委托到远方的微信小程序服务器。
微信小程序服务器管理着一个超级钱包，其中包含了海量的账户，每个账户由个人用户的OPENID所标识，区隔开了用户的私钥、地址、道具等信息。
从某种角度来看，微信小程序服务器是一个特殊的全节点，与其目的性相对应，有一系列的函数需要完成这种相关性改造，以便该特殊节点可以携带额外的OPENID参数访问这些函数，从而营造出一个多账户系统。
与此同时，忽略这个参数的系列调用，其运作机制又回到了一个单账户体系。

## 兼容性设计
同样的机制被用在一个游戏特约全节点需要管理不同的游戏的场景中。
在这个场景中，每一台游戏服务器都会被分配一个终端编码（等比于微信小程序用户的OPENID），从而被特约全节点映射到一个单独的账户上。
因此，特约定如下兼容性设计：
1、微信小程序后端发起RPC调用时，约定采用 config.root 作为终端码，即Root模式
2、游戏授权终端向特约全节点发起RPC调用时，使用非 config.root 作为终端码，即普通模式
3、类 RPCWallet 设计了 simulateAccount 函数，对如上两种模式做不同处理：
    1、Root模式下，simulateAccount 返回RPC调用中上传的账户，例如微信小程序后台就是调用时填写当前用户的OPENID，以便将用户的操作限定于各自账户内
    2、普通模式下，simulateAccount 返回终端码作为账户，覆盖了RPC调用中上传的账户，以此将RPC调用强行限定于终端码对应的账户内

## 管理后台操作规范
@note 务请提前修改 .gamegold.conf 的配置字段 hmac-salt 为个性化HEX字符串(长度64)

### 超级用户如何登录

通过如下指令，然后从全节点监控屏上拷贝实时生成的令牌：
```bash
token.auth "xxxxxxxx-game-gold-root-xxxxxxxxxxxx"
```

屏显终端码对应的令牌如下：
c01: 0340129aaa7a69ac10bfbf314b9b1ca8bdda5faecce1b6dab3e7c4178b99513392

至此，可以形成超级用户登录授权所需的 cid/token 参数对

通过如下指令，生成对外公布的收款地址
```bash
address.create
```

### 如何添加新的操作员账户？

管理员以超级用户身份登录(自动对应)，输入操作员登录名(例如 c01)等信息，生成新的操作员账户，并绑定对应的令牌

运行如下指令，然后从全节点监控屏上拷贝实时生成的令牌：
```bash
token.auth "c01"
```

屏显终端码对应的令牌如下：
c01: 0296a660c1f0ae0a6b1727db34d86a989f6ff28c8bb0a45ab2b212edf5148c0ad4

至此，可以形成登录授权所需的 cid/token 参数对

通过如下指令，生成该操作员专用的收款地址(operator-addr):
```bash
address.create c01
```

### 操作员如何连接全节点

操作员登录后，后台系统将为其生成相应的全节点连接器：
```js
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
remote.setup({ //设置授权式连接器的参数
    type:   'testnet',               //希望连接的对等网络的类型，分为 testnet 和 main
    ip:     '127.0.0.1',             //远程全节点地址
    apiKey: 'bookmansoft',           //远程全节点基本校验密码, 对应配置字段 api-key
    id:     'primary',               //默认访问的钱包编号
    cid:    'c01',                   //终端编码
    token:  '0296a660c1f0ae0a6b1727db34d86a989f6ff28c8bb0a45ab2b212edf5148c0ad4', //访问钱包时的令牌固定量
});
```

通过如下指令，生成该操作员专用的收款地址(operator-addr):
```bash
address.create
```

### 如何注册CP？

操作员登录系统，输入名称、IP地址、收款地址等必要信息，注册新的CP。如果未指定收款地址，系统在操作员账户内自动分配(不推荐)

注册厂商: 名称(不少于4个字符) URL地址 (CP收款地址 IP地址)
```bash
cp.create "name" "url" ("addr" "ip")
```

### 备用金如何管理？

超级用户登录后，选取管理员，为其公开的收款地址注入备用金

```bash
tx.send operator-addr amount
```

### 如何制备道具？

操作员登录系统, 为其名下的CP制备并送出道具，该操作将消耗操作员名下的备用金

运行如下语句制备道具，参数包括 厂商编码 道具原始码 含金量 目标地址：
```bash
prop.order cid oid gold addr
```
@note addr 为系统查询得出的高值用户的地址

## 函数清单

### 创建CP

```bash
cp.create name url addr ip [account]
```

Property | Description
---|---
name    |   名称
url     |   URL
addr    |   收款地址
ip      |   IP
account |   用于创建CP的子账户名称

### 修改CP

```bash
cp.change name newName url ip [addr] [account]
```

Property | Description
---|---
name    |   名称
newName |   新的名称
url     |   URL
ip      |   IP
addr    |   转移的目标地址
account |   用于创建CP的子账户名称

### 转账

```bash
tx.send addr value [account]
```

Property | Description
---|---
addr        |   转账目标地址
value       |   转账金额
account     |   用于转账的子账户名称

### 查询钱包余额

```bash
balance.all account
```

Property | Description
---|---
account     |   子账户名称

### 创建虚拟道具

```bash
prop.create cid oid gold [openid]
```

Property | Description
---|---
cid         |   游戏编码
oid         |   道具原生编码
gold        |   道具含金量
openid      |   子账号名称

### 转移虚拟道具

```bash
prop.send addr hash index [openid]
```

Property | Description
---|---
addr        |   转移的目标地址
hash        |   交易哈希
index       |   交易输出索引
openid      |   子账户名称

### 创建用户通行证

```bash
token.user cid uid [openid]
```

Property | Description
---|---
cid         |   游戏编码
uid         |   用户游戏内编码
openid      |   子账号名称

### 捐赠道具

```bash
prop.donate hash index [openid]
```

### 收取捐赠

```bash
prop.receive raw [openid]
```

Property | Description
---|---
raw         |   原始交易数据，HEX格式
openid      |   子账号名称

### 拍卖道具

```bash
prop.sale hash index fixed [openid]
```

Property | Description
---|---
hash        |   道具所在交易哈希
index       |   输出索引。在批量转移道具的交易中，需要输出索引以指明目标道具；如果遇到拍卖交易(目前只支持单件道具拍卖)，系统将锁定 index=2 ：该交易在 index=2 的输出上携带有效载荷
fixed       |   一口价
openid      |   子账号名称

### 竞拍道具

```bash
prop.buy pid bid [openid]
```

Property | Description
---|---
pid         |   道具编号
bid         |   竞拍价
openid      |   子账号名称

### 查询道具列表

```bash
prop.list [pageNum] [openid]
```

Property | Description
---|---
pageNum     |   道具列表的页码，从1开始
openid      |   子账号名称
