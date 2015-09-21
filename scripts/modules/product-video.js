/* global YT */
define([
    'modules/models-product',
    'widgets/video',
    'modules/jquery-mozu',
    'hyprlivecontext',
    'modules/is-mobile',
    'shim!vendor/jquery-fitvids[jquery=jQuery]',
    '//www.youtube.com/iframe_api',
    'shim!vendor/jquery-colorbox[jquery=jQuery]'
    ], function(ProductModel, videoLogic, $, HyprLiveContext, isMobile) {
        var themeSettings = HyprLiveContext.locals.themeSettings,
            parseVideoList = function() {
            var properties = ProductModel.Product.fromCurrent().apiModel.data.properties,
                videoList;

            for (var property in properties) {
                if (properties[property].attributeDetail.name == 'Video Id') {
                    videoList = properties[property].values[0].stringValue;
                    break;
                }
            }

            return videoList.replace(' ', '').split(',');
        };

        $(document).ready(function() {
            // setup a variable for the parsed video list
            var videoList = parseVideoList(),
                videoSelector = 'section[data-mz-tabs-id="videos"]',
                $videoNode = $(videoSelector);

            // for each item in that array, generate a DOM element
            $.each(videoList, function (index, videoId) {

                $.get('http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=jsonc', function(json) {
                    if (index < 1) {

                        
                           // $videoNode.append('<div class="mz-product-video-placeholder" href="http://www.youtube.com/watch?v=' + videoId + '" data-aspect-ratio="' + themeSettings.productPageVideoAspectRatio + '"><div class="mz-product-video-player"></div><div class="mz-product-video-cover"></div></div>');

                        $videoNode.append('<div class="mz-product-video-link"><a class="' + json.data.id + '" href="//www.youtube.com/embed/' + json.data.id + '"><img class="img-responsive" src="' + json.data.thumbnail.hqDefault + '"/>' + '<i class="icon icon-5x icon-youtube-play product-video-icon"></i>&nbsp;' + '</a></div>');

                        $('body').on('productVideoHidden', function () {
                            $videoNode.find('iframe').each(function () {
                                this.contentWindow.postMessage('{"event":"command", "func":"pauseVideo","args":""}', '*');

                            });
                        });

                        //YT.ready(function () {
                        //    $('.mz-product-video-placeholder').each(videoLogic.bindVideo).fitVids();
                        //});
                        if (videoList.length == 1) {
                            if (isMobile) {
                                $('.mz-product-video-link a').colorbox({ iframe: true, width: '95%', height: '95%' });
                            } else {
                                $('.mz-product-video-link a').colorbox({ iframe: true, innerWidth: 640, innerHeight: 390 });
                            }
                        }

                    }

                   

                setTimeout(function() {
                        var minutes = Math.floor(json.data.duration / 60);
                        var seconds = json.data.duration % 60;
                        var time = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
                        $videoNode.append('<div class="mz-product-video-link">' +
                                                '<a  href="//www.youtube.com/embed/' + json.data.id + '">' + '<i class="icon icon-2x icon-youtube-play"></i>&nbsp;' + json.data.title + '</a>' +
                                                '<strong>' + time + '</strong>' +
                                          '</div>');


                    if (isMobile) {
                        $('.mz-product-video-link a').colorbox({ iframe: true, width: '95%', height: '95%' });
                    } else {
                        $('.mz-product-video-link a').colorbox({ iframe: true, innerWidth: 640, innerHeight: 390 });
                    }
                        

                }, index < 1 ? 1 : 500);
                    



                });



            });


        });

        function str_pad_left(string, pad, length) {
             return (new Array(length + 1).join(pad) + string).slice(-length);
        }
        


    }
);