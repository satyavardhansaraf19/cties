function initStaticCore(){
    initTravelTips(); 
    initFaq();
    setFaqURLs();   
    initWIC();
    setCopyRightYear();
}

function initTravelTips(){
    if($('.section-traveltips').length>0){
        var clickCount = 0;
        $('#travelTipFilterSelect').on('change', function(e) {
            clickCount = 0;
            $('.article-category').hide();          
            $('#'+ $('#travelTipFilterSelect').val()).show();  
            if($('#'+ $('#travelTipFilterSelect').val()+' .row').length>1){
                $('#loadMoreTravelTips').show();
            }else{
                $('#loadMoreTravelTips').hide();
            }              
        });
        $('#loadMoreTravelTips').on('click', function(e) {   
            clickCount = clickCount + 1;
            $('#'+ $('#travelTipFilterSelect').val()+' .row').each(function(index) { 
                if($(this).css('display')=='none' && index==clickCount){                
                    $(this).slideDown();                    
                }
                if(clickCount==$('#'+ $('#travelTipFilterSelect').val()+' .row').length-1){
                    $('#loadMoreTravelTips').hide();
                }
            }); 
        });
    }
    
}
function initFaq(){
    jQuery.fn.extend({
        chubbFaqFilter: function(b) {
            var c = a(this);
            c.find(".select-faqs-category").on("change", function(b) {
                var d = a(this).val();
                "0" == d ? c.find(".faq-category").show() : (c.find(".faq-category").hide(),
                a("#" + d).show())
            })
        }
    });
    jQuery.fn.extend({
        chubbFaqFilter: jQuery.fn.chubbFaqFilter
    });
    var a = jQuery.noConflict();
    a(function() {
        var b = a(".faqs-body");
        b.length && (b.chubbFaqFilter(),
        a(window).on("hashchange", function() {
            var b = window.location.hash;
            if ("undefined" != typeof b) {
                var c = a(b)
                  , d = a(".navbar-main")
                  , e = d.outerHeight() + d.position().top;
                a(document).scrollTo(c, 800, {
                    offset: {
                        top: -e
                    }
                })
            }
        }).trigger("hashchange"))
    })  
    $ = jQuery.noConflict();
}
/*what is covered*/
function initWIC(){
    $("#category-filter-1").on("change",function(){
        var opt=$(this).val();
        if(opt==0){
            $(".section-group").removeClass("hide");
            $('html, body').animate({
                scrollTop: $("#section-1-group1").offset().top-100
            }, 800);   
        }else{

        $(".section-group").addClass("hide");
        $("#"+opt+".section-group").removeClass("hide");
        $('html, body').animate({
            scrollTop: $("#"+opt).offset().top-100
        }, 800);
    }
        
    });
    $(".benefit-filter input:checkbox").on("change",function(){

      //  $(".benefit-filter input:checkbox").each(function(){
            var v= $(this).val();
            if($(this).prop("checked") == true){
                $(this).parent().addClass("checked");
               if(!$(".panel-table-pricing").find(".table-col.plan-"+v).hasClass("highlight"))
                $(".panel-table-pricing").find(".table-col.plan-"+v).addClass("highlight");
            }
            else{
                $(this).parent().removeClass("checked");
                $(".panel-table-pricing").find(".table-col.plan-"+v).removeClass("highlight");
            }
      //  });
    })
  
}
/*what is covered end */
function isProductionEnv(){
    var isProd = true;
    if (location.host.indexOf('atuat.acegroup.com') > 0) {
        isProd = false;
    } else {
        if (location.port == '8080') {
            isProd = false;
        }
    }
    return isProd;        
}
function setCopyRightYear(){
    $(".copyright_year").text(new Date().getFullYear());
}
function getUrlParam(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];

};
function setFaqURLs(){
    $('.faq-menu li a').each(function( index ) {
        index>0?$(this).attr('href', $(this).attr('href')+'#section1group'+ index):'';        
    });
}

/* header script */
$(document).on('scroll', function(){
    if($('.hero-banner-section').length>0){
        if($(document).scrollTop() > 59){
            $(".navbar").addClass("navbarFixed");
        }
        else {
            $(".navbar").removeClass("navbarFixed");
        }
    }
});
if(!$('.hero-banner-section').length>0){
    $(".navbar").addClass("navbarFixed");//Not home page
    $("body").addClass('non-home-padding');
}
$('[data-toggle="collapse"]').on('click', function() {
    $(window).scrollTop(60);
});
$('[data-toggle="collapse"]').on('click', function() {
    $('.offcanvas-collapse').toggleClass('open');
    $('.navbar-toggler-icon').toggleClass('open');
    $(window).scrollTop(60);
});
/* header script end */
  

