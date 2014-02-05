Openstat = {
	'o' 		: new Array(),
	'ping_time' : 0,
	'timer' 	: 0,
	'session' 	: 
	{
		'vid_id' 	: 0,
		'vid_t' 	: 0,
		'vid_hl'	: 0,
		'vid_ev'	: ''
	},
	'advert' :
	{
		'id'	: 0,
		'type'	: '',
		'adv_t' : 0,
		'ping_time' : 0,
		'timer' : 0
	},
	'errors' 	:
	{
		'er_id'		: '',
		'er_st'		: '',
		'vid_t'		: 0
	},
	'params' 	:
	{
		'bc_type'	: 'live',
		'bc_lang'	: 'ru',
		'bc_qlt'	: 'sd',
		'bc_fmt'	: 'rtmp',
		'source_id'	: 'live.digicast.ru',
		'cl_id'		: 0,
		'alias_id'	: 0
	},
	functions		: {
		setVidt		: function(vid_t, dest) {
			var now = Math.round((new Date()).getTime() / 1000);
			var from = Math.round(new Date(2010, 6, 30).getTime() / 1000);
			vid_t = (vid_t < now && vid_t > from) ? vid_t : '';
			if(dest == 'session')
				Openstat.session.vid_t = vid_t;
			if(dest == 'errors')
				Openstat.errors.vid_t = vid_t;
		}
	},
	'adv' :
	{
		'init' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				ac_type: 	Openstat.advert.type, 
				ac_lang: 	Openstat.params.bc_lang,
				vid_id: 	Openstat.session.vid_id
			}});
			Openstat.adv.ping();	
		},
		'ready' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'ready', 
				ac_lang: 	Openstat.params.bc_lang,
				vid_id: 	Openstat.session.vid_id
			}});	
		},
		'play' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'play', 
				adv_t: 		Openstat.advert.adv_t,
				vid_id: 	Openstat.session.vid_id
			}});	
		},
		'show' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'show', 
				adv_t: 		Openstat.advert.adv_t,
				vid_id: 	Openstat.session.vid_id
			}});	
		},
		'hide' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'hide', 
				adv_t: 		Openstat.advert.adv_t,
				vid_id: 	Openstat.session.vid_id
			}});	
		},
		'ping'	: function() {
			s = (Openstat.advert.type == 'pre-roll') ? 7 : 20;
			Openstat.advert.ping_time = s;
			
			Openstat.advert.adv_t = (TM_Player.adv_object) ? parseInt( TM_Player.adv_object.get_advert_position() ) : false;
			
			if(Openstat.advert.adv_t) {
				Openstat.o.push({ url: '/', vars: 
				{ 
					adv_id		: Openstat.advert.id, 
					adv_ev 		: 'ping', 
					adv_t		: Openstat.advert.adv_t
				}});
			}
			
			if( Openstat.advert.timer !== null )
				Openstat.advert.timer = setTimeout( function(){ Openstat.adv.ping() }, Openstat.advert.ping_time * 1000 );
		},
		'skip' : function(){
			Openstat.advert.adv_t = (TM_Player.adv_object) ? parseInt( TM_Player.adv_object.get_advert_position() ) : false;
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'skip', 
				adv_t: 		Openstat.advert.adv_t,
				vid_id: 	Openstat.session.vid_id
			}});
			clearTimeout( Openstat.advert.timer )
			Openstat.advert.timer = null;
		},
		'complete' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'complete', 
				adv_t: 		Openstat.advert.adv_t,
				vid_id: 	Openstat.session.vid_id
			}});
			clearTimeout( Openstat.advert.timer )
			Openstat.advert.timer = null;
		},
		'click' : function(){
			Openstat.o.push({ url: '/', vars: 
			{ 
				adv_id: 	Openstat.advert.id,
				adv_ev: 	'click', 
				adv_t: 		Openstat.advert.adv_t,
				vid_id: 	Openstat.session.vid_id
			}});
		}
	},
	'ajax' : 
	{
		'player'	: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id	: Openstat.session.vid_id,
				bc_type : Openstat.params.bc_type, 
				bc_lang : Openstat.params.bc_lang, 
				bc_qlt	: Openstat.params.bc_qlt, 
				bc_fmt	: Openstat.params.bc_fmt
			}});
			Openstat.ajax.ping();
		},
		'ready'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'ready', 
				source_id	: Openstat.params.source_id, 
				alias_id	: Openstat.params.alias_id 
			}});
		},
		'ping'		: function() {
			var s = 30, l = 45
			if(TM_Player.config.timeFrom && TM_Player.config.timeTo)
				Openstat.ping_time = ( (TM_Player.config.timeTo - TM_Player.config.timeFrom) > 30*60) ? l : s;
			else if (TM_Player.config.timeFrom && !TM_Player.config.timeTo)
				Openstat.ping_time = ( (TM_Player.config.timeTo -  Math.round((new Date()).getTime() / 1000)) > 30*60) ? l : s;
			else
				Openstat.ping_time = l;
			
			Openstat.session.vid_t = (TM_Player.flash_object) ? parseInt( TM_Player.flash_object.get_playhead_position() ) : false;
			if(Openstat.session.vid_t) {
				Openstat.o.push({ url: '/', vars: 
				{ 
					vid_id		: Openstat.session.vid_id,
					cl_id 		: Openstat.params.cl_id, 
					vid_ev 		: 'ping', 
					vid_t		: Openstat.session.vid_t
				}});
			}
			
			Openstat.timer = setTimeout( function(){ Openstat.ajax.ping() }, Openstat.ping_time * 1000 );
		},
		'error'		: function(params) {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'error', 
				vid_t 		: Openstat.errors.vid_t,
				er_id		: Openstat.errors.er_id, 
				er_st 		: Openstat.errors.er_st 
			}});
		},
		'play'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'play', 
				vid_t		: Openstat.session.vid_t
			}});
		},
		'pause'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'pause', 
				vid_t		: Openstat.session.vid_t
			}});
		},
		'fullscreen'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'fullscreen', 
				vid_t		: Openstat.session.vid_t
			}});
		},
		'window'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'window', 
				vid_t		: Openstat.session.vid_t
			}});
		},
		'seek'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'seek', 
				vid_t		: Openstat.session.vid_t,
				vid_hl 		: Openstat.session.vid_hl
			}});
		},
		'complete'		: function() {
			Openstat.o.push({ url: '/', vars: 
			{ 
				vid_id		: Openstat.session.vid_id,
				cl_id 		: Openstat.params.cl_id, 
				vid_ev 		: 'complete', 
				vid_t		: Openstat.session.vid_t
			}});
		},		
		'alert'		: function() {
			alert()	
		}
	}
}