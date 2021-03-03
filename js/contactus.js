function contactus() {       

    var contactForm = $('#contactForm');

    if (contactForm.length == 0) {
        console.log("No contact form found");
        return;
    }

    contactForm.find('[name=_NAME_]')
        .attr('data-parsley-maxlength', 50)
        .attr('data-parsley-required-message', contactUs.required.name)
        .attr('data-parsley-pattern-message', contactUs.alphanumeric);
    contactForm.find('[name=_COMPANY_]')
        .attr('data-parsley-maxlength', 50)
        .attr('data-parsley-required-message', contactUs.required.company)
        .attr('data-parsley-pattern-message', contactUs.alphanumeric);
    contactForm.find('[name=_PHONE_NUMBER_]')
        .attr('data-parsley-required-message', contactUs.required.phone)
        .attr('data-parsley-pattern-message', contactUs.numeric);
    contactForm.find('[name=_MESSAGE_]')
        .attr('data-parsley-maxlength', 1000)
        .attr('data-parsley-required-message', contactUs.required.question)
        .attr('data-parsley-length-message', contactUs.messageLength);
    contactForm.find('[name=_EMAIL_]')
        .attr('data-parsley-required-message', contactUs.required.email)
        .attr('data-parsley-type-message', contactUs.emailInvalid);
    contactForm.find('[name=_POLICY_NUMBER_]')
        .attr('data-parsley-required-message', contactUs.required.policy);

    initSiteCustom();
    contactForm.parsley();

    $.listen('parsley:field:error', function (e) {
        e.$element.closest("div.col-sm-6").addClass("parsley-border");
        e.$element.closest("div.form-group.row").find(".validation-icon span").addClass("icon-Accidents_exclamation");
        e.$element.closest("div.form-group.row").find(".validation-icon span").removeClass("icon-Tickmark");
    })

    $.listen('parsley:field:success', function (e) {
        e.$element.closest("div.col-sm-6").removeClass("parsley-border");
        e.$element.closest("div.form-group.row").find(".validation-icon span").removeClass("icon-Accidents_exclamation");
        if (e.$element.val()!= null && e.$element.val().trim().length > 0) {
            e.$element.closest("div.form-group.row").find(".validation-icon span").addClass("icon-Tickmark");
        }
    })

    contactForm.submit(function(e) {
        e.preventDefault();

        var formData = contactForm.serialize(),
            submitButton = $("#btnContactUs");

        $.ajaxSetup({scriptCharset: "utf-8", contentType: "application/x-www-form-urlencoded; charset=UTF-8" });

        submitButton
            .addClass("loading")
            .prop("disabled", true);

        $.ajax({
            url: '/FPS/FormProcessor',
            type: 'POST',
            data: formData,
            dataType: 'html',
            success: function(data, status, xmlhttp) {
                if (data.toUpperCase().indexOf("ERROR") >= 0) {
                    $('#contactFormMessage')
                        .addClass("bg-danger")
                        .text(contactUs.formSubmission.error);
                } else {
                    $('#contactFormMessage')
                        .addClass("bg-success")
                        .text(contactUs.formSubmission.success);
                }
            },
            error: function(xmlhttp, status, error) {
                $('#contactFormMessage')
                    .addClass("bg-danger")
                    .text(contactUs.formSubmission.error);
                submitButton.prop("disabled", false);
            },
            complete: function () {
                submitButton.removeClass("loading");
            }
        });
        e.stopPropagation();
        e.preventDefault();
        return false;
    });

    function initSiteCustom(){

        if ($('[name="_SITENAME_"]').val()==='CTIAU') {

            $('#claimNumber').attr('readonly', true).val("");
            $('#policyNumber').attr('required', 'required');

            $('#subjectList').bind('init change', function() {
                if ($('#subjectList').get(0).selectedIndex == '0' || $('#subjectList').get(0).selectedIndex == '1') {
                    $('#claimNumber')
                        .attr('readonly', true)
                        .removeAttr('required')
                        .val("");
                    $('#policyNumber')
                        .attr('readonly', false)
                        .attr('required', 'required');
                } else if ($('#subjectList').get(0).selectedIndex == '3' || $('#subjectList').get(0).selectedIndex == '4') {
                    $('#policyNumber')
                        .attr('readonly', false)
                        .removeAttr('required');
                    $('#claimNumber')
                        .attr('readonly', false)
                        .attr('required', 'required');
                } else if ($('#subjectList').get(0).selectedIndex == '6') {
                    $('#policyNumber')
                        .attr('readonly', true)
                        .removeAttr('required')
                        .val("");
                    $('#claimNumber')
                        .attr('readonly', true)
                        .removeAttr('required')
                        .val("");
                } else {
                    $('#policyNumber')
                        .attr('required', 'required')
                        .attr('readonly', false);
                    $('#claimNumber')
                        .attr('readonly', true)
                        .removeAttr('required')
                        .val("");
                }

                $('#subjectText').val($("#subjectList option:selected").text());

            }).trigger('init');
        }

        if ($('[name="_SITENAME_"]').val()==='CTITW') {
            $('#claimNumber').attr('readonly', true).removeAttr('required').val("");
            $('#policyNumber').removeAttr('required').val("");
            $('#subjectList').bind('init change', function() {
                if ($('#subjectList').get(0).selectedIndex == '0' || $('#subjectList').get(0).selectedIndex == '1') {
                    $('#policyNumber').attr('required', 'required');						
                } else if ($('#subjectList').get(0).selectedIndex == '3' || $('#subjectList').get(0).selectedIndex == '4') {		                
                    $('#claimNumber')
                        .attr('readonly', false)
                        .attr('required', 'required');
                } else {
                    $('#policyNumber')
                        .removeAttr('required');
                    $('#claimNumber')
                        .attr('readonly', true)
                        .removeAttr('required')
                        .val("");
                }

                $('#subjectText').val($("#subjectList option:selected").text());

            }).trigger('init');
            $(".checkbox").find("input[type='checkbox']")
            .attr('data-parsley-required-message', contactUs.checkbox)
            .attr('required', 'required')
            .attr('data-parsley-required', true)
            .attr('data-parsley-mincheck', '1');
        }		    
    }		
}