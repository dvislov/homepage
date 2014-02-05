/**
 * TM_Player
 *
 * @constructor
 * @param DOMElement|string container player container as a DOM element or the element id (required)
 * @param object|null params object, as specified in TM_Player.params
 * @param object|null options object to pass to the constructor
 */
TM_Player = {
	'data_tmp' : null,
	'flash_object'	:	false,
	'adv_object'	:	false,
	'countdown_object'	:	false,
	'advert' : {
		'last' : 0,
		'timeout' : 60,
		'data' : null,
		'dataBanner' : null
	},
	'ajax'	: {
		'anchors' 	: false,
		'sessions'	: false
	},
	'tags'	: {
		'ids'	: [],
		'original' : []
	},
	'config': {
		'container': 'tmPlayer',
		'adv_container' : 'advPlayer',
		'live': false,
		'highlight': false,
		'referer' : null,
		'options'  : {
				'debug'				:	false,
				'anchor_slide'		: 	true,
				'seconds'			:	0,
				'show_tags'			:	false,
				'player_path'		:	'/public/player/',
				'styles_path'		:	'/public/player/default/styles.swf',
				'fetch_path'		:	'/tm',
				'longterm_anchors'	:	true,
				'anchor_content'	:	'<span class="time">{hour}:{minute}</span>' +
											'<a class="item" href="#time{time}" onclick="TM_Player.anchors.select({id}, \'{time}\');">' +
											'<span class="name">{name}</span>' +
											'<span class="description">{description}</span>' +
										'</a>',
				'tag_content'	:	'<a class="item" href="#" onclick="return false;">' +
											'<span class="name">{name}</span>' +
									'</a>',						
				'messages'  : {
						'error'				:	"Ошибка!",
						'warning'			:	"Внимание!",
						'not_avaliable'		: 'Видео трансляция сейчас недоступна. <BR />Воспроизведение начнется автоматически.',
						'server_error'		: 'Видео трансляция недоступна. Обновите страницу через 30 секунд.',
						'expiry_text'		: 'совсем немного',
						'until_start'		: 'До начала осталось',
						'streamer_error'	: false
				}
		},
		'player': {
			'status'			:	null,
			"stream_url"		:	"rtmp.telemarker.ru", 
			"protocol"			:	"rtmp", 
			"startAt"			:	0,
			"ratio"				:	"16:9",
			"reconnect"			:	"1", 
			"styles_path"		:	"styles.swf",
			"bgcolor"			:	"#303030",
			'delayBuffer'		:  	'5',
			'newstream'			:	'0',
			'maxUsers' : 3500
		},
		'isIpad'				:	false,
		'isIphone'				:	false,
		'ipadVersionEnabled'	: false,
		'isFile'				: false,
		'alias_id'				: 0,
		'event_id'				: 0
	},
	'forcedParams': {
		'player': {}
	},
	'addictedParams': {
		'player': {}
	},
	'params': {
		'language'	:	'ru',
		'quality'	:	'sd'
	},
	'session_data': false,
	'timers': {
		'anchors_web': 30000,
		'anchors_player': 35000,
		'active_clean': 7000,
		'reloadPreview': 15000,
		'bookmark': 5000,
		'server_timestamp' : false,
		'psLive_delta': 300
	},
	'anchors' : {
		'bookmarks': '',
		'bool_update' : ''
	},
	'callbacks': {
		'advert' : function( code ) {
			switch( code ) {
				case 'skipAd':
					TM_Player.initPlayer( TM_Player.data_tmp );
					$('.adv_wrapper').remove();
					TM_Player.adv_object = false;
					
					Openstat.adv.skip();
					
					last = new Date().getTime();
					expires = new Date(); expires.setTime(expires.getTime() + (1000 * TM_Player.advert.timeout))
					Global.cookie.set('adlast', last, expires)
				break;
				
				case 'stopStream': 
					TM_Player.initPlayer( TM_Player.data_tmp );
					$('.adv_wrapper').remove();
					TM_Player.adv_object = false;
					
					Openstat.adv.complete();
					
					last = new Date().getTime();
					expires = new Date(); expires.setTime(expires.getTime() + (1000 * TM_Player.advert.timeout))
					Global.cookie.set('adlast', last, expires)
				break;
				
				case 'clickVideo':
					Openstat.adv.click();
					if( TM_Player.advert.data.url )
						window.open( TM_Player.advert.data.url, 'advertWindow' );
				break;
				case 'clickLogo':
					Openstat.adv.click();
					if( TM_Player.advert.data.logo_url )
						window.open( TM_Player.advert.data.logo_url, 'advertWindow' );
				break;
				
				case 'startStream':
					Openstat.adv.play();
				break;
				
				case 'errorStream':
					TM_Player.initPlayer( TM_Player.data_tmp );
					$('.adv_wrapper').remove();
					TM_Player.adv_object = false;
					
					last = new Date().getTime();
					expires = new Date(); expires.setTime(expires.getTime() + (1000 * TM_Player.advert.timeout))
					Global.cookie.set('adlast', last, expires)
				break;

				default :
					console.log( code )
			}
		},
		'banAdvert' : function( code ) {
			switch( code ) {
				case 'click':
					Openstat.adv.click();
					if( TM_Player.advert.dataBanner.ad_link )
						window.open( TM_Player.advert.dataBanner.ad_link, 'advertWindow' );
				break;
				
				case 'more':					
					Openstat.adv.show();
				break;
				
				case 'less':
					Openstat.adv.hide();
				break;

				default :
					console.log( code )
			}
		},
		'anchors' : {
			'prevSlide' : function(){
				$('#presentation').attr('rel', new Date().getTime()/1000);
				
				cur_slide = $('#presentation img.active');
				prev = cur_slide.prev('.slide');
				if(prev.length) {
					cur_slide.fadeOut('slow').removeClass('active');
					prev.fadeIn('slow').addClass('active');
				}
			},
			'nextSlide' : function(){
				$('#presentation').attr('rel', new Date().getTime()/1000);
				
				cur_slide = $('#presentation img.active');
				next = cur_slide.next('.slide');
				if(next.length) {
					cur_slide.fadeOut('slow').removeClass('active');
					next.fadeIn('slow').addClass('active');
				}
			}
		},
		'player': {
			'jsReady' : function() {
				TM_Player.common.changeStatus('play');
				
				Openstat.params.bc_type = (TM_Player.config.live) ? 'live' : 'archive';
				Openstat.session.vid_hl = (TM_Player.config.highlight) ? TM_Player.params.translation_id : 0;
				Openstat.params.bc_lang = TM_Player.params.language;
				Openstat.params.bc_qlt = TM_Player.params.quality;
				if(!TM_Player.config.isFile)
					Openstat.params.bc_fmt = (TM_Player.config.isIpad || TM_Player.config.isIphone) ? 'hls' : 'rtmp';
				else
					Openstat.params.bc_fmt = 'mp4';

				Openstat.ajax.player();
				

				/* Парсим url на предмет перехода на конкретное время */
				var time = TM_Player.common.getHashTime();

				if( time && TM_Player.forcedParams.player.state !== 'pause' )
					TM_Player.player.setTime( time );
				if( TM_Player.config.player.ajax_play )
					TM_Player.player.setTime( TM_Player.config.player.ajax_play  );
			},
			'jsChangeBookmark' : function(id) {
				clearTimeout(TM_Player.config.anchorselect_timer);

		        if (!TM_Player.config.options.longterm_anchors)
		        	TM_Player.config.anchorselect_timer = setTimeout("$('#episodes li').removeClass('active');", TM_Player.timers.active_clean);

		        $('#episodes li').removeClass('active');
				
				clicked = $('#presentation').attr('rel');
				clicked = (clicked) ? clicked : 0;
				now = new Date().getTime()/1000;
					
				cur_slide = $('#presentation img.active');
				last_slide = $('#presentation img:last');
				to_select = (id == -1) ? last_slide : $('#presentation img.epilist_'+ id);
				
				if( cur_slide.attr('id') != to_select.attr('id') && (now - clicked) > 25 ) {
					cur_slide.fadeOut('slow').removeClass('active');
					to_select.fadeIn('slow').addClass('active');
				}

				if (TM_Player.config.options.debug)
					console.log('flash_object jsChangeBookmark: "' + id + '"');
				
				if (id == -1) {
					$('#episodes li:last').addClass('active');
					return  true;
				}
				
				$('#episodes li.epilist_'+ id).addClass('active');
				return true;
			},
			'jsSetShrink' : function(state) {
				
				if (TM_Player.config.options.debug)
					console.log('flash_object jsSetShrink: "' + state + '"');
					
				var ratio = TM_Player.config.player.ratio.split(':');
				ratio = ratio[0]/ratio[1];

				var player_width = 500;
				var player_height = 300;
				
				var player = $('.left-block');
				var width = player.parent().width();

				if (state)
				{
					player.animate({
						width: width
					},500);
					player.find('.b-flash-player').animate({
						height:	width/ratio
					},500);
					$('.right-block').addClass('right-block_under');
				}
				else
				{
					player.animate({
						width: TM_Player.config.player.width
					},500);
					player.find('.b-flash-player').animate({
						height:	TM_Player.config.player.height
					},500);
					$('.right-block').removeClass('right-block_under');
				}
			},
			'jsChangeStreamStatus' : function(data) {
				if (TM_Player.config.options.debug)
					console.log('flash_object jsChangeStreamStatus: "' + data.type + '", "' + data.uri + '", "' + data.channel_id + '", "' + data.state + '", "' + data.timestamp + '"');

				Openstat.functions.setVidt( TM_Player.flash_object.get_playhead_position(), 'errors' );
				Openstat.errors.er_st = data.uri;
				Openstat.errors.er_id = data.type;
				Openstat.ajax.error();
			},
			'jsGetPsLive' : function (channel_id) {
				timestamp = TM_Player.timers.server_timestamp - TM_Player.timers.psLive_delta;
				TM_Player.flash_object.set_ps_live( timestamp );
			},
			'statePlayer': function(params) {
				Openstat.functions.setVidt( TM_Player.flash_object.get_playhead_position(), 'session' );
				switch (params.object) {
					case 'Stream':
						switch (params.status) {
							case 'BufferFull':
								Openstat.ajax.play();
								break;
							case 'Pause':
								Openstat.ajax.pause();
								break;
							case 'Seek':
								Openstat.functions.setVidt( TM_Player.flash_object.get_playhead_position(), 'session' );
								Openstat.session.vid_hl = '';
								Openstat.ajax.seek();
								break;
							case 'Stop':
								Openstat.functions.setVidt( TM_Player.flash_object.get_playhead_position(), 'session' );
								Openstat.ajax.complete();
								break;
						}
						break;
					case 'Player':
						switch (params.status) {
							case 'Fullscreen':
								Openstat.ajax.fullscreen();
								break;
							case 'Window':
								Openstat.ajax.window();
								break;
						}
						break;
					default: 
						break;
				}
			},
			'drawTags': function( tags ) {				
				$.each(tags, function(){
					key = $.inArray( this.id, TM_Player.tags.ids )
					if(key >= 0) {
						TM_Player.tags.original[this.id].counter++;
					}
					else {
						TM_Player.tags.original[this.id] = this
						TM_Player.tags.original[this.id].counter = 1
						TM_Player.tags.ids.push(this.id)		
					}
				})
				
				$.each(TM_Player.tags.ids, function(){
					tag = TM_Player.tags.original[this]
					var tag_content = TM_Player.config.options.tag_content.supplant(tag);
					
					if( $('.tag_id_'+tag.id).length ) {
						$('.tag_id_'+tag.id).data('weight', tag.counter)
						$('.tag_id_'+tag.id).html( tag_content )
					} else {
						$('<li class="tag_clickable tag_id_'+tag.id+'" data-id="'+tag.id+'" data-weight="'+tag.counter+'">' + tag_content + '</li>').appendTo('#tags');
					}
				})
				
				if (TM_Player.tags.ids.length > 0) {
					$(function(){ $('#tags_block').show(); });
				} else {
					$(function(){ $('#tags_block').hide(); });
				}
			}
		},
		'web' : {
			'sessionStart' : function(data) {},
			'playerClose' : function(callback) {},
			'getSession' : function(data) {
				
				TM_Player.session_data = jQuery.extend(TM_Player.params, data);
				TM_Player.config.player.width = $('.left-block').width();
				TM_Player.config.player.height = $('.left-block').find('.b-flash-player').height();
				try {
					switch (data.status) {
						case 'wait':

							TM_Player.common.changeStatus('wait');
							setTimeout("TM_Player.anchors.reload()", TM_Player.timers.anchors_web);
							if (TM_Player.config.player.status != 'countdown' && data.time && !TM_Player.config.isIpad && !TM_Player.config.isIphone)
								TM_Player.countdown.init(data);
							else if(TM_Player.config.player.status != 'countdown' && data.time && (TM_Player.config.isIpad || TM_Player.config.isIphone))
								TM_Player.countdown.i_init(data);
							else
								TM_Player.common.showMessage(TM_Player.config.options.messages.warning, TM_Player.config.options.messages.not_avaliable);

							break;
						case 'ok':
			                if (data.startAt == 0 && !data.file)
			                	TM_Player.config.live = true;
	
			                TM_Player.callbacks.web.sessionStart(data);
			                
			                if (TM_Player.config.isIpad) {
			                	TM_Player.initIpadPlayer(data);		                	
			                } else if(TM_Player.config.isIphone) {
			                	TM_Player.initIphonePlayer(data);
			                } else if(TM_Player.common.isSilverlight()) {
								TM_Player.initSilverlightPlayer(data);
							} else {	
								last = Global.cookie.get('adlast')
								last = (last) ? last : 0;
								currentTime = new Date().getTime();
								
								if( data.ad_preroll != null && ( last + TM_Player.advert.timeout*1000 ) < currentTime && TM_Player.flash_object === false )   {
									TM_Player.initAds( data );
									TM_Player.data_tmp = data;
								} else {
									TM_Player.initPlayer(data);
								}
			                }
			                
			                TM_Player.anchors.reload();
	
							break;
						default: 
							TM_Player.common.showMessage(TM_Player.config.options.messages.error, TM_Player.config.options.messages.server_error);
							return false;
							break;
					}
				} catch(e) {
					if (TM_Player.config.options.debug)
						console.log(e);
				}
			},
			'getAnchors' : function(data) {
				if (!data || data.result == "error") {
					TM_Player.common.changeStatus('wait');
					setTimeout("TM_Player.getSession()", TM_Player.timers.anchors_web);
					TM_Player.common.showMessage(TM_Player.config.options.messages.error, TM_Player.config.options.messages.server_error);
					return false;
				}
				
				var anchors_count = 0;
				var xml = '';
				var tags = []
				$.each(data, function(i) {
					switch (this.type) {
						case 'begin':
							if (TM_Player.config.player.status == 'wait' || TM_Player.config.player.status == 'countdown') {
								clearTimeout(TM_Player.config.anchorsreload_timer);

								TM_Player.getSession();
							}
							break;
						case 'end':

							if (TM_Player.config.player.status == 'play')
								TM_Player.player.setEnding(this.time);

							break;
						case 'default':
							if (this.status == 'deleted') {
								$("#episode_" + this.id).slideUp('slow');
								//delete slide
								break;
							}
							else
								xml += '<bm id=\''+this.id+'\'>'+this.time+'</bm>';
									
							var anchor = $("#episode_" + this.id);
							var slide = $("#slide_" + this.id);

							var date = new Date(this.time * 1000);
							this.hour = TM_Player.common.formatTime(date.getHours()); 
							this.minute = TM_Player.common.formatTime(date.getMinutes());
						
							var anchor_content = TM_Player.config.options.anchor_content.supplant(this);
							
							var data_tag = ''
							if(TM_Player.config.options.show_tags && this.tags) {
								var local = []
								$.each(this.tags, function() {
									tags.push(this)
									local.push(this.id)
								})
								data_tag = 'data-tags="'+ local.implode(',') +'"'
							}
							
							if (!anchor.size()) {
								if(TM_Player.config.options.anchor_slide)
									$('<li class="epilist_'+ this.id +'" id="episode_' + this.id + '" '+ data_tag +'>' + anchor_content + '</li>').appendTo('#episodes').attr('rel', this.updated).slideDown('slow');
								else
									$('<li class="epilist_'+ this.id +'" id="episode_' + this.id + '" '+ data_tag +'>' + anchor_content + '</li>').appendTo('#episodes').attr('rel', this.updated);
							}
							else if (anchor.attr('rel') != this.updated) {
								anchor.html(anchor_content).attr('rel', this.updated);
							}
							
							if (!slide.size()) {
								cls = (this.slide) ? '' : 'empty';
								lang = (TM_Player.params.language == 'ru' || TM_Player.params.language == 'rusur') ? 'ru' : 'en'
								this.slide = (this.slide) ? this.slide : '/public/images/default-slide-'+ lang +'.png';
								
								sl = $('<img class="slide epilist_'+ this.id +' '+ cls +'" id="slide_' + this.id + '" src="'+ this.slide +'" href="#time'+ this.time +'" onclick="TM_Player.anchors.select('+ this.id +', \''+ this.time +'\');">').appendTo('#presentation').attr('rel', this.updated);
								if( anchors_count == 0 )
									sl.fadeIn('slow').addClass('active')
							}
							else if (slide.attr('rel') != this.updated) {
								cls = (this.slide) ? slide.removeClass('empty') : slide.addClass('empty');
								lang = (TM_Player.params.language == 'ru' || TM_Player.params.language == 'rusur') ? 'ru' : 'en'
								this.slide = (this.slide) ? this.slide : '/public/images/default-slide-'+ lang +'.png';
								slide.attr({
									'src': this.slide,
									'rel': this.updated
								})
							}
										
							anchors_count = anchors_count + 1;
							break;
					}
				});
				TM_Player.callbacks.player.drawTags( tags );
				
				
				xml = (xml) ? xml : '<bm></bm>';
				TM_Player.anchors.bookmarks = '<?xml version="1.0" encoding="utf-8"?><bms>'+xml+'</bms>';
				if (TM_Player.config.player.status == 'play')
                   TM_Player.anchors.update();

				if (anchors_count > 0) {
					$(function(){
						$('#episodes_block').show();
						$('#description_block').hide();
	
						if (TM_Player.config.player.status == 'play' && TM_Player.config.live)
							$('#episodes').scrollTo('100%', 800);
					});
				} else {
					$(function(){
						$('#episodes_block').hide();
					});
				}
			}
		}
	},
	'closePlayer' : function() {
		
		TM_Player.player.pause();
		
		clearTimeout(TM_Player.config.anchorselect_timer);
		clearTimeout(TM_Player.config.anchorsreload_timer);
		
		swfobject.removeSWF('flash-' + TM_Player.config.container);
		
		$('#' + TM_Player.config.container + '_wrapper').html('<div id="' + TM_Player.config.container + '"></div>');
		TM_Player.common.changeStatus('closed');
		
		TM_Player.callbacks.web.sessionClose();
	},
	'initIpadPlayer' : function(data) {
		if(data.file_url)
			$('.b-video-player__quality').show()
		var html = TM_Player.common.getiOSPlayer(data, 'ipad');
		$('#' + TM_Player.config.container).html(html);
	},
	'initIphonePlayer' : function(data) {
		if(data.file_url)
			$('.b-video-player__quality').show()
		var html = TM_Player.common.getiOSPlayer(data, 'iphone');
		$('#' + TM_Player.config.container).html(html);
	},
	'initSilverlightPlayer' : function(data) {
		var getSilverlightMethodCall = "javascript:Silverlight.getSilverlight(\"4.0.60310.0\");";
        var installImageUrl = "http://go.microsoft.com/fwlink/?LinkId=161376";
        var imageAltText = "Get Microsoft Silverlight";
        var altHtml = "<div align='center'><a target='_blank' href='{1}' style='text-decoration: none;'>" +
            "<img src='{2}' alt='{3}' " +
            "style='border-style: none; margin-top:-20px'/></a><div>";
        altHtml = altHtml.replace('{1}', getSilverlightMethodCall);
        altHtml = altHtml.replace('{2}', installImageUrl);
        altHtml = altHtml.replace('{3}', imageAltText);
		
		var logo = data.logo ? data.logo : '';
		if(data.logoLeft || data.logoRight)
			logo = (data.logoRight) ? data.logoRight : data.logoLeft;
		
		var stream_url = 'http://80.249.134.100:1935/' + data.channel_id + '/' + data.channel_id + '.stream/Manifest';
		
		if (TM_Player.config.options.debug)
			console.log("state=" + data.state + ", ratio=" + data.ratio + ", stream_url=" + stream_url + ", logo_url=" + logo);

		Silverlight.createObjectEx({
           	source: "/public/player/silverlight/SilverlightPlayer.xap",
           	parentElement: document.getElementById('tmPlayer'),
            id: "silver",
            properties: {
                width: "100%",
				height: "100%",
				background: "black",
				alt: altHtml,
				isWindowless: "true",
                version: "2.0.31005.0"
            },
            events: { onError: onSLError },
			initParams: "state=" + data.state + ", ratio=" + data.ratio + ", stream_url=" + stream_url + ", logo_url=" + logo
		});				
	},
	'initPlayer' : function(data) {
		try {
			var time = TM_Player.common.getHashTime();
			if( time )
				TM_Player.forcedParams.player.startAt = time;
				
			var params = jQuery.extend(this.config.player, data);
			var params = jQuery.extend(params, this.forcedParams.player);

			var addictedParams = this.addictedParams.player;
			
			TM_Player.config.timeFrom = params.timeFrom;
			TM_Player.config.timeTo = (params.timeTo) ? params.timeTo : Math.round((new Date()).getTime() / 1000);
			
			if(addictedParams.timeFrom && (addictedParams.timeFrom > TM_Player.config.timeFrom && (params.timeTo && addictedParams.timeFrom < params.timeTo) ))
			{
				params.timeFrom = addictedParams.timeFrom;
				TM_Player.config.timeFrom = params.timeFrom;
				params.startAt = params.timeFrom;
			}
			if(addictedParams.timeTo && (addictedParams.timeTo > TM_Player.config.timeFrom && (params.timeTo && addictedParams.timeTo < params.timeTo) ))
			{
				params.timeTo = addictedParams.timeTo;
				TM_Player.config.timeTo = params.timeTo;
			}
			if(addictedParams.startAt && (addictedParams.startAt > TM_Player.config.timeFrom && ( (params.timeTo > 0 && addictedParams.startAt < params.timeTo) ||  params.timeTo == 0) ))
			{
				params.startAt = addictedParams.startAt;
				TM_Player.config.startAt = params.startAt;
			}
			
			params.bgcolor = this.config.player.bgcolor;
			params.styles_path = this.config.options.player_path + data.styles_path + 'styles.swf';
			params.dispatchState = "1";
			params.timezone = -parseInt((new Date().getTimezoneOffset())/60);
			
			if(TM_Player.config.options.messages.streamer_error)
				params.messageDisconnect = TM_Player.config.options.messages.streamer_error;
			
			switch (this.params.language) {
				case 'en':
				case 'english':
					params.language =  "english";
					params.locale =  "english";
					break;
				default:
					params.language =  "russian";
					params.locale =  "russian";
					break;
			}
			
			var swf = 'rtmpPlayer.swf';
			
			if( $('#preview_thumb').length ) {
				TM_Player.player.SetPreview();	
			}

			if (params.audio_only) {
				params.channel = params.channel_id + "/live/russian audio";
                params.server = "rtmp://87.245.207.13:1935";
			}
			
			if( params.ad_banner ) {
				max_priority = 0, index = 0;
				for(var i=0; i < params.ad_banner.length; i++) 
					params.ad_banner[i].priority *= Math.random();
				for(var i=0; i < params.ad_banner.length; i++) 
					if( max_priority < params.ad_banner[i].priority ) {
						index = i; 
						max_priority = params.ad_banner[i].priority;
					}
				adv = params.ad_banner[index];
				
				Openstat.advert.id = adv.id;
				Openstat.advert.type = 'overlay';
				Openstat.adv.init();
				Openstat.adv.ready();
				
				TM_Player.advert.dataBanner = adv;
				TM_Player.player.reloadAd(adv.ad_title, adv.ad_img, adv.ad_txt, adv.ad_link, adv.ad_delay, adv.ad_type);
			}
			
			if(TM_Player.timers.server_timestamp)
			{
				params.startAt = 0;
				params.timePsLive = TM_Player.timers.server_timestamp - TM_Player.timers.psLive_delta;
			}
				
			if (params.file_url) {
				TM_Player.config.isFile = true;
				swf = 'flvPlayer.swf';
				params['file_url'] = params.file_url;
				if (params.timeFrom) {
					params['timeOffset'] = params.timeFrom;
					params['timestamp'] = params.startAt;
				}
			}
			if(this.flash_object)
			{
				swfobject.removeSWF('flash-' + TM_Player.config.container);
				$('#' + TM_Player.config.container + '_wrapper').html('<div id="' + TM_Player.config.container + '"></div>');
			}
			
			var flashparams = {bgcolor: this.config.player.bgcolor, allowScriptAccess: "always", allowFullScreen: "true", wmode: "transparent"};
			this.flash_object = new SWFPlayer(this.config.container, params, flashparams, this.config.options.player_path + data.player_path + swf+ "?rand=" + Math.random(), '',function(e){alert(e.success);});
			
			if(swfobject.getFlashPlayerVersion().major == 0 || swfobject.getFlashPlayerVersion().major == null || swfobject.getFlashPlayerVersion().major == undefined)
				$('#no_flash_player').show();
			
			TM_Player.common.changeStatus('loaded');
		} catch(e) {
			TM_Player.common.showMessage(TM_Player.config.options.messages.error, TM_Player.config.options.messages.server_error);
		}
	},
	'initAds' : function( data ) {		
		pl_container = $('#' + this.config.container)
		pl_container.parent().append( '<div class="adv_wrapper"><div id="'+ this.config.adv_container +'"></div></div>' )
		ad_con = $('#' + this.config.adv_container)
		ad_con.parent().width( '100%' ).height( '100%' )
		
		var xiSwfUrlStr = "expressInstall.swf";
		var swfVersionStr = "11.1.0";
        var flashvars = {};
		
		max_priority = 0, index = 0;
		for(var i=0; i < data.ad_preroll.length; i++) 
			data.ad_preroll[i].priority *= Math.random();
		for(var i=0; i < data.ad_preroll.length; i++) 
			if( max_priority < data.ad_preroll[i].priority ) {
				index = i; 
				max_priority = data.ad_preroll[i].priority;
			}
		
		adv = data.ad_preroll[index];
		TM_Player.advert.data = adv;
		flashvars.delay = adv.delay;
		flashvars.stream = adv.file;
		if( adv.volume ) flashvars.volume = adv.volume;
		if( adv.logo ) flashvars.logo = adv.logo;
		flashvars.locale = (TM_Player.params.language == 'ru') ? 'rus' : 'eng';
		
		Openstat.advert.id = adv.id;
		Openstat.advert.type = 'pre-roll';
		Openstat.adv.init();
		Openstat.adv.ready();
		Openstat.adv.play();
		
		var params = {};
		params.quality = "high";
        params.bgcolor = "#000000";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "true";
		
		TM_Player.adv_object = new SWFPlayer(this.config.adv_container, flashvars, params, "/public/player/default_debug/DigicastAd.swf", '',function(e){alert(e.success);});
	},
	'player': {
		'setEnding' : function(time) {
			if (!TM_Player.flash_object)
				return false;

			if (TM_Player.config.player.timeTo === time)
				return false;
			
			if (time != 0)
				TM_Player.config.live = false;

			if (TM_Player.config.options.debug)
				console.log('flash_object setEnding: "' + time + '"');

			TM_Player.config.player.timeTo = time;

			return TM_Player.flash_object.set_Ending(time);	
		},
		'play' : function(time) {
			if (!TM_Player.flash_object)
				return false;

			TM_Player.common.changeStatus('play');
			
			return TM_Player.flash_object.play();
		},
		'pause' : function(time) {
			if (!TM_Player.flash_object)
				return false;

			TM_Player.common.changeStatus('pause');
			
			return TM_Player.flash_object.play();
		},
		'reloadAd' : function(title, image, message, link, delay, type) {
			if (!TM_Player.flash_object || TM_Player.config.player.status != 'play')
				return setTimeout('TM_Player.player.reloadAd("' + title + '", "' + image + '", "' + message + '", "' + link + '", "' + delay + '", "'+ type +'")', 1000);
			
			return TM_Player.flash_object.reload_ad(title, image, message, link, delay, type);
		},
		'setTime' : function(time) {
			if (!TM_Player.flash_object)
				return false;
			
			if (TM_Player.config.options.debug)
				console.log('flash_object setTime: "' + time + '"');
			
			return TM_Player.flash_object.set_playhead_position(time);
		},
		'setChannel' : function(channel_id, beginning, ending, go_offset) {
			if (!TM_Player.flash_object)
				return false;
			
			if (TM_Player.config.options.debug)
				console.log('flash_object setChannel: "' + channel_id +', ' + beginning +', ' + ending +', ' + go_offset + '"');
			
			return TM_Player.set_channel_id_and_playhead_position(time);
		},
		'getCurrentBookmarkID' : function() {
			if (!TM_Player.flash_object)
				return false;
			
			if (TM_Player.config.options.debug)
				console.log('flash_object getCurrentBookmarkID');
			
			return TM_Player.flash_object.get_CurrentBookmarkID();
		},	
		'ReloadBookmarks' : function() {
			if (!TM_Player.flash_object)
				return false;
				
			if(TM_Player.anchors.bookmarks && TM_Player.config.player.status == 'play' && TM_Player.anchors.bool_update !== TM_Player.anchors.bookmarks)
			{
				if (TM_Player.config.options.debug)
					console.log('flash_object ReloadBookmarks');
				TM_Player.anchors.bool_update = TM_Player.anchors.bookmarks;
				return TM_Player.flash_object.ReloadBookmarks("'"+TM_Player.anchors.bookmarks+"'");
			}
			else
				setTimeout("TM_Player.player.ReloadBookmarks()", TM_Player.timers.bookmark);
		},
		'SetPreview' : function() {
			if(TM_Player.flash_object && TM_Player.config.player.status != 'countdown') {
				position = parseInt( TM_Player.flash_object.get_playhead_position() );
				console.log("Position:" + position);
				if(position > 0)
				{
					date = new Date(position*1000);
					
					year = date.getUTCFullYear();
					
					month = date.getUTCMonth() + 1;
					if(month < 10) month = '0' + month;
					
					day = date.getUTCDate();
					if(day < 10) day = '0' + day;
					
					hour = date.getUTCHours();
					if(hour < 10) hour = '0' + hour;
					
					minutes = date.getUTCMinutes();
					if(minutes < 10) minutes = '0' + minutes;
					
					seconds = date.getUTCSeconds();
					if(seconds < 10) seconds = '0' + seconds;
					
					str = year +'/'+ month +'/'+ day +'/'+ hour +'/'+ minutes +'_'+ seconds;
					console.log("Time is :" + str);
					
					thumb = $('#preview_thumb img');
					full = $('#preview_full');
					t_h = thumb.height();
					t_w = thumb.width();
					f_h = full.height();
					f_w = full.width();
					
					thumb.attr('src', 'http://screenshots.telemarker.ru/screenshot-tm/do-main-4/' + str + '_' + t_w +'x'+ t_h +'.jpg');
					full.css({
							'background-image' : 'url(http://screenshots.telemarker.ru/screenshot-tm/do-main-4/' + str + '_1280x720.jpg)',
							'background-position' : -parseInt( (1280-f_w)/2 ) +'px -'+ parseInt( (720-f_h)/2 ) +'px'
						});
				}
			}
			setTimeout("TM_Player.player.SetPreview()",TM_Player.timers.reloadPreview);
		}
	},
	'getSession' : function() {
		if (this.config.player.status == "countdown") {
			if(TM_Player.config.isIpad || TM_Player.config.isIphone)
			{
				TM_Player.countdown_object.countdown('destroy');
				$('#'+TM_Player.config.container).removeClass('countdown');
				TM_Player.countdown_object = false;
			}
			else
			{
				swfobject.removeSWF('flash-' + TM_Player.config.container + "-countdown");
				$('#' + TM_Player.config.container + '_wrapper').html('<div id="' + TM_Player.config.container + '"></div>');
			}
		}
		
		//sum = jQuery.parseJSON(this.config.sum);
		//this.params.sum = sum[this.params.language +'_'+ this.params.quality];
		this.params.referer = TM_Player.config.referer;
		this.params.player_template = TM_Player.config.player.template;
		this.params.alias = TM_Player.config.alias;
		
		this.common.changeStatus('getsession');
		TM_Player.ajax.session = $.getJSON(this.config.options.fetch_path + '/session_' + this.params.translation_id + '_' + this.params.language + '_' + this.params.quality + '.json', this.params, TM_Player.callbacks.web.getSession)
		.error( function(){
			 TM_Player.countdown.init({time:5, language:TM_Player.params.language});
			 setTimeout("TM_Player.getSession()", TM_Player.timers.anchors_web); 
		});
	},
	'anchors': {
		'update' : function() {
			if (TM_Player.config.options.longterm_anchors) {
				var currentbookmark = TM_Player.player.getCurrentBookmarkID();
	    		jsChangeBookmark(currentbookmark);
			}
		},
		'select' : function(id, time) {
	        if (TM_Player.config.player.status != 'play')
                return false;
	        
			if (TM_Player.config.options.debug)
				console.log('select episode: "' + id + '", time: "' + time + '"');

	        $('#episodes li').removeClass('active');
	        $('#episode_' + id).addClass('active');

			Openstat.functions.setVidt( TM_Player.flash_object.get_playhead_position(), 'session' );
			Openstat.session.vid_hl = id;
			Openstat.ajax.seek();

	        TM_Player.player.setTime(time);
		},
		'reload' : function() {
			if( (TM_Player.flash_object && TM_Player.flash_object.get_player_state() != 'paused') || ( TM_Player.config.ipadVersionEnabled && (TM_Player.config.isIpad || TM_Player.config.isIphone) ) || TM_Player.config.player.status == 'countdown' )
			{
				show_tags = (TM_Player.config.options.show_tags) ? 1 : '';
				TM_Player.ajax.anchors = $.getJSON(TM_Player.config.options.fetch_path + '/anchors_' + TM_Player.params.translation_id + '_' + TM_Player.params.language + '_' + TM_Player.params.quality + '.json', {rand: Math.random(), referer : TM_Player.config.referer, show_tags : show_tags}, TM_Player.callbacks.web.getAnchors)
				.error( function(){ setTimeout("TM_Player.anchors.reload()", TM_Player.timers.anchors_web - (TM_Player.common.getRandomNumber(3)*1000)); } );
			}
			
			setTimeout("TM_Player.player.ReloadBookmarks()", TM_Player.timers.bookmark);
			
			if (TM_Player.config.live || TM_Player.config.player.status == 'wait' || TM_Player.config.player.status == 'countdown')
				TM_Player.config.anchorsreload_timer = setTimeout("TM_Player.anchors.reload()", TM_Player.timers.anchors_web - (TM_Player.common.getRandomNumber(3)*1000));
			
		},
		'setNoRelevant' : function(){
			$('#episodes li').each(function(){
				$(this).attr('rel', 0);
			});
			$('#presentation img').each(function(){
				$(this).attr('rel', 0);
			});
		}
	},
	// @constructor
	'init': function() {
		if ('object' == typeof this.config.container) {
			this.container = $(this.config.container);
		} else {
			this.container = $('#' + this.config.container);
		}

		if (!this.container) 
			alert('Не могу найти объект для загрузки плеера');

		if (typeof(console) === 'undefined' || console == null)
			TM_Player.config.options.debug = false;

		this.config.isIpad = this.common.isIpad();
		this.config.isIphone = this.common.isIphone();
		this.anchors.bool_update = false;
		
		if(TM_Player.timers.server_timestamp)
			TM_Player.common.serverTime();
		
		if (!this.common.domainValid())
			TM_Player.common.showMessage(TM_Player.config.options.messages.error, TM_Player.config.options.messages.server_error);
		
		if (this.config.options.debug) {
			this.timers.anchors_web = 5000;
			this.timers.anchors_player = 5000;
		}
		
		try {
			this.getSession();
		} catch(e) {
			TM_Player.common.showMessage(TM_Player.config.options.messages.error, TM_Player.config.options.messages.server_error);
			return false;
		}

		return true;
	},
	'countdown': {
		'init' : function(data) {

			if (TM_Player.config.options.debug)
				console.log("Init countdown time: " + data.time);
		
			TM_Player.common.changeStatus('countdown');
			
			var seconds = TM_Player.config.options.seconds;
			var params = {wait : data.time, seconds : seconds, coverURL : "/public/player/Countdown-background.jpg", bgcolor: TM_Player.config.player.bgcolor};
			var flashparams = {bgcolor: TM_Player.config.player.bgcolor, allowScriptAccess: "always", allowFullScreen: "true", wmode: "transparent"};
			
			if (typeof(data.countdown_image) !== 'undefined')
				params.coverURL = data.countdown_image;

			switch (data.language) {
				case 'tur':
				case 'esp':
				case 'fr':
				case 'ch':
				case 'en':
				case 'english':
					params.locale =  "english";
					break;
				default:
					params.locale =  "russian";
					break;
			}
			
			if(!TM_Player.countdown_object)
			{
				TM_Player.countdown_object = swfobject.embedSWF(TM_Player.config.options.player_path + '/Countdown.swf', TM_Player.config.container, "100%", "100%", "10.0.0",
																	null, params, flashparams, {id: TM_Player.config.container + "-countdown", name: TM_Player.config.container + "-countdown"});
			}
			else
				TM_Player.countdown.setTime(data.time);
		},
		'i_init' : function(data) {

			if (TM_Player.config.options.debug)
				console.log("Init countdown time: " + data.time);
		
			TM_Player.common.changeStatus('countdown');
			$('#'+TM_Player.config.container+' table:first-child').hide();
			
			if(!TM_Player.countdown_object)
			{
				layout = (data.time/(60*60*24) > 1) ? '<table class="countdown_row"><tr class="countdown_show countdown_amount">'+
						 '<td>{dn}</td> <td class="delimeter"></td> <td>{hn}</td> <td class="delimeter"><span>:</span></td> <td>{mn}</td> <td class="delimeter"><span>:</span></td> <td>{sn}</td>'+
					'</tr><tr class="countdown_section">'+
						 '<td>{dl}</td> <td></td> <td>{hl}</td> <td></td> <td>{ml}</td> <td></td> <td>{sl}</td>'+
					'</tr></table>' : '<table class="countdown_row"><tr class="countdown_show countdown_amount">'+
						 '<td>{hn}</td> <td class="delimeter"><span>:</span></td> <td>{mn}</td> <td class="delimeter"><span>:</span></td> <td>{sn}</td>'+
					'</tr><tr class="countdown_section">'+
						 '<td>{hl}</td> <td></td> <td>{ml}</td> <td></td> <td>{sl}</td>'+
					'</tr></table>';
				
				var seconds = ( data.time/(60*60*24) >= 1 ) ? 4 : 3;
				$('<div></div>').appendTo('#'+TM_Player.config.container).countdown({
					until: +data.time,
					description: TM_Player.config.options.messages.until_start,
					format: 'dHMS',
					layout : '<span class="countdown_row countdown_descr">{desc}</span>' + layout,
					tickInterval : 180,
					onExpiry : TM_Player.countdown.callbacks.finishWait,
					significant: seconds
				});
				$('#'+TM_Player.config.container).addClass('countdown');
				TM_Player.countdown_object =  $('.hasCountdown');
			}
			else
				TM_Player.countdown.setTime(data.time);
		},
		'setTime' : function(time) {
			if (TM_Player.config.player.status != "countdown" || !TM_Player.countdown_object)
				return false;

			if (TM_Player.config.options.debug)
				console.log("Set countdown time: " + time);
			
			if(TM_Player.config.isIpad || TM_Player.config.isIphone)
				TM_Player.countdown_object.countdown('change', {until: +time});
			else
				TM_Player.countdown_object.fpSetWait(time);
		},
		'callbacks': {
			'finishWait' : function(data) {
				if (TM_Player.config.options.debug)
					console.log("FinishWait callback");

				TM_Player.getSession();
			}
		}
	},
	'common': {
		'showMessage' : function(title, description) {
			if (TM_Player.config.options.debug)
				console.log("TM_Player throwed error: " + description);

			$('#' + TM_Player.config.container + '_wrapper').html('<div id="' + TM_Player.config.container + '"><table style="margin: auto;margin-top: 90px;"><tr><td class="stub" style="padding:10px;border: 1px solid #222;"><h2>' + title + '</h2> ' + description + '</td></tr></table></div>');
		},
		'domainValid' : function() {
			if (window.location.hostname != TM_Player.config.domain)
				return false;

			return true;
		},
		'getHashTime' : function() {
			var hash = document.location.hash;
			hash = hash.replace("#time",'');
			
			if (hash)
				return hash;
			else
				return false;
		},
		'changeStatus' : function(status) {
			if (TM_Player.config.options.debug)
				console.log('Player status changed to "' + status + '"');

			TM_Player.config.player.status = status;
		},
		'formatTime': function(time) {
			  if (time < 10)
			    time = "0" + time;

			  return time;
		},
		'readableFileSize': function(size) {
		    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		    var i = 0;
		    while(size >= 1024) {
		        size /= 1024;
		        ++i;
		    }
		    return size.toFixed(1) + ' ' + units[i];
		}, 
		'isIpad': function() {
            if (TM_Player.config.ipadVersionEnabled == true && navigator.userAgent.match(/iPad/i) != null)
				return true;
			
			return false;
		},
		'isIphone': function() {
            if (TM_Player.config.iphoneVersionEnabled == true && navigator.userAgent.match(/iPhone/i) != null)
				return true;
			
			return false;
		},
		'isSilverlight': function() {
			if(TM_Player.config.player.template == 'silverlight')
				return true;
				
			return false;
		},
		'getiOSPlayer': function(data) {
			var video_src = false;
			var poster = "";
			
			if (data.coverURL)
				poster = data.coverURL;
			
			if (data.file_url) {
	            video_src = data.file_url;
			} else if (data.channel_id) {
				var channel = data.channel_id;
				
			    channel = channel.replace("-sd", "");
			    channel = channel.replace("-hd", "");

			    channel = channel.replace("_sd", "");
			    channel = channel.replace("_hd", "");
	
			    channel = channel.replace(new RegExp('^do-main$'), 'do-main-ru-1');
			    channel = channel.replace(new RegExp('^do-main-2$'), 'do-main-ru-2');
			    channel = channel.replace(new RegExp('^do-main-4$'), 'do-main-ru-1');
			    
			    channel = channel.replace(new RegExp('^do-main-1$'), 'do-main-en-1');
		  	    channel = channel.replace(new RegExp('^do-main-3$'), 'do-main-ru-2');
		        channel = channel.replace(new RegExp('^do-main-5$'), 'do-main-en-1');
		        
			    channel = channel.replace(new RegExp('^do-main-6$'), 'do-main-sur-1');
			    channel = channel.replace(new RegExp('^do-main-8$'), 'do-main-sur-1');
			    
			    channel = channel.replace(new RegExp('^do-main-7$'), 'do-main-en-2');
			    channel = channel.replace(new RegExp('^do-main-9$'), 'do-main-en-2');
		        
		        //video_src = TM_Player.params.streamer_ios + '/' + channel + '.m3u8';
				video_src = TM_Player.params.streamer_ios + '?cid=' + channel;
		        
		        var now = Math.round((new Date()).getTime() / 1000);
					
		        if (data.timeFrom && data.timeTo && data.timeTo <= now) {
					diff = 	data.timeTo - data.timeFrom;
					part_size = 60*60*4;
					count = diff / part_size;
					
					from = data.timeFrom;
					to = data.timeTo;
					
					if(count <= 1)
						//video_src = TM_Player.params.streamer_ios + '/' + channel + '/' + data.timeFrom + '-' + data.timeTo + '.m3u8';
						video_src = video_src + '&since='+ from +'&till='+ to;
						//video_src = video_src + '&ts='+ from +'-'+ to;			
					else {
						//video_src = TM_Player.params.streamer_ios + '/' + channel + '/' + from + '-' + (from + part_size) + '.m3u8';
						video_src = video_src + '&since='+ from +'&till='+ (from + part_size);
						//video_src = video_src + '&ts='+ from +'-'+ (from + part_size);	
						
						$('.b-video-player__quality').hide().html('Части: ')
						for(var i = 0; i < count; i++) {
							//data_src = TM_Player.params.streamer_ios + '/' + channel + '/' + (from + part_size*i) + '-' + ( ((from + part_size*(i+1)) > to ) ? to : (from + part_size*(i+1))) + '.m3u8';
							data_src = TM_Player.params.streamer_ios + '?cid=' + channel + '&since=' + (from + part_size*i) + '&till=' + ( ((from + part_size*(i+1)) > to ) ? to : (from + part_size*(i+1)));
							//data_src = TM_Player.params.streamer_ios + '?cid=' + channel + '&ts=' + (from + part_size*i) + '-' + ( ((from + part_size*(i+1)) > to ) ? to : (from + part_size*(i+1)));
							$('.b-video-player__quality').append('<span><a href="#" class="ios_part '+ ( (i==0)? 'active' : '' ) +'" data-src="'+ data_src +'">'+ (i+1) +'</a></span>')
						}
						$('.b-video-player__quality').show()
					}
						
				} 
			}
	        
	        return '<video controls poster="' + poster + '" apple-group="video" src="' + video_src + '"></video>';
		},
		'getRandomNumber': function(max) {
			return Math.floor( Math.random( ) * (max+1) );
		},
		'serverTime': function(){
			setInterval(function(){ TM_Player.timers.server_timestamp++; },1000);
		}
	}
};

