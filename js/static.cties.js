$(function() {
    setQuoteLink()
    initStaticCore();
    initGlobalCountry();
    initContactUs();
    initWhatisCovered();
});
function setQuoteLink(){
    var uat = "https://buy-uat.chubbtravelinsurance.com/cties/quote";
    var prod = "https://buy.chubbtravelinsurance.com/cties/quote";

    $('#quote').attr('href',isProductionEnv()?prod:uat);
    $('#quote-banner').attr('href',isProductionEnv()?prod:uat);    
}
function initGlobalCountry(){
    var options = {template: "ctiRes", showGlobal: true, language: "es", siteName: "CTIES", siteLanglbl: "España"};
    $.fn.globalcountry.settings = $.extend({
        template         : 'ati',
        language         : 'en',
        siteName         : null,
        siteLanglbl      : null,
        siteOverriding   : null,
        showGlobal       : false,
        offline          : false
    },options);
    $.fn.globalcountry.init();
    $('.globalCountry .dropdown-menu').addClass('sub-menu');
    $('.globalCountry .dropdown-menu').addClass('submenu-5');
    
}
function initContactUs(){
    if($('#contactForm').length>0){
        contactUs = {
            required : {
                name: "Por favor introduzca su nombre y apellidos",
                company: "Díganos su empresa",
                email: "Por favor introduzca su email",
                question: "Por favor indíquenos si tiene alguna pregunta o comentario"
            },
            alphanumeric : "Utilice sólo caracteres alfanuméricos",
            numeric: "Utilice sólo números",
            messageLength: "Por favor, limite tus preguntas / Comentarios entre 5 y 1000 caracteres",
            emailInvalid: "Por favor, introduce una dirección de correo electrónico válida, example@domain.com",
            formSubmission: {
                success: "Gracias por sus preguntas / Comentarios.",
                error: "Se ha producido un error al enviar el formulario - Por favor, inténtelo de nuevo más tarde."
            }
        }
        contactus();
    }    
}

function initWhatisCovered(){
    $("#uniform-what-is-covered-group-1 label").addClass("active");
    $(".whatiscovered-group-filter input[name='options']").on("change", function(){
        var curType=$(this).val();
        $(".whatiscovered-body").hide();
        if(curType=="PHP"){
            $("#what-is-covered-policy-1").show();
        }
        else{
             $("#what-is-covered-policy-2").show();
        }
    });
}