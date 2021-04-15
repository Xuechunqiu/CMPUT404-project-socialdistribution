import { getDomainName } from "../components/Utils";

let _config64 = process.env.REACT_APP_CONFIGBASE64;
let _domain;
let _remoteDomain;
let _remoteDomain4;
let _remoteDomain20;
let _port;
let _port4;
let _port20;
let _auth;
let _auth4;
let _auth20;

if (_config64) {
  let _config = JSON.parse(atob(_config64));
  _domain = _config.self.url;
  _remoteDomain = _config.clone.url;
  _remoteDomain4 = _config.team4.url;
  _remoteDomain20 = _config.team20.url;
  _port = _config.self.port;
  _port4 = _config.team4.port;
  _port20 = _config.team20.port;
  _auth = _config.clone.auth;
  _auth4 = _config.team4.auth;
  _auth20 = _config.team20.auth;
} else {
  _domain = "http://localhost"; //"https://social-distribution-t1.herokuapp.com";
  _remoteDomain = "https://nofun.herokuapp.com";
  _remoteDomain4 = "https://c404posties.herokuapp.com"; // team 4
  _remoteDomain20 = "https://nofun.herokuapp.com"; // team 20
  _port = "8000";
  _port4 = "";
  _port20 = "";
  _auth = "Basic YXV0aDoxMjM=";
  _auth4 = "Basic YWRtaW5COmFkbWluQg==";
  _auth20 = "Basic YXV0aDoxMjM=";
}

const domain = _domain;
const remoteDomain = _remoteDomain;
const remoteDomain4 = _remoteDomain4;
const remoteDomain20 = _remoteDomain20;
const port = _port;
const port4 = _port4;
const port20 = _port20;
const auth = _auth;
const auth4 = _auth4;
const auth20 = _auth20;

const remoteHost = getDomainName(_remoteDomain);
const remoteHost4 = getDomainName(_remoteDomain4);
const remoteHost20 = getDomainName(_remoteDomain20);
const domainAuthPair = {
  [remoteHost]: _auth,
  [remoteHost4]: _auth4,
  [remoteHost20]: _auth20,
};

export {
  domain,
  port,
  remoteDomain,
  auth,
  remoteDomain4,
  port4,
  auth4,
  remoteDomain20,
  port20,
  auth20,
  domainAuthPair,
};