Global = {
	cookie: {
		get: function(name) {
			cookie_name = name + "=";
			cookie_length = document.cookie.length;
			cookie_begin = 0;
			while (cookie_begin < cookie_length) {
				value_begin = cookie_begin + cookie_name.length;
				if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
					var value_end = document.cookie.indexOf(";", value_begin);
					if (value_end == -1) {
						value_end = cookie_length;
					}
					return unescape(document.cookie.substring(value_begin, value_end));
				}
				cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
				if (cookie_begin == 0) {
					break;
				}
			}
			return null
		},
		set: function(name, value, expires) {
			if (!expires) {
				expires = new Date();
			}
			document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString();
		},
		'remove': function(name, path, domain) {
			if (get_cookie(name)) document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}

	}	
}

User = {
	vr : {
		messages : {
			goto : 'Перейти на указанное время',
			addedSoon : 'Комментарий успешно добавлен и скоро появится.',
			emptyComment : 'Необходимо ввести комментарий.',
			onPlaySendError : 'Комментарий можно отправлять только во время воспроизведения.'
		},
		timeline : {
			getTimer : null,
			timeToGet : 10000,
			timeToScroll : 1000,
			timeToGetWait : 400,
			smashTime : 60,
			tmpl : '<div class="comment comment{hash} commentid{id}" data-t="{timestamp}"><table width="100%">'+
						'<tr>'+
							'<td class="photo"><img src="{userPhoto}"></td>'+
							'<td class="box"><p class="margin-bottom-5"><strong><a href="{userUrl}" class="name" target="_blank">{userName}</a></strong></p><p>{message}</p>'+
							'<a href="#" title="{goTo}" class="pull-right timelink" onClick="TM_Player.flash_object.set_playhead_position({timestamp}); return false;">{time}</a>'+
							'</td>'+
						'</tr>'+
					'</table></div>'
		}
	},
	gotToken : function(a) {
		$.getJSON('/login/oauth', {token: a}, function(data){
			if(data.error) {
				User.timeline.error('error', data.error)
				return false;	
			}
			auth = $('.timelinecomments .authenticated')
			auth.find('img').attr('src', data.photo)
			auth.find('img').attr('src', data.photo)
			auth.find('.name').attr({'href' : data.identity}).html(data.first_name +' '+ data.last_name)
			
			auth.removeClass('hidden')
			$('.timelinecomments .not_authenticated').addClass('hidden')
		})
	},
	logout : function(){
		$.getJSON('/login/logout', function(data){
			$('.timelinecomments .authenticated').addClass('hidden')
			$('.timelinecomments .not_authenticated').removeClass('hidden')
			Global.cookie.remove('PHPSESSID')
		})
	},
	timeline : {
		sendMessage : function(){
			message = $('.timelinecomments .authenticated textarea').val()
			if(!TM_Player.flash_object) {User.timeline.error('error', User.vr.messages.onPlaySendError); return false;}
			timestamp = TM_Player.flash_object.get_playhead_position()
			if(!message) {User.timeline.error('error', User.vr.messages.emptyComment); return false;}
			if(!timestamp) {User.timeline.error('error', User.vr.messages.onPlaySendError); return false;}
			$.getJSON('/ajax/timelinepostmessage', {message: message, session: TM_Player.params.translation_id, timestamp: timestamp}, function(data){
				if(data.error){User.timeline.error('error', data.error);return false;}
				User.timeline.error('success', User.vr.messages.addedSoon);
				$('.timelinecomments .authenticated textarea').val('')
			})
		},
		error : function(type, message){
			$('.timelinecomments .authenticated .message')
				.stop(true).removeClass().slideUp(0).addClass('message').addClass(type)
				.text(message).slideDown(200).delay( message.length*210 )
				.slideUp(200)
		},
		get : function(){
			if(typeof TM_Player.params.timeFrom == 'undefined') {
				clearTimeout(User.vr.timeline.getTimer); 
				setTimeout('User.timeline.get()', User.vr.timeline.timeToGetWait); 
				return false;
			}
			$.getJSON('/tm/timeline_'+ TM_Player.params.translation_id +'.json', {r : Math.random()}, function(data){
				if(data) User.callbacks.timeline.draw(data);
			})
			
			clearTimeout(User.vr.timeline.getTimer); 
			User.vr.timeline.getTimer = setTimeout('User.timeline.get()', User.vr.timeline.timeToGet);
		},
		init : function(){
			$('.authenticated textarea').attr('placeholder', $.trim($('.authenticated textarea').attr('placeholder')))
			$('.comments_list .inner').empty();
			User.timeline.get();
			User.callbacks.timeline.scroll();
			User.vr.timeline.timeToGet = Math.round(25 + Math.random()*10)*1000;
			User.vr.timeline.getTimer = setTimeout('User.timeline.get()', User.vr.timeline.timeToGet);
		}
	},
	callbacks : {
		timeline : {
			draw : function(data){				
				var firstTime = ($('.comments_list .inner div').length) ? false : true;
				changed = false; result = $('<div></div>'); dateObj = new Date();
				timeFrom = TM_Player.params.timeFrom.smash(User.vr.timeline.smashTime);
				
				obj_count = (data.data) ? data.data.length : 0;
				for(var d=0; d < obj_count; d++) {
					val = data.data[d];k = d;
					val.goTo = User.vr.messages.goto;
					user = data.users[val.userUrl]
					$.extend(val, user)
					
					if(!$('.commentid'+ val.id).length) {
						changed = true;
						val.hash = val.timestamp.smash(User.vr.timeline.smashTime);
						
						dateObj.setTime(val.timestamp*1000)
						val.time = dateObj.getHours().zeroFill(2) +':'+ dateObj.getMinutes().zeroFill(2) +':'+ dateObj.getSeconds().zeroFill(2)						
						
						if(firstTime) {
							result.append(User.vr.timeline.tmpl.supplant(val));
						}
						else {
							for(var i=val.hash; i >= timeFrom; i-=User.vr.timeline.smashTime)
								{comment = $('.comment'+ i); if(comment.length) break;}
							
							slave = $( User.vr.timeline.tmpl.supplant(val) ).hide()
							if(typeof comment != 'undefined' && comment.length) {
								if( i == val.hash )	{
									$.each(comment, function(){
										if( $(this).data('t') < val.timestamp ) {
											slave.insertBefore( $(this) ).animate({opacity:'show', height:'show'}, 400);
											return false;	
										}
									})	
								} else {
									slave.insertBefore( comment.first() ).animate({opacity:'show', height:'show'}, 400);	
								}
							} else 
								slave.appendTo( $('.comments_list .inner') ).animate({opacity:'show', height:'show'}, 400);	
						}
					} else
						$('.commentid'+ val.id).slideDown(1000)
				}
				if(data.banned)
				$.each(data.banned, function(k, id){
					$('.commentid'+ id.id).slideUp(1000)
				})
				
				if(firstTime) {
					$('.comments_list .inner').append(result)
					setTimeout(function(){$('.comments_list').data('timestamp', 0);}, 200)
				}						
			},
			scroll : function(){
				setTimeout("User.callbacks.timeline.scroll()", User.vr.timeline.timeToScroll);
				c_h = $('.comment_box').height(); b_h = $('.timelinecomments').height(); 
				$('.comments_list').css( {'height': b_h - c_h})
				if(!TM_Player.flash_object) return false;
				
				timestamp = TM_Player.flash_object.get_playhead_position().smash(User.vr.timeline.smashTime);
				timeFrom = TM_Player.params.timeFrom.smash(User.vr.timeline.smashTime);
				current = $('.comments_list').data('timestamp')
				if(timestamp > 0 && current != timestamp) {
					var comment;
					for(var i=timestamp; i >= timeFrom; i-=User.vr.timeline.smashTime)
						{comment = $('.comment'+ i).first(); if(comment.length) break;}
							
					if(comment && comment.length) {
						$('.comment').css('opacity', 0.2).removeClass('active')
						offset = $('.comments_list').scrollTop() + comment.position().top
						
						$('.comment'+ i).css('opacity', 1).addClass('active')
						$('.comments_list').animate({scrollTop: offset}, 950);
						$('.comments_list').data('timestamp', timestamp)
					}
				}
			}	
		}
	}
}

