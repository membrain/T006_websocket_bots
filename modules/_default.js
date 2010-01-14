var sys = require("sys");

var COMMANDS = {
    "init-bot": function() {},
    "move":     function(direction) {
        this._bot[direction.toLowerCase()]();
    }
}

var Module = this.Module = function() {
  this._bot         = new Bot();
  this._interval    = null;
};

Module.prototype.onData = function(data, connection) {
    sys.puts(data);
    var message = JSON.parse(data);
    (COMMANDS[message["command"]] || function() {}).apply(this, message["arguments"]);
};

Module.prototype.onConnect = function(connection) {
    this._interval = setInterval(function() {
        connection.send(JSON.stringify(Bot.instances));
    }, 100);
};

Module.prototype.onDisconnect = function(connection) {
    this._bot.destroy();
};

// ----------------------------------------------------------------------------
// Bot
// ----------------------------------------------------------------------------
var Bot = function() {
    this._top    = 0;
    this._left   = 0;
    this.width  = 20;
    this.height = 20;
    this.id     = Bot.NEXT_ID++;
    
    Bot.instances[this.id] = this;
};

Bot.NEXT_ID     = 1;
Bot.STEP        = 10;
Bot.instances   = {};

Bot.prototype.up = function() {
    this._top -= Bot.STEP;
}

Bot.prototype.down = function() {
    this._top += Bot.STEP;
}

Bot.prototype.left = function() {
    this._left -= Bot.STEP;
}

Bot.prototype.right = function() {
    this._left += Bot.STEP;
}

Bot.prototype.destroy = function() {
    delete Bot.instances[this.id];
}

Bot.prototype.toString = function() {
   return "{top:" + this._top + ", left:" + this._left + "}";
}