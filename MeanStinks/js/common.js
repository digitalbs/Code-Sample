//Quiz Builder 
(function ($) {
    var currentIndex, //current quiz index
		qLength, //question length
		methods = {
		    init: function(options)
		    {
		        var settings = $.extend( {
		            'start' : 1
		        }, options);
		        return this.each(function(){
		            var $this = this;
		            $(window).bind('load.quizSelector', methods.build($this, settings.start));
		            $('article', $this).delegate('input[type="radio"]', 'click', function(){
		                methods.markAnswer($this, this);
		            });					
				
		            $('.utilityNav a.back', $this).click(function(){
		                if(!$(this).hasClass('disabled'))
		                {
		                    methods.back($this)	
		                }
					
		            });
				
		            $('.utilityNav a.next', $this).click(function(){
		                if(!$(this).hasClass('disabled'))
		                {
		                    methods.next($this)	
		                }
		            });
		        });		
		    },
		    build: function($this, start)
		    {
		        var qWidth = $('article', $this).width();
		        qLength = $('article.question', $this).length;
			
		        $('.questions_answer', $this).width(Math.floor(qWidth * qLength));
		        $('.questions_answer article:first', $this).addClass('current');
		        var questionCounter = '<p class="questionCounter"><span>' + start + '</span> of ' + (qLength) + '</p>'
		        $($this).append(questionCounter);
		        $('.questionCounter', $this).fadeIn();
		        $('.questions_answer article').not('.current').hide(); //hide all articles
			
		    },
		    markAnswer: function($this, that)
		    {
		        $('.current li .answered', $this).remove();
		        $(that).parent('li').append('<span class="answered"><img src="//s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/4768/bkgdHighlight.png" width="' + parseInt($(that).parent("li").width() + 20) + '" height="' + parseInt($(that).parent("li").height() + 10) + '" alt=""/><span></span></span>');
		        $('.current .answered').show('blind', {direction: 'right'}, 700, function(){
		            setTimeout(function(){
		                $('article.current').hide('blind', {direction:'left'}, 700, function(){
		                    console.log($('.questions_answer article').index(this));
		                    currentIndex = $('.questions_answer article').index(this) + 1;
		                    $(this).removeClass('current');
		                    if(qLength <= currentIndex)
		                    {
		                        methods.showAnswers($this, this);
		                    }
		                    else
		                    {
		                        methods.showQuestion($this, this);
		                        $('.utilityNav', $this).fadeIn();	
		                    }
						
		                });
		            }, 300);	
		        });
			
		    },
		    showQuestion: function($this, that)
		    {
		        //hide count
		        $('.questionCounter span', $this).hide('blind', 500, function(){
		            var qCount = parseInt($('.questionCounter span', $this).text());
		            _gaq.push(['_trackEvent', 'Quiz', "Question " + (qCount + 1)]); //track question count
		            $('.questionCounter span', $this).text(qCount + 1);
		            $('.questionCounter span', $this).show('blind', 500);	
		        });
			
		        $(that).next().show('blind', {direction: 'right'}, 700, function(){
		            $(this).addClass('current');	
				
		            if($(this).children('span').hasClass('answered'))
		            {
		                $('.utilityNav .next', $this).removeClass('disabled');
		            }
		            else
		            {
		                $('.utilityNav .next', $this).addClass('disabled');
		                $('.utilityNav .back, .utilityNav .spacer', $this).addClass('disabled');
		            }
				
		            //show nav
		            if($('article.current', $this).index() >= 0)
		            {
		                $('.utilityNav .back', $this).removeClass('disabled');
		            }
		            else{
		                $('.utilityNav .back', $this).addClass('disabled');
		            }
		        });
		    }, 
		    showAnswers: function($this, that)
		    {
		        $('.questionCounter, .utilityNav, header h2, #spiral', $this).fadeOut();
		        $(that).next().show('blind', 300, function(){
		            $(this).addClass('current');
		            var data = $('form', $this).serializeArray();
		            showAnswer($this, data);
		        });
		    },
		    back: function($this)
		    {
		        var pQuestion = $('article.current', $this).prev(),
                    qCount = parseInt($('.questionCounter span', $this).text());
			
		        $('.questionCounter span', $this).text(qCount - 1);
		        $('.questionCounter span', $this).show('blind', 500);
		        $('article.current', $this).hide('blind', {direction: 'left'}, 700, function(){
		            $('article', $this).next().removeClass('current');
		            $(pQuestion).show('blind', {direction: 'right'}, 700);
		            $(pQuestion).addClass('current');
				
		            if($('article.current li span', $this).hasClass('answered'))
		            {
		                $('.utilityNav .next', $this).removeClass('disabled');
					
		                //if at first, hide
		                if(currentIndex <= 1)
		                {
		                    $('.utilityNav .back, .utilityNav .spacer', $this).addClass('disabled');
		                }
		                else
		                {
		                    if($('article.current li span', $this).hasClass('answered'))
		                    {
		                        $('.utilityNav .back, .utilityNav .spacer', $this).removeClass('disabled');
		                    }
		                    else
		                    {
		                        $('.utilityNav .back, .utilityNav .spacer', $this).addClass('disabled');	
		                    }
		                }
		            }
				
		            currentIndex = currentIndex - 1;
				
		        });
		    },
		    next: function($this)
		    {
		        var pQuestion = $('article.current', $this).next(),
                    qCount = parseInt($('.questionCounter span', $this).text());
				
		        $('.utilityNav .back').removeClass('disabled');
		        $('.questionCounter span', $this).text(qCount + 1);
		        $('.questionCounter span', $this).show('blind', 500);
		        $('article.current', $this).hide('blind', {direction: 'left'}, 700, function(){
		            $('article', $this).prev().removeClass('current');
		            $(pQuestion).show('blind', {direction: 'right'}, 700);
		            $(pQuestion).addClass('current');
		            if($('article.current li span', $this).hasClass('answered'))
		            {
		                $('.utilityNav .next, .utilityNav .spacer', $this).removeClass('disabled');
		            }
		            else
		            {
		                $('.utilityNav .next, .utilityNav .spacer', $this).addClass('disabled');
					
		            }
		            currentIndex = currentIndex + 1;
				
		        });
		    }
		
		}
	
    $.fn.quizSelector = function(method) {
    
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }    
	  
    };
	
})(jQuery);
  
