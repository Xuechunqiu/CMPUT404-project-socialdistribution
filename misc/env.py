import json
import base64
import gen

x = '''
{
    "team4": {
        "domain": "c404posties.herokuapp.com",
        "port": "443",
        "scheme": "https://",
        "auth": "Basic YWRtaW5COmFkbWluQg=="
    },
    "clone": {
        "domain": "https://nofun.herokuapp.com",
        "port": "443",
        "scheme": "https://",
        "auth": "Basic YXV0aDoxMjM="
    },
    "team20": {
        "domain": "social-distribution-t1.herokuapp.com",
        "port": "443",
        "scheme": "https://",
        "auth": "Basic UmVtb3RlMTpyZW1vdGUxMjM0"
    },
    "self": {
        "domain": "social-distribution-t1.herokuapp.com",
        "port":"443",
        "scheme": "https://"
    }
}
'''

x = json.loads(x)
compact_x = {}

for key in x.keys():
    if key == "self":
        compact_x[key] = {"url": x[key]["scheme"] +
                          x[key]["domain"], "port": x[key]["port"]}
    else:
        compact_x[key] = {"url": x[key]["scheme"] + x[key]
                          ["domain"], "port": x[key]["port"], "auth": x[key]["auth"]}
print(base64.b64encode(json.dumps(compact_x).encode('utf-8')).decode('utf-8'))
