## 连接器

连接器是指协助业务点执行连接公链、发起业务请求并获取应答的流程的辅助类
目前有控制台连接器和Fetch连接器两种连接器

### 控制台连接器

用于集成了核心库（GameGold Core）的控制台或游戏服务端，向SPV节点/全节点发起API调用
该连接器使用了核心库提供的 accessWallet 类

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

### Fetch连接器

用于基于浏览器的游戏客户端，或没有集成核心库的游戏服务端，向SPV节点/全节点发起API调用
详细案例请查阅 gamegoldmanager 项目中的 remoting 对象封装

```javascript
//此处使用了蚂蚁金服的 dva 库
import fetch from 'dva/fetch';

//连接参数配置对象
const $params = {
  apiKey: 'hello', //远程服务器基本校验密码
  cid: 'terminal001', //终端编码，作为访问远程钱包时的终端标识
  //访问钱包时的令牌固定量，通过HMAC算法，将令牌随机量和令牌固定量合成为最终的访问令牌
  token: '0340129aaa7a69ac10bfbf314b9b1ca8bdda5faecce1b6dab3e7c4178b99513392', 
  id: 'primary', //默认访问的钱包编号
  random: null,
  randomTime: null,
};

//连接器
async function connector(method, params) {
  await queryToken(); //登录辅助：远程获取令牌随机量

  params = params || [];

  let rt = await request(
    '/api/execute',
    fillOptions({
      method: 'POST',
      body: {
        method: method,
        params: params,
      },
    })
  );
  if(!!rt.error || !rt.result) {
    const error = new Error(rt.error);
    throw error;
  }    

  return rt.result;
}

//发起远程API调用，获取游戏列表，外围用异步函数进行了包装以使用 await 关键字
(async ()=>{
  let rt = await connector('cp.list', params); //params为参数数组
})();

//登录辅助函数：远程获取令牌随机量
async function queryToken() {
  let ret = getRandom();
  if (!ret) {
    ret = await request(
      '/api/execute',
      fillOptions({
        method: 'POST',
        body: {
          method: 'token.random',
          params: [$params.cid],
        },
      })
    );
    if(!!ret.error || !ret.result) {
      const error = new Error(rt.error);
      throw error;
    }    
    setRandom(ret.result); //获取令牌随机量
  }
}

//辅助函数，处理发送参数
function fillOptions(options) {
  if (!options) {
    options = {};
  }
  if (!options.body) {
    options.body = {};
  }
  if (!options.headers) {
    options.headers = {};
  }

  let rnd = getRandom();
  if ($params.token && rnd) {
    options.body.token = signHMAC($params.token, rnd);
  }
  options.body.id = $params.id; //附加默认钱包编号
  options.body.cid = $params.cid; //附加客户端编号

  let auth = {
    username: 'bitcoinrpc',
    password: $params.apiKey || '',
  };
  var base = new Base64();
  var result = base.encode(`${auth.username}:${auth.password}`);
  options.headers.Authorization = `Basic ${result}`;
  return options;
}

//辅助远程访问函数，通过 fetch 函数实现 API 调用
function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };

  const newOptions = { ...defaultOptions, ...options };

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new Error(response.statusText);
      error.name = response.status;
      error.response = response;
      throw error;
    })
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        return;
      }
      if (status === 403) {
        return;
      }
      if (status <= 504 && status >= 500) {
        return;
      }
      if (status >= 404 && status < 422) {
        return;
      }
    });
}

//辅助类：处理二进制转换
function Base64() {
	// private property
	const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// private method for UTF-8 encoding
	const _utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
		return utftext;
	}
 
	// private method for UTF-8 decoding
	const _utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}

  // public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
 
	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
}

//辅助函数：读取随机量
function getRandom() {
  let _t = (Math.floor(Date.now() / 1000) / 120) | 0;
  $params.randomTime = $params.randomTime || _t;
  if (_t > $params.randomTime) {
    //有效期检测
    $params.random = null;
  }

  return $params.random;
}

//辅助函数：设置随机量
function setRandom(val) {
  $params.random = val;
  if (!!val) {
    $params.randomTime = (Math.floor(Date.now() / 1000) / 120) | 0; //设置有效期
  }
}
```
