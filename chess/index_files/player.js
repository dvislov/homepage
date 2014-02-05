$(function()
{
	$('.dd').hover( function(){$(this).addClass('dd_hover');}, function(){$(this).removeClass('dd_hover');});
	$('.dd').click(function(){$(this).toggleClass('dd_hover');})
	$('.dd__catlist a').click(function(){$('.dd').toggleClass('dd_hover');})
		
	$('#preview_thumb img').bind('mouseover mousemove', function(e){
		x = e.pageX - $(this).offset().left;
		y = e.pageY - $(this).offset().top;
		
		t_h = $(this).height()
		t_w = $(this).width()
		
		i_h = 720
		i_w = 1280
		
		f_h = $('#preview_full').height()
		f_w = $('#preview_full').width()
		
		allowed_x = t_w * (f_w/i_w) / 2
		allowed_y = t_h * (f_h/i_h) / 2
		
		offset_x = (i_w - f_w) * (x - allowed_x)/(t_w - allowed_x*2)
		offset_y = (i_h - f_h) * (y - allowed_y)/(t_h - allowed_y*2)
		
		if(x < allowed_x) offset_x = 0
		if(x > t_w - allowed_x) offset_x = i_w - f_w
		
		if(y < allowed_y) offset_y = 0
		if(y > t_h - allowed_y) offset_y = i_h - f_h
		
		$('#preview_full').css('background-position' , -parseInt( offset_x ) +'px -'+ parseInt( offset_y ) +'px')
	})
	
	$('.quality').click(function(){
	if(!$(this).hasClass('active') && TM_Player.adv_object === false ) {
		quality = $(this).attr('data')
		$('.quality.active').removeClass('active')
		$(this).addClass('active')
		TM_Player.params.quality = quality
		
		var now = Math.round((new Date()).getTime() / 1000);

		if(TM_Player.flash_object)
		{
			var state = TM_Player.flash_object.get_player_state()
			var state_play = (state = 'playing' || state == 'live') ? true : false;
			if(TM_Player.forcedParams.player.state == 'pause' && state_play)
				TM_Player.forcedParams.player.state = '';
			
			if(TM_Player.flash_object.get_playhead_position() && ( TM_Player.params.onlyLive == null && ( TM_Player.params.timeTo !== 0 && TM_Player.params.timeTo < now ) ) )
				TM_Player.forcedParams.player.startAt = TM_Player.flash_object.get_playhead_position()
			if(state_play && ( TM_Player.params.onlyLive == null && TM_Player.params.timeTo !== 0 ) )
				TM_Player.config.player.ajax_play = TM_Player.flash_object.get_playhead_position();
			else
				TM_Player.config.player.ajax_play = false;
				
			if(TM_Player.params.file_url)
				TM_Player.config.player.ajax_play = TM_Player.flash_object.get_playhead_position();
		}
		
		Openstat.params.bc_qlt = TM_Player.params.quality;
		
		TM_Player.init();

	}
	return false;
	})
	
	$('.language').click(function(){
	if(!$(this).hasClass('active') && TM_Player.adv_object === false ) {
		language = $(this).attr('data')
		$('.language.active').removeClass('active')
		$(this).addClass('active')
		
		TM_Player.tags.ids = []
		TM_Player.tags.original = []
		
		if($('#lang_ru')[0].tagName == 'DIV')
			if(language == 'ru' || language == 'rusur') $('#lang_ru').addClass('active')
			else $('#lang_ru').removeClass('active')
		
		var now = Math.round((new Date()).getTime() / 1000);
		
		if(TM_Player.flash_object)
		{
			var state = TM_Player.flash_object.get_player_state()
			var state_play = (state = 'playing' || state == 'live') ? true : false;
			if(TM_Player.forcedParams.player.state == 'pause' && state_play)
				TM_Player.forcedParams.player.state = '';

			if(TM_Player.flash_object.get_playhead_position() && ( TM_Player.params.onlyLive == null && ( TM_Player.params.timeTo !== 0 && TM_Player.params.timeTo < now ) ) )
				TM_Player.forcedParams.player.startAt = TM_Player.flash_object.get_playhead_position()
			if(state_play && ( TM_Player.params.onlyLive == null && TM_Player.params.timeTo !== 0 ) )
				TM_Player.config.player.ajax_play = TM_Player.flash_object.get_playhead_position();
			else
				TM_Player.config.player.ajax_play = false;
				
			if(TM_Player.params.file_url)
				TM_Player.config.player.ajax_play = TM_Player.flash_object.get_playhead_position();
		}
		
		Openstat.params.bc_lang = TM_Player.params.language;
		
		TM_Player.anchors.setNoRelevant()
		TM_Player.params.language = language
		TM_Player.init();
	}
	return false;
	})
	
	if(navigator.userAgent.match(/iPad/i) != null || navigator.userAgent.match(/iPhone/i) != null) {
		$('.b-video-player__quality').hide()
		$('.ios_part').live('click',function(){
			$('.ios_part').removeClass('active')
			$(this).addClass('active')
			$('#tmPlayer video').attr('src', $(this).data('src'))
		})
		
		$('#tmPlayer video').live('onended', function(){
			console.log('Play ended')
		})
	}
	
	$('.tags_reset').live('click', function(){
		$('#episodes_block h2').html('Эпизоды:')
		$('.tag_clickable').removeClass('active');
		$('#episodes li').removeClass('hidden');	
	})
	
	$('.tag_clickable').live('click', function(){
		var has = $(this).hasClass('active');
		var episodes = $('#episodes li');
		var tags = $('#tags li');
		
		if( has ) {
			$('#episodes_block h2').html('Эпизоды:')
			$(this).removeClass('active');
			$('#episodes li').removeClass('hidden');		
		} else {
			$('#episodes_block h2').html('Эпизоды  свыбранным тэгом: <a href="#" class="tags_reset" style="float:right">все эпизоды</a>')
			tags.removeClass('active');	
			$(this).addClass('active');
			id = String( $(this).data('id') )	
			
			$('#episodes li').each(function(){
				tags = String( $(this).data('tags') );
				tag = (tags) ? tags.split(',') : []
				if( $.inArray( id, tag ) >= 0 ) {
					$(this).removeClass('hidden')
				} else {
					$(this).addClass('hidden')
				}				
			})
		}
	})	
});