(function($) {

    $.fn.globalcountry = function(options) {

    	// Establish our default settings
        $.fn.globalcountry.settings = $.extend({
            template         : 'ati',
			language         : 'en',
            siteName         : null,
            siteLanglbl      : null,
            siteOverriding   : null,
            showGlobal       : false,
            offline          : false // this is to handle CTI template which  globalcountry included automatically libraries.
        },options);

        if ($.fn.globalcountry.settings.offline == true) {
            return;
        }

        if (typeof $.fn.globalcountry.countrylist['en'] == 'undefined') {
           $.getScript(location.protocol+'//'+location.host+'/aceStatic/ACETravel/Shared/Master/globalcountry/globalcountry.ati.en.js', function () { // load the default lang.
                $.fn.globalcountry.init();
            });
        } else { 
            $.fn.globalcountry.init();
        }
    };   

    var countrylist = $.fn.globalcountry.countrylist = {};

    $.fn.globalcountry.init = function() {
        
        var content = $.fn.globalcountry.getContent();

        // Populate the country item to html element
        if (($('.globalCountry').length > 0) &&  $('.globalCountry .content').length === 0) {             
            $('.globalCountry').append(content);
        }

        // Populate the country item to fancy box.
        if(jQuery().fancybox) {// Fancy box for ATI site            
            $(".ati_country, .wl_country").fancybox({
                'overlayShow': true, 'autoDimensions':true, 'padding':0, 'margin':0,'content':content
            });
        }        
    };

    // Render the popup content 
    $.fn.globalcountry.getContent = function() {
        // throw error if translation missing.
        if (typeof $.fn.globalcountry.countrylist[$.fn.globalcountry.settings.language] == 'undefined') {
            alert('globalcountry.' + $.fn.globalcountry.settings.template + '.' + $.fn.globalcountry.settings.language + '.js is missing');
            return;
        }

       // Generate the country listing.
       var countryList     = $.fn.globalcountry.countrylist[$.fn.globalcountry.settings.language]['list'];
       var others          = $.fn.globalcountry.countrylist[$.fn.globalcountry.settings.language]['others'];
       var headerTitle     = $.fn.globalcountry.countrylist[$.fn.globalcountry.settings.language]['title']['header'];

        // loop country list
        htmlList = $.fn.globalcountry.getItemHTML(countryList);
        // loop other list
        htmlList += $.fn.globalcountry.getItemHTML(others);

        // select the right html template
        var content = $.fn.globalcountry.template[$.fn.globalcountry.settings.template];
        
        content = content.replace('##siteLanglbl##', $.fn.globalcountry.settings.siteLanglbl);

        // append the country list item into the template.
        content = content.replace('##countryitem##', htmlList);

        // Title REplacement
        content = content.replace('##headertitle##', headerTitle);

        return content;
    };

    // Render the items list.
    $.fn.globalcountry.getItemHTML = function(aItem) {
        var htmlItem = '';
        var cssClass = '';
        for ( var index in aItem ){

           if (!aItem.hasOwnProperty(index) || typeof $.fn.globalcountry.domain[aItem[index]['id']] == 'undefined') { // IE issue
                continue;
            }

            // hide Global link.
            if (aItem[index]['id'] == 'Global' && $.fn.globalcountry.settings.showGlobal == false) {
                continue;
            }

            if ($.fn.globalcountry.domain[aItem[index]['id']]['class'] != undefined) {
                cssClass= $.fn.globalcountry.domain[aItem[index]['id']]['class'];
            }

            if (aItem[index]['id'] == $.fn.globalcountry.settings.siteName) {
                 htmlItem += '<li id=' + aItem[index]['id'] + ' class="active ' + cssClass + '">';
            } else {
                htmlItem += '<li id=' + aItem[index]['id'] + ' class="' + cssClass+ '">';
            }
            htmlItem += '<div>' + aItem[index]['label'] +'</div>';
            htmlItem += '<div class="language">';

            for ( var i in aItem[index]['link'] ) {
                if (!aItem[index]['link'] .hasOwnProperty(i)) { // IE issue
                    continue;
                }

                if (i>0) {
                    htmlItem += ' <span class="pipe">|</span> ';
                }
               htmlItem += '<a href="' + $.fn.globalcountry.getLink(aItem[index]['id'], i) +'">' + aItem[index]['link'][i]+ '</a>';
            }
            htmlItem += '</div></li>';
        }

        return htmlItem;

    };
    
    // Generate the language link.
    $.fn.globalcountry.getLink = function(id, index) {
        var key = id;
        // check for sub site overriding.
         if (id == $.fn.globalcountry.settings.siteName) { // This is for parent domain searching (parent=true)
        // check for sub site overriding.
        //if (id == $.fn.globalcountry.settings.siteName && index == null) { // This is for parent domain searching (parent=true)
            if (($.fn.globalcountry.settings.siteOverriding !='') && (typeof $.fn.globalcountry.domain[$.fn.globalcountry.settings.siteOverriding] != 'undefined')) {
                id = $.fn.globalcountry.settings.siteOverriding;
            }
        }

        var currentPage     = '';
        var locationPath    = window.location.href; 

        var PROD            =  'prod';
        var UAT             =  'uat';
        var DEV             =  'dev';

        var environment     =  PROD;

        // build the domain url
        var gotoURL = $.fn.globalcountry.domain[id]['prod'];
        if (location.host.indexOf('atuat.acegroup.com') > 0) {
            environment   = UAT;
            gotoURL       = $.fn.globalcountry.domain[id]['uat'];
        } else {
            if (location.port == '8080') {
                environment  = DEV;
                gotoURL      = $.fn.globalcountry.domain[id]['others'];
               // locationPath = window.location.pathname; 
			}
        }

        if (typeof $.fn.globalcountry.domain[id]['parent'] != undefined && $.fn.globalcountry.domain[id]['parent']) {
            var parentDomain = $.fn.globalcountry.getLink($.fn.globalcountry.settings.siteName, null);
            gotoURL =  (parentDomain==undefined?'':parentDomain) + gotoURL; // generate parent domain + url.
        } 

        // handling visiting page url for old site - strip out existing URI parameter.
        if (key == $.fn.globalcountry.settings.siteName && typeof $.fn.globalcountry.domain[id]['furl'] == 'undefined') {
            gotoURL = window.location.pathname;    
        }

        if (typeof $.fn.globalcountry.domain[id]['link'] != 'undefined' && index !=null) {
            if (typeof $.fn.globalcountry.domain[id]['furl'] != 'undefined' && $.fn.globalcountry.domain[id]['furl'] == true) {

                language = $.fn.globalcountry.domain[id]['link'][index];

                if (id == $.fn.globalcountry.settings.siteName) { // current visiting site.
                    var pattern1 = /\/[a-z]{2}\//g;    /*    /en/   */
                    var pattern2 = /\/[a-z]{2}\?{1}/g; /*   /en?    */
                    var pattern3 = /\/\?/g;            /*   /?    */

                    if (pattern1.test(locationPath)) {
                        gotoURL = locationPath.replace(pattern1, '/' + language +'/');
                    } else if (pattern2.test(locationPath)) {
                        gotoURL = locationPath.replace(pattern2, '/' + language +'?');
                    } else if (pattern3.test(locationPath)) {
                        gotoURL = locationPath.replace(pattern3, '/' + language +'?');
                    } else {
                        gotoURL += '/' + language;
                    }
                } else {
                    gotoURL += '/' + language;
                }

                // To handle subsite. https://cxhk.atuat.acegroup.com/m/
                if (typeof $.fn.globalcountry.domain[id].subsite != 'undefined') {
                    if (environment == DEV || environment == UAT || (environment == PROD && ($.fn.globalcountry.domain[id].subsite.prod == true))) {
                        gotoURL += '/' + $.fn.globalcountry.domain[id].subsite.channel;
                    }
                }

            } else {
                // append session Locale.
                gotoURL += '?sessionLocale=' + $.fn.globalcountry.domain[id]['link'][index];
            }   
        }

        return gotoURL;
    };


    // Domain setting.
    var domain = $.fn.globalcountry.domain = {
        'ATIAU'       : {'prod':'https://www.chubbtravelinsurance.com.au', 'uat':'https://ctiau.atuat.acegroup.com', 'others':'/sites/CTIAU', 'class' :'flag-au'},
        'ATIID'       : {'prod':'https://www.chubbtravelinsurance.co.id', 'uat':'https://ctiid.atuat.acegroup.com', 'others':'/sites/CTIID', 'class' :'flag-id','furl':true, 'link':['in', 'en']},
        'ATIJP'       : {'prod':'https://www.chubbtravelinsurance.jp', 'uat':'https://atijp.atuat.acegroup.com', 'others':'/sites/ATIJP', 'class' :'flag-jp'},
        'ATIMY'       : {'prod':'https://www.chubbtravelinsurance.com.my', 'uat':'https://ctimy.atuat.acegroup.com', 'others':'/sites/CTIMY', 'class' :'flag-my'},
        'ATINZ'       : {'prod':'https://www.chubbtravelinsurance.co.nz', 'uat':'https://ctinz.atuat.acegroup.com', 'others':'/sites/CTINZ', 'class' :'flag-nz'},
        'ATISG'       : {'prod':'https://www.chubbtravelinsurance.com.sg', 'uat':'https://ctisg.atuat.acegroup.com', 'others':'/sites/CTISG', 'class' :'flag-sg'},
        'ATISAF'      : {'prod':'https://www.chubbtravelinsurance.co.za', 'uat':'https://ctisaf.atuat.acegroup.com', 'others':'/sites/CTISAF', 'class' :'flag-saf'},
       /* 'ATIKR'       : {'prod':'http://www.acetravelinsurance.co.kr', 'uat':'https://atikr.atuat.acegroup.com', 'others':'/sites/ATIKR', 'class' :'flag-kr'}, */
        'ATIKR'       : {'prod':'https://www.acedirect.co.kr/', 'uat':'https://www.acedirect.co.kr/', 'others':'/sites/ATIKR', 'class' :'flag-kr'},
        'ATITW'       : {'prod':'https://www.chubbtravelinsurance.com.tw', 'uat':'https://ctitw.atuat.acegroup.com', 'others':'/sites/CTITW', 'class' :'flag-tw','furl':true, 'link':['zh', 'en']},
        'ATITWATP'    : {'prod':'https://ctptw.chubbtravelinsurance.com/ATP', 'uat':'https://atitw.atuat.acegroup.com/ATP', 'others':'/sites/ATITW/ATP', 'class' :'flag-tw', 'link':['zh', 'en']},
        'ATITH'       : {'prod':'https://www.chubbtravelinsurance.co.th', 'uat':'https://ctith.atuat.acegroup.com', 'others':'/sites/CTITH', 'class' :'flag-th', 'furl': true, 'link':['th', 'en']},
        'ATIHK'       : {'prod':'https://www.chubbtravelinsurance.com.hk', 'uat':'https://ctihk.atuat.acegroup.com', 'others':'/sites/CTIHK', 'class' :'flag-hk','furl': true,'link':['zh', 'en']},
        'ATIHKCTP'    : {'prod':'https://www.chubbtravelinsurance.com.hk/CTP', 'uat':'https://atihk.atuat.acegroup.com/CTP', 'others':'/sites/ATIHK/CTP', 'class' :'flag-hk', 'link':['zh', 'en']},
        'ATIHKOSP'    : {'prod':'https://osp.chubbtravelinsurance.com.hk', 'uat':'https://atihkosp.atuat.acegroup.com/OSP', 'others':'/sites/ATIHK/OSP', 'class' :'flag-hk', 'link':['zh', 'en']},
        'ATIIE'       : {'prod':'https://ie.chubbinsured.com/travel/', 'uat':'https://ie.chubbinsured.com/travel/', 'others':'https://ie.chubbinsured.com/travel/', 'class' :'flag-ie'},
        'ATIUK'       : {'prod':'http://helpinghand.uk.chubbinsured.com/', 'uat':'http://helpinghand.uk.chubbinsured.com/', 'others':'http://helpinghand.uk.chubbinsured.com/', 'class' :'flag-uk'},
        'ATIIT'       : {'prod':'http://www.chubbtravelinsurance.it', 'uat':'http://ctiit.atuat.acegroup.com', 'others':'/sites/CTIIT', 'class' :'flag-it'},

        'CTIAU'       : {'prod':'https://www.chubbtravelinsurance.com.au', 'uat':'https://ctiau.atuat.acegroup.com', 'others':'/sites/CTIAU', 'class' :'flag-au'},
        'CTIBR'       : {'prod':'https://www.seguroviagemchubb.com.br', 'uat':'https://www.seguroviagemchubb.com.br', 'others':'/sites/CTIBR', 'class' :'flag-br'},
		'CTIES'       : {'prod':'https://es.chubbtravelinsurance.com', 'uat':'https://cties.atuat.acegroup.com', 'others':'/sites/CTIES', 'class' :'flag-es'},
        'CTIFI'       : {'prod':'https://www.chubbmatkavakuutus.fi', 'uat':'https://ctifi.atuat.acegroup.com', 'others':'/sites/CTIFI', 'class' :'flag-fi', 'furl': true, 'link':['fi']},
        'CTIFR'       : {'prod':'https://fr.chubbtravelinsurance.com', 'uat':'https://ctifr.atuat.acegroup.com', 'others':'/sites/CTIFR', 'class' :'flag-fr', 'furl': true, 'link':['fr']},
        'CTIID'       : {'prod':'https://www.chubbtravelinsurance.co.id', 'uat':'https://ctiid.atuat.acegroup.com', 'others':'/sites/CTIID', 'class' :'flag-id','furl':true, 'link':['in', 'en']},
        'CTIJP'       : {'prod':'https://www.chubbtravelinsurance.jp', 'uat':'https://atijp.atuat.acegroup.com', 'others':'/sites/ATIJP', 'class' :'flag-jp'},
        'CTIMY'       : {'prod':'https://www.chubbtravelinsurance.com.my', 'uat':'https://ctimy.atuat.acegroup.com', 'others':'/sites/CTIMY', 'class' :'flag-my'},
        'CTIMX'       : {'prod':'https://www.chubbtravelinsurance.com.mx', 'uat':'https://ctimx.atuat.acegroup.com', 'others':'/sites/CTIMX', 'class' :'flag-mx'},        
        'CTINZ'       : {'prod':'https://www.chubbtravelinsurance.co.nz', 'uat':'https://ctinz.atuat.acegroup.com', 'others':'/sites/CTINZ', 'class' :'flag-nz'},
        'CTISG'       : {'prod':'https://www.chubbtravelinsurance.com.sg', 'uat':'https://ctisg.atuat.acegroup.com', 'others':'/sites/CTISG', 'class' :'flag-sg'},
        'CTISAF'      : {'prod':'https://www.chubbtravelinsurance.co.za', 'uat':'https://ctisaf.atuat.acegroup.com', 'others':'/sites/CTISAF', 'class' :'flag-saf'},
        /*'CTIKR'       : {'prod':'http://www.acetravelinsurance.co.kr', 'uat':'https://atikr.atuat.acegroup.com', 'others':'/sites/ATIKR', 'class' :'flag-kr'}, */
        'CTIKR'       : {'prod':'https://www.acedirect.co.kr/', 'uat':'https://www.acedirect.co.kr/', 'others':'/sites/ATIKR', 'class' :'flag-kr'},
        'CTITW'       : {'prod':'https://www.chubbtravelinsurance.com.tw', 'uat':'https://ctitw.atuat.acegroup.com', 'others':'/sites/CTITW', 'class' :'flag-tw','furl':true, 'link':['zh', 'en']},
        'CTITWATP'    : {'prod':'https://ctptw.chubbtravelinsurance.com/ATP', 'uat':'https://atitw.atuat.acegroup.com/ATP', 'others':'/sites/ATITW/ATP', 'class' :'flag-tw', 'link':['zh', 'en']},
        'CTITH'       : {'prod':'https://www.chubbtravelinsurance.co.th', 'uat':'https://ctith.atuat.acegroup.com', 'others':'/sites/CTITH', 'class' :'flag-th', 'furl': true, 'link':['th', 'en']},
        'CTIHK'       : {'prod':'https://www.chubbtravelinsurance.com.hk', 'uat':'https://ctihk.atuat.acegroup.com', 'others':'/sites/CTIHK', 'class' :'flag-hk','furl': true,'link':['zh', 'en']},
        'CTIHKOSP'    : {'prod':'https://osp.chubbtravelinsurance.com.hk', 'uat':'https://atihkosp.atuat.acegroup.com', 'others':'/sites/ATIHK/OSP', 'class' :'flag-hk', 'link':['zh', 'en']},
        'CTIIE'       : {'prod':'https://ie.chubbinsured.com/travel/', 'uat':'https://ie.chubbinsured.com/travel/', 'others':'https://ie.chubbinsured.com/travel/', 'class' :'flag-ie'},
        'CTIUK'       : {'prod':'http://helpinghand.uk.chubbinsured.com/', 'uat':'http://helpinghand.uk.chubbinsured.com/', 'others':'http://helpinghand.uk.chubbinsured.com/',                   'class' :'flag-uk'},
        /*'CTIIT'       : {'prod':'http://www.acetravelinsurance.it', 'uat':'http://atiit.atuat.acegroup.com', 'others':'/sites/ATIIT', 'class' :'flag-it'}, */
        'CTIIT'       : {'prod':'https://www.chubbtravelinsurance.it', 'uat':'http://ctiit.atuat.acegroup.com', 'others':'/sites/CTIIT', 'class' :'flag-it'},
		'CTIPH'       : {'prod':'https://www.chubbtravelinsurance.com.ph', 'uat':'https://ctiph.atuat.acegroup.com', 'others':'/sites/CTIPH', 'class' :'flag-ph'},
        'CTIVN'       : {'prod':'https://www.chubbtravelinsurance.com.vn', 'uat':'https://ctivn.atuat.acegroup.com', 'others':'/sites/CTIVN', 'class' :'flag-vn','furl': true, 'link':['en', 'vi']},
        'CTIUS'       : {'prod':'https://ctiusa.chubbtravelinsurance.com', 'uat':'https://ctius.atuat.acegroup.com', 'others':'/sites/CTIUS', 'class' :'flag-us'},
        'CTICH'       : {'prod':'https://www.chubbtravelinsurance.ch', 'uat':'https://ctich.atuat.acegroup.com', 'others':'/sites/CTICH', 'class' :'flag-ch','furl': true,'link':['en', 'de', 'fr', 'it']},
        'PeachHK'     : {'prod':'https://www.chubbtravelinsurance.com.hk/ATP', 'uat':'https://atihk.atuat.acegroup.com/ATP', 'others':'/sites/ATIHK/ATP', 'class' :'flag-hk','link':['zh', 'en']},
        /*'PeachJP'     : {'prod':'https://flypeachinsurance.com', 'uat':'http://peachjp.atuat.acegroup.com', 'others':'/sites/PeachJP', 'class' :'flag-jp'}, DE-COMMISSIONED */
        
        'ScootHK'     : {'prod':'https://www.chubbtravelinsurance.com.hk/Scoot', 'uat':'https://atihk.atuat.acegroup.com/Scoot', 'others':'/sites/ATIHK/Scoot', 'class' :'flag-hk', 'link':['zh', 'en']},
        'ScootTH'     : {'prod':'https://scoot.chubbtravelinsurance.com/TH', 'uat':'https://scoot.atuat.acegroup.com/TH', 'others':'/sites/Scoot/TH', 'class' :'flag-th'},
        'ScootSG'     : {'prod':'https://scoot.chubbtravelinsurance.com/SG', 'uat':'https://scoot.atuat.acegroup.com/SG', 'others':'/sites/Scoot/SG', 'class' :'flag-sg'},
        'ScootAU'     : {'prod':'https://scoot.chubbtravelinsurance.com/AU', 'uat':'https://scoot.atuat.acegroup.com/AU', 'others':'/sites/Scoot/AU', 'class' :'flag-au'},
        'ScootZH'     : {'prod':'https://huatai.acetravelinsurance.com', 'uat':'https://huatai.atuat.acegroup.com/', 'others':'/sites/Huatai', 'class' :'flag-zh', 'link':['zh', 'en']},
        
        'TigerairHK'  : {'prod':'https://www.chubbtravelinsurance.com.hk/Tigerair', 'uat':'https://atihk.atuat.acegroup.com/Tigerair', 'others':'/sites/ATIHK/Tigerair', 'class' :'flag-hk', 'link':['zh', 'en']},
        'TigerairSG'  : {'prod':'https://tigerair.chubbtravelinsurance.com/SG', 'uat':'https://tigerair.atuat.acegroup.com/SG', 'others':'/sites/Tigerair/SG', 'class' :'flag-sg'},
        'TigerairMY'  : {'prod':'https://tigerair.chubbtravelinsurance.com/MY', 'uat':'https://tigerair.atuat.acegroup.com/MY', 'others':'/sites/Tigerair/MY', 'class' :'flag-my'},
        'TigerairAU'  : {'prod':'https://tigerair.chubbtravelinsurance.com/AU', 'uat':'https://tigerair.atuat.acegroup.com/AU', 'others':'sites/Tigerair/AU', 'class' :'flag-au'},
        'TigerairZH'  : {'prod':'https://huatai.acetravelinsurance.com/Tigerair', 'uat':'https://huatai.atuat.acegroup.com/Tigerair', 'others':'/sites/Huatai/Tigerair', 'class' :'flag-zh', 'link':['zh', 'en']},
        'TigerairTH'  : {'prod':'https://tigerair.chubbtravelinsurance.com/TH', 'uat':'https://tigerair.atuat.acegroup.com/TH', 'others':'/sites/Tigerair/TH', 'class' :'flag-th'},

        'HKA'         : {'prod':'https://hkairlines.chubbtravelinsurance.com', 'uat':'https://hka.atuat.acegroup.com', 'others':'/sites/HKA', 'class' :'flag-hk', 'furl': true, 'link':['zh', 'en']},        
        'FlynasSA'     : {'prod':'https://flynas.chubbtravelinsurance.com/SA/Returning-Customer/', 'uat':'https://flynas.atuat.acegroup.com/SA/Returning-Customer/', 'others':'/sites/Flynas/SA/Returning-Customer/', 'class' :'flag-sa', 'link':['ar', 'en']},
        'FlynasJO'     : {'prod':'https://flynas.chubbtravelinsurance.com/JO/Returning-Customer/', 'uat':'https://flynas.atuat.acegroup.com/JO/Returning-Customer/', 'others':'/sites/Flynas/JO/Returning-Customer/', 'class' :'flag-jo', 'link':['ar', 'en']},
        'FlynasAE'     : {'prod':'https://flynas.chubbtravelinsurance.com/AE/Returning-Customer/', 'uat':'https://flynas.atuat.acegroup.com/AE/Returning-Customer/', 'others':'/sites/Flynas/AE/Returning-Customer/', 'class' :'flag-ae', 'link':['ar', 'en']},
        'FlyinSA'      : {'prod':'https://flyinsa.chubbtravelinsurance.com/', 'uat':'https://flyinsa.atuat.acegroup.com/', 'others':'/sites/FlyinSA/', 'class' :'flag-sa-lg', 'furl': true, 'link':['ar', 'en']},

        // 'CathayHK'     : {'prod':'https://www.acepremiertravel.com/HK/', 'uat':'https://cathay.atuat.acegroup.com/HK/', 'others':'/sites/Cathay/HK/', 'class' :'flag-hk', 'link':['zh', 'en']},
        'CathayHK'     : {'prod':'https://hk.chubbpremiertravel.com', 'uat':'https://cxhk.atuat.acegroup.com', 'others':'/sites/CATHAYHK', 'class' :'flag-hk', 'furl': true, 'link':['zh', 'en']},
        'CathayHKM'    : {'prod':'https://hk.chubbpremiertravel.com', 'uat':'https://cxhk.atuat.acegroup.com', 'others':'/sites/CATHAYHK', 'class' :'flag-hk', 'furl': true, 'link':['zh', 'en'], 'subsite':{'prod':true, 'channel':'m'}},
        'CathayUK'     : {'prod':'https://www.chubbpremiertravel.com/UK/', 'uat':'https://cathay.atuat.acegroup.com/UK/', 'others':'/sites/Cathay/UK/', 'class' :'flag-uk', 'link':['en']},
        'CathaySG'     : {'prod':'https://www.chubbpremiertravel.com/SG/', 'uat':'https://cathay.atuat.acegroup.com/SG/', 'others':'/sites/Cathay/SG/', 'class' :'flag-sg', 'link':['en']},
        'CathayAU'     : {'prod':'https://www.chubbpremiertravel.com/AU/', 'uat':'https://cathay.atuat.acegroup.com/AU/', 'others':'/sites/Cathay/AU/', 'class' :'flag-au', 'link':['en']},
		'CathayNZ'     : {'prod':'https://www.chubbpremiertravel.com/NZ/', 'uat':'https://cathay.atuat.acegroup.com/NZ/', 'others':'/sites/Cathay/NZ/', 'class' :'flag-nz', 'link':['en']},
        'CathayMY'     : {'prod':'https://www.chubbpremiertravel.com/MY/', 'uat':'https://cathay.atuat.acegroup.com/MY/', 'others':'/sites/Cathay/MY/', 'class' :'flag-my', 'link':['en']},
        'CathayPH'     : {'prod':'https://www.chubbpremiertravel.com/PH/', 'uat':'https://cathay.atuat.acegroup.com/PH/', 'others':'/sites/Cathay/PH/', 'class' :'flag-ph', 'link':['en']},
        'CathayTH'     : {'prod':'https://www.chubbpremiertravel.com/TH/', 'uat':'https://cathay.atuat.acegroup.com/TH/', 'others':'/sites/Cathay/TH/', 'class' :'flag-th', 'link':['en']},
        'CathayID'     : {'prod':'https://www.chubbpremiertravel.com/ID/', 'uat':'https://cathay.atuat.acegroup.com/ID/', 'others':'/sites/Cathay/ID/', 'class' :'flag-id', 'link':['id', 'en']},
        'Global'       : {'prod':'http://www.acegroup.com/ACE-Worldwide/ACE-Worldwide.html', 
                          'uat': 'http://www.acegroup.com/ACE-Worldwide/ACE-Worldwide.html', 
                          'others': 'http://www.acegroup.com/ACE-Worldwide/ACE-Worldwide.html', 'class':'global', 'parent':false} ,
        //Canada
        'Canada'       : {'prod':'https://www.chubb.com/ca-en/contact-us/locations.aspx', 
                          'uat': 'https://www.chubb.com/ca-en/contact-us/locations.aspx', 
                          'others': 'https://www.chubb.com/ca-en/contact-us/locations.aspx', 'class':'global', 'class' :'flag-ca'} ,                          
        // Morgan Stanley  CTI AU
        'MSCTISG'       : {'prod':'https://travelprosg.chubbinsured.com', 'uat':'https://atisgr.atuat.acegroup.com', 'others':'/sites/ATISGR', 'class' :'flag-sg'},
        'MSCTIKR'       : {'prod':'https://www.acedirect.co.kr/', 'uat':'https://www.acedirect.co.kr/', 'others':'/sites/ATIKR', 'class' :'flag-kr'},
        'MSCTICN'       : {'prod':'http://baoxian.chubb.com.cn/favourableActivity.html', 'uat':'http://baoxian.chubb.com.cn/favourableActivity.html', 'others':'http://baoxian.chubb.com.cn/favourableActivity.html', 'class' :'flag-cn'},
        'MSCTIPH'       : {'prod':'http://chubbtravelinsurance.com.ph/morgan', 'uat':'https://ctiph.atuat.acegroup.com/morgan', 'others':'/sites/CTIPH/morgan', 'class' :'flag-ph'},
        'MSTWPROPRA'    : {'prod':'https://b2bace.propra.com/index.htm', 'uat':'https://b2bace.propra.com/index.htm', 'others':'https://b2bace.propra.com/index.htm', 'class' :'flag-tw'},
        'MSTWPAMEX'    : {'prod':'https://ctrtw.chubbtravelinsurance.com/TW/morganstanleytw', 'uat':'https://ctrtw.atuat.acegroup.com/TW/morganstanleytw', 'others':'https://ctrtw.chubbtravelinsurance.com/TW/morganstanleytw', 'class' :'flag-tw'},

        'TAPPT'      : {'prod':'https://insurance.flytap.com', 'uat':'https://tappt.atuat.acegroup.com', 'others':'/sites/TAPPT', 'class' :'flag-pt', 'furl': true, 'link':['pt', 'en']},
    };

    // country list template 
    var template = $.fn.globalcountry.template = { 
        atiRes      : '<div class="atiRes content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">##siteLanglbl## <span class="caret"></span></a> <div class="dropdown-menu" role="menu"> <ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>',
        ati         : '<div class="atiFb" class="clearfix"><div class="header">##headertitle##</div><ul class="clearfix">##countryitem##</ul></div>',
        peach       : '<div class="atiFb" class="clearfix"><div class="header">##headertitle##</div><ul class="clearfix">##countryitem##</ul></div>',
        scoot       : '<div class="atiFb" class="clearfix"><div class="header">##headertitle##</div><ul class="clearfix">##countryitem##</ul></div>',
        tigerair    : '<div class="atiFb" class="clearfix"><div class="header">##headertitle##</div><ul class="clearfix">##countryitem##</ul></div>',
        cathay      : '<div class="atiRes content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">##siteLanglbl## <span class="caret"></span></a> <div class="dropdown-menu" role="menu"> <ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>',
        ctiRes      : '<div class="white content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">##siteLanglbl## <span class="caret"></span></a> <div class="dropdown-menu" role="menu"> <ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>',
        hka         : '<div class="white content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">##siteLanglbl## <span class="caret"></span></a> <div class="dropdown-menu" role="menu"> <ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>',
        flynas      : '<div class="atiRes content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">##siteLanglbl## <span class="caret"></span></a> <div class="dropdown-menu" role="menu"> <ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>',
        flyinSA     : '<div class="white content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">##siteLanglbl## <span class="caret"></span></a> <div class="dropdown-menu" role="menu"><ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>',
        TAPPT       : '<div class="white content nav navbar-nav navbar-right"> <div class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="flag-pt"><div>##siteLanglbl##</div></span></a> <div class="dropdown-menu" role="menu"><ul class="clearfix"> ##countryitem## </ul> </div> </div> </div>'
    }; 

}(jQuery));