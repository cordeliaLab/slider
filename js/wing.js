Wing = {
	'version':'1.1.10',
	// 'authorSite':'http://wingjs.com',
	'jQueryTestVersion':['1.3.2', '1.12.4', '2.2.4', '3.1.0', '3.6.0']
};

(function($){
	/**
	 * Wing jQuery Plugin
	 * Since 2016.03,08
	 * @author Elenin Jay
	 * @author jayelenin@gmail.com
	 * @param options
	 * @returns {*}
	 */
	$.fn.Wing = function(options){
		/**
		 * 기본 옵션
		 */
		var defaults = {
			/**
			 * 선택자
			 */
			selector : this.selector,

			/**
			 * jQuery 3 사용을 위한 셀렉터
			 * {string|null} [null]
			 */
			selectorStr : null,

			/**
			 * 움직임형식
			 * {string} ['none'|'mos']
			 */
			moveType : 'none',

			/**
			 * 자동시작
			 * {bool} [false]
			 */
			autoPlay : false,

			/**
			 * 자동변경시간
			 * {int} [2000]
			 */
			autoPlayTime : 2000,

			/**
			 * animate 속도
			 */
			animateSpeed : 300,

			/**
			 * animate easing 효과
			 * {string} [swing|linear]
			 */
			animateEasing : 'swing',

			/**
			 * 이미지를 둘러싼 CSS 포지션
			 * {string} ['relative']
			 */
			imgViewPosition : 'relative',

			/**
			 * 이미지를 둘러싼 class
			 * {string} ['img_view']
			 */
			imgViewClass : 'img_view',

			/**
			 * 버튼을 둘러싼 class
			 * {string|null} [null]
			 */
			btnViewClass : null,

			/**
			 * 이전버튼을 둘러싼 class
			 * {string|null} [null]
			 */
			prevBtnClass : null,

			/**
			 * 다음버튼을 둘러싼 class
			 * {string|null} [null]
			 */
			nextBtnClass : null,

			/**
			 * 첫 시작을 랜덤
			 * {bool} [false]
			 */
			startIndexRandom : false,

			/**
			 * 버튼이벤트
			 * {string} ['img_view']
			 */
			btnEvent : 'over',

			/**
			 * 모션 마다 실행 될 함수
			 * {null|function} [null]
			 */
			motionScript : null,

			/**
			 * mos 모션시 필요한 옵션
			 */
			mosParams:{
				/**
				 * 모션 동작시 필요한 뷰 박스 클래스를 지정한다.
				 * null 의 경우 기본 Class view_size_box
				 * {null|string} [null]
				 */
				viewBoxClass:null,

				/**
				 * 모션동작시 한 화면의 노출 갯수 지정
				 * 기본값인 null 의경우 자동계산
				 * {null|int} [null]
				 */
				viewBoxChildLen:null,

				/**
				 * 이미지 박스의 가로와 세로길이를 정한다
				 * null 값일 경우 selector 박스의 크기로 지정된다
				 * {null|int} [null]
				 */
				viewBoxWidth:null,
				viewBoxHeight:null,

				/**
				 * overflow hidden
				 * {bool} [false]
				 */
				viewBoxOverFlowHidden:false,
				/**
				 * 마지막 인덱스를 이미지 표시수와 같게 설정
				 * {bool} [false]
				 */
				viewBoxLastIndexChange:false
			}
		};

		var options = $.extend(defaults, options);

		return this.each(function(){
			options.indexNum = 0; // 이미지 인덱스 변수
			options.prevIndexNum = 0; // 이전 인덱스 변수
			options.setTimeID = 0; // 타이머 설정 변수

			// jquery 3를 위한 셀렉터 설정
			if( !options.selector && options.selectorStr != '' ){
				options.selector = options.selectorStr;
			}

			var API = $.fn.Wing.API;
			options = API.construct(options);
			API.initialize(options);

			// 자동 시작
			if(options.autoPlay == true){
				options.setTimeID = API.autoPlay(options);
			};

			// 메인 이미지 오버시
			options.imgView.hover(function(){
				API.autoStop(options);
			}, function(){
				API.autoPlay(options);
			});

			// 버튼
			if(options.btnViewClass != null && $.trim(options.btnViewClass) != ''){
				API.btnSet(options);
			};

			// 이전 | 다음
			if(options.prevBtnClass != null && $.trim(options.prevBtnClass) != '' || options.nextBtnClass != null && $.trim(options.nextBtnClass) != ''){
				API.arrowBtn(options);
			};
		});
	};

	/**
	 * API
	 * @type {{construct: $.fn.Wing.API.'construct', initialize: $.fn.Wing.API.'initialize', cssApply: $.fn.Wing.API.'cssApply', motion: $.fn.Wing.API.'motion', indexCheck: $.fn.Wing.API.'indexCheck', autoPlay: $.fn.Wing.API.'autoPlay', autoStop: $.fn.Wing.API.'autoStop', btnSet: $.fn.Wing.API.'btnSet', arrowBtn: $.fn.Wing.API.'arrowBtn'}}
	 */
	$.fn.Wing.API = {
		/**
		 * @param options
		 * @returns {*}
		 */
		'construct' : function(options){
			// 메인 이미지
			var imgView = $(options.selector + ' .' + options.imgViewClass);
			var imgViewLi = imgView.children();

			// 기본 버튼
			var btnView = null;
			var btnViewLi = null;
			if(options.btnViewClass != null && $.trim(options.btnViewClass) != ''){
				btnView = $(options.selector + ' .' + options.btnViewClass);
				btnViewLi = btnView.children();
			};

			// 이전 | 다음 버튼
			var prevBtn = null;
			var nextBtn = null;
			if(options.prevBtnClass != null && $.trim(options.prevBtnClass) != ''){
				prevBtn = $(options.selector + ' .' + options.prevBtnClass);
			};
			if(options.nextBtnClass != null && $.trim(options.nextBtnClass) != ''){
				nextBtn = $(options.selector + ' .' + options.nextBtnClass);
			};

			options.imgView = imgView;
			options.imgViewLi = imgViewLi;
			options.btnView = btnView;
			options.btnViewLi = btnViewLi;
			options.prevBtn = prevBtn;
			options.nextBtn = nextBtn;

			return options;
		},

		/**
		 * initialize
		 * @param options
		 */
		'initialize' : function(options){
			var API = $.fn.Wing.API;

			// 이미지박스 기본 포지션
			options.imgView.css({position : options.imgViewPosition});

			// 랜덤 시작
			if(options.startIndexRandom == true){
				options.indexNum = Math.floor(Math.random() * options.imgViewLi.length);
			};

			API.cssApply(options);
			API.motion(options);
		},

		/**
		 * 스타일 필요 적용
		 * @param options
		 */
		'cssApply':function(options){
			var moveType = options.moveType.toLowerCase();
			switch(moveType){
				// Move one space
				case 'mos':
					options.imgViewLi.css({
						float:'left'
					});

					var mainBoxWidth = 0;
					var mainBoxHeight = 0;
					if( options.mosParams.viewBoxWidth > 0 ){
						mainBoxWidth = options.mosParams.viewBoxWidth;
					} else {
						mainBoxWidth = $(options.selector).width();
					}
					if( options.mosParams.viewBoxHeight > 0 ){
						mainBoxHeight = options.mosParams.viewBoxHeight;
					} else {
						mainBoxHeight = $(options.selector).height();
					}

					var imgListWidth = options.imgViewLi.eq(0).width();

					// 주 이미지를 감싸는 영역을 추가한다
					// 해당 영역의 사이즈는 selector 의 사이즈를 기준으로 한다
					var viewBoxClass = 'view_size_box';
					if( $.trim(options.mosParams.viewBoxClass) != '' ){
						viewBoxClass = options.mosParams.viewBoxClass;
					}
					options.imgView.wrap('<div class="' + viewBoxClass + '"></div>');
					$(options.selector + ' .' + viewBoxClass).css({
						position:'relative',
						width:mainBoxWidth,
						height:mainBoxHeight
					});

					// 자동 계산
					if( options.mosParams.viewBoxChildLen == null ){
						// 표시할 갯 수
						var viewBoxChildLen = mainBoxWidth / imgListWidth;
						options.mosParams.viewBoxChildLen = viewBoxChildLen = Math.floor(viewBoxChildLen);
					}
					// 갯수 설정시
					else if ( options.mosParams.viewBoxChildLen > 0 ){
						viewBoxChildLen = options.mosParams.viewBoxChildLen;
					}

					// 박스 하나의 가로 길이를 구한다
					var setListWidth = Math.ceil(mainBoxWidth / viewBoxChildLen);

					// css 적용
					options.imgView.css({
						position:'absolute',
						width:options.imgViewLi.length * setListWidth,
						left:0,
						right:0,
						margin:0,
						padding:0
					});
					options.imgViewLi.css({
						width:setListWidth
					});

					// viewBoxOverFlowHidden
					if( options.mosParams.viewBoxOverFlowHidden == true ){
						$(options.selector + ' .' + viewBoxClass).css({
							overflow:'hidden'
						});
					}
					break;
				// moveType none
				default:
					var imgListWidth = options.imgViewLi.eq(0).find('img').width();
					var imgListHeight = options.imgViewLi.eq(0).find('img').height();
					if( imgListWidth > 0 ){
						options.imgView.width(imgListWidth);
					};
					if( imgListHeight > 0 ){
						options.imgView.height(imgListHeight);
					};
					options.imgViewLi.find('img').css({
						float:'left'
					});
					options.imgViewLi.css({
						position : 'absolute', left : 0, top : 0, zIndex : 1, opacity : 0
					});
					options.imgViewLi.eq(options.indexNum).css({
						zIndex : 5, opacity : 1
					});
					break;
			};
		},

		/**
		 * 모션 설정
		 * @param options
		 */
		'motion' : function(options){
			/**
			 * 모션 동작시 실행
			 */
			if( typeof options.motionScript == 'function' ){
				options.motionScript(options);
			};

			var moveType = options.moveType.toLowerCase();

			switch(moveType){
				// Move one space
				case 'mos':
					var moveSize = options.imgViewLi.eq(options.indexNum).position().left;
					options.imgView.stop().animate({left:'-'+moveSize}, options.animateSpeed, options.animateEasing);
					break;
				// moveType none
				default:
					options.imgViewLi.css({
						zIndex : 1, opacity : 0
					});
					options.imgViewLi.eq(options.indexNum).css({
						zIndex : 5, opacity : 1
					});
					break;
			};
		},

		/**
		 * 인덱스 확인
		 * @param options
		 * @returns {*|number}
		 */
		'indexCheck' : function(options){
			var indexNum = options.indexNum;
			var moveType = options.moveType.toLowerCase();

			switch (moveType){
				// Move one space
				case 'mos':
					if( options.mosParams.viewBoxLastIndexChange == true ){
						if(indexNum < 0){
							indexNum = options.imgViewLi.length - options.mosParams.viewBoxChildLen;
						} else if( (indexNum + (options.mosParams.viewBoxChildLen - 1) ) >= options.imgViewLi.length ){
							indexNum = 0;
						};
					} else {
						if(indexNum < 0){
							indexNum = options.imgViewLi.length - 1;
						} else if(indexNum >= options.imgViewLi.length){
							indexNum = 0;
						};
					}
					break;
				// moveType none
				default:
					if(indexNum < 0){
						indexNum = options.imgViewLi.length - 1;
					} else if(indexNum >= options.imgViewLi.length){
						indexNum = 0;
					};
					break;
			}
			return indexNum;
		},

		/**
		 * Play
		 * @param options
		 * @returns {*}
		 */
		'autoPlay' : function(options){
			var API = $.fn.Wing.API;
			if(options.autoPlay == true){
				if(options.setTimeID != 0){
					window.clearInterval(options.setTimeID);
				};
				options.setTimeID = setInterval(function(){
					options.prevIndexNum = options.indexNum;
					options.indexNum++;
					options.indexNum = API.indexCheck(options);
					API.motion(options);
				}, options.autoPlayTime);
			};
			return options.setTimeID;
		},

		/**
		 * Stop
		 * @param options
		 * @returns {*}
		 */
		'autoStop' : function(options){
			if(options.autoPlay == true){
				if(options.setTimeID != 0){
					window.clearInterval(options.setTimeID);
				};
				options.setTimeID = 0;
			};
			return options.setTimeID;
		},

		/**
		 * 기본 버튼
		 * @param options
		 */
		'btnSet' : function(options){
			var API = $.fn.Wing.API;

			if(options.btnViewLi != null){
				var btnEvent = options.btnEvent;
				btnEvent = btnEvent.toLowerCase();

				switch(btnEvent){
					// click
					case 'click':
						options.btnViewLi.hover(function(){
							API.autoStop(options);
						}, function(){
							API.autoPlay(options);
						});

						options.btnViewLi.click(function(){
							options.prevIndexNum = options.indexNum;
							options.indexNum = options.btnViewLi.index(this);
							options.indexNum = btnIndexCheck(options);
							API.motion(options);
						});
						break;
					// over
					default:
						options.btnViewLi.hover(function(){
							API.autoStop(options);
							options.prevIndexNum = options.indexNum;
							options.indexNum = options.btnViewLi.index(this);
							options.indexNum = btnIndexCheck(options);
							API.motion(options);
						}, function(){
							API.autoPlay(options);
						});
						break;
				};
			};

			/**
			 * 버튼 이용시의 indexNum 을 재설정한다
			 * API.indexCheck 는 최대치를 넘으면 0으로 돌아가기때문에 전용으로 생성
			 * @param options
			 * @returns {*|number}
			 */
			function btnIndexCheck(options) {
				if( options.mosParams.viewBoxLastIndexChange == true ){
					var moveType = options.moveType.toLowerCase();
					switch(moveType){
						case 'mos':
							var lastIndex = options.imgViewLi.length - options.mosParams.viewBoxChildLen;
							if( options.indexNum > lastIndex ){
								options.indexNum = lastIndex;
							}
							break;
					}
					return options.indexNum;
				} else {
					return options.indexNum;
				}
			}
		},

		/**
		 * 이전 | 다음 버튼
		 * @param options
		 */
		'arrowBtn' : function(options){
			var API = $.fn.Wing.API;

			if(options.prevBtn != null){
				options.prevBtn.hover(function(){
					API.autoStop(options);
				}, function(){
					API.autoPlay(options);
				});
				options.prevBtn.click(function(){
					options.prevIndexNum = options.indexNum;
					options.indexNum--;
					options.indexNum = API.indexCheck(options);
					API.motion(options);
				});
			};
			if(options.nextBtn != null){
				options.nextBtn.hover(function(){
					API.autoStop(options);
				}, function(){
					API.autoPlay(options);
				});
				options.nextBtn.click(function(){
					options.prevIndexNum = options.indexNum;
					options.indexNum++;
					options.indexNum = API.indexCheck(options);
					API.motion(options);
				});
			};
		}
	};
})(jQuery);

Wing.etc = function(){
	Wing.consoleLog("jQuery Plugin Wing \nVersion : " + Wing.version + "\nAuthor : jayelenin@gmail.com");
};
Wing.consoleLog = function(msg){
	if( typeof console == 'object' ){
		if( typeof console.log == 'function' ){
			console.log(msg);
		}
	}
};
Wing.etc();