/* FLASH CALLBACKS */
function jsReady() {TM_Player.callbacks.player.jsReady();}
function jsChangeBookmark(id) {TM_Player.callbacks.player.jsChangeBookmark(id);}
function jsFinishWait() {TM_Player.countdown.callbacks.finishWait();} 
function jsSetShrink(status) {TM_Player.callbacks.player.jsSetShrink(status);}
function jsChangeStreamStatus(params) {TM_Player.callbacks.player.jsChangeStreamStatus(params);}
function onSLError (sender, args) {	TM_Player.common.showMessage(TM_Player.config.options.messages.error, TM_Player.config.options.messages.server_error);}
function jsGetPsLive(channel_id) {TM_Player.callbacks.player.jsGetPsLive(channel_id);}
function jsStatePlayer(params) {TM_Player.callbacks.player.statePlayer(params);}

function status(code) {TM_Player.callbacks.advert(code);}
function jsStateAd(status) {TM_Player.callbacks.banAdvert(status);}

/* CALLBACKS */
function gotToken(a) {User.gotToken(a);}

/* Exception handling */
function Error(title, description) {TM_Player.common.showMessage(title, description);}

String.prototype.supplant = function(obj) {
	return this.replace(/{([^{}]*)}/g,
		function(a, b) {
			var r = obj[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};
Array.prototype.implode = function(glue) {return ( ( this instanceof Array ) ? this.join ( glue ) : this );}
Number.prototype.smash = function(number) {return (this - this%number);}
Number.prototype.zeroFill = function(size){
	var n = Math.abs(this),
	zeros = Math.max(0, size - n.toString().length ),
	zeroString = Math.pow(10,zeros).toString().substr(1);
	if( this < 0 ) {zeroString = '-' + zeroString;}
	return zeroString+n;
}