(function ($){
    $.fn.tooltip = function(options) {
        // Prepare variables
        var $this = $(this),
			timer = null,
			delay = 500,
			settings = $.extend({
			    id: 'tooltip' || options.id
			}, options),
			mouse = {
			    x : 0,
			    y : 0
			}

        return this.each(function(){
            // Update bounds
            $this.build = function() {
                $this.getMouseCoords();
                $('a', $this).bind('mouseover', $this.showTooltip);
                $('a', $this).bind('mouseout', $this.hideTooltip);
            };
			
            $this.showTooltip = function(){
                if($('.tooltip').length <= 0)
                {
                    $('#tabs-facebook-container #container').append('<div class="tooltip" id="' + settings.id + '"><a href="#" id="cvs">CVS</a><a href="#" id="kroger">Kroger</a><a href="#" id="target">Target</a><a href="#" id="walgreens">Walgreens</a></div>');
                    $('#productTooltip').delegate('a', 'click', function(){
                        var store = $(this).attr('id');
                        _gaq.push(['_trackEvent', 'Buy Now', store]);
                    });	
                }
				
                if($.browser.msie && parseInt($.browser.version, 10) <= 8)
                {
                    $('.tooltip').css({
                        position: 'absolute',
                        top: mouse.y + 15,
                        left: mouse.x - $('.tooltip').width() + 95
                    }).show();
                }
                else
                {
                    $('.tooltip').css({
                        position: 'absolute',
                        top: mouse.y + 15,
                        left: mouse.x - $('.tooltip').width() + 95
                    }).fadeIn();
                }

                if(!timer)
                {
                    window.clearTimeout(timer);	
                }
				
                $('.tooltip').bind('mouseover', function(){
                    window.clearTimeout(timer);
                });
				
                $('.tooltip').bind('mouseleave', function(){
                    if($.browser.msie && parseInt($.browser.version, 10) <= 8)
                    {
                        $('.tooltip').hide();
                    }
                    else
                    {
                        $('.tooltip').fadeOut();
                    }
                });
					
            };
			
            $this.hideTooltip = function(){
                console.log('you need to get on tooltip');
                timer = setTimeout(function(){
                    if($.browser.msie && parseInt($.browser.version, 10) <= 8)
                    {
                        $('.tooltip').hide();
                    }
                    else
                    {
                        $('.tooltip').fadeOut();
                    }
                }, delay);
				
            };
			
            $this.getMouseCoords = function(){
                $('a', $this).bind('mouseover', function(e){
                    var posX = $(this).offset().left + $(this).width()/2,
						posY = $(this).offset().top + $(this).height()/2;
					
                    mouse.x = posX;
                    mouse.y = posY;
                });
				
            };
			
			
            $this.build();
        });
		
    };	
})(jQuery);

