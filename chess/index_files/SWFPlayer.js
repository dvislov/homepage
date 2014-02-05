//= require <jquery>
//= require <lowpro.jquery>
//= require <swfobject>
// Flash player api wrapper
// requires swfobject

SWFPlayer = $.klass({
  initialize: function(element_id, flashvars, flashparams, swf_path, session_cookie_name) {
    this.slice = jQuery.extend({}, flashvars);
    this.initial_slice = this.slice;
    flashvars['get_params'] = "";
    if (flashvars['name']) {
      flashvars['name'] = encodeURIComponent(flashvars['name']);
    }
    this.player_id = 'flash-' + element_id;

    this.do_on_ready = [];
    this.ready_state = false;

    SWFPlayer.players.push(this);

    swfobject.embedSWF(swf_path, element_id, "100%", "100%", "10.0.0", null, flashvars, flashparams,
                      {id: this.player_id, name: this.player_id});
  },

  ready: function(fun) {
    if (this.ready_state) {
      fun();
    } else {
      this.do_on_ready.push(fun);
    }
  },

  become_ready: function() {
    if (this.ready_state) return;
    this.ready_state = true;

    for ( var i = 0; i < this.do_on_ready.length; i++ ){
      this.do_on_ready[i]();
    }
  },

  get: function() {
    return document.getElementById(this.player_id);
  },

  command_without_prefixing: function(cmd) {
    var e = this.get();
    if (!e) return;
    var func = e[cmd];
    var args = Array.prototype.slice.call(arguments).slice(1);
    if (func) {
		return func.apply(e, args);
    } else {
      return null;
    }
  },

  command: function(cmd) {
    cmd = 'fp' + cmd.slice(0,1).toUpperCase() + cmd.slice(1);
    return this.command_without_prefixing.apply(this,arguments);
  },
  
  commandWtt: function(cmd) {
    return this.command_without_prefixing.apply(this,arguments);
  },

  get_playhead_position: function() {
    return this.command('GetPlayheadPosition');
  },
  
  get_advert_position: function() {
    return this.commandWtt('getPosition');
  },
  
  get_player_state: function() {
	return this.command('GetState')  
  },

  set_playhead_range: function(beginning, ending) {
	  this.command('SetTimeFrom', beginning);
    return this.command('SetTimeTo', ending);
  },

  get_channel_id: function() {
    return this.command('getChannelID');
  },

  set_channel_id: function(id) {
    return this.command('setChannelID', id);
  },
  
  set_ps_live: function(timestamp) {
	  this.command('SetPsLive', timestamp);
  },

  set_channel_id_and_playhead_position: function(channel_id, beginning, ending, go_offset) {
    return this.command('SetChannelAndRange', channel_id, beginning, ending, go_offset);
  },
  
  set_playhead_position: function(position) {
	    return this.command('SetPlayheadPosition', position);
  },

  set_Ending: function(position) {
	    return this.command('SetTimeTo', position);
  },

  set_BookmarksUrl: function(url) {
	    return this.command('SetBookmarksURL', url);
  },

  ReloadBookmarks: function(bookmarks) {
	    return this.command('ReloadBookmarks', bookmarks);
  },
  
  set_time_from: function(time) {
	    return this.command('SetTimeFrom', time);
  },

  set_time_to: function(time) {
	    return this.command('SetTimeTo', time);
  },

  get_CurrentBookmarkID: function() {
    return this.command('GetCurrentBookmarkID');
  },

  add_bookmarks: function(bookmarks) {
	    return this.command('addBookmarks', bookmarks);
  },

  play: function() {
    return this.command('play');
  },

  pause: function() {
    return this.command('stop');
  },

  take_snapshot: function() {
    return this.command('takeSnapshot');
  },
  
  reload_ad: function(title, image, message, link, delay, type) {	 
	var ad = { title: title, image: image, message: message, link: link, delay: delay, type: type };
	
	if (typeof(title) === 'undefined' || title == null || title == "")
		ad = null;
		
	return this.command('ReloadAd', ad);
  },

  set_telecast: function(slice) {
    this.slice = slice;
    return this.command('setTelecastInfo', slice.beginning, slice.ending, slice.name);
  },

  version: function() {
    if (!this._version) {
      this._version = this.command_without_prefixing('fpGetVersionLabel') ||
                      SWFPlayer.undefined_version_string;
    }
    return this._version;
  },

  parse_window_location_hash_moment: function() {
    var moment = window.location.hash;
    if (moment) moment = moment.replace(/^#/,'');
    if (moment) moment = moment.split(".")[0];
    if (moment) moment = parseFloat(moment);
    if (moment) return (moment);
  }
})

SWFPlayer.players = [];
SWFPlayer.skip_seconds_before_comment = 3;
SWFPlayer.undefined_version_string = 'Video Player ver. Unknown';

TrackedInterval = $.klass({
  initialize: function(player, options) {
    // beginning and ending should be integer local timestamps;
    this.beginning = options.beginning;
    this.ending = options.ending;
    this.enter = options.enter || (function() {});
    this.leave = options.leave || (function() {});
    this.player = player;

    this.id = TrackedInterval.register(this);
    result = this.player.command('setTrackedInterval', this.id, this.beginning, this.ending);
  },

  remove: function() {
    TrackedInterval.unregister(this.id);
    this.player.command('removeTrackedInterval', this.id);
  }
});

TrackedInterval.last_id = 1;
TrackedInterval.intervals = {};

TrackedInterval.register = function(interval) {
  var interval_id = TrackedInterval.last_id;
  TrackedInterval.last_id += 1;
  TrackedInterval.intervals[interval_id] = interval;
  return '' + interval_id; // Cast to string
}

TrackedInterval.unregister = function(id) {
  TrackedInterval.intervals[id] = null;
}

TrackedInterval.enter = function(id) {
  var interval = TrackedInterval.intervals[id];
  if (interval) interval.enter();
}

TrackedInterval.leave = function(id) {
  var interval = TrackedInterval.intervals[id];
  if (interval) interval.leave();
}

function fpTrackedStateChanged(id, state) {
  if (state == 1) {
    TrackedInterval.enter(id);
  } else {
    TrackedInterval.leave(id);
  }
  return true;
}

function fpReady() {
  for ( var i = 0; i < SWFPlayer.players.length; i++ ){
    SWFPlayer.players[i].become_ready();
  }
}
