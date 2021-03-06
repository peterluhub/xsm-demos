let _data = {};
let config = {};
let sharedState = {};
let sublist = new Map();
let rmsublist = new Map();
let debug=false;
let trace=false;
let fwsetstate, fwinitstate, fwumount, fwcname;

function initstate(self, key, val) {
    let v = get(key);
    if( v === undefined ) {
        self[key] = val;
        set(key, val);
    } else {
        self[key] = v;
    }
}

const frameworkcfg = {
    React: {
        umount: 'componentWillUnmount',
        setstate: self => (key, val) => {
            self[key] = val;
            self.forceUpdate();
            return self;
        },
        initstate,
        cname: self => self.constructor.name,
    },
    Vue: {
        umount: 'destroyed',
        setstate: self => (key, val) => {
            self[key] = val;
            return self.$forceUpdate();
        },
        initstate,
        cname: self => self.$options._componentTag
    },
    Angular: {
        umount: 'ngOnDestroy',
        setstate: self => (key, val) => self[key] = val,
        initstate,
        cname: self => self.constructor.name,
    },
};

function rmkey(key) {
    _data[key] = undefined;
    if( trace )
        console.trace('trace for removing key=', key, 'store', {..._data});
    if( debug )
        console.log('removing key=', key, 'store', {..._data});
}

function rmsub(key, id) {
      if( (id||id===0) && sublist.has(key) && (sublist.get(key).length) > id ) {
          sublist.get(key).splice(id, 1)
          if( sublist.get(key).length === 0 ) {
              sublist.delete(key)
              rmkey(key);
          }
      }
}

function addsub(key, cb) {
      if( !sublist.has(key) ) sublist.set(key, []);
      let subitem = sublist.get(key);
      subitem.push((key,val)=>cb(key,val))
      return subitem.length-1;
}

export function set(key, val) {
    let cblst = sublist.get(key);
    if(  cblst ) {
        if( cblst.length == 1 ) {
            cblst[0](key, val);
        } else {
            for(let i=0; i<cblst.length; i++) {
                cblst[i](key, val);
            }
        }
    }
    _data[key] = val;
    if( debug )
        console.log('store', {..._data});
    if( trace )
        console.trace('store', {..._data});
}

export function setMany(kv) {
    Object.keys(kv).forEach(key => {
        set(key, kv[key])
    });
}

export function get(key) {
    return _data[key];
}

function rmStateBinding(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[fwcname(self)];
    else
        return;
    Object.keys(map).forEach(key => {
        rmsub(key, rmsublist.get(self)[key]);
    });
}

export function bindState(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[fwcname(self)];
    else
        return;
    let id, statecb;
    rmsublist.set(self, {});
    const ref = rmsublist.get(self)
    let frameworkcb =  fwsetstate(self);
    Object.keys(map).forEach(key => {
        fwinitstate(self, key, map[key]);
        /*
        statecb = (key, val) => {
            return frameworkcb(key, val);
        }
        id = addsub(key, statecb);
        */
        id = addsub(key, frameworkcb);
        ref[key] = id;
    });
    if( config.framework ) {
        let umount = self[fwumount]
        if( umount ) {
            umount = umount.bind(self);
            self[fwumount] = function classDestroy() {
                rmStateBinding(self, map);
                return umount();
            };
        } else {
            self[fwumount] = function classDestroy() {
                rmStateBinding(self, map);
            };
        }
    } else {
        console.log('default framework', framework, 'umount', umount, 'self', self)
    }
}

export function reset(key, opt) {
    if(key) {
      delete _data[key];
    } else {
      _data = {};
    }
}

function addSharedState(bindings) {
    Object.keys(bindings).forEach(key => {
        sharedState[key] = true;
    });
}

function setSharedState(bindings) {
    let keylist = {};
    Object.keys(bindings).forEach(key => {
      const component = bindings[key];
      addSharedState( bindings[key]);
      Object.keys(component).forEach(state => {
        if( keylist[state])
            keylist[state] += 1;
        else
            keylist[state]= 1;
      });
    });
    Object.keys(keylist).forEach(key => {
        if( keylist[key]>1 )
            sharedState[key] = true;
    });
    if( debug )
        console.log('sharedState', sharedState);
}

export function setcfg(opt) {
    if( !opt ) return;
    let val;
    Object.keys(opt).forEach(key => {
        val = opt[key];
        config[key] = val;
        
        if( key === 'framework' ) {
            fwinitstate = frameworkcfg[val].initstate;
            fwsetstate = frameworkcfg[val].setstate;
            fwumount = frameworkcfg[val].umount;
            fwcname = frameworkcfg[val].cname;
            //console.log('fwinitstate', fwinitstate);
        } else if( key === 'bindings' ) {
            setSharedState(val)
        } else if( key === 'sharedBindings' ) {
            addSharedState(val)
        } else if( key === 'debug' ) {
            usm.debug(val)
            debug = val;
        } else {
            console.log('not supported option ', key);
        }
    });
}

const usm = {
  setcfg,
  set,
  get,
  reset,
  rmsub,
  addsub,
  bindState,
  debug: val => debug=val,
  trace: val => trace=val,
};

export default usm;
