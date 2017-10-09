jQuery.noConflict();

jQuery(window).load(function(){
	var $featured_content = jQuery('#featured'),
		et_disable_toptier = jQuery("meta[name=et_disable_toptier]").attr('content'),
		et_featured_slider_pause = jQuery("meta[name=et_featured_slider_pause]").attr('content'),
		et_featured_slider_auto = jQuery("meta[name=et_featured_slider_auto]").attr('content'),
		et_featured_auto_speed = jQuery("meta[name=et_featured_auto_speed]").attr('content');

	jQuery('ul.nav').superfish({
		delay:       300,                            // one second delay on mouseout
		animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation
		speed:       'fast',                          // faster animation speed
		autoArrows:  true,                           // disable generation of arrow mark-up
		dropShadows: false                            // disable drop shadows
	});

	jQuery('ul.nav > li > a.sf-with-ul').parent('li').addClass('sf-ul');

	if ($featured_content.length) {
		var $featured_slides = $featured_content.find('.slide').show(),
			slides_pos = [],
			slides_zindex = [],
			active_slide_width = 500,
			small_slide_width = 250,
			slide_margin = 16,
			featured_animation = 'easeInOutQuad', //'easeInOutQuad','easeInOutQuint', 'easeInOutQuart'
			et_animation_running = false,
			last_slide = false,
			pause_scroll = false,
			top_slide_pos,
			left_slide_pos,
			slide_opacity;

		$featured_content.css( 'backgroundImage', 'none' );

		$featured_slides.each(function(index, domEle){
			var $this_slide = jQuery(domEle);

			top_slide_pos = 82;
			slide_opacity = 0.3;

			if ( index === 0 ) {
				top_slide_pos = 0;
				slide_opacity = 1;
				left_slide_pos = 230;
			}
			if ( index === 1 ) left_slide_pos = 620;
			if ( index === 2 ) left_slide_pos = 90;
			if ( index > 2 ) {
				if ( index % 2 === 1 ) left_slide_pos = slides_pos[index-2].left + small_slide_width + slide_margin;
				else left_slide_pos = slides_pos[index-2].left - small_slide_width - slide_margin;
			}

			if ( index !== 0 ) {
				$this_slide.find('img').attr({
					width: '250',
					height: '169'
				});
			}

			slides_pos[index] = {
				width: $this_slide.width(),
				top: top_slide_pos,
				left: left_slide_pos,
				opacity: slide_opacity
			};

			$this_slide.css('zIndex',$featured_slides.length-index);
			slides_zindex[index] = $this_slide.css('zIndex');

			$this_slide.animate(slides_pos[index],100,function(){
				// fixes the slide title display bug in Opera
				jQuery(this).css( 'width', 'auto' );
			});
			jQuery(domEle).data('slide_pos',index);
		});

		jQuery('a.nextslide').live('click',function(event){
			event.preventDefault();
			if (!et_animation_running) rotate_slide('next');
			if ( typeof(et_auto_animation) !== 'undefined' ) clearInterval(et_auto_animation);
		});

		jQuery('a.prevslide').live('click',function(event){
			event.preventDefault();
			if (!et_animation_running) rotate_slide('prev');
			if ( typeof(et_auto_animation) !== 'undefined' ) clearInterval(et_auto_animation);
		});

		$featured_slides.hover(function(){
			if ( !et_animation_running ) {
				if ( jQuery(this).hasClass('active') ){
					jQuery(this).find('.additional').stop(true, true).animate({'opacity':'show'},300);
				}
			}
			if ( et_featured_slider_pause == 1 ) pause_scroll = true;
		},function(){
			if ( !et_animation_running ) {
				jQuery(this).find('.additional').stop(true, true).animate({'opacity':'hide'},300);
			}
			if ( et_featured_slider_pause == 1 ) pause_scroll = false;
		});

		var et_mousex = 0,
			et_mousey = 0,
			featured_activeslide_x = $featured_content.find('.container').offset().left + 230,
			featured_activeslide_y = $featured_content.find('.container').offset().top;

		jQuery(document).mousemove(function(e){
			et_mousex = e.pageX;
			et_mousey = e.pageY;
		});

		function rotate_slide(direction){
			$featured_slides.removeClass('active');

			$featured_slides.each(function(index, domEle){
				var $this_slide = jQuery(domEle),
					next_slide_num = $this_slide.data('slide_pos');

				et_animation_running = true;
				last_slide = false;

				$featured_slides.find('.additional').css('display','none');

				if ( direction === 'next' ){
					if ( next_slide_num === 0 ) next_slide_num = 2;
					else if ( next_slide_num === 1 ) next_slide_num = 0;
					else if ( $featured_slides.length % 2 === 0 && next_slide_num === ( $featured_slides.length - 2 ) ) {
						next_slide_num = $featured_slides.length - 1;
					}
					else {
						if ( next_slide_num !== ($featured_slides.length - 1) ) {
							if ( next_slide_num % 2 === 0 )  next_slide_num = next_slide_num + 2;
							else next_slide_num = next_slide_num - 2;
						} else {
							if ( $featured_slides.length % 2 === 0 ) {
								if ( next_slide_num % 2 === 0 )  next_slide_num = next_slide_num + 2;
								else next_slide_num = next_slide_num - 2;
							}
							else {
								next_slide_num = $featured_slides.length - 2;
								last_slide = true;
							}
						}
					}
				} else {
					if ( next_slide_num === 0 ) next_slide_num = 1;
					else if ( $featured_slides.length % 2 === 0 && next_slide_num === ( $featured_slides.length - 1 ) ) {
						next_slide_num = $featured_slides.length - 2;
					}
					else {
						if ( $featured_slides.length % 2 === 0 ) {
							if ( next_slide_num % 2 === 0 ) next_slide_num = next_slide_num - 2;
							else next_slide_num = next_slide_num + 2;
						} else {
							if ( next_slide_num !== ($featured_slides.length - 2) ) {
								if ( next_slide_num % 2 === 0 ) next_slide_num = next_slide_num - 2;
								else next_slide_num = next_slide_num + 2;
							} else {
								next_slide_num = $featured_slides.length-1;
								last_slide = true;
							}
						}
					}
				}

				if ( last_slide ) {
					$this_slide.css('left',slides_pos[next_slide_num].left);
				}

				$this_slide.stop(true, true).animate(slides_pos[next_slide_num],600,featured_animation,function(){
					if ( index === $featured_slides.length - 1 ) et_animation_running = false;

					if ( !et_animation_running ) {
						if ( et_mousex > featured_activeslide_x && et_mousex < (featured_activeslide_x + 500) && et_mousey > featured_activeslide_y && et_mousey < (featured_activeslide_y + 335) ){
							if ( next_slide_num === 0 ) $featured_content.find('.slide').filter(':eq('+($featured_slides.length - 1)+')').find('.additional').stop(true, true).animate({'opacity':'show'},300);
							else $featured_content.find('.active .additional').stop(true, true).animate({'opacity':'show'},300);

							if ( et_featured_slider_pause == 1 ) pause_scroll = true;
						}
					}

					// fixes the slide title display bug in Opera
					jQuery(this).css( 'width', 'auto' );
				});
				if ( next_slide_num != 0 ) {
					$this_slide.find('img').stop(true, true).animate({'width':'250px','height':'169px'},600,featured_animation);
				}
				else {
					$this_slide.find('img').stop(true, true).animate({'width':'500px','height':'335px'},600,featured_animation,function(){
						$this_slide.addClass('active');
					});
				}

				setTimeout(function(){
					$this_slide.css({zIndex: slides_zindex[next_slide_num]});
				},300);

				$this_slide.data('slide_pos',next_slide_num);
			});
		}

		if ( et_featured_slider_auto == 1 ) {
			et_auto_animation = setInterval(function(){
				if ( !pause_scroll ) rotate_slide('next');
			}, et_featured_auto_speed);
		}

		if ( $featured_content.find('.slide').length == 1 ){
			$featured_content.find('.slide').css({'position':'absolute','top':'0','left':'0'}).show();
			jQuery('#featured a.prevslide, #featured a.nextslide').hide();
		}
	}

	var $et_blurb_thumb = jQuery('div.project');
	$et_blurb_thumb.hover(function(){
		jQuery(this).find('img').fadeTo('fast', 0.8);
		jQuery(this).find('.more-icon,.zoom-icon').fadeTo('fast', 1);
	}, function(){
		jQuery(this).find('img').fadeTo('fast', 1);
		jQuery(this).find('.more-icon,.zoom-icon').fadeTo('fast', 0);
	});

	var $footer_widget = jQuery("#footer-widgets .footer-widget");
	if ( $footer_widget.length ) {
		$footer_widget.each(function (index, domEle) {
			if ((index+1)%3 == 0) jQuery(domEle).addClass("last").after("<div class='clear'></div>");
		});
	}

	if ( et_disable_toptier == 1 ) jQuery("ul.nav > li > ul").prev("a").attr("href","#");
});