$(function(){
    $('#startQuiz a').click(function(){
        $('#startQuiz').hide('blind', {direction : 'left'}, 700, function(){
            $('.questions_answer').show('blind', {direction: 'right'}, 700);
            $('#quiz').quizSelector({
                'start':1
            });
        });
        _gaq.push(['_trackEvent', 'Quiz', "Start"]);
        _gaq.push(['_trackEvent', 'Quiz', "Question 1"]);
        return false;
    });
  
    $('#ytVideo').click(function(){
  	
        $(this).append('<iframe width="381" height="211" src="//www.youtube.com/embed/jeoJ53UgmEc?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        _gaq.push(['_trackEvent', 'Video', 'Play Blue Pinky Swear Video']);	
        $('iframe', this).fadeIn();
    });
  
    $('#dramaFreeYear a').click(function(){
        _gaq.push(['_trackEvent', 'Share:Start', 'Drama-Free Pledge']);
        share("Drama-Free Pledge", "");
        return false;
    });
  
    $('#btnSharePage').click(function(){
        _gaq.push(['_trackEvent', 'Share:Start', 'Mean Stinks Tab']);
        share("Mean Stinks Tab", "");
        return false;
    });
  
    bullyBook.init();	
});

var bullyType;
var bullyBook = {
    nextBtn: $('#btnNextBully'),
    count:0,
    fadeTransition: 600,
    bookLength: $('#bullyBook li').length,
    showNext: function(){
        var $this = this,
			dir;
        $this.nextBtn.hide();
        $('#bullyBook li.active').hide('blind', $this.fadeTransition, function(){
            bullyType = $(this).next().attr('title');
            $this.dropShow(this);
            $this.nextBtn.show();
        });
        $this.count++;
    },
    dropShow: function(that){
        var $this = this;
		
        if($this.bookLength <= $this.count)
        {
            $('#bullyBook li:first').show('blind', $this.fadeTransition).addClass('active');
            if($.browser.msie && parseInt($.browser.version, 10) <= 8)
            {
                $this.nextBtn.show().addClass('start');	
            }
            else
            {
                $this.nextBtn.hide('drop', {direction: 'left'}, $this.fadeTransition, function(){
                    $this.nextBtn.show().addClass('start');	
                });
            }
            $this.count = 0; 
        }
        else
        {
            $(that).next().show('blind', $this.fadeTransition).addClass('active');
            //$('#bullyNotepage').show();
        }
        $(that).removeClass('active');
    },
    startBook: function(){
        var $this = this;
        $this.nextBtn.click(function(){
            if($(this).hasClass('start'))
            {
                $(this).fadeOut(500, function(){
                    $(this).removeClass('start');
                    $this.showNext();
                    if($.browser.msie && parseInt($.browser.version, 10) <= 8)
                    {
                        $this.nextBtn.show();	
                    }
                    else
                    {
                        $this.nextBtn.show('drop', {direction: 'left'},$this.fadeTransition);	
                    }
                });
                _gaq.push(['_trackEvent', 'Bully Book', 'Home']);
            }
            else
            {
                $this.showNext();
                _gaq.push(['_trackEvent', 'Bully Book', bullyType]);				
            }
            return false;
        });
    },
    init: function(){
        var $this = this;
        $this.startBook();	
    }
	
	
}
    
function share(type, badge)
{
    var title,
		desc,
		pic;
    if(type == "Drama-Free Pledge")
    {
        title = "I pledge to have a drama-free year!";
        desc = "By saying &ldquo;no&rdquo; to drama, I'm helping Secret Mean Stinks end girl-to-girl bullying. You can, too! Take the pledge like I did and join us in Ganging Up for Good!";
        pic ="https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6971/MS_DramaFree_Share_02.jpg";
    }
    else if(type == "Mean Stinks Tab")
    {
        title = "It's time to Gang Up for Good!";
        desc = "We can all play a role in ending girl-to-girl bullying. Gang Up for Good with Secret Mean Stinks to find out how you can help make a difference this year!";
        pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/8051/MS_Share.jpg";
    }
    else
    {
        switch(badge)
        {
            case "bigHeart":
                title = "I'm the Big Heart!";
                desc = "Secret Mean Stinks believes everyone has a role to play in Ganging Up for Good. My role is listening. Girls come to me when they need a good talk. Want to know yours? Take the quiz to see how you can help end girl-to-girl bullying!";
                pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6313/badgeBigHeart.jpg";
                break;
			
            case "peacemaker":
                title = "I'm the Peacemaker!";
                desc = "Secret Mean Stinks believes everyone has a role to play in Ganging Up for Good. My role is solving problems. When I see a conflict, I do my best to mediate. Want to know yours? Take the quiz to see how you can help end girl-to-girl bullying!";
                pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6322/badgePeacemaker.jpg";
                break;
			
            case "cheerleader":
                title = "I'm the Cheerleader!";
                desc = "Secret Mean Stinks believes everyone has a role to play in Ganging Up for Good. My role is giving moral support. I'll take a stand if other girls do. Want to know yours? Take the quiz to see how you can help end girl-to-girl bullying!";
                pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6316/badgeCheerleader.jpg";
                break;
				
            case "communicator":
                title = "I'm the Communicator!";
                desc = "Secret Mean Stinks believes everyone has a role to play in Ganging Up for Good. My role is reporting the facts. If there's conflict, I'm the first to tell an adult. Want to know yours? Take the quiz to see how you can help end girl-to-girl bullying!";
                pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6319/badgeCommunicator.jpg";
                break;
			
            case "socialButterfly":
                title = "I'm the Social Butterfly!";
                desc = "Secret Mean Stinks believes everyone has a role to play in Ganging Up for Good. My role is to get involved. So I'm recruiting the whole school to take action. Want to know yours? Take the quiz to see how you can help end girl-to-girl bullying!";
                pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6325/badgeSocialButterfly.jpg";
                break;
			
            case "truthTeller":
                title = "I'm the Truth Teller!";
                desc = "Secret Mean Stinks believes everyone has a role to play in Ganging Up for Good. My role is defending others. I'm not afraid to tell a bully to back off. Want to know yours? Take the quiz to see how you can help end girl-to-girl bullying!";
                pic = "https://s3.amazonaws.com/publisher_production-s3fs-public-3ed74cb/tabs/assets/0020/6328/badgeTruthteller.jpg";
                break;
				
			
        }
    }
	
    FB.ui({
        method: 'feed',
        name:title,
        link: 'https://www.facebook.com/pages/Vitrue-Tabs-Preview/152121401466284?sk=app_140201916047746&app_data=preview_key%3DS515269003',
        picture: pic,
        caption:'',
        description: desc
    },
	function(response)
	{
	    if(response && response.post_id)
	    {
	        console.log('Post was published.');
	        if(type == "shareBadge")
	        {
	            _gaq.push(['_trackEvent', 'Share:Success', 'Badge - ' + badge]);	
	        }
	        else
	        {
	            _gaq.push(['_trackEvent', 'Share:Success', type]);
	        }
			
	    }	
	    else
	    {
	        console.log('Post was not published');
	        if(type == "shareBadge")
	        {
	            _gaq.push(['_trackEvent', 'Share:Cancel', 'Badge - ' + badge]);	
	        }
	        else
	        {
	            _gaq.push(['_trackEvent', 'Share:Cancel', type]);
	        }
	    }
	});
}
  
function showAnswer(quiz, answers)
{
    var a = 0, 
		b = 0, 
		c = 0, 
		d = 0, 
		e = 0,
		f = 0,
		answer;
	
    $(answers).each(function(i, val)
    {
        switch(val.value)
        {
            case "a":
                a++;
                break;
			
            case "b":
                b++;
                break;
			
            case "c":
                c++;
                break;
			
            case "d":
                d++;
                break;
			
            case "e":
                e++;
                break; 
			
            case "f":
                f++;
                break;
        }
    });
  
    var compare = ['a:' + a, 'b:' + b, 'c:' + c, 'd:' + d, 'e:' + e, 'f:' + f];
    var to = ['a:' + a, 'b:' + b, 'c:' + c, 'd:' + d, 'e:' + e, 'f:' + f];
	
    if(a > b && a > c && a > d && a > e & a > f)
    {
        answer = "bigHeart";		
    }
    else if(b > a && b > c && b > d && b > e && b >f)
    {
        answer = "peacemaker";
    }
    else if(c > a && c > b && c > d && c > e && c >f)
    {
        answer = "communicator";
    }
    else if(d > a && d > b && d > c && d > e && d >f)
    {
        answer = "truthTeller";
    }
    else if(e > a && e > b && e > c && e > d && e > f)
    {
        answer = "cheerleader";
    }
    else if(f > a && f > b && f > c && f > d && f >e)
    {
        answer = "socialButterfly";
    }
    else
    {
        var matches =[];
        for(var i = 0; to[i]; i++)
        {
            var t = to[i].split(':');
			
            for(var k = 0; compare[k]; k++)
            {
                var comp = compare[k].split(':');	

                if(t[1] != comp[1])
                {
                    //console.log(t[0] + ' : ' + comp[0] + ' no match');
                }	
                else if(t[0] == comp[0])
                {
                    //console.log(t[0] + ' matches ' + comp[0] + ' exactly');
                }
                else
                {
                    var ans;
                    if(t[1] != 0)
                    {
                        switch(t[0])
                        {
                            case "a":
                                ans = "bigHeart";
                                break;
							
                            case "b":
                                ans = "peacemaker";
                                break;
								
                            case "c":
                                ans = "communicator";
                                break;
								
                            case "d":
                                ans = "truthTeller";
                                break;
								
                            case "e":
                                ans ="cheerleader";
                                break;
								
                            case "f":
                                ans = "socialButterfly";
                                break;
                        }
                        matches.push(ans);
                    }
					
                    var answerLength = matches.length;
                    var answerRandom = Math.floor(Math.random() * answerLength);
					
                    answer = matches[answerRandom];
                }
            }
			
        }
		
    }
	
    $(quiz).append('<div id="' + answer + '" class="qAnswer"><a href="javascript:void(0);" title="' + answer + '" class="noText">Share your badge with friends</a></div>');
    _gaq.push(['_trackEvent', 'Quiz', "Result - " + answer]); //show result
    $('.qAnswer').fadeIn();
    $('.qAnswer a').click(function(){
        var badge = $(this).attr('title');
        var desc = 'blah blah blha';
        _gaq.push(['_trackEvent', 'Share:Start', 'Badge - ' + answer]); //show share track
        share('shareBadge', badge);
    });

}  


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-33465789-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
